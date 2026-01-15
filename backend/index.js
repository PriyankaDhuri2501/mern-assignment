import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/database.js';

// Load environment variables
dotenv.config();

// Cache MongoDB connection for serverless (reuse across invocations)
let isDbConnected = false;

async function ensureDatabaseConnection() {
  // Check if already connected using mongoose connection state
  const mongoose = await import('mongoose');
  
  if (isDbConnected && mongoose.default.connection.readyState === 1) {
    return;
  }

  // If connection exists but is not ready, reset flag
  if (mongoose.default.connection.readyState !== 0 && mongoose.default.connection.readyState !== 1) {
    isDbConnected = false;
  }

  try {
    await connectDB();
    isDbConnected = true;
    console.log('✅ MongoDB connected for serverless function');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    isDbConnected = false;
    throw error;
  }
}

// Vercel serverless function entry point
export default async function handler(req, res) {
  // Ensure MongoDB connection before handling request
  try {
    await ensureDatabaseConnection();
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }

  // Delegate all handling to the Express app
  // Express app handles all routes: /, /health, /api/movies, /api/auth, etc.
  return app(req, res);
}
