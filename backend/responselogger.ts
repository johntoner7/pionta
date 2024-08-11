import { Request, Response, NextFunction } from 'express';
import logger from './logger';

const responseLogger = (req: Request, res: Response, next: NextFunction): void => {
  const oldSend = res.send;
  res.send = function (body?: any): Response {
    const summaryMessage = `Response: ${res.statusCode} - ${req.method} ${req.url}`;
    logger.info(summaryMessage);
    return oldSend.apply(res, arguments as any);
  };

  next();
};

export default responseLogger;