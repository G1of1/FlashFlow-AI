import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from '../models/user.model';

export const middleWare = async (req: Request, res: Response, next: NextFunction) : Promise<void>=> {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      res.status(401).json({ success: false, error: 'Token expired or no authorization' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload & { userID: string };

    const user = await User.findById(decoded.userID).select('-password');
    if (!user) {
      res.status(401).json({ success: false, error: 'User not found' });
      return;
    }

    req.user = user;
    next();
  } catch (error: any) {
    res.status(500).json({ error: `Internal Server Error: ${error.message}` });
  }
};