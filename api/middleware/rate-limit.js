const rateLimit = require('express-rate-limit');

/**
 * Rate limiting for authentication routes
 * Prevents brute force attacks on login and signup
 * Limit: 5 requests per 15 minutes per IP
 */
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per windowMs
    message: {
        success: false,
        error: {
            message: 'Too many authentication attempts, please try again later'
        }
    },
    statusCode: 429,
    standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false, // Disable `X-RateLimit-*` headers
});

module.exports = authLimiter;
