import express from 'express';
import pintController from '../controllers/pintController';

const router = express.Router();

router.delete('/api/price', pintController.deletePrice);

export default router;