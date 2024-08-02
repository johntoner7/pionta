const express = require('express');
const cors = require('cors');
const listBarsRouter = require('./routes/list_bars');
const addPintRouter = require('./routes/add_pint');
const logPintRouter = require('./routes/log_pint');
const listPintLogsRouter = require('./routes/list_pint_logs');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/bars', listBarsRouter);
app.post('/api/pint', addPintRouter);
app.post('/api/pint/log', logPintRouter);
app.get('/api/pint/logs', listPintLogsRouter);

const port = 8080;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = { app };