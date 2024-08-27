import { Request, Response } from 'express';
import logger from '../../logging/logger';
import configService from '../services/configService';

export const getMapboxConfig = async (req: Request, res: Response): Promise<void> => {
    try {
        const config = await configService.getMapboxConfig();
        res.json(config);
    } catch (error) {
        logger.error((error as Error).message);
        res.status(500).json({ error: (error as Error).message });
    }
    }


export default {
  getMapboxConfig,
}