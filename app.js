const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

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

app.use(
  helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: false,
  })
);

app.use(cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true
}));

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: "10mb" }));

app.use('/uploads', express.static('uploads'));

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: "API is healthy",
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: { message: 'Route not found' }
    });
});

app.use((error, req, res, next) => {
    console.error("ERROR:", {
        message: error.message,
        stack: process.env.NODE_ENV !== "production" ? error.stack : undefined
    });

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