const {
    orderData,
    shoeData,
    userData,
} = require('../data/index.js');

exports.seed = function(knex) {
    // add seeding functionality here
    return knex.migrate
        .rollback()
        .then(() => {
            return knex.migrate.latest();
        })
        .then(() => {
            console.log("LET\'S GET SEEDY!");
            return knex('shoes')
                .insert(shoeData)
                .returning('*')
        })
        .then(() => {
            return knex('users')
                .insert(userData)
                .returning('*')
        })
        .then(() => {
            return knex('orders')
                .insert(orderData)
                .returning('*')
                .then(() => {})
        })
};