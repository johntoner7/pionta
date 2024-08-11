import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import addBarRouter from './core/routes/add_bar';
import listBarsRouter from './core/routes/list_bars';
import addPintRouter from './core/routes/add_pint';
import logPintRouter from './core/routes/log_pint';
import listPintLogsRouter from './core/routes/list_pint_logs';
import logger from './logger';
import responseLogger from './responselogger';

const app = express();

app.use(cors());
app.use(express.json());

// Middleware to log requests
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Middleware to log responses
app.use(responseLogger);

app.get('/api/bar', listBarsRouter);
app.post('/api/bar', addBarRouter);

app.post('/api/pint', addPintRouter);

app.get('/api/logs', listPintLogsRouter);
app.post('/api/log', logPintRouter);

const port = 8080;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export { app };