const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { authenticate, isAdmin } = require('../middleware/auth');
const validate = require('../middleware/validator');
const adminController = require('../controllers/adminController');

/**
 * ADMIN ROUTES - ALL PROTECTED
 * Requires JWT authentication AND admin role
 */

// Apply authentication middleware to all routes
router.use(authenticate);

// Apply admin role check to all routes
router.use(isAdmin);

/**
 * @route   GET /api/admin/dashboard
 * @desc    Get dashboard statistics (total reports, pending claims, etc.)
 * @access  Private (Admin only)
 */
router.get('/dashboard', adminController.getDashboardStats);

/**
 * @route   GET /api/admin/analytics
 * @desc    Get detailed analytics data
 * @access  Private (Admin only)
 */
router.get('/analytics', adminController.getAnalytics);

/**
 * User Management Routes
 */

/**
 * @route   GET /api/admin/users
 * @desc    Get all users with filtering options
 * @query   status, role
 * @access  Private (Admin only)
 */
router.get('/users', adminController.getAllUsers);

/**
 * @route   PUT /api/admin/users/:id/status
 * @desc    Update user account status (activate/suspend)
 * @params  id - User ID
 * @body    status - 'active' or 'suspended'
 * @access  Private (Admin only)
 */
router.put('/users/:id/status', 
  [
    body('status')
      .notEmpty().withMessage('Status is required')
      .isIn(['active', 'suspended']).withMessage('Status must be either active or suspended')
  ],
  validate,
  adminController.updateUserStatus
);

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Delete a user account
 * @params  id - User ID
 * @access  Private (Admin only)
 */
router.delete('/users/:id', adminController.deleteUser);

/**
 * Report Management Routes
 */

/**
 * @route   PUT /api/admin/reports/:id/verify
 * @desc    Verify or reject an item report
 * @params  id - Report/Item ID
 * @body    verified - boolean
 * @access  Private (Admin only)
 */
router.put('/reports/:id/verify',
  [
    body('verified')
      .notEmpty().withMessage('Verified field is required')
      .isBoolean().withMessage('Verified must be a boolean value')
  ],
  validate,
  adminController.verifyReport
);

module.exports = router;
