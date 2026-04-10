const mongoose = require('mongoose');

const Order = require("../models/orders");
const Product = require("../models/products")

exports.orders_get_all = (req, res, next) => {
    Order
        .find()
        .select('product quantity _id')
        .populate('product', 'name price')
        .exec()
        .then(docs => {
            res.status(200).json({
                success: true,
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity
                    }
                })
            })
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                error: {
                    message: err.message
                }
            });
        })
}

exports.orders_create_order = async (req, res) => {
    try {
        const productId = req.body.productId;

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
            quantity: req.body.quantity,
            product: productId
        });

        const result = await order.save();

        res.status(201).json({
            success: true,
            message: "Order stored",
            createdOrder: {
                _id: result._id,
                product: result.product,
                quantity: result.quantity
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

        res.status(200).json({
            success: true,
            order: {
                orderId: order._id,
                product: order.product,
                quantity: order.quantity
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

        const result = await Order.deleteOne({ _id: orderId });
        if (result.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                error: { message: "Order not found" }
            });
        }

        res.status(200).json({
            success: true,
            message: "Order deleted",
            orderId: orderId
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            error: { message: err.message }
        });
    }
}