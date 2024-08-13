import express from 'express';
import logController from '../controllers/logController';

const router = express.Router();

router.delete('/api/log', logController.deleteLog);

export default router;