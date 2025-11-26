const bcrypt = require('bcryptjs');
const { query } = require('../config/database');
const { generateToken } = require('../middleware/auth');

// Password strength validator
const validatePasswordStrength = (password) => {
  const minLength = 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const errors = [];

  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }
  if (!hasUpperCase) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!hasLowerCase) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!hasNumbers) {
    errors.push('Password must contain at least one number');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Sanitize user object (remove sensitive data)
const sanitizeUser = (user) => {
  const sanitized = { ...user };
  delete sanitized.password;
  return sanitized;
};

// Register new user
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
        code: 'INVALID_EMAIL',
      });
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Password does not meet security requirements',
        code: 'WEAK_PASSWORD',
        errors: passwordValidation.errors,
      });
    }

    // Check if user already exists
    const existingUser = await query(
      'SELECT id, email FROM users WHERE LOWER(email) = LOWER($1)',
      [email]
    );
    
    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists',
        code: 'EMAIL_EXISTS',
      });
    }

    // Hash password with bcrypt (cost factor: 12 for better security)
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user with default role 'student' and status 'active'
    const result = await query(
      `INSERT INTO users (name, email, password, role, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, role, status, created_at`,
      [name.trim(), email.toLowerCase().trim(), hashedPassword, 'student', 'active']
    );

    const user = result.rows[0];
    
    // Generate JWT token
    const token = generateToken(user);

    console.log(`✅ New user registered: ${user.email} (ID: ${user.id})`);

    return res.status(201).json({
      success: true,
      message: 'Registration successful. Welcome to FLIRT!',
      data: {
        user: sanitizeUser(user),
        token,
        expiresIn: process.env.JWT_EXPIRE || '7d',
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle duplicate email error from database
    if (error.code === '23505') { // PostgreSQL unique violation
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists',
        code: 'EMAIL_EXISTS',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.',
      code: 'REGISTRATION_ERROR',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Login user
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
        code: 'MISSING_CREDENTIALS',
      });
    }

    // Find user by email (case-insensitive)
    const result = await query(
      'SELECT * FROM users WHERE LOWER(email) = LOWER($1)',
      [email.trim()]
    );

    // Generic error message to prevent email enumeration
    if (result.rows.length === 0) {
      console.warn(`⚠️ Login attempt with non-existent email: ${email}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS',
      });
    }

    const user = result.rows[0];

    // Check if user account is active
    if (user.status !== 'active') {
      console.warn(`⚠️ Login attempt for suspended account: ${user.email} (ID: ${user.id})`);
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended. Please contact support for assistance.',
        code: 'ACCOUNT_SUSPENDED',
      });
    }

    // Verify password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.warn(`⚠️ Failed login attempt for: ${user.email}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS',
      });
    }

    // Generate JWT token
    const token = generateToken(user);

    // Update last login timestamp (optional - uncomment if needed)
    // await query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);

    console.log(`✅ User logged in: ${user.email} (${user.role})`);

    return res.status(200).json({
      success: true,
      message: 'Login successful. Welcome back!',
      data: {
        user: sanitizeUser(user),
        token,
        expiresIn: process.env.JWT_EXPIRE || '7d',
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.',
      code: 'LOGIN_ERROR',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Get current user profile
exports.getProfile = async (req, res, next) => {
  try {
    const result = await query(
      `SELECT id, name, email, role, status, created_at
       FROM users WHERE id = $1`,
      [req.user.id]
    );

    res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

// Update user profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await query(
        'SELECT id FROM users WHERE email = $1 AND id != $2',
        [email, req.user.id]
      );

      if (existingUser.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use',
        });
      }
    }

    const result = await query(
      `UPDATE users
       SET name = COALESCE($1, name),
           email = COALESCE($2, email),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING id, name, email, role, status`,
      [name, email, req.user.id]
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

// Change password
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validate new password strength
    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'New password does not meet security requirements',
        code: 'WEAK_PASSWORD',
        errors: passwordValidation.errors,
      });
    }

    // Prevent using the same password
    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password must be different from current password',
        code: 'SAME_PASSWORD',
      });
    }

    // Get user with password
    const result = await query(
      'SELECT password FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        code: 'USER_NOT_FOUND',
      });
    }

    const user = result.rows[0];

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      console.warn(`⚠️ Failed password change attempt for user ${req.user.id}`);
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
        code: 'INVALID_CURRENT_PASSWORD',
      });
    }

    // Hash new password with higher cost factor
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await query(
      'UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [hashedPassword, req.user.id]
    );

    console.log(`✅ Password changed for user: ${req.user.email}`);

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully. Please log in with your new password.',
    });
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to change password. Please try again.',
      code: 'PASSWORD_CHANGE_ERROR',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Get user statistics
exports.getUserStats = async (req, res, next) => {
  try {
    const itemsResult = await query(
      'SELECT COUNT(*) as count FROM items WHERE user_id = $1',
      [req.user.id]
    );

    const claimsResult = await query(
      'SELECT COUNT(*) as count FROM claims WHERE claimant_id = $1',
      [req.user.id]
    );

    res.status(200).json({
      success: true,
      data: {
        totalReports: parseInt(itemsResult.rows[0].count),
        totalClaims: parseInt(claimsResult.rows[0].count),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;
