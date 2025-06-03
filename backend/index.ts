import express from "express";
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDB } from "./dbconfig/db";
import authRoutes from './routes/auth.routes'
import userRoutes from './routes/user.routes'
import profileRoutes from './routes/profile.routes';
import cors from 'cors';
import {v2 as cloudinary} from 'cloudinary';
import path from 'path';
import {Request, Response } from 'express';
dotenv.config();



cloudinary.config({
  cloud_name: process.env.CLOUD_NAME as string,
  api_key: process.env.CLOUD_APIKEY as string,
  api_secret: process.env.CLOUD_APISECRET as string
})

const app = express();
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({"limit" : "8mb"}));
app.use(cors({
  origin: 'http://localhost:5000',
  credentials: true,              
}));

const port = process.env.PORT || 5000;

//console.log("Logging authroutes")
app.use('/api/auth', authRoutes);
//console.log("Logging userroutes")
app.use('/api/user', userRoutes);
//console.log("Logging profileroutes")
app.use('/api/profile', profileRoutes);

if(process.env.NODE_ENV as string === "production") {
  const frontendPath = path.join(__dirname, "../../frontend/dist")
  app.use(express.static(frontendPath));
  console.log("Frontend path:", frontendPath);
  //console.log("loggin *")
  app.get(/^\/(?!api).*/, (req: Request, res: Response)=> {
   res.sendFile(path.resolve(frontendPath, "index.html"))
  })
}

app.listen(port, () => {
    connectDB();
    console.log(`Server connected at http://localhost:${port}`);
}
)