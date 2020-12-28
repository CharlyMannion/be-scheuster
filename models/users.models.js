const connection = require("../db/connection")
const { checkValid } = require('../db/utils/modelUtils');

exports.fetchUsers = (sentName, sentUsername, sentEmail, queryKey) => {
    const validKeys = ['name', 'username', 'email'];
    return connection
        .select('users.*')
        .from('users')
        .modify(function(knex) {
            if (sentName) {
                knex.where('users.name', sentName)
            }
            if (sentUsername) {
                knex.where('users.username', sentUsername)
            }
            if (sentEmail) {
                knex.where('users.email', sentEmail)
            }
        })
        .then((user) => {
            if (user.length < 1 || checkValid(validKeys, queryKey) === false)
                return Promise.reject({
                    status: 404,
                    msg: "Sorry Pal, That Query Was Funky. User Not Found!",
                });
            return user;
        });
};

exports.insertUser = (userBody) => {
    return connection("users").insert(userBody).returning("*");
};