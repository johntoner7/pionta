import express from 'express';
import { Router } from 'express';
import { getMapboxConfig } from '../controllers/configController';

const router: Router = express.Router();

router.get('/api/mapbox', getMapboxConfig);

export default router;
