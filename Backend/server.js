const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const fileUpload = require('express-fileupload');

// Load environment variables
dotenv.config();

// Import Firebase Admin
const admin = require('./config/firebase');

// Import routes
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const couponRoutes = require('./routes/couponRoutes');
const cartRoutes = require('./routes/cartRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const notFoundHandler = require('./middleware/notFoundHandler');

// Initialize Express app
const app = express();

// Trust proxy for rate limiting behind reverse proxy
app.set('trust proxy', 1);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all routes
app.use('/api/', limiter);

// Middleware
app.use(helmet()); // Security headers
app.use(compression()); // Compress responses
app.use(morgan('combined')); // Logging
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:3001',
    'http://localhost:3000'
  ],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded bodies
app.use(fileUpload({
  createParentPath: true,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max file size
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
const API_PREFIX = process.env.API_PREFIX || '/api';
const API_VERSION = process.env.API_VERSION || 'v1';
const BASE_PATH = `${API_PREFIX}/${API_VERSION}`;

app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/products`, productRoutes);
app.use(`${BASE_PATH}/orders`, orderRoutes);
app.use(`${BASE_PATH}/users`, userRoutes);
app.use(`${BASE_PATH}/analytics`, analyticsRoutes);
app.use(`${BASE_PATH}/coupons`, couponRoutes);
app.use(`${BASE_PATH}/cart`, cartRoutes);
app.use(`${BASE_PATH}/wishlist`, wishlistRoutes);

// Welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Clothing Brand API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: `${BASE_PATH}/auth`,
      products: `${BASE_PATH}/products`,
      orders: `${BASE_PATH}/orders`,
      users: `${BASE_PATH}/users`,
      analytics: `${BASE_PATH}/analytics`,
      coupons: `${BASE_PATH}/coupons`,
      cart: `${BASE_PATH}/cart`,
      wishlist: `${BASE_PATH}/wishlist`,
    },
  });
});

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════════════╗
  ║   🚀 Clothing Brand API Server                ║
  ║                                                ║
  ║   Server running on port: ${PORT}               ║
  ║   Environment: ${process.env.NODE_ENV || 'development'}              ║
  ║   API Base URL: http://localhost:${PORT}${BASE_PATH}  ║
  ║                                                ║
  ║   📚 API Documentation:                        ║
  ║   http://localhost:${PORT}                      ║
  ╚════════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  // Close server & exit process
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  // Close server & exit process
  process.exit(1);
});

module.exports = app;
