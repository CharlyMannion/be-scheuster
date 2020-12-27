const { fetchShoes, insertShoe, fetchShoeById } = require('../models/shoes.models');

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

exports.postShoe = (req, res, next) => {
    const { name, description, price, sizing_info, stock_number, avatar_url } = req.body;
    const newShoe = { name: name, description: description, price: price, sizing_info: sizing_info, stock_number: stock_number, avatar_url: avatar_url };
    insertShoe(newShoe)
        .then(([shoe]) => {
            res.status(201).send({ shoe });
        })
        .catch((err) => {
            next(err);
        })
};

exports.getShoeById = (req, res, next) => {
    const { shoe_id } = req.params;
    fetchShoeById(shoe_id)
        .then((shoes) => {
            res.status(200).send({ shoes })
        })
        .catch((err) => {
            next(err);
        })
};