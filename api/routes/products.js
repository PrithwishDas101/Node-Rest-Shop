const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        success: "true",
        message: "Handling GET requests to /products"
    })
})

router.post('/', (req, res, next) => {
    res.status(201).json({
        success: "true",
        message: "Handling POST requests to /products"
    })
})

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    if (id === 'special') {
        res.status(200).json({
            success: "true",
            message: "Hey you found our special item"
        });
    }
    else{
        res.status(200).json({
            success: "true",
            message: `Hey you found our product ${id};`
        })
    }
})

router.post('/:productId', (req, res, next) => {
    const id = req.params.productId;
    
    res.status(201).json({
        success:"true",
        message: `Product with id ${id} has been updated`
    })
})

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    
    res.status(200).json({
        success:"true",
        message: `Product with id ${id} has been deleted`
    })
})

module.exports = router