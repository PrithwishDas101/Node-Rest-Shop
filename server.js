require('dotenv').config({ quiet: true });
const app = require('./app');

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
    console.log(`Server running on port ${port} in ${process.env.NODE_ENV || 'development'} mode`);
});

process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION:', err.message);
    server.close(() => {
        process.exit(1);
    });
});

process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION:', err.message);
    process.exit(1);
});