/**
 * Rate Limiter Middleware
 * Prevents brute force attacks and API abuse
 */

// In-memory store for rate limiting (use Redis in production)
const requestCounts = new Map();

/**
 * Clean up old entries periodically
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of requestCounts.entries()) {
    if (now - value.resetTime > 0) {
      requestCounts.delete(key);
    }
  }
}, 60000); // Clean every minute

/**
 * Rate limiter factory
 * @param {Object} options - Rate limit options
 * @param {number} options.windowMs - Time window in milliseconds
 * @param {number} options.max - Maximum requests per window
 * @param {string} options.message - Error message
 * @returns {Function} Express middleware
 */
const createRateLimiter = (options = {}) => {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes default
    max = 100, // 100 requests default
    message = 'Too many requests, please try again later',
    keyGenerator = (req) => req.ip, // Default to IP-based limiting
  } = options;

  return (req, res, next) => {
    const key = keyGenerator(req);
    const now = Date.now();
    
    let record = requestCounts.get(key);

    if (!record) {
      // First request from this key
      record = {
        count: 1,
        resetTime: now + windowMs,
      };
      requestCounts.set(key, record);
      return next();
    }

    if (now > record.resetTime) {
      // Reset window
      record.count = 1;
      record.resetTime = now + windowMs;
      requestCounts.set(key, record);
      return next();
    }

    // Increment count
    record.count++;
    requestCounts.set(key, record);

    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - record.count));
    res.setHeader('X-RateLimit-Reset', new Date(record.resetTime).toISOString());

    // Check if limit exceeded
    if (record.count > max) {
      console.warn(`⚠️ Rate limit exceeded for ${key}: ${record.count} requests`);
      return res.status(429).json({
        success: false,
        message,
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfter: Math.ceil((record.resetTime - now) / 1000), // seconds
      });
    }

    next();
  };
};

/**
 * Strict rate limiter for authentication endpoints
 * Prevents brute force attacks on login/register
 */
const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many authentication attempts. Please try again in 15 minutes.',
  keyGenerator: (req) => {
    // Limit by IP + email combination if available
    const email = req.body?.email || '';
    return `${req.ip}-${email}`;
  },
});

/**
 * General API rate limiter
 * Prevents general API abuse
 */
const apiLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests from this IP. Please try again later.',
});

/**
 * Strict limiter for sensitive operations
 */
const strictLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 requests per hour
  message: 'Too many requests for this operation. Please try again later.',
});

module.exports = {
  createRateLimiter,
  authLimiter,
  apiLimiter,
  strictLimiter,
};
