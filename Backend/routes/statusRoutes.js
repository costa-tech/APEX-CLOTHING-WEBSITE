const express = require('express');
const { getDatabaseStatus } = require('../middleware/databaseCheck');
const router = express.Router();

/**
 * GET /api/status
 * Get comprehensive system status including database, server, and configuration
 */
router.get('/', getDatabaseStatus, (req, res) => {
  try {
    const packageJson = require('../package.json');
    
    const status = {
      success: true,
      timestamp: new Date().toISOString(),
      server: {
        name: packageJson.name,
        version: packageJson.version,
        environment: process.env.NODE_ENV || 'development',
        port: process.env.PORT || 5000,
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        nodeVersion: process.version
      },
      database: req.databaseStatus,
      configuration: {
        jwtConfigured: !!process.env.JWT_SECRET,
        stripeConfigured: !!process.env.STRIPE_SECRET_KEY,
        emailConfigured: !!process.env.SMTP_HOST,
        corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000'
      },
      endpoints: {
        health: '/health',
        status: '/api/status',
        auth: '/api/auth/*',
        products: '/api/products/*',
        cart: '/api/cart/*',
        orders: '/api/orders/*',
        analytics: '/api/admin/analytics/*'
      },
      features: {
        authentication: true,
        productManagement: true,
        cartSystem: true,
        orderProcessing: true,
        paymentIntegration: !!process.env.STRIPE_SECRET_KEY,
        adminAnalytics: true,
        rateLimiting: true,
        inputValidation: true,
        securityHeaders: true
      }
    };

    // Add warnings if database is not connected
    if (!req.databaseStatus.connected) {
      status.warnings = [
        'Database connection is not available',
        'Some API endpoints may not function properly',
        'See DATABASE_SETUP.md for connection instructions'
      ];
    }

    res.status(200).json(status);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving system status',
      error: error.message
    });
  }
});

module.exports = router;
