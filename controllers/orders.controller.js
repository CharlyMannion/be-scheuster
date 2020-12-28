const { fetchOrders, insertOrder, fetchOrderById, updateOrder, removeOrderById } = require('../models/orders.models');

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

exports.postOrder = (req, res, next) => {
    const { shoe, username, price } = req.body;
    const newOrder = { shoe: shoe, username: username, price: price };
    insertOrder(newOrder)
        .then(([order]) => {
            res.status(201).send({ order });
        })
        .catch((err) => {
            next(err);
        })
};

exports.getOrderById = (req, res, next) => {
    const { order_id } = req.params;
    fetchOrderById(order_id)
        .then((orders) => {
            res.status(200).send({ orders })
        })
        .catch((err) => {
            next(err);
        })
};

exports.patchOrderById = (req, res, next) => {
    const { order_id } = req.params;
    const { shipped_date, returned_date, refund_date } = req.body;
    updateOrder(order_id, shipped_date, returned_date, refund_date)
        .then(([order]) => {
            res.status(200).send({ order });
        })
        .catch((err) => {
            next(err);
        });
};