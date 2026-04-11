const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    productImage: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);