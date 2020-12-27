const knex = require("../db/connection")

exports.fetchShoes = () => {
    return knex
        .select('*')
        .from('shoes')
        .then((shoesArr) => {
            // console.log(shoesArr, "<=========== shoes ARRAY IN MODEL");
            return shoesArr;
        })
}