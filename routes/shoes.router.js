const shoesRouter = require('express').Router();
const { getShoes } = require('../controllers/shoes.controller');
const { handle405s } = require('../errors');

shoesRouter.route('/').get(getShoes).all(handle405s);

module.exports = shoesRouter;