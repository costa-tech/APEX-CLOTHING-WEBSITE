const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrder,
  updateOrderStatus,
  getAllOrders
} = require('../controllers/orderController');
const auth = require('../middleware/auth');
const { adminAuth, userAuth } = require('../middleware/roleAuth');
const { validateOrder } = require('../middleware/validation');
const { paymentLimiter } = require('../middleware/rateLimiter');

// User routes
// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', auth, userAuth, paymentLimiter, validateOrder, createOrder);

// @route   GET /api/orders
// @desc    Get user orders
// @access  Private
router.get('/', auth, userAuth, getUserOrders);

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', auth, userAuth, getOrder);

// Admin routes
// @route   GET /api/orders/admin/all
// @desc    Get all orders (Admin)
// @access  Private/Admin
router.get('/admin/all', auth, adminAuth, getAllOrders);

// @route   PUT /api/orders/:id/status
// @desc    Update order status (Admin)
// @access  Private/Admin
router.put('/:id/status', auth, adminAuth, updateOrderStatus);

module.exports = router;
