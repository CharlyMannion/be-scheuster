const { fetchUsers } = require('../models/users.models');
// const { fetchUsers, insertUser, fetchUserById, updateUser, removeUserById } = require('../models/users.models');

exports.getUsers = (req, res, next) => {
    const { query: { name, username, email } } = req;
    const queryObj = req.query;
    const queryKey = Object.keys(queryObj)[0];
    fetchUsers(name, username, email, queryKey)
        .then((users) => {
            res.status(200).send({ users })
        })
        .catch((err) => {
            next(err);
        })
}