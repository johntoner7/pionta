const express = require('express');
const cors = require('cors');
const addBarRouter = require('./core/routes/add_bar');
const listBarsRouter = require('./core/routes/list_bars');
const addPintRouter = require('./core/routes/add_pint');
const logPintRouter = require('./core/routes/log_pint');
const listPintLogsRouter = require('./core/routes/list_pint_logs');
const logger = require('./logger');
const responseLogger = require('./responselogger');
const app = express();

app.use(cors());
app.use(express.json());

// Middleware to log requests
app.use((req, res, next) => {
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

module.exports = { app };