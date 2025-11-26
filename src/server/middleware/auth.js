const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

/**
 * JWT Token Authentication Middleware
 * Verifies JWT token from Authorization header and attaches user to request
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from header (supports both "Bearer token" and "token" formats)
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No authorization header provided.',
        code: 'NO_AUTH_HEADER',
      });
    }

    // Extract token
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.replace('Bearer ', '') 
      : authHeader;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
        code: 'NO_TOKEN',
      });
    }

    // Verify JWT secret is configured
    if (!process.env.JWT_SECRET) {
      console.error('⚠️ JWT_SECRET is not configured in environment variables');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error.',
        code: 'JWT_SECRET_MISSING',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Validate decoded token structure
    if (!decoded.id || !decoded.email) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token structure.',
        code: 'INVALID_TOKEN_STRUCTURE',
      });
    }

    // Get user from database (excluding password)
    const result = await query(
      'SELECT id, name, email, role, status, created_at FROM users WHERE id = $1',
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User not found.',
        code: 'USER_NOT_FOUND',
      });
    }

    const user = result.rows[0];

    // Check if user account is active
    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Your account has been suspended. Please contact support.',
        code: 'ACCOUNT_SUSPENDED',
      });
    }

    // Attach user to request object
    req.user = user;
    req.token = token;
    
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    
    // Handle specific JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Please log in again.',
        code: 'INVALID_TOKEN',
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please log in again.',
        code: 'TOKEN_EXPIRED',
        expiredAt: error.expiredAt,
      });
    }

    if (error.name === 'NotBeforeError') {
      return res.status(401).json({
        success: false,
        message: 'Token not yet valid.',
        code: 'TOKEN_NOT_BEFORE',
      });
    }

    // Generic authentication error
    return res.status(500).json({
      success: false,
      message: 'Authentication failed. Please try again.',
      code: 'AUTH_ERROR',
    });
  }
};

/**
 * Admin Role Verification Middleware
 * Ensures authenticated user has admin role
 * Must be used after authenticate middleware
 */
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.',
      code: 'NOT_AUTHENTICATED',
    });
  }

  if (req.user.role !== 'admin') {
    console.warn(`⚠️ Unauthorized admin access attempt by user ${req.user.id} (${req.user.email})`);
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.',
      code: 'ADMIN_ONLY',
    });
  }

  next();
};

/**
 * Optional Authentication Middleware
 * Attaches user if token is provided but doesn't require it
 * Useful for endpoints that have different behavior for authenticated users
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return next();
    }

    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.replace('Bearer ', '') 
      : authHeader;

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const result = await query(
      'SELECT id, name, email, role, status FROM users WHERE id = $1',
      [decoded.id]
    );

    if (result.rows.length > 0 && result.rows[0].status === 'active') {
      req.user = result.rows[0];
      req.token = token;
    }

    next();
  } catch (error) {
    // Silently fail for optional auth
    next();
  }
};

/**
 * Token Verification Utility
 * Verifies a token without making database calls
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Generate JWT Token Utility
 * Creates a new JWT token for a user
 */
const generateToken = (user, expiresIn = null) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const options = {
    expiresIn: expiresIn || process.env.JWT_EXPIRE || '7d',
  };

  return jwt.sign(payload, process.env.JWT_SECRET, options);
};

module.exports = {
  authenticate,
  isAdmin,
  optionalAuth,
  verifyToken,
  generateToken,
};
