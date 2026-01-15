import dotenv from 'dotenv';
import serverless from 'serverless-http';
import app from './app.js';
import connectDB from './config/database.js';

// Load environment variables (for local dev and some serverless environments)
dotenv.config();

// Optional: serverless-http wrapper (mainly for AWS-style environments)
// Vercel Node functions use (req, res), so we still call the Express app directly below.
const lambdaHandler = serverless(app); // eslint-disable-line no-unused-vars

let isDbConnected = false;

async function ensureDatabaseConnection() {
  if (!isDbConnected) {
    await connectDB();
    isDbConnected = true;
  }
}

// Vercel serverless function entry point
// Signature: (req, res) → Express-compatible
export default async function handler(req, res) {
  try {
    await ensureDatabaseConnection();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
    });
  }

  // Delegate handling to the Express app (all routes remain intact)
  return app(req, res);
}

