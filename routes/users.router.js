const usersRouter = require('express').Router();
const { getUsers, postUser } = require('../controllers/users.controller');
// const { getUsers, postUser, getUserById, patchUserById, deleteUserById } = require('../controllers/users.controller');
const { handle405s } = require('../errors');

usersRouter.route('/').get(getUsers).all(handle405s);
// usersRouter.route('/').get(getUsers).post(postUser).all(handle405s);

// usersRouter.route('/:user_id').get(getUserById).patch(patchUserById).delete(deleteUserById).all(handle405s);

module.exports = usersRouter;