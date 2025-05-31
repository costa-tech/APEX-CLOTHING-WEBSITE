const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {    // Connection options for better reliability
    const options = {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    };

    console.log('🗄️ Attempting database connection...');
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    // Connection event listeners
    mongoose.connection.on('error', (err) => {
      console.error('❌ Database error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ Database disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ Database reconnected');
    });

  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    
    // Provide helpful error messages
    if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
      console.log('💡 Suggestion: Check your internet connection and MongoDB URI');
    } else if (error.message.includes('authentication failed')) {
      console.log('💡 Suggestion: Check your MongoDB credentials');
    } else if (error.message.includes('IP') || error.message.includes('whitelist')) {
      console.log('💡 Suggestion: Add your IP address to MongoDB Atlas whitelist');
      console.log('🔗 Guide: See DATABASE_SETUP.md for detailed instructions');
    }

    // Don't exit process in development, just log the error
    if (process.env.NODE_ENV === 'production') {
      console.log('🚨 Exiting due to database connection failure in production');
      process.exit(1);
    } else {
      console.log('⚠️ Continuing in development mode without database');
      console.log('📝 Note: Some API endpoints may not work without database connection');
    }
  }
};

// Graceful connection handling
const closeDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('🔒 Database connection closed');
  } catch (error) {
    console.error('❌ Error closing database connection:', error.message);
  }
};

module.exports = { connectDB, closeDB };
