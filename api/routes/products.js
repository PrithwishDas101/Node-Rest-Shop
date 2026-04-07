const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/products');

// GET ALL PRODUCTS
router.get('/', (req, res) => {
    Product.find()
        .exec()
        .then(docs => {
            console.log(docs);

            if (docs.length > 0) {
                return res.status(200).json(docs);
            }

            return res.status(404).json({
                message: "No data found"
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err.message
            });
        });
});

// CREATE PRODUCT
router.post('/', (req, res) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });

    product.save()
        .then(result => {
            res.status(201).json({
                success: true,
                createdProduct: result
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err.message
            });
        });
});

// GET SINGLE PRODUCT
router.get('/:productId', (req, res) => {
    const id = req.params.productId;

    Product.findById(id)
        .exec()
        .then(doc => {
            if (doc) {
                return res.status(200).json(doc);
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
});

// UPDATE PRODUCT (PATCH)
router.patch('/:productId', (req, res) => {
    const id = req.params.productId;

    Product.updateOne(
        { _id: id },
        { $set: req.body }   // ✅ clean & correct
    )
        .exec()
        .then(result => {
            res.status(200).json({
                success: true,
                result
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err.message
            });
        });
});

// DELETE PRODUCT
router.delete('/:productId', (req, res) => {
    const id = req.params.productId;

    Product.deleteOne({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                success: true,
                result
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err.message
            });
        });
});

module.exports = router;