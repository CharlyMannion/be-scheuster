const ordersRouter = require('express').Router();
const { getOrders, postOrder, getOrderById, patchOrderById } = require('../controllers/orders.controller');
const { handle405s } = require('../errors');

ordersRouter.route('/').get(getOrders).post(postOrder).all(handle405s);

ordersRouter.route('/:order_id').get(getOrderById).patch(patchOrderById).all(handle405s);

module.exports = ordersRouter;