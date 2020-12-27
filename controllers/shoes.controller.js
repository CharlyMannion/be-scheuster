const { fetchShoes } = require('../models/shoes.models');

exports.getShoes = (req, res, next) => {
    const { query: { name } } = req;
    fetchShoes(name)
        .then((shoes) => {
            res.status(200).send({ shoes })
        })
        .catch((err) => {
            next(err);
        })
}