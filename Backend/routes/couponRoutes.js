const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const couponController = require('../controllers/couponController');
const { verifyToken, isAdmin, optionalAuth } = require('../middleware/authMiddleware');
const validate = require('../middleware/validationMiddleware');

// Validation rules
const createCouponValidation = [
  body('code').trim().notEmpty().withMessage('Coupon code is required'),
  body('type').isIn(['percentage', 'fixed']).withMessage('Type must be percentage or fixed'),
  body('value').isFloat({ min: 0 }).withMessage('Value must be a positive number'),
];

const validateCouponValidation = [
  body('code').trim().notEmpty().withMessage('Coupon code is required'),
  body('orderAmount').isFloat({ min: 0 }).withMessage('Order amount must be a positive number'),
];

// Admin routes
router.post('/', verifyToken, isAdmin, createCouponValidation, validate, couponController.createCoupon);
router.get('/', verifyToken, isAdmin, couponController.getAllCoupons);
router.put('/:id', verifyToken, isAdmin, couponController.updateCoupon);
router.delete('/:id', verifyToken, isAdmin, couponController.deleteCoupon);

// Customer routes (validate works for both authenticated and guest users)
router.post('/validate', optionalAuth, validateCouponValidation, validate, couponController.validateCoupon);
router.post('/use', verifyToken, couponController.useCoupon);

module.exports = router;
