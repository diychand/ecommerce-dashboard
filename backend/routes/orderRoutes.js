const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getMyOrders
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Customer routes
router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);

// Admin routes
router.get('/', protect, adminOnly, getOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id', protect, adminOnly, updateOrderStatus);

module.exports = router;