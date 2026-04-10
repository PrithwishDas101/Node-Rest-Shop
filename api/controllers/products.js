const mongoose = require('mongoose');

const Product = require('../models/products');

exports.products_get_all =  (req, res, next) => {
    Product.find()
        .select('name price _id productImage')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        productImage: doc.productImage
                    }
                })
            }

            //    if (docs.length > 0) {
            //        return res.status(200).json(docs);
            //    }

            //    return res.status(404).json({
            //        message: "No data found"
            //    });

            return res.status(200).json(response)
        })
        .catch(err => {
            res.status(500).json({
                error: err.message
            });
        });
}

exports.products_create_product = (req, res, next) => {

    console.log(req.file);

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });

    product.save()
        .then(result => {
            res.status(201).json({
                success: true,
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err.message
            });
        });
}

exports.products_get_single_product = (req, res, next) => {
    const id = req.params.productId;

    Product.findById(id)
        .select('name price _id productImage')
        .exec()
        .then(doc => {
            if (doc) {
                return res.status(200).json({
                    name: doc.name,
                    price: doc.price,
                    _id: doc._id,
                    productImage: doc.productImage
                });
            }

            return res.status(404).json({
                message: "No valid entry for that ID"
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err.message
            });
        });
}

exports.products_update_product = (req, res, next) => {
    const id = req.params.productId;

    Product.updateOne(
        { _id: id },
        { $set: req.body }
    )
        .exec()
        .then(result => {
            res.status(200).json({
                success: true,
                message: "Product updated",
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err.message
            });
        });
}

exports.products_delete_product = (req, res, next) => {
    const id = req.params.productId;

    Product.deleteOne({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                success: true,
                message: "Product deleted"
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err.message
            });
        });
}