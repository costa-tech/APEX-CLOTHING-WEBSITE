const { db, auth } = require('../config/firebase');

const usersCollection = db.collection('users');
const ordersCollection = db.collection('orders');

/**
 * Get all users (Admin only)
 */
exports.getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      role,
      status,
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query;

    let query = usersCollection;

    // Apply filters
    if (role) {
      query = query.where('role', '==', role);
    }

    if (status) {
      query = query.where('status', '==', status);
    }

    // Apply sorting
    query = query.orderBy(sortBy, order);

    // Apply pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    query = query.limit(parseInt(limit)).offset(skip);

    const snapshot = await query.get();
    
    const users = [];
    for (const doc of snapshot.docs) {
      const userData = doc.data();
      
      // Get user's order stats
      const ordersSnapshot = await ordersCollection.where('userId', '==', doc.id).get();
      let totalSpent = 0;
      ordersSnapshot.forEach(orderDoc => {
        totalSpent += orderDoc.data().total || 0;
      });

      users.push({
        id: doc.id,
        ...userData,
        totalOrders: ordersSnapshot.size,
        totalSpent: totalSpent.toFixed(2),
      });
    }

    // Get total count
    const totalSnapshot = await usersCollection.get();
    const total = totalSnapshot.size;

    res.status(200).json({
      status: 'success',
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch users',
    });
  }
};

/**
 * Get user by ID (Admin only)
 */
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const doc = await usersCollection.doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    const userData = doc.data();

    // Get user's order history
    const ordersSnapshot = await ordersCollection.where('userId', '==', id).get();
    const orders = [];
    let totalSpent = 0;

    ordersSnapshot.forEach(orderDoc => {
      const orderData = orderDoc.data();
      orders.push({
        id: orderDoc.id,
        ...orderData,
      });
      totalSpent += orderData.total || 0;
    });

    res.status(200).json({
      status: 'success',
      data: {
        id: doc.id,
        ...userData,
        totalOrders: orders.length,
        totalSpent: totalSpent.toFixed(2),
        recentOrders: orders.slice(0, 5),
      },
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch user',
    });
  }
};

/**
 * Get current user profile
 */
exports.getProfile = async (req, res) => {
  try {
    const doc = await usersCollection.doc(req.user.uid).get();

    if (!doc.exists) {
      // Create user profile if it doesn't exist
      const userData = {
        email: req.user.email,
        role: 'customer',
        status: 'Active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await usersCollection.doc(req.user.uid).set(userData);

      return res.status(200).json({
        status: 'success',
        data: {
          id: req.user.uid,
          ...userData,
        },
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        id: doc.id,
        ...doc.data(),
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch profile',
    });
  }
};

/**
 * Update current user profile
 */
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address, avatar } = req.body;

    const updateData = {
      updatedAt: new Date().toISOString(),
    };

    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (avatar) updateData.avatar = avatar;

    await usersCollection.doc(req.user.uid).update(updateData);

    const updatedDoc = await usersCollection.doc(req.user.uid).get();

    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: {
        id: updatedDoc.id,
        ...updatedDoc.data(),
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update profile',
    });
  }
};

/**
 * Update user (Admin only)
 */
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const doc = await usersCollection.doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    const updateData = {
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    await usersCollection.doc(id).update(updateData);

    // Update Firebase Auth if email is changed
    if (req.body.email) {
      await auth.updateUser(id, {
        email: req.body.email,
      });
    }

    const updatedDoc = await usersCollection.doc(id).get();

    res.status(200).json({
      status: 'success',
      message: 'User updated successfully',
      data: {
        id: updatedDoc.id,
        ...updatedDoc.data(),
      },
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update user',
    });
  }
};

/**
 * Delete user (Admin only)
 */
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const doc = await usersCollection.doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    // Check if user is admin
    const userData = doc.data();
    if (userData.role === 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Cannot delete admin users',
      });
    }

    // Delete from Firebase Auth
    await auth.deleteUser(id);

    // Delete from Firestore
    await usersCollection.doc(id).delete();

    res.status(200).json({
      status: 'success',
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete user',
    });
  }
};

/**
 * Update user status (Admin only)
 */
exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Active', 'Inactive', 'Suspended'].includes(status)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid status value',
      });
    }

    const doc = await usersCollection.doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    await usersCollection.doc(id).update({
      status,
      updatedAt: new Date().toISOString(),
    });

    // Disable/Enable user in Firebase Auth
    if (status === 'Suspended' || status === 'Inactive') {
      await auth.updateUser(id, { disabled: true });
    } else {
      await auth.updateUser(id, { disabled: false });
    }

    const updatedDoc = await usersCollection.doc(id).get();

    res.status(200).json({
      status: 'success',
      message: 'User status updated successfully',
      data: {
        id: updatedDoc.id,
        ...updatedDoc.data(),
      },
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update user status',
    });
  }
};

/**
 * Update user role (Admin only)
 */
exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['customer', 'admin', 'moderator'].includes(role)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid role value',
      });
    }

    const doc = await usersCollection.doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    await usersCollection.doc(id).update({
      role,
      updatedAt: new Date().toISOString(),
    });

    // Set custom claims in Firebase Auth
    await auth.setCustomUserClaims(id, { role });

    const updatedDoc = await usersCollection.doc(id).get();

    res.status(200).json({
      status: 'success',
      message: 'User role updated successfully',
      data: {
        id: updatedDoc.id,
        ...updatedDoc.data(),
      },
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update user role',
    });
  }
};

/**
 * Get user statistics (Admin only)
 */
exports.getUserStats = async (req, res) => {
  try {
    const snapshot = await usersCollection.get();
    
    let totalUsers = snapshot.size;
    let activeUsers = 0;
    let inactiveUsers = 0;
    let suspendedUsers = 0;
    let admins = 0;

    snapshot.forEach(doc => {
      const data = doc.data();
      
      if (data.status === 'Active') activeUsers++;
      if (data.status === 'Inactive') inactiveUsers++;
      if (data.status === 'Suspended') suspendedUsers++;
      if (data.role === 'admin') admins++;
    });

    // Get new users this month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const newUsersSnapshot = await usersCollection
      .where('createdAt', '>=', startOfMonth.toISOString())
      .get();

    res.status(200).json({
      status: 'success',
      data: {
        totalUsers,
        activeUsers,
        inactiveUsers,
        suspendedUsers,
        admins,
        newUsersThisMonth: newUsersSnapshot.size,
      },
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch user statistics',
    });
  }
};
