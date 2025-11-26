const { query, transaction } = require('../config/database');

// Create new claim
exports.createClaim = async (req, res, next) => {
  try {
    const { itemId, verificationMessage } = req.body;

    // Validate inputs
    if (!itemId || !verificationMessage) {
      return res.status(400).json({
        success: false,
        message: 'Item ID and verification message are required',
      });
    }

    if (verificationMessage.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Verification message must be at least 10 characters',
      });
    }

    // Check if item exists and get full details
    const itemResult = await query(
      `SELECT i.id, i.name, i.description, i.status, i.claim_status, i.user_id, i.location,
              u.name as reporter_name, u.email as reporter_email
       FROM items i
       JOIN users u ON i.user_id = u.id
       WHERE i.id = $1`,
      [itemId]
    );

    if (itemResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    const item = itemResult.rows[0];

    // Prevent user from claiming their own item
    if (item.user_id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot claim your own item',
      });
    }

    // Check if item is already claimed
    if (item.claim_status === 'claimed') {
      return res.status(400).json({
        success: false,
        message: 'This item has already been claimed and verified',
      });
    }

    // Check if user already has a pending or approved claim for this item
    const existingClaim = await query(
      'SELECT id, status FROM claims WHERE item_id = $1 AND claimant_id = $2 AND status IN ($3, $4)',
      [itemId, req.user.id, 'pending', 'approved']
    );

    if (existingClaim.rows.length > 0) {
      const status = existingClaim.rows[0].status;
      return res.status(400).json({
        success: false,
        message: `You already have ${status === 'pending' ? 'a pending' : 'an approved'} claim for this item`,
      });
    }

    // Create claim with transaction
    const result = await transaction(async (client) => {
      // Insert claim
      const claimResult = await client.query(
        `INSERT INTO claims (item_id, claimant_id, verification_message, status)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [itemId, req.user.id, verificationMessage.trim(), 'pending']
      );

      // Get claimant details
      const claimantResult = await client.query(
        'SELECT id, name, email FROM users WHERE id = $1',
        [req.user.id]
      );

      return {
        claim: claimResult.rows[0],
        claimant: claimantResult.rows[0],
      };
    });

    // Return comprehensive response
    return res.status(201).json({
      success: true,
      message: 'Claim submitted successfully. The item owner will be notified for verification.',
      data: {
        ...result.claim,
        claimant_name: result.claimant.name,
        claimant_email: result.claimant.email,
        item_name: item.name,
        item_status: item.status,
        reporter_name: item.reporter_name,
        reporter_email: item.reporter_email,
      },
    });
  } catch (error) {
    console.error('Create claim error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit claim',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Get all claims (admin or filtered by user)
exports.getAllClaims = async (req, res, next) => {
  try {
    const { status, itemId, page = 1, limit = 50 } = req.query;

    let queryText = `
      SELECT c.*,
             u.name as claimant_name,
             u.email as claimant_email,
             u.id as claimant_id,
             i.name as item_name,
             i.description as item_description,
             i.status as item_status,
             i.location as item_location,
             i.claim_status as item_claim_status,
             reporter.name as reporter_name,
             reporter.email as reporter_email,
             reporter.id as reporter_id
      FROM claims c
      JOIN users u ON c.claimant_id = u.id
      JOIN items i ON c.item_id = i.id
      JOIN users reporter ON i.user_id = reporter.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    // If not admin, only show user's claims or claims for user's items
    if (req.user.role !== 'admin') {
      queryText += ` AND (c.claimant_id = ${paramCount} OR i.user_id = ${paramCount})`;
      params.push(req.user.id);
      paramCount++;
    }

    // Filter by status
    if (status) {
      queryText += ` AND c.status = ${paramCount}`;
      params.push(status);
      paramCount++;
    }

    // Filter by item ID
    if (itemId) {
      queryText += ` AND c.item_id = ${paramCount}`;
      params.push(itemId);
      paramCount++;
    }

    queryText += ' ORDER BY c.created_at DESC';

    // Add pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    queryText += ` LIMIT ${paramCount} OFFSET ${paramCount + 1}`;
    params.push(parseInt(limit), offset);

    // Get total count
    let countQuery = queryText.replace(
      /SELECT c\.\*.*?FROM claims/s,
      'SELECT COUNT(*) as total FROM claims'
    );
    countQuery = countQuery.split('ORDER BY')[0];
    countQuery = countQuery.split('LIMIT')[0];

    const countResult = await query(countQuery, params.slice(0, -2));
    const total = parseInt(countResult.rows[0].total);

    const result = await query(queryText, params);

    return res.status(200).json({
      success: true,
      message: 'Claims retrieved successfully',
      count: result.rows.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      data: result.rows,
    });
  } catch (error) {
    console.error('Get all claims error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve claims',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Get single claim by ID
exports.getClaimById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid claim ID',
      });
    }

    const result = await query(
      `SELECT c.*,
              u.name as claimant_name,
              u.email as claimant_email,
              u.id as claimant_id,
              i.name as item_name,
              i.description as item_description,
              i.location as item_location,
              i.date as item_date,
              i.status as item_status,
              i.claim_status as item_claim_status,
              i.image_url as item_image_url,
              reporter.name as reporter_name,
              reporter.email as reporter_email,
              reporter.id as reporter_id
       FROM claims c
       JOIN users u ON c.claimant_id = u.id
       JOIN items i ON c.item_id = i.id
       JOIN users reporter ON i.user_id = reporter.id
       WHERE c.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found',
      });
    }

    const claim = result.rows[0];

    // Check authorization - claimant, reporter, or admin can view
    if (
      req.user.role !== 'admin' &&
      claim.claimant_id !== req.user.id &&
      claim.reporter_id !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this claim',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Claim retrieved successfully',
      data: claim,
    });
  } catch (error) {
    console.error('Get claim by ID error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve claim',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Update claim status (admin only)
exports.updateClaimStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    // Validate ID
    if (isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid claim ID',
      });
    }

    // Validate status
    const validStatuses = ['pending', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be pending, approved, or rejected',
      });
    }

    // Get claim with full details
    const claimCheck = await query(
      `SELECT c.*, i.name as item_name, i.claim_status, u.name as claimant_name, u.email as claimant_email
       FROM claims c
       JOIN items i ON c.item_id = i.id
       JOIN users u ON c.claimant_id = u.id
       WHERE c.id = $1`,
      [id]
    );

    if (claimCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found',
      });
    }

    const claim = claimCheck.rows[0];

    // Check if claim is already in the requested status
    if (claim.status === status) {
      return res.status(400).json({
        success: false,
        message: `Claim is already ${status}`,
      });
    }

    // If approving, check if item is already claimed
    if (status === 'approved' && claim.claim_status === 'claimed') {
      return res.status(400).json({
        success: false,
        message: 'Item has already been claimed',
      });
    }

    // Update claim status with transaction
    const result = await transaction(async (client) => {
      // Update claim
      const updateResult = await client.query(
        `UPDATE claims
         SET status = $1,
             admin_notes = $2,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $3
         RETURNING *`,
        [status, adminNotes || null, id]
      );

      // If approved, mark item as claimed and reject other claims
      if (status === 'approved') {
        await client.query(
          'UPDATE items SET claim_status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
          ['claimed', claim.item_id]
        );

        // Reject other pending claims for this item
        await client.query(
          `UPDATE claims
           SET status = 'rejected',
               admin_notes = 'Another claim was approved for this item',
               updated_at = CURRENT_TIMESTAMP
           WHERE item_id = $1 AND id != $2 AND status = 'pending'`,
          [claim.item_id, id]
        );
      }

      // If rejecting and this was the only approved claim, revert item to unclaimed
      if (status === 'rejected' && claim.status === 'approved') {
        // Check if there are other approved claims
        const otherApprovedClaims = await client.query(
          'SELECT id FROM claims WHERE item_id = $1 AND status = $2 AND id != $3',
          [claim.item_id, 'approved', id]
        );

        if (otherApprovedClaims.rows.length === 0) {
          await client.query(
            'UPDATE items SET claim_status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
            ['unclaimed', claim.item_id]
          );
        }
      }

      return updateResult.rows[0];
    });

    // Prepare response message based on status
    let message = '';
    switch (status) {
      case 'approved':
        message = `Claim approved successfully. Item marked as claimed and claimant (${claim.claimant_name}) has been notified.`;
        break;
      case 'rejected':
        message = `Claim rejected. Claimant (${claim.claimant_name}) has been notified.`;
        break;
      case 'pending':
        message = 'Claim status set back to pending';
        break;
    }

    return res.status(200).json({
      success: true,
      message,
      data: {
        ...result,
        claimant_name: claim.claimant_name,
        claimant_email: claim.claimant_email,
        item_name: claim.item_name,
      },
    });
  } catch (error) {
    console.error('Update claim status error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update claim status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Delete claim
exports.deleteClaim = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid claim ID',
      });
    }

    // Check if claim exists
    const claimCheck = await query(
      'SELECT claimant_id, status FROM claims WHERE id = $1',
      [id]
    );

    if (claimCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found',
      });
    }

    const claim = claimCheck.rows[0];

    // Only claimant or admin can delete
    if (claim.claimant_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this claim',
      });
    }

    // Prevent deletion of approved claims (only admin can delete approved claims)
    if (claim.status === 'approved' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete an approved claim. Please contact an administrator.',
      });
    }

    await query('DELETE FROM claims WHERE id = $1', [id]);

    return res.status(200).json({
      success: true,
      message: 'Claim deleted successfully',
    });
  } catch (error) {
    console.error('Delete claim error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete claim',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Get claims for a specific item
exports.getClaimsByItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    // Validate ID
    if (isNaN(parseInt(itemId))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid item ID',
      });
    }

    // Check if item exists
    const itemCheck = await query(
      'SELECT id, name, user_id FROM items WHERE id = $1',
      [itemId]
    );

    if (itemCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    const item = itemCheck.rows[0];

    // Only item owner or admin can view all claims for an item
    if (item.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view claims for this item',
      });
    }

    // Get all claims for the item
    const result = await query(
      `SELECT c.*,
              u.name as claimant_name,
              u.email as claimant_email
       FROM claims c
       JOIN users u ON c.claimant_id = u.id
       WHERE c.item_id = $1
       ORDER BY c.created_at DESC`,
      [itemId]
    );

    return res.status(200).json({
      success: true,
      message: 'Claims retrieved successfully',
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error('Get claims by item error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve claims',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Get claim statistics for user
exports.getUserClaimStats = async (req, res, next) => {
  try {
    const result = await query(
      `SELECT
         COUNT(*) as total,
         COUNT(*) FILTER (WHERE status = 'pending') as pending,
         COUNT(*) FILTER (WHERE status = 'approved') as approved,
         COUNT(*) FILTER (WHERE status = 'rejected') as rejected
       FROM claims
       WHERE claimant_id = $1`,
      [req.user.id]
    );

    return res.status(200).json({
      success: true,
      message: 'Claim statistics retrieved successfully',
      data: {
        total: parseInt(result.rows[0].total),
        pending: parseInt(result.rows[0].pending),
        approved: parseInt(result.rows[0].approved),
        rejected: parseInt(result.rows[0].rejected),
      },
    });
  } catch (error) {
    console.error('Get user claim stats error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

module.exports = exports;
