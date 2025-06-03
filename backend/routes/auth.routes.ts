import express from 'express';

import { register, login, logout, generate2FASecret, verify2FA } from '../controllers/auth.controller';
import { middleWare } from '../middleware/middleware';
import { getUser } from '../controllers/auth.controller';

const router = express.Router();

router.use(express.json());

router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);
router.get('/user', middleWare, getUser);
router.post('/2fa/generate', middleWare, generate2FASecret);
router.post('/2fa/verify', middleWare, verify2FA);
export default router;