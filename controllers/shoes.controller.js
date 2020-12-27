const { fetchShoes } = require('../models/shoes.models');

exports.getShoes = (req, res, next) => {
    const { query: { name } } = req;
    const queryObj = req.query;
    const queryKey = Object.keys(queryObj)[0];
    fetchShoes(name, queryKey)
        .then((shoes) => {
            res.status(200).send({ shoes })
        })
        .catch((err) => {
            next(err);
        })
}