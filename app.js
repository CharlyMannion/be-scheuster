const express = require('express');
const app = express();
const apiRouter = require('./routes/api.router');
const { handleInvalidPath, handleCustomErrors, handlePsqlErrors, handleServerErrors } = require('./errors');

//essential in order to use the req.body and req.params in the controllers
app.use(express.json());

app.use('/api', apiRouter);

app.all('/*', handleInvalidPath);
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;