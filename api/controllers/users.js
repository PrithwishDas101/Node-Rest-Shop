const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/users');

exports.users_create_user = async (req, res) => {
    try {
        const { email, password, username, age } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: { message: "Email and password are required" }
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                error: { message: "Password must be at least 6 characters" }
            });
        }

        // Generate username if not provided
        let finalUsername = username;
        if (!finalUsername) {
            const base = email.split('@')[0];
            finalUsername = base + Math.floor(Math.random() * 10000);
        }

        if (typeof finalUsername !== "string" || finalUsername.length < 3) {
            return res.status(400).json({
                success: false,
                error: { message: "Username must be at least 3 characters" }
            });
        }

        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(409).json({
                success: false,
                error: { message: "User already exists" }
            });
        }

        const usernameExists = await User.findOne({ username: finalUsername });
        if (usernameExists) {
            const base = email.split('@')[0];
            const newUsername = base + Math.floor(Math.random() * 100000);
            finalUsername = newUsername;
        }

        const hash = await bcrypt.hash(password, 10);

        const newUser = new User({
            _id: new mongoose.Types.ObjectId(),
            email,
            password: hash,
            username: finalUsername,
            age: age || 18
        });

        const result = await newUser.save();

        const token = jwt.sign({
            email: result.email,
            userId: result._id
        },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "1h"
            }
        );

        res.status(201).json({
            success: true,
            data: {
                message: "User created",
                token: token,
                user: {
                    _id: result._id,
                    email: result.email,
                    username: result.username,
                    age: result.age
                }
            }
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            error: { message: err.message }
        });
    }
};

exports.users_login_user = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            error: { message: "Email and password are required" }
        });
    }

    User.findOne({ email })
        .exec()
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    success: false,
                    error: { message: "Authentication failed" }
                });
            }

            bcrypt.compare(password, user.password, (err, result) => {

                if (err) {
                    return res.status(401).json({
                        success: false,
                        error: { message: "Authentication failed" }
                    });
                }

                if (result) {

                    const token = jwt.sign({
                        email: user.email,
                        userId: user._id
                    },
                        process.env.JWT_SECRET_KEY,
                        {
                            expiresIn: "1h"
                        }
                    )

                    return res.status(200).json({
                        success: true,
                        data: {
                            message: "Authentication successful",
                            token: token,
                            user: {
                                _id: user._id,
                                email: user.email,
                                username: user.username,
                                age: user.age
                            }
                        }
                    });
                }

                return res.status(401).json({
                    success: false,
                    error: { message: "Authentication failed" }
                });
            });
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                error: { message: err.message }
            });
        });
};

exports.users_get_profile = (req, res, next) => {
    const userId = req.userData.userId;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({
            success: false,
            error: { message: "Invalid user ID" }
        });
    }

    User.findById(userId)
        .select('_id email username age')
        .exec()
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: { message: "User not found" }
                });
            }

            res.status(200).json({
                success: true,
                data: {
                    user: {
                        _id: user._id,
                        email: user.email,
                        username: user.username,
                        age: user.age
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

exports.users_delete_user = (req, res, next) => {
    const userId = req.params.userId;

    if (!req.userData || !req.userData.userId) {
        return res.status(401).json({
            success: false,
            error: { message: "Authentication failed" }
        });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(404).json({
            success: false,
            error: { message: "User not found" }
        });
    }

    if (req.userData.userId !== userId) {
        return res.status(403).json({
            success: false,
            error: { message: "Unauthorized" }
        });
    }

    User
        .deleteOne({ _id: userId })
        .exec()
        .then(result => {
            if (result.deletedCount === 0) {
                return res.status(404).json({
                    success: false,
                    error: { message: "User not found" }
                });
            }

            res.status(200).json({
                success: true,
                data: {
                    message: "User deleted"
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