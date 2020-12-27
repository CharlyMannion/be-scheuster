const apiRouter = require('express').Router();
const shoesRouter = require('./shoes.router');

apiRouter.use('/shoes', shoesRouter);

module.exports = apiRouter;