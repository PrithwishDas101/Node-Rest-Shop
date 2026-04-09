const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/users');

router.post('/signup', async (req, res) => {
    try {
        const { email, password, username, age } = req.body;

        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(409).json({
                success: false,
                message: "Email already exists"
            });
        }

        const usernameExists = await User.findOne({ username });
        if (usernameExists) {
            const base = email.split('@')[0];

            const suggestions = [
                base + Math.floor(Math.random() * 100),
                base + "_01",
                base + "_official",
                base + Date.now().toString().slice(-3)
            ];

            return res.status(409).json({
                success: false,
                message: "Username unavailable",
                suggestions
            });
        }

        const hash = await bcrypt.hash(password, 15);

        const newUser = new User({
            _id: new mongoose.Types.ObjectId(),
            email,
            password: hash,
            username,
            age
        });

        const result = await newUser.save();

        console.log(result);

        res.status(201).json({
            success: true,
            message: "User created"
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            error: {
                message: err.message
            }
        });
    }
});

router.delete('/:userId', (req, res, next) => {
    User
        .deleteOne({ _id: req.params.userId })
        .exec()
        .then(result => {
            res.status(200).json({
                success: true,
                message: "User deleted"
            })
        }).catch(err => {
            res.status(500).json({
                success: false,
                message: err.message
            })
            
        })
})

module.exports = router;