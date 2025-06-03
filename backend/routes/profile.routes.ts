import express from 'express';
import { middleWare } from '../middleware/middleware';
import upload from '../middleware/upload';
import { getProfile, updateProfile } from '../controllers/profile.controller';




const router = express.Router();
router.use(express.json());
router.get('/:username', middleWare, getProfile);
router.post('/update', middleWare, updateProfile);

export default router;