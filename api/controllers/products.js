const mongoose = require('mongoose');

const Product = require('../models/products');

exports.products_get_all = (req, res, next) => {
    Product.find()
        .select('name price _id productImage')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: Number(doc.price),
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

            return res.status(200).json({
                success: true,
                data: response
            })
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                error: { message: err.message }
            });
        });
}

exports.products_create_product = (req, res, next) => {

    if (!req.body.name || !req.body.price) {
        return res.status(400).json({
            success: false,
            error: { message: "Name and price are required" }
        });
    }

    if (isNaN(req.body.price) || Number(req.body.price) <= 0) {
        return res.status(400).json({
            success: false,
            error: { message: "Price must be a positive number" }
        });
    }

    if (!req.file) {
        return res.status(400).json({
            success: false,
            error: { message: "Product image is required" }
        });
    }

    const port = process.env.PORT || 8000;
    const imageUrl = `http://localhost:${port}/uploads/${req.file.filename}`;

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: Number(req.body.price),
        productImage: imageUrl,
        user: req.userData.userId
    });

    product.save()
        .then(result => {
            res.status(201).json({
                success: true,
                message: "Product created",
                data: {
                    product: {
                        name: result.name,
                        price: result.price,
                        _id: result._id
                    }
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                error: { message: err.message }
            });
        });
};

exports.products_get_single_product = (req, res, next) => {
    const id = req.params.productId;

    Product.findById(id)
        .select('name price _id productImage')
        .exec()
        .then(doc => {
            if (doc) {
                return res.status(200).json({
                    success: true,
                    data: {
                        product: {
                            name: doc.name,
                            price: Number(doc.price),
                            _id: doc._id,
                            productImage: doc.productImage
                        }
                    }
                });
            }

            return res.status(404).json({
                success: false,
                error: { message: "No valid entry for that ID" }
            });
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                error: { message: err.message }
            });
        });
}

exports.products_update_product = (req, res, next) => {
    const id = req.params.productId;
    const userId = req.userData.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({
            success: false,
            error: { message: "Product not found" }
        });
    }

    Product.findById(id)
        .exec()
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    success: false,
                    error: { message: "Product not found" }
                });
            }

            if (product.user.toString() !== userId) {
                return res.status(403).json({
                    success: false,
                    error: { message: "Unauthorized: You can only update your own products" }
                });
            }

            if (!req.body || Object.keys(req.body).length === 0) {
                return res.status(400).json({
                    success: false,
                    error: { message: "No data provided to update" }
                });
            }

            if (req.body.price && (isNaN(req.body.price) || Number(req.body.price) <= 0)) {
                return res.status(400).json({
                    success: false,
                    error: { message: "Price must be a positive number" }
                });
            }

            Product.updateOne(
                { _id: id },
                { $set: req.body }
            )
                .exec()
                .then(result => {
                    res.status(200).json({
                        success: true,
                        data: {
                            message: "Product updated"
                        }
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        success: false,
                        error: { message: err.message }
                    });
                });
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                error: { message: err.message }
            });
        });
}


exports.products_delete_product = (req, res, next) => {
    const id = req.params.productId;
    const userId = req.userData.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({
            success: false,
            error: { message: "Product not found" }
        });
    }

    Product.findById(id)
        .exec()
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    success: false,
                    error: { message: "Product not found" }
                });
            }

            if (product.user.toString() !== userId) {
                return res.status(403).json({
                    success: false,
                    error: { message: "Unauthorized: You can only delete your own products" }
                });
            }

            Product.deleteOne({ _id: id })
                .exec()
                .then(result => {
                    res.status(200).json({
                        success: true,
                        data: {
                            message: "Product deleted"
                        }
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        success: false,
                        error: { message: err.message }
                    });
                });
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                error: { message: err.message }
            });
        });
}