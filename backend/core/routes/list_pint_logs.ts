import express from 'express';
import { Router } from 'express';
import { listPintLogs } from '../controllers/logController';

const router: Router = express.Router();

router.get('/api/logs', listPintLogs);

export default router;
