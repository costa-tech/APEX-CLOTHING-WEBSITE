const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// All analytics routes require admin access
router.use(verifyToken, isAdmin);

router.get('/dashboard', analyticsController.getDashboardStats);
router.get('/revenue', analyticsController.getRevenueStats);
router.get('/products/top-selling', analyticsController.getTopSellingProducts);
router.get('/products/low-stock', analyticsController.getLowStockProducts);
router.get('/customers/top', analyticsController.getTopCustomers);
router.get('/orders/recent', analyticsController.getRecentOrders);
router.get('/trends', analyticsController.getTrends);

module.exports = router;
