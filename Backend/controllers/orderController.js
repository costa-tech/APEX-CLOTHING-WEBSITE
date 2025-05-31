const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const stripe = require('../config/stripe');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      billingAddress,
      paymentMethodId,
      shipping = { cost: 0, method: 'standard' },
      tax = 0,
      discount = { amount: 0 }
    } = req.body;

    // Validate items and calculate totals
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product || !product.isActive) {
        return res.status(400).json({
          success: false,
          message: `Product ${item.product} not found or inactive`
        });
      }

      // Check size availability and stock
      const sizeOption = product.sizes.find(s => s.size === item.size);
      if (!sizeOption || sizeOption.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name} in size ${item.size}`
        });
      }

      // Check color availability
      const colorOption = product.colors.find(c => c.name === item.color);
      if (!colorOption) {
        return res.status(400).json({
          success: false,
          message: `Color ${item.color} not available for ${product.name}`
        });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      validatedItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        image: product.images.find(img => img.isPrimary)?.url || product.images[0]?.url,
        sku: product.sku
      });
    }

    const total = subtotal + shipping.cost + tax - discount.amount;

    // Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // Convert to cents
      currency: 'usd',
      payment_method: paymentMethodId,
      confirmation_method: 'manual',
      confirm: true,
      return_url: `${process.env.FRONTEND_URL}/order-confirmation`,
      metadata: {
        userId: req.user.id.toString(),
        orderType: 'ecommerce'
      }
    });

    // Handle payment status
    if (paymentIntent.status === 'requires_action') {
      return res.json({
        success: false,
        requiresAction: true,
        clientSecret: paymentIntent.client_secret
      });
    } else if (paymentIntent.status === 'succeeded') {
      // Create order
      const order = new Order({
        user: req.user.id,
        items: validatedItems,
        shippingAddress,
        billingAddress: billingAddress || shippingAddress,
        payment: {
          method: 'stripe',
          stripePaymentIntentId: paymentIntent.id,
          status: 'paid',
          paidAt: new Date()
        },
        subtotal,
        shipping,
        tax,
        discount,
        total,
        status: 'processing'
      });

      await order.save();

      // Update product stock
      for (const item of validatedItems) {
        await Product.findOneAndUpdate(
          {
            _id: item.product,
            'sizes.size': item.size
          },
          {
            $inc: {
              'sizes.$.stock': -item.quantity,
              salesCount: item.quantity
            }
          }
        );
      }

      // Clear user's cart
      await Cart.findOneAndUpdate(
        { user: req.user.id },
        { items: [] }
      );

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        order: order,
        paymentStatus: 'succeeded'
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Payment failed'
      });
    }
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating order'
    });
  }
};

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
const getUserOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('items.product', 'name images');

    const total = await Order.countDocuments({ user: req.user.id });

    res.json({
      success: true,
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders'
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name images')
      .populate('user', 'firstName lastName email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns the order or is admin
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching order'
    });
  }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { status, tracking } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.status = status;
    
    if (tracking) {
      order.tracking = tracking;
    }

    if (status === 'delivered') {
      order.deliveredAt = new Date();
    }

    if (status === 'cancelled') {
      order.cancelledAt = new Date();
      
      // Restore product stock
      for (const item of order.items) {
        await Product.findOneAndUpdate(
          {
            _id: item.product,
            'sizes.size': item.size
          },
          {
            $inc: {
              'sizes.$.stock': item.quantity,
              salesCount: -item.quantity
            }
          }
        );
      }
    }

    await order.save();

    res.json({
      success: true,
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating order status'
    });
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    let filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'firstName lastName email')
      .populate('items.product', 'name');

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders'
    });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrder,
  updateOrderStatus,
  getAllOrders
};
