const { fetchShoes } = require('../models/shoes.models');

exports.getShoes = (req, res, next) => {
    fetchShoes()
        .then((shoes) => {
            res.status(200).send({ shoes })
        });
}