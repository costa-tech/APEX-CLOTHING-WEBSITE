const { db } = require('../config/firebase');

const ordersCollection = db.collection('orders');
const productsCollection = db.collection('products');
const usersCollection = db.collection('users');

/**
 * Get all orders (Admin only)
 */
exports.getAllOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      paymentStatus,
      sortBy = 'orderDate',
      order = 'desc',
    } = req.query;

    let query = ordersCollection;

    // Apply filters
    if (status) {
      query = query.where('status', '==', status);
    }

    if (paymentStatus) {
      query = query.where('paymentStatus', '==', paymentStatus);
    }

    // Apply sorting
    query = query.orderBy(sortBy, order);

    // Apply pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    query = query.limit(parseInt(limit)).offset(skip);

    const snapshot = await query.get();
    
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

    // Get total count
    const totalSnapshot = await ordersCollection.get();
    const total = totalSnapshot.size;

    res.status(200).json({
      status: 'success',
      data: {
        orders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch orders',
    });
  }
};

/**
 * Get order by ID
 */
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const doc = await ordersCollection.doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found',
      });
    }

    const orderData = doc.data();

    // Check if user is authorized to view this order
    if (req.user.role !== 'admin' && orderData.userId !== req.user.uid) {
      return res.status(403).json({
        status: 'error',
        message: 'Forbidden - You can only view your own orders',
      });
    }

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

    res.status(200).json({
      status: 'success',
      data: {
        id: doc.id,
        ...orderData,
        customer,
      },
    });
  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch order',
    });
  }
};

/**
 * Get user's orders
 */
exports.getMyOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    console.log('📦 Fetching orders for user:', req.user.uid);

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const snapshot = await ordersCollection
      .where('userId', '==', req.user.uid)
      .limit(parseInt(limit))
      .offset(skip)
      .get();

    const orders = [];
    snapshot.forEach(doc => {
      orders.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    // Sort orders by date in memory (to avoid Firestore index requirement)
    orders.sort((a, b) => {
      const dateA = new Date(a.orderDate || a.createdAt || 0);
      const dateB = new Date(b.orderDate || b.createdAt || 0);
      return dateB - dateA; // Descending order (newest first)
    });

    console.log('✅ Found', orders.length, 'orders');

    res.status(200).json({
      status: 'success',
      data: { orders },
    });
  } catch (error) {
    console.error('❌ Get my orders error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch orders',
      error: error.message,
    });
  }
};

/**
 * Create new order
 */
exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, total, paymentMethod } = req.body;

    // Validate stock availability
    for (const item of items) {
      const productDoc = await productsCollection.doc(item.productId).get();
      
      if (!productDoc.exists) {
        return res.status(404).json({
          status: 'error',
          message: `Product ${item.productId} not found`,
        });
      }

      const product = productDoc.data();
      if (product.stock < item.quantity) {
        return res.status(400).json({
          status: 'error',
          message: `Insufficient stock for product: ${product.name}`,
        });
      }
    }

    // Create order
    const orderData = {
      userId: req.user.uid,
      items,
      shippingAddress,
      total: parseFloat(total),
      paymentMethod: paymentMethod || 'card',
      status: 'Pending',
      paymentStatus: 'Pending',
      orderDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await ordersCollection.add(orderData);

    // Update product stock and sales
    for (const item of items) {
      const productDoc = await productsCollection.doc(item.productId).get();
      const product = productDoc.data();

      await productsCollection.doc(item.productId).update({
        stock: product.stock - item.quantity,
        sales: (product.sales || 0) + item.quantity,
        updatedAt: new Date().toISOString(),
      });
    }

    res.status(201).json({
      status: 'success',
      message: 'Order created successfully',
      data: {
        id: docRef.id,
        ...orderData,
      },
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create order',
    });
  }
};

/**
 * Update order status (Admin only)
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, trackingNumber } = req.body;

    const doc = await ordersCollection.doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found',
      });
    }

    const updateData = {
      status,
      updatedAt: new Date().toISOString(),
    };

    if (trackingNumber) {
      updateData.trackingNumber = trackingNumber;
    }

    await ordersCollection.doc(id).update(updateData);

    const updatedDoc = await ordersCollection.doc(id).get();

    res.status(200).json({
      status: 'success',
      message: 'Order status updated successfully',
      data: {
        id: updatedDoc.id,
        ...updatedDoc.data(),
      },
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update order status',
    });
  }
};

/**
 * Delete order (Admin only)
 */
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const doc = await ordersCollection.doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found',
      });
    }

    await ordersCollection.doc(id).delete();

    res.status(200).json({
      status: 'success',
      message: 'Order deleted successfully',
    });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete order',
    });
  }
};

/**
 * Get order statistics (Admin only)
 */
exports.getOrderStats = async (req, res) => {
  try {
    const snapshot = await ordersCollection.get();
    
    let totalRevenue = 0;
    let totalOrders = snapshot.size;
    let pendingOrders = 0;
    let completedOrders = 0;

    snapshot.forEach(doc => {
      const data = doc.data();
      totalRevenue += data.total || 0;
      
      if (data.status === 'Pending') pendingOrders++;
      if (data.status === 'Completed') completedOrders++;
    });

    res.status(200).json({
      status: 'success',
      data: {
        totalOrders,
        totalRevenue: totalRevenue.toFixed(2),
        pendingOrders,
        completedOrders,
        averageOrderValue: totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0,
      },
    });
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch order statistics',
    });
  }
};
