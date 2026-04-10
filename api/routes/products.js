const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        const name = new Date().toISOString().replace(/:/g, '-') + file.originalname;
        cb(null, name);
    }
});

const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({
    storage: storage, limits: {
        fileSize: 1024 * 1024 * 5 // (5mb)
    },
    fileFilter: fileFilter
});

const Product = require('../models/products');

router.get('/', (req, res, next) => {
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
});

router.post('/', checkAuth, upload.single('productImage'), (req, res, next) => {

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
});

router.get('/:productId', (req, res, next) => {
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
});

router.patch('/:productId', checkAuth, (req, res, next) => {
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
});

router.delete('/:productId', checkAuth, (req, res, next) => {
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
});

module.exports = router;