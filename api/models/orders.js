const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    quantity: { type: Number, default: 1, min: 1 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);