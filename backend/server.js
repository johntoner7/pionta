const express = require('express');
const cors = require('cors');
const listBarsRouter = require('./core/routes/list_bars');
const addPintRouter = require('./core/routes/add_pint');
const logPintRouter = require('./core/routes/log_pint');
const listPintLogsRouter = require('./core/routes/list_pint_logs');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/bars', listBarsRouter);
app.post('/api/pint', addPintRouter);
app.post('/api/log', logPintRouter);
app.get('/api/logs', listPintLogsRouter);

const port = 8080;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = { app };