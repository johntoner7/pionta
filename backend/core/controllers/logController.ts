import { Request, Response } from 'express';
import logService from '../services/logService';
import { PintLogRequest } from '../../../shared/types/pintLog';

export const logPint = async (req: Request, res: Response) => {
  const { pintName, barId, rating, description, price } = req.body;
  if (!pintName || !barId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const log: PintLogRequest = {
    pintName,
    barId,
    rating,
    description,
    price,
  };

  try {
    const result = await logService.logPint(log);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const listPintLogs = async (req: Request, res: Response) => {
  try {
    const result = await logService.listPintLogs();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const deleteLog = async (req: Request, res: Response) => {
  const { logId } = req.body;
  if (!logId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await logService.deleteLog(logId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}

export default {
  logPint,
  listPintLogs,
  deleteLog,
}