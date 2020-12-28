const apiRouter = require('express').Router();
const shoesRouter = require('./shoes.router');
const userRouter = require('./users.router');

apiRouter.use('/shoes', shoesRouter);
apiRouter.use('/users', userRouter);

apiRouter.get('/', (req, res) => {
    res.json({
        'possible endpoints:': {
            '/api/shoes': ['GET', 'POST'],
            '/api/shoes/:shoe_id': ['GET', 'PATCH', 'DELETE'],
            '/api/users': ['GET', 'POST'],
            '/api/users/:user_id': ['GET', 'PATCH', 'DELETE'],
            '/api/orders/': ['POST', 'GET'],
            '/api/orders/:order_id': ['PATCH', 'GET'],
        }
    })
})

module.exports = apiRouter;