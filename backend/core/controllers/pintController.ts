import { Request, Response } from 'express';
import pintService from '../services/pintService';
import logService from '../services/logService';
import logger from '../../logger';

interface AddPintRequestBody {
  pintName: string;
  barId: number;
  price: number | null;
}

interface LogPintRequestBody {
  pintName: string;
  barId: number;
  rating?: number;
  description?: string;
}

export const addPint = async (req: Request<{}, {}, AddPintRequestBody>, res: Response): Promise<void> => {
  const { pintName, barId, price } = req.body;

  if (!pintName || !barId || price === null) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    const result = await pintService.addPint(pintName, barId, price);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};


export const deletePint = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const {id} = req.body;
  
  if (!id) {
    logger.error('Missing required fields');
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    await pintService.deletePint(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}

export const deletePrice = async (req: Request<{ barId: string, pintId: string, price: string }>, res: Response): Promise<void> => {
  const { barId, pintId, price } = req.body;

  if (!barId || !pintId || !price) {
    logger.error('Missing required fields');
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    await pintService.deletePrice(barId, pintId, price);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}

export default {
  addPint,
  deletePint,
  deletePrice,
}