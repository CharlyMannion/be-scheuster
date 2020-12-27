const shoesRouter = require('express').Router();
const { getShoes } = require('../controllers/shoes.controller');

shoesRouter.get('/', getShoes);

module.exports = shoesRouter;