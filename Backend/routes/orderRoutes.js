const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const orderController = require('../controllers/orderController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const validate = require('../middleware/validationMiddleware');

// Validation rules
const orderValidation = [
  body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  body('items.*.productId').notEmpty().withMessage('Product ID is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('shippingAddress').notEmpty().withMessage('Shipping address is required'),
  body('total').isFloat({ min: 0 }).withMessage('Total must be a positive number'),
];

// Customer routes (Protected)
router.get('/my-orders', verifyToken, orderController.getMyOrders);
router.get('/:id', verifyToken, orderController.getOrderById);
router.post('/', verifyToken, orderValidation, validate, orderController.createOrder);

// Admin routes
router.get('/', verifyToken, isAdmin, orderController.getAllOrders);
router.patch('/:id/status', verifyToken, isAdmin, orderController.updateOrderStatus);
router.delete('/:id', verifyToken, isAdmin, orderController.deleteOrder);
router.get('/stats/summary', verifyToken, isAdmin, orderController.getOrderStats);

module.exports = router;
