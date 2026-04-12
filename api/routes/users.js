const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const UsersController = require('../controllers/users');
const checkAuth = require('../middleware/check-auth');
const authLimiter = require('../middleware/rate-limit');
const { validateSignup, validateLogin } = require('../middleware/input-validation');

// Middleware to validate ObjectId parameters
const validateObjectId = (paramName = 'userId') => {
    return (req, res, next) => {
        const id = req.params[paramName];
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                error: { message: 'Invalid user ID format' }
            });
        }
        next();
    };
};

// Rate limited authentication routes
router.post('/signup', authLimiter, validateSignup, UsersController.users_create_user);
router.post('/login', authLimiter, validateLogin, UsersController.users_login_user);

// Protected routes
router.get('/me', checkAuth, UsersController.users_get_profile);
router.delete('/:userId', checkAuth, validateObjectId('userId'), UsersController.users_delete_user);

module.exports = router;