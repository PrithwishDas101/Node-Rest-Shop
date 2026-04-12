/**
 * Sanitization middleware to prevent NoSQL injection and XSS attacks
 */

/**
 * Check if an object contains MongoDB operators at any level
 */
const hasDangerousOperator = (obj) => {
    if (typeof obj !== 'object' || obj === null) {
        return false;
    }
    
    for (const key of Object.keys(obj)) {
        // Check if key starts with $ (MongoDB operator)
        if (key.startsWith('$')) {
            return true;
        }
        // Recursively check nested objects
        if (typeof obj[key] === 'object' && hasDangerousOperator(obj[key])) {
            return true;
        }
    }
    return false;
};

/**
 * Sanitize string values (basic XSS prevention)
 */
const sanitizeValue = (value) => {
    if (typeof value === 'string') {
        // Remove potential XSS vectors
        return value.replace(/[<>]/g, '');
    }
    if (Array.isArray(value)) {
        return value.map(sanitizeValue);
    }
    if (typeof value === 'object' && value !== null) {
        const sanitized = {};
        for (const [key, val] of Object.entries(value)) {
            sanitized[key] = sanitizeValue(val);
        }
        return sanitized;
    }
    return value;
};

/**
 * Express middleware to sanitize and validate request inputs
 */
const sanitizeInput = (req, res, next) => {
    try {
        // Check for dangerous MongoDB operators in body
        if (req.body && typeof req.body === 'object' && hasDangerousOperator(req.body)) {
            return res.status(400).json({
                success: false,
                error: { message: 'Invalid input format' }
            });
        }

        // Check for dangerous operators in query
        if (req.query && typeof req.query === 'object' && hasDangerousOperator(req.query)) {
            return res.status(400).json({
                success: false,
                error: { message: 'Invalid input format' }
            });
        }

        // Sanitize string values only
        if (req.body && typeof req.body === 'object') {
            req.body = sanitizeValue(req.body);
        }
        if (req.query && typeof req.query === 'object') {
            req.query = sanitizeValue(req.query);
        }
        if (req.params && typeof req.params === 'object') {
            req.params = sanitizeValue(req.params);
        }

        next();
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: { message: 'Invalid input format' }
        });
    }
};

module.exports = {
    sanitizeInput,
    hasDangerousOperator
};
