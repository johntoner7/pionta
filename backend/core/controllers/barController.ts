import { Request, Response } from 'express';
import logger from '../../logger';
import barService from '../services/barService';
import {NewBar} from '../../../shared/types/bar';

export const addBar = async (req: Request, res: Response): Promise<void> => {
  const { name, description, latitude, longitude } = req.body;
  if (!name || !latitude || !longitude) {
    res.status(400).json({ error: 'Missing required fields' });
    return
  }
    const bar: NewBar = {
    name,
    description,
    latitude,
    longitude,
  };
  try {
    const result = await barService.addBar(bar);
    res.json({ message: 'Bar added successfully', barId: result });
  } catch (error) {
    logger.error((error as Error).message);
    res.status(500).json({ error: (error as Error).message });
  }
};

export const listBars = async (req: Request, res: Response): Promise<void> => {
  try {
    const results = await barService.listBars();
    res.json({ bars: results });
  } catch (error) {
    logger.error((error as Error).message);
    res.status(500).json({ error: (error as Error).message });
  }
};
