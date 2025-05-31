require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

console.log('🚀 Starting Clothing E-commerce Backend Server...');

// Security and CORS middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Health check endpoints
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Clothing E-commerce API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Clothing E-commerce API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Clothing E-commerce API',
    version: '1.0.0',
    documentation: {
      health: '/health',
      endpoints: {
        auth: '/api/auth',
        products: '/api/products',
        cart: '/api/cart',
        orders: '/api/orders',
        analytics: '/api/admin/analytics'
      }
    }
  });
});

// Load API routes
console.log('📋 Loading API routes...');

try {
  // Auth routes
  const authRoutes = require('./routes/authRoutes');
  app.use('/api/auth', authRoutes);
  console.log('✅ Auth routes loaded');

  // Product routes  
  const productRoutes = require('./routes/productRoutes');
  app.use('/api/products', productRoutes);
  console.log('✅ Product routes loaded');

  // Cart routes
  const cartRoutes = require('./routes/cartRoutes');
  app.use('/api/cart', cartRoutes);
  console.log('✅ Cart routes loaded');

  // Order routes
  const orderRoutes = require('./routes/orderRoutes');
  app.use('/api/orders', orderRoutes);
  console.log('✅ Order routes loaded');
  // Analytics routes
  const analyticsRoutes = require('./routes/analyticsRoutes');
  app.use('/api/admin/analytics', analyticsRoutes);
  console.log('✅ Analytics routes loaded');

  // Wishlist routes
  const wishlistRoutes = require('./routes/wishlistRoutes');
  app.use('/api/wishlist', wishlistRoutes);
  console.log('✅ Wishlist routes loaded');

  console.log('🎉 All routes loaded successfully!');
} catch (error) {
  console.error('❌ Error loading routes:', error);
  process.exit(1);
}

// 404 handler for unknown routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    path: req.originalUrl,
    available_endpoints: [
      '/health',
      '/api/health',
      '/api/auth/*',
      '/api/products/*', 
      '/api/cart/*',
      '/api/orders/*',
      '/api/admin/analytics/*'
    ]
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('🔥 Global Error:', err);

  let error = {
    success: false,
    message: err.message || 'Internal Server Error'
  };

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    error.message = Object.values(err.errors).map(val => val.message).join(', ');
    return res.status(400).json(error);
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    error.message = 'Invalid ID format';
    return res.status(400).json(error);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    error.message = 'Duplicate field value entered';
    return res.status(400).json(error);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token';
    return res.status(401).json(error);
  }

  if (err.name === 'TokenExpiredError') {
    error.message = 'Token expired';
    return res.status(401).json(error);
  }

  // Default to 500 server error
  const statusCode = err.statusCode || 500;
  if (process.env.NODE_ENV === 'development') {
    error.stack = err.stack;
  }

  res.status(statusCode).json(error);
});

const PORT = process.env.PORT || 5000;

console.log(`🔥 Starting server on port ${PORT}...`);

const server = app.listen(PORT, () => {
  console.log(`✅ Server running successfully on port ${PORT}`);
  console.log(`🌐 Local: http://localhost:${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log('🎉 Ready to handle requests!');
  
  // Connect to database after server starts
  console.log('🗄️ Connecting to database...');
  const connectDB = require('./config/database');
  connectDB();
});

// Graceful shutdown handlers
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('unhandledRejection', (err) => {
  console.log('❌ Unhandled Rejection:', err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (err) => {
  console.log('❌ Uncaught Exception:', err.message);
  process.exit(1);
});

module.exports = app;
