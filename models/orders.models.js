const connection = require("../db/connection")
const { checkValid } = require('../db/utils/modelUtils');

exports.fetchOrders = (sentUsername, sentShoe, queryKey) => {
    const validKeys = ['username', 'shoe'];
    return connection
        .select('orders.*')
        .from('orders')
        .modify(function(knex) {
            if (sentUsername) {
                knex.where('orders.username', sentUsername)
            }
            if (sentShoe) {
                knex.where('orders.shoe', sentShoe)
            }
        })
        .then((order) => {
            if (order.length < 1 || checkValid(validKeys, queryKey) === false)
                return Promise.reject({
                    status: 404,
                    msg: "Sorry Pal, That Query Was Funky. Order Not Found!",
                });
            return order;
        });
};