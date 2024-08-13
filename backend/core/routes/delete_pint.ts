import express from 'express';
import pintController from '../controllers/pintController';

const router = express.Router();

router.delete('/api/pint', pintController.deletePint);

export default router;