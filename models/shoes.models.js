const connection = require("../db/connection")
const { checkValid } = require('../db/utils/modelUtils');

exports.fetchShoes = (sentName, queryKey) => {
    const validKeys = ['name'];
    return connection
        .select('shoes.*')
        .from('shoes')
        .modify(function(knex) {
            if (sentName) {
                knex.where('shoes.name', sentName)
            }
        })
        .then((shoe) => {
            if (shoe.length < 1 || checkValid(validKeys, queryKey) === false)
                return Promise.reject({
                    status: 404,
                    msg: "Sorry Pal, That Query Was Funky. Shoe Not Found!",
                });
            return shoe;
        });
}

exports.insertShoe = (shoeBody) => {
    return connection("shoes").insert(shoeBody).returning("*");
};

exports.fetchShoeById = (sentShoeId) => {
    return connection
        .select("shoes.*")
        .from("shoes")
        .where("shoes.shoe_id", sentShoeId)
        .then((shoe) => {
            if (shoe.length < 1)
                return Promise.reject({
                    status: 404,
                    msg: "Sorry Pal, Shoe Not Found!",
                });
            return shoe;
        });
};