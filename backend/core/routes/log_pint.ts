import express from 'express';
import logController from '../controllers/logController';

const router = express.Router();

router.post('/api/log', logController.logPint);

export default router;