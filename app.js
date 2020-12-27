const express = require('express');
const app = express();
const apiRouter = require('./routes/api.router');
const { handleInvalidPath } = require('./errors')

app.use('/api', apiRouter);

app.all('/*', handleInvalidPath);

module.exports = app;