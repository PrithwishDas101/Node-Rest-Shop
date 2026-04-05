const express = require('express');
const app = express();

app.use((req, res, next) => {
    res.status(200).json({
        succes:"true",
        message:"it works man"
    })
})

module.exports = app;