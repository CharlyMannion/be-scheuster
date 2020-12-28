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

exports.fetchUserById = (sentUserId) => {
    return connection
        .select("users.*")
        .from("users")
        .where("users.user_id", sentUserId)
        .then((user) => {
            if (user.length < 1)
                return Promise.reject({
                    status: 404,
                    msg: "Sorry Pal, User Not Found!",
                });
            return user;
        });
};

exports.updateUser = (patchUserId, newEmail) => {
    if (newEmail === undefined) {
        return Promise.reject({ status: 400, msg: "No Can Do Pal, Bad Request. Fix Ya Body!" });
    }
    if (newEmail !== 'undefined' || newEmail) {
        return connection
            .select("users.*")
            .from("users")
            .where("users.user_id", patchUserId)
            .update("email", newEmail)
            .then(() => {
                return connection
                    .select("users.*")
                    .from("users")
                    .where("users.user_id", patchUserId)
                    .then((user) => {
                        if (user.length < 1)
                            return Promise.reject({
                                status: 404,
                                msg: "Sorry Pal, User Not Found!",
                            });
                        else return user;
                    });
            });
    }
};

//deletes the requested user from the DB, and sets user in any related orders to null
exports.removeUserById = (delUserId) => {
    return connection('users')
        .where('user_id', delUserId)
        .del()
        .then((user) => {
            if (user === 0) return Promise.reject({
                status: 404,
                msg: 'Sorry Pal, Cannot Delete Non Existant User!'
            });
        });
};