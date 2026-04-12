const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const { validateOrderCreation, validateObjectIdParam } = require('../middleware/input-validation');

const OrdersController = require('../controllers/orders');

router.get('/', checkAuth, OrdersController.orders_get_all)
router.post('/', checkAuth, validateOrderCreation, OrdersController.orders_create_order);
router.get('/:orderId', checkAuth, validateObjectIdParam('orderId'), OrdersController.orders_get_single_order);
router.delete('/:orderId', checkAuth, validateObjectIdParam('orderId'), OrdersController.orders_delete_order);

module.exports = router;