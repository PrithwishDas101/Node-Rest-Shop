const mongoose = require('mongoose');

const Order = require("../models/orders");
const Product = require("../models/products")

exports.orders_get_all = (req, res, next) => {
    Order
        .find({ user: req.userData.userId })
        .select('product quantity _id user')
        .populate('product')
        .exec()
        .then(docs => {
            res.status(200).json({
                success: true,
                data: {
                    count: docs.length,
                    orders: docs.map(doc => {
                        const product = doc.product || {};
                        return {
                            _id: doc._id,
                            product: {
                                _id: product._id,
                                name: product.name,
                                price: Number(product.price) || 0,
                                productImage: product.productImage
                            },
                            quantity: doc.quantity
                        };
                    })
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                error: { message: err.message }
            });
        })
}

exports.orders_create_order = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        if (!productId || quantity === undefined) {
            return res.status(400).json({
                success: false,
                error: { message: "productId and quantity are required" }
            });
        }

        if (typeof quantity !== "number" || quantity <= 0) {
            return res.status(400).json({
                success: false,
                error: { message: "Quantity must be a positive number" }
            });
        }

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(404).json({
                success: false,
                error: { message: "Product not found" }
            });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                error: { message: "Product not found" }
            });
        }

        const order = new Order({
            _id: new mongoose.Types.ObjectId(),
            quantity: quantity,
            product: productId,
            user: req.userData.userId
        });

        const result = await order.save();

        res.status(201).json({
            success: true,
            data: {
                message: "Order stored",
                order: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                }
            }
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            error: { message: err.message }
        });
    }
}

exports.orders_get_single_order = async (req, res) => {
    try {
        const orderId = req.params.orderId;

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(404).json({
                success: false,
                error: { message: "Order not found" }
            });
        }

        const order = await Order.findById(orderId)
            .populate('product', 'name price');

        if (!order) {
            return res.status(404).json({
                success: false,
                error: { message: "Order not found" }
            });
        }

        if (order.user.toString() !== req.userData.userId) {
            return res.status(403).json({
                success: false,
                error: { message: "Unauthorized" }
            });
        }

        res.status(200).json({
            success: true,
            data: {
                order: {
                    orderId: order._id,
                    product: order.product,
                    quantity: order.quantity
                }
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: { message: err.message }
        });
    }
}

exports.orders_delete_order = async (req, res) => {
    try {
        const orderId = req.params.orderId;

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(404).json({
                success: false,
                error: { message: "Order not found" }
            });
        }

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                error: { message: "Order not found" }
            });
        }

        if (order.user.toString() !== req.userData.userId) {
            return res.status(403).json({
                success: false,
                error: { message: "Unauthorized" }
            });
        }

        const result = await Order.deleteOne({ _id: orderId });
        if (result.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                error: { message: "Order not found" }
            });
        }

        res.status(200).json({
            success: true,
            data: {
                message: "Order deleted",
                orderId: orderId
            }
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            error: { message: err.message }
        });
    }
}