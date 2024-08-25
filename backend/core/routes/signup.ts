import express from 'express';
import authController from '../controllers/authController';

const router = express.Router();

router.post('/api/auth/signup', authController.signUp);

export default router;