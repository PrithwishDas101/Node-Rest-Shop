const { body, validationResult, param } = require('express-validator');
const mongoose = require('mongoose');

/**
 * Custom validation and error handling middleware
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: {
                message: errors.array()[0].msg || 'Validation failed'
            }
        });
    }
    next();
};

/**
 * Signup validation
 */
const validateSignup = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Invalid email format')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain uppercase, lowercase, and number'),
    body('username')
        .optional()
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage('Username must be 3-30 characters')
        .matches(/^[a-zA-Z0-9_-]+$/)
        .withMessage('Username can only contain letters, numbers, hyphens, and underscores'),
    body('age')
        .optional()
        .isInt({ min: 13, max: 120 })
        .withMessage('Age must be between 13 and 120'),
    handleValidationErrors
];

/**
 * Login validation
 */
const validateLogin = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Invalid email format')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 1 })
        .withMessage('Password is required'),
    handleValidationErrors
];

/**
 * Product creation validation
 */
const validateProductCreation = [
    body('name')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Product name is required and must be 100 characters or less')
        .matches(/^[a-zA-Z0-9\s\-\.,'&():]+$/)
        .withMessage('Invalid characters in product name'),
    body('price')
        .isFloat({ min: 0.01 })
        .withMessage('Price must be a positive number'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description must be 500 characters or less'),
    handleValidationErrors
];

/**
 * Order creation validation
 */
const validateOrderCreation = [
    body('productId')
        .custom(value => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error('Invalid product ID');
            }
            return true;
        }),
    body('quantity')
        .isInt({ min: 1, max: 1000 })
        .withMessage('Quantity must be between 1 and 1000'),
    handleValidationErrors
];

/**
 * MongoDB ObjectId parameter validation
 */
const validateObjectIdParam = (paramName = 'id') => [
    param(paramName)
        .custom(value => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error('Invalid ID format');
            }
            return true;
        })
        .withMessage('Invalid ID format'),
    handleValidationErrors
];

module.exports = {
    validateSignup,
    validateLogin,
    validateProductCreation,
    validateOrderCreation,
    validateObjectIdParam,
    handleValidationErrors
};
