const apiRouter = require('express').Router();
const shoesRouter = require('./shoes.router');
const userRouter = require('./users.router');

apiRouter.use('/shoes', shoesRouter);
apiRouter.use('/users', userRouter);

module.exports = apiRouter;