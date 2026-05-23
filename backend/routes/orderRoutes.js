const express = require('express');
const router = express.Router();
const { createOrder, getOrderById, getUserOrders, getMyOrders } = require('../controllers/orderController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');

router.post('/', optionalAuth, createOrder);
router.get('/my', protect, getMyOrders);
router.get('/user/:userId', getUserOrders);
router.get('/:orderId', getOrderById);

module.exports = router;
