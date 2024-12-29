import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { Server } from 'ws';
import http from 'http';
import addBarRouter from './core/routes/add_bar';
import listBarsRouter from './core/routes/list_bars';
import addPintRouter from './core/routes/add_pint';
import logPintRouter from './core/routes/log_pint';
import listPintLogsRouter from './core/routes/list_pint_logs';
import deletePintRouter from './core/routes/delete_pint';
import deletePriceRouter from './core/routes/delete_price';
import deleteLogRouter from './core/routes/delete_log';
import getMapboxConfigRouter from './core/routes/get_mapbox_config';
import loginRouter from './core/routes/login';
import signupRouter from './core/routes/signup';
import logger from './logging/logger';
import responseLogger from './logging/responselogger';
import config from './config/config';

const app = express();
const server = http.createServer(app);
const wss = new Server({ server });

app.use(cors());
app.use(express.json());

// Middleware to log requests
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.url} ${req.body}`);
  next();
});

// Middleware to log responses
app.use(responseLogger);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.get('/api/bar', listBarsRouter);
app.post('/api/bar', addBarRouter);

app.post('/api/pint', addPintRouter);
app.delete('/api/pint', deletePintRouter);

app.delete('/api/price', deletePriceRouter);

app.get('/api/logs', listPintLogsRouter);
app.post('/api/log', logPintRouter);
app.delete('/api/log', deleteLogRouter);

app.get('/api/mapbox', getMapboxConfigRouter)

app.post('/api/auth/signup', signupRouter);
app.post('/api/auth/login', loginRouter);

const port = config.PORT;
server.listen(port, () => {
  console.log(`Server is running on ${port}`);
});

// WebSocket connection
wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

export { app, wss };