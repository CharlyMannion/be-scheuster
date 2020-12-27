const shoesRouter = require('express').Router();
const { getShoes, postShoe, getShoeById, patchShoeById, deleteShoeById } = require('../controllers/shoes.controller');
const { handle405s } = require('../errors');

shoesRouter.route('/').get(getShoes).post(postShoe).all(handle405s);

shoesRouter.route('/:shoe_id').get(getShoeById).patch(patchShoeById).delete(deleteShoeById).all(handle405s);

module.exports = shoesRouter;