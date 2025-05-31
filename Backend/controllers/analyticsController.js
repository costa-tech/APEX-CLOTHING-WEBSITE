const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Get dashboard analytics
// @route   GET /api/admin/analytics/dashboard
// @access  Private/Admin
const getDashboardAnalytics = async (req, res) => {
  try {
    const currentDate = new Date();
    const currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const lastMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);

    // Total orders and revenue
    const totalOrders = await Order.countDocuments({ status: { $ne: 'cancelled' } });
    const totalRevenue = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' }, 'payment.status': 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    // This month stats
    const thisMonthOrders = await Order.countDocuments({
      createdAt: { $gte: currentMonth },
      status: { $ne: 'cancelled' }
    });

    const thisMonthRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: currentMonth },
          status: { $ne: 'cancelled' },
          'payment.status': 'paid'
        }
      },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    // Last month stats for comparison
    const lastMonthOrders = await Order.countDocuments({
      createdAt: { $gte: lastMonth, $lt: currentMonth },
      status: { $ne: 'cancelled' }
    });

    const lastMonthRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: lastMonth, $lt: currentMonth },
          status: { $ne: 'cancelled' },
          'payment.status': 'paid'
        }
      },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    // Total users
    const totalUsers = await User.countDocuments({ role: 'user' });
    const thisMonthUsers = await User.countDocuments({
      createdAt: { $gte: currentMonth },
      role: 'user'
    });

    // Total products
    const totalProducts = await Product.countDocuments({ isActive: true });
    const lowStockProducts = await Product.countDocuments({
      isActive: true,
      totalStock: { $lt: 10 }
    });

    // Recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'firstName lastName email')
      .select('orderNumber user total status createdAt');

    // Calculate growth percentages
    const orderGrowth = lastMonthOrders > 0 
      ? ((thisMonthOrders - lastMonthOrders) / lastMonthOrders * 100).toFixed(1)
      : 0;

    const revenueGrowth = lastMonthRevenue[0]?.total > 0
      ? ((thisMonthRevenue[0]?.total || 0 - lastMonthRevenue[0]?.total) / lastMonthRevenue[0]?.total * 100).toFixed(1)
      : 0;

    res.json({
      success: true,
      analytics: {
        overview: {
          totalOrders,
          totalRevenue: totalRevenue[0]?.total || 0,
          totalUsers,
          totalProducts,
          lowStockProducts
        },
        thisMonth: {
          orders: thisMonthOrders,
          revenue: thisMonthRevenue[0]?.total || 0,
          users: thisMonthUsers,
          orderGrowth: `${orderGrowth}%`,
          revenueGrowth: `${revenueGrowth}%`
        },
        recentOrders
      }
    });
  } catch (error) {
    console.error('Get dashboard analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching analytics'
    });
  }
};

// @desc    Get orders per month
// @route   GET /api/admin/analytics/orders-monthly
// @access  Private/Admin
const getOrdersPerMonth = async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();

    const ordersPerMonth = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(year, 0, 1),
            $lt: new Date(year + 1, 0, 1)
          },
          status: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          orders: { $sum: 1 },
          revenue: { $sum: '$total' }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // Fill in missing months with 0
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const monthData = ordersPerMonth.find(item => item._id === i + 1);
      return {
        month: i + 1,
        orders: monthData ? monthData.orders : 0,
        revenue: monthData ? monthData.revenue : 0
      };
    });

    res.json({
      success: true,
      data: monthlyData
    });
  } catch (error) {
    console.error('Get orders per month error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching monthly orders'
    });
  }
};

// @desc    Get top selling products
// @route   GET /api/admin/analytics/top-products
// @access  Private/Admin
const getTopSellingProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const topProducts = await Product.find({ isActive: true })
      .sort({ salesCount: -1 })
      .limit(limit)
      .select('name salesCount price images totalStock');

    res.json({
      success: true,
      products: topProducts
    });
  } catch (error) {
    console.error('Get top selling products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching top products'
    });
  }
};

// @desc    Get revenue analytics
// @route   GET /api/admin/analytics/revenue
// @access  Private/Admin
const getRevenueAnalytics = async (req, res) => {
  try {
    const { period = '7days' } = req.query;
    
    let startDate;
    let groupBy;
    
    switch (period) {
      case '7days':
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        };
        break;
      case '30days':
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        };
        break;
      case '12months':
        startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        };
        break;
      default:
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        };
    }

    const revenueData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $ne: 'cancelled' },
          'payment.status': 'paid'
        }
      },
      {
        $group: {
          _id: groupBy,
          revenue: { $sum: '$total' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    res.json({
      success: true,
      data: revenueData
    });
  } catch (error) {
    console.error('Get revenue analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching revenue analytics'
    });
  }
};

// @desc    Get inventory analytics
// @route   GET /api/admin/analytics/inventory
// @access  Private/Admin
const getInventoryAnalytics = async (req, res) => {
  try {
    // Low stock products (less than 10 items)
    const lowStockProducts = await Product.find({
      isActive: true,
      totalStock: { $lt: 10, $gt: 0 }
    }).select('name totalStock sku');

    // Out of stock products
    const outOfStockProducts = await Product.find({
      isActive: true,
      totalStock: 0
    }).select('name sku');

    // Total products by category
    const productsByCategory = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalStock: { $sum: '$totalStock' }
        }
      }
    ]);

    // Total inventory value
    const inventoryValue = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalValue: { $sum: { $multiply: ['$price', '$totalStock'] } }
        }
      }
    ]);

    res.json({
      success: true,
      inventory: {
        lowStockProducts,
        outOfStockProducts,
        productsByCategory,
        totalInventoryValue: inventoryValue[0]?.totalValue || 0,
        lowStockCount: lowStockProducts.length,
        outOfStockCount: outOfStockProducts.length
      }
    });
  } catch (error) {
    console.error('Get inventory analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching inventory analytics'
    });
  }
};

module.exports = {
  getDashboardAnalytics,
  getOrdersPerMonth,
  getTopSellingProducts,
  getRevenueAnalytics,
  getInventoryAnalytics
};
