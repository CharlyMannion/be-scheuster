const {
    orderData,
    shoeData,
    userData,
} = require('../data/index.js');

exports.seed = function(knex) {
    return knex.migrate
        .rollback()
        .then(() => {
            return knex.migrate.latest();
        })
        .then(() => {
            // console.log("seeding data");
            // inserts shoeData into shoes table
            return knex('shoes')
                .insert(shoeData)
                .returning('*')
        })
        .then(() => {
            return knex('users')
                // inserts userData into users table
                .insert(userData)
                .returning('*')
        })
        .then(() => {
            return knex('orders')
                // inserts orderData into orders table
                .insert(orderData)
                .returning('*')
                .then(() => {})
        })
};