exports.up = function(knex) {
    // console.log('creating shoes table');
    return knex.schema.createTable('shoes', (shoesTable) => {
        shoesTable.increments('shoe_id').primary();
        shoesTable.string('name').notNullable().unique();
        shoesTable.string('category').notNullable();
        shoesTable.string('style').notNullable();
        shoesTable.string('material').notNullable();
        shoesTable.integer('size').defaultTo(0);
        shoesTable.string('colour_group').notNullable();
        shoesTable.string('heel_height').notNullable();
        shoesTable.text('description').notNullable();
        shoesTable.integer('price').defaultTo(0);
        shoesTable.text('sizing_info').notNullable();
        shoesTable.integer('stock_number').defaultTo(0);
        shoesTable.string('avatar_url').notNullable();
    });
};

exports.down = function(knex) {
    // console.log('dropping shoes table');
    return knex.schema.dropTable('shoes');
};