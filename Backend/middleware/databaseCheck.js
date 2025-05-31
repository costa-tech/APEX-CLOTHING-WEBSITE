const mongoose = require('mongoose');

/**
 * Middleware to check database connection status
 * Provides graceful degradation when database is unavailable
 */
const checkDatabaseConnection = (req, res, next) => {
  const isConnected = mongoose.connection.readyState === 1;
  
  if (!isConnected) {
    return res.status(503).json({
      success: false,
      message: 'Database connection unavailable',
      error: 'SERVICE_UNAVAILABLE',
      suggestion: 'Please check database configuration and try again',
      documentation: 'See DATABASE_SETUP.md for connection instructions'
    });
  }
  
  next();
};

/**
 * Middleware to provide database status information
 */
const getDatabaseStatus = (req, res, next) => {
  const connectionState = mongoose.connection.readyState;
  
  let status = {
    connected: false,
    state: 'disconnected',
    host: null,
    database: null
  };

  switch (connectionState) {
    case 0:
      status.state = 'disconnected';
      break;
    case 1:
      status.connected = true;
      status.state = 'connected';
      status.host = mongoose.connection.host;
      status.database = mongoose.connection.name;
      break;
    case 2:
      status.state = 'connecting';
      break;
    case 3:
      status.state = 'disconnecting';
      break;
    default:
      status.state = 'unknown';
  }

  req.databaseStatus = status;
  next();
};

/**
 * Create a mock response for offline development
 */
const createMockResponse = (message = 'Database connection required', data = null) => {
  return {
    success: false,
    message,
    mock: true,
    data,
    note: 'This is a mock response for development without database connection'
  };
};

module.exports = {
  checkDatabaseConnection,
  getDatabaseStatus,
  createMockResponse
};
