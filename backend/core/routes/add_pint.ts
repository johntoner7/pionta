import express from 'express';
import pintController from '../controllers/pintController';

const router = express.Router();

router.post('/api/pint', pintController.addPint);

export default router;