exports.up = function(knex) {
    console.log('creating orders table');
    return knex.schema.createTable('orders', (ordersTable) => {
        ordersTable.increments('order_id').primary();
        ordersTable.string('shoe').references('shoes.name').notNullable();
        ordersTable.string('username').references('users.username').notNullable();
        ordersTable.integer('price').defaultTo(0);
        ordersTable.timestamp('order_date').notNullable().defaultTo(knex.fn.now());
        ordersTable.timestamp('shipped_date');
        ordersTable.timestamp('returned_date');
        ordersTable.timestamp('refund_date');
    });
};

exports.down = function(knex) {
    console.log('dropping orders table');
    return knex.schema.dropTable('orders');
};