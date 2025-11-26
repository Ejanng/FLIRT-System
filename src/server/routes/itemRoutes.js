const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validator');
const { upload, handleMulterError } = require('../middleware/upload');
const itemController = require('../controllers/itemController');

// Validation rules for creating/updating items
const itemValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Item name is required')
    .isLength({ min: 3, max: 255 }).withMessage('Item name must be between 3 and 255 characters'),
  
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  
  body('category')
    .notEmpty().withMessage('Category is required')
    .isIn(['electronics', 'clothing', 'accessories', 'bags', 'keys', 'books', 'other'])
    .withMessage('Invalid category'),
  
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['lost', 'found']).withMessage('Status must be either lost or found'),
  
  body('location')
    .trim()
    .notEmpty().withMessage('Location is required')
    .isLength({ min: 3, max: 255 }).withMessage('Location must be between 3 and 255 characters'),
  
  body('date')
    .notEmpty().withMessage('Date is required')
    .isISO8601().withMessage('Valid date is required (YYYY-MM-DD format)')
    .custom((value) => {
      const date = new Date(value);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (date > today) {
        throw new Error('Date cannot be in the future');
      }
      return true;
    }),
];

// Public routes - No authentication required
/**
 * @route   GET /api/items
 * @desc    Get all items with optional filters
 * @query   category, status, location, dateFrom, dateTo, search, claimStatus
 * @access  Public
 */
router.get('/', itemController.getAllItems);

/**
 * @route   GET /api/items/:id
 * @desc    Get single item by ID
 * @params  id - Item ID
 * @access  Public
 */
router.get('/:id', itemController.getItemById);

// Protected routes - Authentication required
/**
 * @route   POST /api/items
 * @desc    Report a new lost or found item
 * @body    name, description, category, status, location, date
 * @file    image (optional) - Item image file
 * @access  Private (requires authentication)
 */
router.post(
  '/',
  authenticate,
  upload.single('image'),
  handleMulterError,
  itemValidation,
  validate,
  itemController.createItem
);

/**
 * @route   GET /api/items/user/my-items
 * @desc    Get all items reported by the authenticated user
 * @access  Private (requires authentication)
 */
router.get('/user/my-items', authenticate, itemController.getUserItems);

/**
 * @route   PUT /api/items/:id
 * @desc    Update an existing item
 * @params  id - Item ID
 * @body    name, description, category, status, location, date (all optional)
 * @file    image (optional) - New item image file
 * @access  Private (requires authentication, owner or admin)
 */
router.put(
  '/:id',
  authenticate,
  upload.single('image'),
  handleMulterError,
  itemController.updateItem
);

/**
 * @route   DELETE /api/items/:id
 * @desc    Delete an item
 * @params  id - Item ID
 * @access  Private (requires authentication, owner or admin)
 */
router.delete('/:id', authenticate, itemController.deleteItem);

module.exports = router;
