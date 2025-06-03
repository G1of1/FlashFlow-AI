import jwt from 'jsonwebtoken';
import { Response } from 'express';
export const generateTokenAndSetCookie = (userID: string, res: Response) => {
    const token  = jwt.sign({ userID }, process.env.JWT_SECRET as string, {
        expiresIn: '7d'
    });
    const cookieOptions: object = {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: true
    }
    res.cookie('jwt', token, cookieOptions);


}