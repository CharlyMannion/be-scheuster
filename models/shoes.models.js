const connection = require("../db/connection")

exports.fetchShoes = (sentName) => {
    return connection
        .select('shoes.*')
        .from('shoes')
        .modify(function(knex) {
            if (sentName) {
                knex.where('shoes.name', sentName)
            }
        })
}