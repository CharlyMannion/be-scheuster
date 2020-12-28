const { fetchOrders } = require('../models/orders.models');
// const { fetchOrders, insertOrder, fetchOrderById, updateOrder, removeOrderById } = require('../models/orders.models');

exports.getOrders = (req, res, next) => {
    const { query: { username, shoe } } = req;
    const queryObj = req.query;
    const queryKey = Object.keys(queryObj)[0];
    fetchOrders(username, shoe, queryKey)
        .then((orders) => {
            res.status(200).send({ orders })
        })
        .catch((err) => {
            next(err);
        })
};