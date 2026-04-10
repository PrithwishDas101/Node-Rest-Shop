const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/users');

exports.users_create_user = async (req, res) => {
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

        const hash = await bcrypt.hash(password, 10);

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
            message: "User created",
            _id: result._id
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            error: {
                message: err.message
            }
        });
    }
};

exports.users_login_user = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication failed"
                });
            }

            bcrypt.compare(req.body.password, user[0].password, (err, result) => {

                if (err) {
                    return res.status(401).json({
                        success: false,
                        message: "Authentication failed"
                    });
                }

                if (result) {

                    const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id
                    },
                        process.env.JWT_SECRET_KEY,
                        {
                            expiresIn: "1h"
                        }
                    )

                    return res.status(200).json({
                        success: true,
                        message: "Authentication successful",
                        token: token
                    });
                }

                return res.status(401).json({
                    success: false,
                    message: "Authentication failed"
                });
            });
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                message: err.message
            });
        });
};

exports.users_delete_user = (req, res, next) => {
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    if (req.userData.userId !== userId) {
        return res.status(403).json({
            success: false,
            message: "Unauthorized"
        });
    }

    User
        .deleteOne({ _id: userId })
        .exec()
        .then(result => {
            if (result.deletedCount === 0) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            res.status(200).json({
                success: true,
                message: "User deleted"
            });
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                message: err.message
            });
        });
};