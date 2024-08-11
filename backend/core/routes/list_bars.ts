import express from 'express';
import { Router } from 'express';
import { listBars } from '../controllers/barController';

const router: Router = express.Router();

router.get('/api/bar', listBars);

export default router;
