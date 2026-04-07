const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "Orders were fetched"
    })
})

router.post('/', (req, res, next) => {

    const order = {
        orderId: req.body.orderId,
        quantity: req.body.quantity
    }

    res.status(201).json({
        success: true,
        message: "Order was created",
        Order: order
    })
})

router.get('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    res.status(200).json({
        success: true,
        message: `Order details`,
        orderId: req.params.orderId
    })
})

router.delete('/:orderId', (req, res, next) => {
    const id = req.params.orderId;

    res.status(200).json({
        success: true,
        message: `Order deleted`,
        orderId: req.params.orderId
    })
})

module.exports = router