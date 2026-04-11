const mongoose = require('mongoose');

const usersSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    age: {
        type: Number,
        min: 1
    }
}, { timestamps: true });

module.exports = mongoose.model('User', usersSchema);