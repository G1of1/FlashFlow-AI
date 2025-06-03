import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../libraries/utilities/generateToken";
import { User,  IUser } from "../models/user.model";
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const register = async (req: Request, res: Response): Promise<any> => {
  try {
    const { username, password, fullName, email } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ success: false, error: "Invalid email" });
      return;
    }

    const existingUser: IUser | null = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({ success: false, error: "Username already taken" });
      }
      if (existingUser.email === email) {
       return res.status(400).json({ success: false, error: "Email already used" });
        
      }
    }

    if (password.length < 8) {
      return res.status(400).json({success: false, error: "Password length must be at least 8 characters"});
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      username,
      password: hashedPassword,
    });

    await newUser.save();
    generateTokenAndSetCookie(newUser._id.toString(), res);

    const returnedUser = {
      _id: newUser._id.toString(),
      fullName: newUser.fullName,
      username: newUser.username,
      email: newUser.email,
    };
    res.status(201).json({ success: true, requires2FASetup: true });
  } 
  catch (error: any) {
    console.log(`Server Error: ${error.message}`);
    res.status(500).json({ success: false, error: `Server Error: ${error.message}` });
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { username, password, email } = req.body;
    const user: IUser | null = await User.findOne({$or: [{ username }, { email }],});

    if (!user) {
      res.status(400).json({ success: false, error: "Invalid username/email or password" });
      return;
    }

    const isPass = await bcrypt.compare(password, user.password);
    if (!isPass) {
      res.status(400).json({ success: false, error: "Invalid username/email or password" });
      return;
    }

    generateTokenAndSetCookie(user._id.toString(), res);

    if(!user?.twoFactorEnabled) {
       return res.status(403).json({success: false, error: "2FA not setup"})
    }

    const returnedUser = {
      _id: user._id.toString(),
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic,
      twoFactorEnabled: user?.twoFactorEnabled,
    };

    res.status(200).json({ success: true, data: returnedUser});
  } catch (error: any) {
    console.log(`Server Error: ${error.message}`)
    res.status(500).json({ success: false, error: `Server Error: ${error.message}` });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, error: `Server Error: ${error.message}` });
  }
};

export const getUser = async (req: Request, res: Response) : Promise<any> => {
    try {
        const userID = req.user?._id;
        const user = await User.findById(userID).select("-password");
        
        res.status(200).json({success: true, data: user})
    }
    catch(error: any) {
        console.log(`Server Error: ${error.message}`)
        res.status(500).json({success: false, error: `Server Error: ${error.message}`})
    }
}

export const generate2FASecret = async (req: Request, res: Response) : Promise<any> => {
  try {
  const secret = speakeasy.generateSecret({
    name: `FlashFlow : ${req.user?.email}`
  })

  await User.findByIdAndUpdate(req.user?._id, {twoFactorSecret: secret.base32, twoFactorEnabled: false})

  const qrCodeURL = await qrcode.toDataURL(secret.otpauth_url as string);
  res.status(200).json({success: true, data: qrCodeURL});
}
catch(error: any) {
  res.status(500).json({success: false, error:`Server Error: ${error.message}`})
}
}

export const verify2FA = async (req: Request, res: Response) : Promise<any> => {
  try {
    const userID = req.user?._id;
    const { token } = req.body;
    
    const user = await User.findById(userID).select("-password");

    if(!user) {
      return res.status(400).json({success: false, error: "User not found"});
    }

    const verified = speakeasy.totp.verify({
      secret: user?.twoFactorSecret as string,
      encoding: "base32",
      token
    })

    if(!verified) {
      return res.status(401).json({success: false, error: "Invalid token"})
    }
    
    user.twoFactorEnabled = true;
    await user.save();

    res.status(200).json({success: true, data: user, message: "Authenticated successfully"})

   
  } 
  catch (error: any) {
    res.status(500).json({success: false, error: `Server Error: ${error.message}`});
  }

}

export const forgotPassword = async (req: Request, res: Response) : Promise<any> => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if(!user) {
      return res.status(400).json({success: false, error: "User not found"})
    }

    const resetToken = crypto.randomBytes(6).toString("hex").toUpperCase();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);

    await user.save();
    await sendEmail(user.email, "Password reset code", `Your code: ${resetToken}`)
    console.log(`Reset Token: ${resetToken}`);
    res.status(200).json({success: true, message: "Reset code sent to email"})

  } 
  catch (error: any) {
    res.status(500).json({success: false, error: `Server Error: ${error.message}`})
  }
}

export const resetPassword = async(req: Request, res: Response) : Promise<any> => {
  try {
    const { email, code , newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user || !user.resetPasswordToken || user.resetPasswordToken !== code) {
    return res.status(400).json({ error: "Invalid code" });
  }

  if (user.resetPasswordExpires && user.resetPasswordExpires < new Date()) {
    return res.status(400).json({ error: "Code expired" });
  }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({succes: true, message: "Password reset successfully"})
  } 
  catch (error: any) {
    res.status(500).json({success: false, error: `Server Error: ${error.message}`})
  }
}

export const sendEmail = async (to: string, subject: string, text: string ) : Promise<any> => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER as string,
      pass: process.env.EMAIL_PASS as string
    }
  })
  
  await transporter.sendMail({
    from: "FlashFlow AI",
    to,
    subject,
    text
  })
}