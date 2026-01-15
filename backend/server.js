/**
 * Local Development Server
 * This file is used for local development only
 * For Vercel deployment, use api/index.js
 */

import app from './app.js';
import connectDB from './config/database.js';
import { jwtConfig } from './config/jwt.js';

// Validate critical environment variables on startup
const validateEnvironment = () => {
  const requiredVars = [];
  const warnings = [];
  
  // Check MongoDB URI
  if (!process.env.MONGODB_URI) {
    requiredVars.push('MONGODB_URI');
  }
  
  // JWT_SECRET validation is handled in jwt.js, but we can check here too
  try {
    // This will throw if JWT_SECRET is missing in production
    const _ = jwtConfig.secret;
  } catch (error) {
    if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
      requiredVars.push('JWT_SECRET');
    } else {
      warnings.push('JWT_SECRET not set (using fallback - NOT SECURE)');
    }
  }
  
  if (requiredVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    requiredVars.forEach(v => console.error(`   - ${v}`));
    console.error('\nPlease set these in your .env file or Vercel environment variables.');
    process.exit(1);
  }
  
  if (warnings.length > 0) {
    warnings.forEach(w => console.warn(`⚠️  ${w}`));
  }
  
  console.log('✅ Environment variables validated');
};

// Validate environment before starting
validateEnvironment();

// Connect to MongoDB for local development
connectDB();

// Start server (only for local development)
const PORT = process.env.PORT || 5000;
const ENV = process.env.NODE_ENV || 'development';

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${ENV} mode on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📍 API Base: http://localhost:${PORT}/api`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.message);
  process.exit(1);
});

