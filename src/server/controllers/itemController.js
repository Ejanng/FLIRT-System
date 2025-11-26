const { query, transaction } = require('../config/database');
const path = require('path');
const fs = require('fs');

// Helper function to delete file
const deleteFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }
};

// Get all items with filters
exports.getAllItems = async (req, res, next) => {
  try {
    const {
      category,
      status,
      location,
      dateFrom,
      dateTo,
      search,
      claimStatus,
      page = 1,
      limit = 50,
    } = req.query;

    let queryText = `
      SELECT i.*, u.name as reporter_name, u.email as reporter_email
      FROM items i
      JOIN users u ON i.user_id = u.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    // Apply filters
    if (category) {
      queryText += ` AND i.category = ${paramCount}`;
      params.push(category);
      paramCount++;
    }

    if (status) {
      queryText += ` AND i.status = ${paramCount}`;
      params.push(status);
      paramCount++;
    }

    if (location) {
      queryText += ` AND LOWER(i.location) LIKE ${paramCount}`;
      params.push(`%${location.toLowerCase()}%`);
      paramCount++;
    }

    if (dateFrom) {
      queryText += ` AND i.date >= ${paramCount}`;
      params.push(dateFrom);
      paramCount++;
    }

    if (dateTo) {
      queryText += ` AND i.date <= ${paramCount}`;
      params.push(dateTo);
      paramCount++;
    }

    if (search) {
      queryText += ` AND (LOWER(i.name) LIKE ${paramCount} OR LOWER(i.description) LIKE ${paramCount})`;
      params.push(`%${search.toLowerCase()}%`);
      paramCount++;
    }

    if (claimStatus) {
      queryText += ` AND i.claim_status = ${paramCount}`;
      params.push(claimStatus);
      paramCount++;
    }

    queryText += ' ORDER BY i.created_at DESC';

    // Add pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    queryText += ` LIMIT ${paramCount} OFFSET ${paramCount + 1}`;
    params.push(parseInt(limit), offset);

    // Get total count
    let countQuery = queryText.replace('SELECT i.*, u.name as reporter_name, u.email as reporter_email', 'SELECT COUNT(*) as total');
    countQuery = countQuery.split('ORDER BY')[0]; // Remove ORDER BY from count query
    countQuery = countQuery.split('LIMIT')[0]; // Remove LIMIT/OFFSET from count query

    const countResult = await query(countQuery, params.slice(0, -2)); // Remove pagination params
    const total = parseInt(countResult.rows[0].total);

    const result = await query(queryText, params);

    return res.status(200).json({
      success: true,
      message: 'Items retrieved successfully',
      count: result.rows.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      data: result.rows,
    });
  } catch (error) {
    console.error('Get all items error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve items',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Get single item by ID
exports.getItemById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ID is a number
    if (isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid item ID',
      });
    }

    const result = await query(
      `SELECT i.*, u.name as reporter_name, u.email as reporter_email, u.id as reporter_id
       FROM items i
       JOIN users u ON i.user_id = u.id
       WHERE i.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Item retrieved successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Get item by ID error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve item',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Create new item
exports.createItem = async (req, res, next) => {
  try {
    const {
      name,
      description,
      category,
      status,
      location,
      date,
    } = req.body;

    // Handle image upload
    let imageUrl = null;
    if (req.file) {
      // Store relative path for serving
      imageUrl = `/uploads/${req.file.filename}`;
    }

    // Validate required fields (additional check)
    if (!name || !description || !category || !status || !location || !date) {
      // Clean up uploaded file if validation fails
      if (req.file) {
        deleteFile(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided',
        required: ['name', 'description', 'category', 'status', 'location', 'date'],
      });
    }

    // Insert item into database
    const result = await query(
      `INSERT INTO items (user_id, name, description, category, status, location, date, image_url, claim_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [req.user.id, name, description, category, status, location, date, imageUrl, 'unclaimed']
    );

    // Get reporter information for response
    const item = result.rows[0];
    const userResult = await query('SELECT name, email FROM users WHERE id = $1', [req.user.id]);
    
    return res.status(201).json({
      success: true,
      message: 'Item reported successfully',
      data: {
        ...item,
        reporter_name: userResult.rows[0].name,
        reporter_email: userResult.rows[0].email,
      },
    });
  } catch (error) {
    // Clean up uploaded file if error occurs
    if (req.file) {
      deleteFile(req.file.path);
    }
    
    console.error('Create item error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to report item',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Update item
exports.updateItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      category,
      status,
      location,
      date,
      claimStatus,
    } = req.body;

    // Validate ID
    if (isNaN(parseInt(id))) {
      if (req.file) {
        deleteFile(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: 'Invalid item ID',
      });
    }

    // Check if item exists and get current data
    const itemCheck = await query('SELECT user_id, image_url FROM items WHERE id = $1', [id]);
    
    if (itemCheck.rows.length === 0) {
      if (req.file) {
        deleteFile(req.file.path);
      }
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    const currentItem = itemCheck.rows[0];

    // Only owner or admin can update
    if (currentItem.user_id !== req.user.id && req.user.role !== 'admin') {
      if (req.file) {
        deleteFile(req.file.path);
      }
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this item',
      });
    }

    // Handle new image upload
    let imageUrl = undefined;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
      // Delete old image if exists
      if (currentItem.image_url) {
        const oldImagePath = path.join(process.env.UPLOAD_PATH || './uploads', path.basename(currentItem.image_url));
        deleteFile(oldImagePath);
      }
    }

    // Update item
    const result = await query(
      `UPDATE items
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           category = COALESCE($3, category),
           status = COALESCE($4, status),
           location = COALESCE($5, location),
           date = COALESCE($6, date),
           image_url = COALESCE($7, image_url),
           claim_status = COALESCE($8, claim_status),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING *`,
      [name, description, category, status, location, date, imageUrl, claimStatus, id]
    );

    return res.status(200).json({
      success: true,
      message: 'Item updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    // Clean up uploaded file if error occurs
    if (req.file) {
      deleteFile(req.file.path);
    }
    
    console.error('Update item error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update item',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Delete item
exports.deleteItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid item ID',
      });
    }

    // Check if item exists and get image URL
    const itemCheck = await query('SELECT user_id, image_url FROM items WHERE id = $1', [id]);
    
    if (itemCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    const item = itemCheck.rows[0];

    // Only owner or admin can delete
    if (item.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this item',
      });
    }

    // Delete from database
    await query('DELETE FROM items WHERE id = $1', [id]);

    // Delete image file if exists
    if (item.image_url) {
      const imagePath = path.join(process.env.UPLOAD_PATH || './uploads', path.basename(item.image_url));
      deleteFile(imagePath);
    }

    return res.status(200).json({
      success: true,
      message: 'Item deleted successfully',
    });
  } catch (error) {
    console.error('Delete item error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete item',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Get user's items
exports.getUserItems = async (req, res, next) => {
  try {
    const result = await query(
      `SELECT * FROM items WHERE user_id = $1 ORDER BY created_at DESC`,
      [req.user.id]
    );

    return res.status(200).json({
      success: true,
      message: 'User items retrieved successfully',
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error('Get user items error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve user items',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

module.exports = exports;
