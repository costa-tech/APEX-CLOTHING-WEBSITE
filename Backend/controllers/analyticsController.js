const { db } = require('../config/firebase');

const ordersCollection = db.collection('orders');
const productsCollection = db.collection('products');
const usersCollection = db.collection('users');

/**
 * Get dashboard statistics
 */
exports.getDashboardStats = async (req, res) => {
  try {
    // Get total orders and revenue
    const ordersSnapshot = await ordersCollection.get();
    let totalRevenue = 0;
    let totalOrders = ordersSnapshot.size;
    let pendingOrders = 0;
    let completedOrders = 0;

    ordersSnapshot.forEach(doc => {
      const data = doc.data();
      totalRevenue += data.total || 0;
      if (data.status === 'Pending') pendingOrders++;
      if (data.status === 'Completed') completedOrders++;
    });

    // Get total products
    const productsSnapshot = await productsCollection.get();
    const totalProducts = productsSnapshot.size;
    let lowStockProducts = 0;

    productsSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.stock < 10) lowStockProducts++;
    });

    // Get total users
    const usersSnapshot = await usersCollection.get();
    const totalUsers = usersSnapshot.size;
    let activeUsers = 0;

    usersSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.status === 'Active') activeUsers++;
    });

    // Get new users this month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const newUsersSnapshot = await usersCollection
      .where('createdAt', '>=', startOfMonth.toISOString())
      .get();

    // Get orders this month
    const ordersThisMonthSnapshot = await ordersCollection
      .where('orderDate', '>=', startOfMonth.toISOString())
      .get();
    
    let revenueThisMonth = 0;
    ordersThisMonthSnapshot.forEach(doc => {
      revenueThisMonth += doc.data().total || 0;
    });

    res.status(200).json({
      status: 'success',
      data: {
        overview: {
          totalRevenue: totalRevenue.toFixed(2),
          totalOrders,
          totalProducts,
          totalUsers,
        },
        orders: {
          total: totalOrders,
          pending: pendingOrders,
          completed: completedOrders,
          thisMonth: ordersThisMonthSnapshot.size,
        },
        revenue: {
          total: totalRevenue.toFixed(2),
          thisMonth: revenueThisMonth.toFixed(2),
          averageOrderValue: totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0,
        },
        products: {
          total: totalProducts,
          lowStock: lowStockProducts,
        },
        users: {
          total: totalUsers,
          active: activeUsers,
          newThisMonth: newUsersSnapshot.size,
        },
      },
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch dashboard statistics',
    });
  }
};

/**
 * Get revenue statistics
 */
exports.getRevenueStats = async (req, res) => {
  try {
    const { period = '30days' } = req.query;

    const now = new Date();
    let startDate;

    switch (period) {
      case '7days':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30days':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90days':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '365days':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const snapshot = await ordersCollection
      .where('orderDate', '>=', startDate.toISOString())
      .orderBy('orderDate', 'asc')
      .get();

    const dailyRevenue = {};
    let totalRevenue = 0;

    snapshot.forEach(doc => {
      const data = doc.data();
      const date = new Date(data.orderDate).toISOString().split('T')[0];
      
      if (!dailyRevenue[date]) {
        dailyRevenue[date] = 0;
      }
      
      dailyRevenue[date] += data.total || 0;
      totalRevenue += data.total || 0;
    });

    const chartData = Object.entries(dailyRevenue).map(([date, revenue]) => ({
      date,
      revenue: parseFloat(revenue.toFixed(2)),
    }));

    res.status(200).json({
      status: 'success',
      data: {
        period,
        totalRevenue: totalRevenue.toFixed(2),
        chartData,
      },
    });
  } catch (error) {
    console.error('Get revenue stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch revenue statistics',
    });
  }
};

/**
 * Get top selling products
 */
exports.getTopSellingProducts = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const snapshot = await productsCollection
      .orderBy('sales', 'desc')
      .limit(parseInt(limit))
      .get();

    const products = [];
    snapshot.forEach(doc => {
      products.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    res.status(200).json({
      status: 'success',
      data: { products },
    });
  } catch (error) {
    console.error('Get top selling products error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch top selling products',
    });
  }
};

/**
 * Get low stock products
 */
exports.getLowStockProducts = async (req, res) => {
  try {
    const { threshold = 10 } = req.query;

    const snapshot = await productsCollection
      .where('stock', '<=', parseInt(threshold))
      .orderBy('stock', 'asc')
      .get();

    const products = [];
    snapshot.forEach(doc => {
      products.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    res.status(200).json({
      status: 'success',
      data: { products },
    });
  } catch (error) {
    console.error('Get low stock products error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch low stock products',
    });
  }
};

/**
 * Get top customers
 */
exports.getTopCustomers = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    // Get all orders
    const ordersSnapshot = await ordersCollection.get();
    
    const customerStats = {};

    ordersSnapshot.forEach(doc => {
      const data = doc.data();
      const userId = data.userId;

      if (!customerStats[userId]) {
        customerStats[userId] = {
          totalSpent: 0,
          orderCount: 0,
        };
      }

      customerStats[userId].totalSpent += data.total || 0;
      customerStats[userId].orderCount += 1;
    });

    // Get customer details
    const topCustomers = await Promise.all(
      Object.entries(customerStats)
        .sort((a, b) => b[1].totalSpent - a[1].totalSpent)
        .slice(0, parseInt(limit))
        .map(async ([userId, stats]) => {
          const userDoc = await usersCollection.doc(userId).get();
          const userData = userDoc.exists ? userDoc.data() : {};

          return {
            id: userId,
            name: userData.name || 'Unknown',
            email: userData.email || 'N/A',
            totalSpent: stats.totalSpent.toFixed(2),
            orderCount: stats.orderCount,
          };
        })
    );

    res.status(200).json({
      status: 'success',
      data: { customers: topCustomers },
    });
  } catch (error) {
    console.error('Get top customers error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch top customers',
    });
  }
};

/**
 * Get recent orders
 */
exports.getRecentOrders = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const snapshot = await ordersCollection
      .orderBy('orderDate', 'desc')
      .limit(parseInt(limit))
      .get();

    const orders = [];
    for (const doc of snapshot.docs) {
      const orderData = doc.data();
      
      // Get customer details
      let customer = {};
      if (orderData.userId) {
        const userDoc = await usersCollection.doc(orderData.userId).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          customer = {
            name: userData.name,
            email: userData.email,
          };
        }
      }

      orders.push({
        id: doc.id,
        ...orderData,
        customer,
      });
    }

    res.status(200).json({
      status: 'success',
      data: { orders },
    });
  } catch (error) {
    console.error('Get recent orders error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch recent orders',
    });
  }
};

/**
 * Get trends
 */
exports.getTrends = async (req, res) => {
  try {
    const now = new Date();
    const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const previousMonth = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    // Get current month data
    const currentMonthOrders = await ordersCollection
      .where('orderDate', '>=', lastMonth.toISOString())
      .get();

    // Get previous month data
    const previousMonthOrders = await ordersCollection
      .where('orderDate', '>=', previousMonth.toISOString())
      .where('orderDate', '<', lastMonth.toISOString())
      .get();

    let currentRevenue = 0;
    currentMonthOrders.forEach(doc => {
      currentRevenue += doc.data().total || 0;
    });

    let previousRevenue = 0;
    previousMonthOrders.forEach(doc => {
      previousRevenue += doc.data().total || 0;
    });

    const revenueTrend = previousRevenue > 0
      ? ((currentRevenue - previousRevenue) / previousRevenue * 100).toFixed(2)
      : 100;

    const ordersTrend = previousMonthOrders.size > 0
      ? ((currentMonthOrders.size - previousMonthOrders.size) / previousMonthOrders.size * 100).toFixed(2)
      : 100;

    // Get new users trend
    const currentMonthUsers = await usersCollection
      .where('createdAt', '>=', lastMonth.toISOString())
      .get();

    const previousMonthUsers = await usersCollection
      .where('createdAt', '>=', previousMonth.toISOString())
      .where('createdAt', '<', lastMonth.toISOString())
      .get();

    const usersTrend = previousMonthUsers.size > 0
      ? ((currentMonthUsers.size - previousMonthUsers.size) / previousMonthUsers.size * 100).toFixed(2)
      : 100;

    res.status(200).json({
      status: 'success',
      data: {
        revenue: {
          current: currentRevenue.toFixed(2),
          previous: previousRevenue.toFixed(2),
          trend: parseFloat(revenueTrend),
          direction: revenueTrend >= 0 ? 'up' : 'down',
        },
        orders: {
          current: currentMonthOrders.size,
          previous: previousMonthOrders.size,
          trend: parseFloat(ordersTrend),
          direction: ordersTrend >= 0 ? 'up' : 'down',
        },
        users: {
          current: currentMonthUsers.size,
          previous: previousMonthUsers.size,
          trend: parseFloat(usersTrend),
          direction: usersTrend >= 0 ? 'up' : 'down',
        },
      },
    });
  } catch (error) {
    console.error('Get trends error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch trends',
    });
  }
};
