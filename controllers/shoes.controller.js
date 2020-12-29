const { fetchShoes, insertShoe, fetchShoeById, updateShoe, removeShoeById } = require('../models/shoes.models');

exports.getShoes = (req, res, next) => {
    const { query: { name, category, style, material, size, colour_group, heel_height } } = req;
    const queryObj = req.query;
    const queryKey = Object.keys(queryObj)[0];
    fetchShoes(name, category, style, material, size, colour_group, heel_height, queryKey)
        .then((shoes) => {
            res.status(200).send({ shoes })
        })
        .catch((err) => {
            next(err);
        })
}

exports.postShoe = (req, res, next) => {
    const { name, description, category, style, material, size, colour_group, heel_height, price, sizing_info, stock_number, avatar_url } = req.body;
    const newShoe = { name: name, description: description, category: category, style: style, material: material, size: size, colour_group: colour_group, heel_height: heel_height, price: price, sizing_info: sizing_info, stock_number: stock_number, avatar_url: avatar_url };
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

exports.patchShoeById = (req, res, next) => {
    const { shoe_id } = req.params;
    const { reduce_stock } = req.body;
    updateShoe(shoe_id, reduce_stock)
        .then(([shoe]) => {
            res.status(200).send({ shoe });
        })
        .catch((err) => {
            next(err);
        });
};

exports.deleteShoeById = (req, res, next) => {
    //gets the shoe if from the request url
    const { shoe_id } = req.params;
    // removeShoe call - sends the shoe id to the model so it can be deleted from the DB
    removeShoeById(shoe_id)
        .then(() => {
            res.sendStatus(204)
        })
        .catch((err) => {
            next(err);
        });
}