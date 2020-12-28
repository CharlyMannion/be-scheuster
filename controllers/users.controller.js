const { fetchUsers, insertUser, fetchUserById, updateUser } = require('../models/users.models');
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
};

exports.postUser = (req, res, next) => {
    const { name, username, email, avatar_url } = req.body;
    const newUser = { name: name, username: username, email: email, avatar_url: avatar_url };
    insertUser(newUser)
        .then(([user]) => {
            res.status(201).send({ user });
        })
        .catch((err) => {
            next(err);
        })
};

exports.getUserById = (req, res, next) => {
    const { user_id } = req.params;
    fetchUserById(user_id)
        .then((users) => {
            res.status(200).send({ users })
        })
        .catch((err) => {
            next(err);
        })
};

exports.patchUserById = (req, res, next) => {
    const { user_id } = req.params;
    const { email } = req.body;
    updateUser(user_id, email)
        .then(([user]) => {
            res.status(200).send({ user });
        })
        .catch((err) => {
            next(err);
        });
};