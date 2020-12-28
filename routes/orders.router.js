const ordersRouter = require('express').Router();
const { getOrders, postOrder } = require('../controllers/orders.controller');
// const { getOrders, postOrder, getOrderById, patchOrderById, deleteOrderById } = require('../controllers/orders.controller');
const { handle405s } = require('../errors');

ordersRouter.route('/').get(getOrders).post(postOrder).all(handle405s);

// ordersRouter.route('/:order_id').get(getOrderById).all(handle405s);
// ordersRouter.route('/:order_id').get(getOrderById).patch(patchOrderById).delete(deleteOrderById).all(handle405s);

module.exports = ordersRouter;