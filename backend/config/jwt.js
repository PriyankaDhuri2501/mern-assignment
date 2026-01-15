/**
 * JWT Configuration
 * Centralized JWT settings
 */
const getJWTSecret = () => {
  const secret = process.env.JWT_SECRET;
  
  // In production, JWT_SECRET is required
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
    if (!secret) {
      throw new Error(
        '❌ CRITICAL: JWT_SECRET environment variable is required in production. ' +
        'Please set it in your Vercel environment variables.'
      );
    }
    if (secret.length < 32) {
      throw new Error(
        '❌ SECURITY: JWT_SECRET must be at least 32 characters long for production.'
      );
    }
  }
  
  // In development, use fallback if not set (with warning)
  if (!secret) {
    console.warn('⚠️  WARNING: JWT_SECRET not set. Using fallback (NOT SECURE FOR PRODUCTION)');
    return 'fallback_secret_change_in_production';
  }
  
  return secret;
};

export const jwtConfig = {
  secret: getJWTSecret(),
  expiresIn: process.env.JWT_EXPIRE || '7d',
};

export default jwtConfig;

