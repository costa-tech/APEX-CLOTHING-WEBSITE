const express = require('express');
const router = express.Router();
const {
  getDashboardAnalytics,
  getOrdersPerMonth,
  getTopSellingProducts,
  getRevenueAnalytics,
  getInventoryAnalytics
} = require('../controllers/analyticsController');
const auth = require('../middleware/auth');
const { adminAuth } = require('../middleware/roleAuth');

// All analytics routes require admin authentication
router.use(auth);
router.use(adminAuth);

// @route   GET /api/admin/analytics/dashboard
// @desc    Get dashboard analytics
// @access  Private/Admin
router.get('/dashboard', getDashboardAnalytics);

// @route   GET /api/admin/analytics/orders-monthly
// @desc    Get orders per month
// @access  Private/Admin
router.get('/orders-monthly', getOrdersPerMonth);

// @route   GET /api/admin/analytics/top-products
// @desc    Get top selling products
// @access  Private/Admin
router.get('/top-products', getTopSellingProducts);

// @route   GET /api/admin/analytics/revenue
// @desc    Get revenue analytics
// @access  Private/Admin
router.get('/revenue', getRevenueAnalytics);

// @route   GET /api/admin/analytics/inventory
// @desc    Get inventory analytics
// @access  Private/Admin
router.get('/inventory', getInventoryAnalytics);

module.exports = router;
