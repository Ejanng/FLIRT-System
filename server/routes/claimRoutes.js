const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { authenticate, isAdmin } = require('../middleware/auth');
const validate = require('../middleware/validator');
const claimController = require('../controllers/claimController');

// Validation rules for creating claims
const claimValidation = [
  body('itemId')
    .notEmpty().withMessage('Item ID is required')
    .isInt({ min: 1 }).withMessage('Valid item ID is required'),
  
  body('verificationMessage')
    .trim()
    .notEmpty().withMessage('Verification message is required')
    .isLength({ min: 10, max: 1000 }).withMessage('Verification message must be between 10 and 1000 characters')
    .matches(/^[a-zA-Z0-9\s\.,!?'-]+$/).withMessage('Verification message contains invalid characters'),
];

// Validation rules for updating claim status
const statusValidation = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['pending', 'approved', 'rejected']).withMessage('Status must be pending, approved, or rejected'),
  
  body('adminNotes')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Admin notes cannot exceed 500 characters'),
];

// All routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/claims
 * @desc    Submit a new claim for an item
 * @body    itemId, verificationMessage
 * @access  Private (authenticated users)
 */
router.post('/', claimValidation, validate, claimController.createClaim);

/**
 * @route   GET /api/claims
 * @desc    Get all claims (filtered by user if not admin)
 * @query   status, itemId, page, limit
 * @access  Private (authenticated users)
 */
router.get('/', claimController.getAllClaims);

/**
 * @route   GET /api/claims/stats
 * @desc    Get claim statistics for the authenticated user
 * @access  Private (authenticated users)
 */
router.get('/stats', claimController.getUserClaimStats);

/**
 * @route   GET /api/claims/item/:itemId
 * @desc    Get all claims for a specific item
 * @params  itemId - Item ID
 * @access  Private (item owner or admin)
 */
router.get('/item/:itemId', claimController.getClaimsByItem);

/**
 * @route   GET /api/claims/:id
 * @desc    Get single claim by ID
 * @params  id - Claim ID
 * @access  Private (claimant, reporter, or admin)
 */
router.get('/:id', claimController.getClaimById);

/**
 * @route   PUT /api/claims/:id/status
 * @desc    Update claim status (approve/reject)
 * @params  id - Claim ID
 * @body    status, adminNotes (optional)
 * @access  Private (admin only)
 */
router.put('/:id/status', isAdmin, statusValidation, validate, claimController.updateClaimStatus);

/**
 * @route   DELETE /api/claims/:id
 * @desc    Delete a claim
 * @params  id - Claim ID
 * @access  Private (claimant or admin)
 */
router.delete('/:id', claimController.deleteClaim);

module.exports = router;
