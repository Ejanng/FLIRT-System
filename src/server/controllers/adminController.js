const { query } = require('../config/database');

// Get dashboard statistics
exports.getDashboardStats = async (req, res, next) => {
  try {
    // Total reports
    const totalReports = await query('SELECT COUNT(*) as count FROM items');

    // Pending claims
    const pendingClaims = await query(
      "SELECT COUNT(*) as count FROM claims WHERE status = 'pending'"
    );

    // Resolved items
    const resolvedItems = await query(
      "SELECT COUNT(*) as count FROM items WHERE claim_status = 'claimed'"
    );

    // Active users
    const activeUsers = await query(
      "SELECT COUNT(*) as count FROM users WHERE status = 'active'"
    );

    // Items by category
    const itemsByCategory = await query(`
      SELECT category, COUNT(*) as count
      FROM items
      GROUP BY category
      ORDER BY count DESC
    `);

    // Recent activity
    const recentActivity = await query(`
      SELECT 'item' as type, i.id, i.name as title, i.created_at, u.name as user_name
      FROM items i
      JOIN users u ON i.user_id = u.id
      UNION ALL
      SELECT 'claim' as type, c.id, i.name as title, c.created_at, u.name as user_name
      FROM claims c
      JOIN items i ON c.item_id = i.id
      JOIN users u ON c.claimant_id = u.id
      ORDER BY created_at DESC
      LIMIT 10
    `);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalReports: parseInt(totalReports.rows[0].count),
          pendingClaims: parseInt(pendingClaims.rows[0].count),
          resolvedItems: parseInt(resolvedItems.rows[0].count),
          activeUsers: parseInt(activeUsers.rows[0].count),
        },
        itemsByCategory: itemsByCategory.rows,
        recentActivity: recentActivity.rows,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get all users (admin only)
exports.getAllUsers = async (req, res, next) => {
  try {
    const { status, role } = req.query;

    let queryText = `
      SELECT u.id, u.name, u.email, u.role, u.status, u.created_at,
             COUNT(DISTINCT i.id) as reports_count,
             COUNT(DISTINCT c.id) as claims_count
      FROM users u
      LEFT JOIN items i ON u.id = i.user_id
      LEFT JOIN claims c ON u.id = c.claimant_id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    if (status) {
      queryText += ` AND u.status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    if (role) {
      queryText += ` AND u.role = $${paramCount}`;
      params.push(role);
      paramCount++;
    }

    queryText += ' GROUP BY u.id ORDER BY u.created_at DESC';

    const result = await query(queryText, params);

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

// Update user status (suspend/activate)
exports.updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Prevent admin from suspending themselves
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot change your own account status',
      });
    }

    const result = await query(
      `UPDATE users
       SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING id, name, email, status`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: `User ${status === 'active' ? 'activated' : 'suspended'} successfully`,
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

// Delete user (admin only)
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account',
      });
    }

    const result = await query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Verify report (admin only)
exports.verifyReport = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { verified } = req.body;

    const result = await query(
      `UPDATE items
       SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [verified ? 'verified' : 'rejected', id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    res.status(200).json({
      success: true,
      message: `Report ${verified ? 'verified' : 'rejected'} successfully`,
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

// Get analytics data
exports.getAnalytics = async (req, res, next) => {
  try {
    // Items by status
    const itemsByStatus = await query(`
      SELECT status, COUNT(*) as count
      FROM items
      GROUP BY status
    `);

    // Claims by status
    const claimsByStatus = await query(`
      SELECT status, COUNT(*) as count
      FROM claims
      GROUP BY status
    `);

    // Monthly trends
    const monthlyTrends = await query(`
      SELECT
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as count
      FROM items
      WHERE created_at >= NOW() - INTERVAL '6 months'
      GROUP BY month
      ORDER BY month
    `);

    // Success rate
    const successRate = await query(`
      SELECT
        COUNT(*) FILTER (WHERE claim_status = 'claimed') as claimed,
        COUNT(*) as total
      FROM items
    `);

    const rate = successRate.rows[0].total > 0
      ? (successRate.rows[0].claimed / successRate.rows[0].total) * 100
      : 0;

    res.status(200).json({
      success: true,
      data: {
        itemsByStatus: itemsByStatus.rows,
        claimsByStatus: claimsByStatus.rows,
        monthlyTrends: monthlyTrends.rows,
        successRate: Math.round(rate),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;
