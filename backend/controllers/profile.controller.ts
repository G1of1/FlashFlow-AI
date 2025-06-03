import bcrypt from "bcryptjs";
import { User } from "../models/user.model";
import { v2 as cloudinary } from 'cloudinary';
import { Request, Response} from 'express';

export const updateProfile = async (req: Request, res: Response) : Promise<any>=> {
    try {
        const { username, currentPassword, newPassword, fullName, email, profilePic } = req.body;
        const userID = req.user?._id;
        let user = await User.findById(userID);

        if(!user) {
            return res.status(400).json({success: false, error: "User not found"})
        }
        if((!currentPassword && newPassword ) || (!newPassword && currentPassword)) {
            return res.status(400).json({success: false, error: "Please provide both current and new passwords"})
        }

        if(currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if(!isMatch) {
               return res.status(400).json({success: false, error: "Current password is incorrect"});
            }
            if(currentPassword === newPassword) {
                return res.status(400).json({success: false, error: "New password must be a different password"});
            }
            if(newPassword.length < 8) {
               return res.status(400).json({success: false, error: "Password must be at least 8 characters"})
            }
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }
        let uploadedImage;
        if(profilePic) {
          if(user.profilePic) {
              const publicID = user.profilePic.split("/").slice(-1)[0].split(".")[0];
              await cloudinary.uploader.destroy(publicID);
            }
          const uploadedResponse = await cloudinary.uploader.upload(profilePic);
          uploadedImage = uploadedResponse.secure_url;
        }
        user.fullName = fullName || user.fullName;
        user.email = email || user.email;
        user.username = username || user.username;
        if (uploadedImage) {
        user.profilePic = uploadedImage;
        }
        user = await user.save();

        const returnedUser : object = {
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            profilePic: user.profilePic
        }
        res.status(200).json({success: true, data: returnedUser, message: "Profile updated!"});
    }
    catch(error : any) {
        res.status(500).json({error: `Internal Server Error: ${error.message}`});
    }
}

export const getProfile = async (req: Request, res: Response) : Promise<any>=> {
    
    try {
       const { username } = req.params;
       const user = await User.findOne({username}).select("-password");
       
       if(!user) {
        return res.status(400).json({success: false, error: "User doesn't exist"})
       }
       res.status(200).json({success: true, data: user});
    }
    catch(error : any) {
        res.status(500).json({success: false, error: `Server Error: ${error.message}`});
    }
}