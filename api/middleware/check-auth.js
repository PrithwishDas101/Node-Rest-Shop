const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                error: { message: "Authentication failed" }
            });
        }

        // Validate Bearer token format
        const parts = authHeader.split(" ");
        if (parts.length !== 2 || parts[0] !== 'Bearer' || !parts[1]) {
            return res.status(401).json({
                success: false,
                error: { message: "Authentication failed" }
            });
        }

        const token = parts[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        req.userData = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            error: { message: "Authentication failed" }
        });
    }
};