const connection = require("../db/connection");
const { checkValid } = require("../db/utils/modelUtils");

exports.fetchOrders = (sentUsername, sentShoe, queryKey) => {
    const validKeys = ["username", "shoe"];
    return connection
        .select("orders.*")
        .from("orders")
        .modify(function(knex) {
            if (sentUsername) {
                knex.where("orders.username", sentUsername);
            }
            if (sentShoe) {
                knex.where("orders.shoe", sentShoe);
            }
        })
        .orderBy("order_date", "desc")
        .then((order) => {
            if (order.length < 1 || checkValid(validKeys, queryKey) === false)
                return Promise.reject({
                    status: 404,
                    msg: "Sorry Pal, That Query Was Funky. Order Not Found!",
                });
            return order;
        });
};

exports.insertOrder = (orderBody) => {
    // forces a 400 error by setting an undefined price to null when POST request body is malformed
    if (orderBody.price === undefined) orderBody.price = null;
    return connection("orders").insert(orderBody).returning("*")
};

exports.fetchOrderById = (sentOrderId) => {
    return connection
        .select("orders.*")
        .from("orders")
        .where("orders.order_id", sentOrderId)
        .then((order) => {
            if (order.length < 1)
                return Promise.reject({
                    status: 404,
                    msg: "Sorry Pal, Order Not Found!",
                });
            return order;
        });
};

exports.updateOrder = (patchOrderId, shippedDate, returnedDate, refundDate) => {
    if (shippedDate === undefined && returnedDate === undefined && refundDate === undefined) {
        return Promise.reject({ status: 400, msg: "No Can Do Pal, Bad Request. Fix Ya Body!" });
    }
    if (shippedDate === null || returnedDate === null || refundDate === null) {
        return Promise.reject({ status: 400, msg: "No Can Do Pal, Bad Request. Fix Ya Body!" });
    }
    return connection
        .select("orders.*")
        .from("orders")
        .where("orders.order_id", patchOrderId)
        .update("shipped_date", shippedDate)
        .update("returned_date", returnedDate)
        .update("refund_date", refundDate)
        .then(() => {
            return connection
                .select("orders.*")
                .from("orders")
                .where("orders.order_id", patchOrderId)
                .then((order) => {
                    if (order.length < 1)
                        return Promise.reject({
                            status: 404,
                            msg: "Sorry Pal, Order Not Found!",
                        });
                    else return order;
                });
        });
};