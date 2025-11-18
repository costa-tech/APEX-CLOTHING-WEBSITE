const { db } = require('../config/firebase');

const couponsCollection = db.collection('coupons');

/**
 * Create a new coupon (Admin only)
 */
exports.createCoupon = async (req, res) => {
  try {
    const {
      code,
      type, // 'percentage' or 'fixed'
      value,
      description,
      minOrderAmount,
      maxDiscount,
      usageLimit,
      expiryDate,
      isActive = true,
    } = req.body;

    // Check if coupon code already exists
    const existingCoupon = await couponsCollection.where('code', '==', code.toUpperCase()).get();
    if (!existingCoupon.empty) {
      return res.status(400).json({
        status: 'error',
        message: 'Coupon code already exists',
      });
    }

    const couponData = {
      code: code.toUpperCase(),
      type, // 'percentage' or 'fixed'
      value: parseFloat(value),
      description: description || '',
      minOrderAmount: minOrderAmount ? parseFloat(minOrderAmount) : 0,
      maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
      usageLimit: usageLimit ? parseInt(usageLimit) : null,
      usedCount: 0,
      expiryDate: expiryDate || null,
      isActive,
      createdBy: req.user.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await couponsCollection.add(couponData);

    res.status(201).json({
      status: 'success',
      message: 'Coupon created successfully',
      data: {
        id: docRef.id,
        ...couponData,
      },
    });
  } catch (error) {
    console.error('Create coupon error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create coupon',
    });
  }
};

/**
 * Get all coupons (Admin only)
 */
exports.getAllCoupons = async (req, res) => {
  try {
    const snapshot = await couponsCollection.orderBy('createdAt', 'desc').get();

    const coupons = [];
    snapshot.forEach(doc => {
      coupons.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    res.status(200).json({
      status: 'success',
      data: { coupons },
    });
  } catch (error) {
    console.error('Get all coupons error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch coupons',
    });
  }
};

/**
 * Validate and apply coupon (Customer)
 */
exports.validateCoupon = async (req, res) => {
  try {
    const { code, orderAmount } = req.body;

    if (!code || !orderAmount) {
      return res.status(400).json({
        status: 'error',
        message: 'Coupon code and order amount are required',
      });
    }

    // Find coupon by code
    const snapshot = await couponsCollection
      .where('code', '==', code.toUpperCase())
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({
        status: 'error',
        message: 'Invalid coupon code',
      });
    }

    const couponDoc = snapshot.docs[0];
    const coupon = { id: couponDoc.id, ...couponDoc.data() };

    // Validate coupon
    if (!coupon.isActive) {
      return res.status(400).json({
        status: 'error',
        message: 'This coupon is no longer active',
      });
    }

    // Check expiry date
    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return res.status(400).json({
        status: 'error',
        message: 'This coupon has expired',
      });
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({
        status: 'error',
        message: 'This coupon has reached its usage limit',
      });
    }

    // Check minimum order amount
    if (coupon.minOrderAmount && orderAmount < coupon.minOrderAmount) {
      return res.status(400).json({
        status: 'error',
        message: `Minimum order amount of $${coupon.minOrderAmount} required`,
      });
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.type === 'percentage') {
      discountAmount = (orderAmount * coupon.value) / 100;
      // Apply max discount if specified
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else if (coupon.type === 'fixed') {
      discountAmount = coupon.value;
    }

    // Ensure discount doesn't exceed order amount
    if (discountAmount > orderAmount) {
      discountAmount = orderAmount;
    }

    res.status(200).json({
      status: 'success',
      message: 'Coupon applied successfully',
      data: {
        couponId: coupon.id,
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        discountAmount: parseFloat(discountAmount.toFixed(2)),
        finalAmount: parseFloat((orderAmount - discountAmount).toFixed(2)),
      },
    });
  } catch (error) {
    console.error('Validate coupon error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to validate coupon',
    });
  }
};

/**
 * Update coupon (Admin only)
 */
exports.updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    // If updating code, check if it already exists
    if (updateData.code) {
      updateData.code = updateData.code.toUpperCase();
      const existingCoupon = await couponsCollection
        .where('code', '==', updateData.code)
        .get();
      
      if (!existingCoupon.empty && existingCoupon.docs[0].id !== id) {
        return res.status(400).json({
          status: 'error',
          message: 'Coupon code already exists',
        });
      }
    }

    await couponsCollection.doc(id).update(updateData);

    const updatedDoc = await couponsCollection.doc(id).get();

    res.status(200).json({
      status: 'success',
      message: 'Coupon updated successfully',
      data: {
        id: updatedDoc.id,
        ...updatedDoc.data(),
      },
    });
  } catch (error) {
    console.error('Update coupon error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update coupon',
    });
  }
};

/**
 * Delete coupon (Admin only)
 */
exports.deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    await couponsCollection.doc(id).delete();

    res.status(200).json({
      status: 'success',
      message: 'Coupon deleted successfully',
    });
  } catch (error) {
    console.error('Delete coupon error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete coupon',
    });
  }
};

/**
 * Mark coupon as used (called after successful order)
 */
exports.useCoupon = async (req, res) => {
  try {
    const { couponId } = req.body;

    const couponRef = couponsCollection.doc(couponId);
    const couponDoc = await couponRef.get();

    if (!couponDoc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'Coupon not found',
      });
    }

    const coupon = couponDoc.data();

    await couponRef.update({
      usedCount: (coupon.usedCount || 0) + 1,
      updatedAt: new Date().toISOString(),
    });

    res.status(200).json({
      status: 'success',
      message: 'Coupon usage recorded',
    });
  } catch (error) {
    console.error('Use coupon error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to record coupon usage',
    });
  }
};
