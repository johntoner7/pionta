import express from 'express';
import { Router } from 'express';
import { addBar } from '../controllers/barController';

const router: Router = express.Router();

router.post('/api/bar', addBar);

export default router;
