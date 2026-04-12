const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

// Security middleware
const authLimiter = require('./api/middleware/rate-limit');
const { sanitizeInput } = require('./api/middleware/sanitize-input');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');

if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in .env");
}

const uri = process.env.MONGODB_URI;

mongoose.connect(uri)
    .then(() => console.log("MongoDB connected"))
    .catch(err => {
        console.error("MongoDB connection error:", err.message);
        process.exit(1);
    });

mongoose.Promise = global.Promise;

app.disable('x-powered-by');

// Security headers with proper CSP
app.use(
  helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", process.env.CLIENT_URL || "http://localhost:5173"],
        }
    },
    crossOriginResourcePolicy: { policy: "cross-origin" },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    }
  })
);

// CORS configuration - restrict to specific origin(s)
const corsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = [
            process.env.CLIENT_URL || 'http://localhost:5173',
            'http://localhost:3000'
        ];
        
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Logging
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Body parser with reduced limits
app.use(express.urlencoded({ extended: false, limit: '100kb' }));
app.use(express.json({ limit: '100kb' }));

// Sanitization middleware
app.use(sanitizeInput);

// Static files
app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: "API is healthy",
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: { message: 'Route not found' }
    });
});

// Global error handler
app.use((error, req, res, next) => {
    console.error("ERROR:", {
        message: error.message,
        stack: process.env.NODE_ENV !== "production" ? error.stack : undefined
    });

    // Handle CORS errors
    if (error.message.includes('CORS')) {
        return res.status(403).json({
            success: false,
            error: { message: 'CORS policy violation' }
        });
    }

    res.status(error.status || 500).json({
        success: false,
        error: {
            message: process.env.NODE_ENV === 'production'
                ? "Internal Server Error"
                : error.message
        }
    });
});

module.exports = app;