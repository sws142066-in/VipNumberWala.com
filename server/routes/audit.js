const express = require('express');
const db = require('../database');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

const router = express.Router();

// Middleware to check admin access
router.use(verifyToken);
router.use(verifyAdmin);

// Get all audit logs
router.get('/logs', (req, res) => {
  const limit = req.query.limit || 100;
  const offset = req.query.offset || 0;

  db.all(
    `SELECT * FROM audit_logs 
     ORDER BY timestamp DESC 
     LIMIT ? OFFSET ?`,
    [limit, offset],
    (err, logs) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      // Get total count
      db.get('SELECT COUNT(*) as count FROM audit_logs', (err, result) => {
        res.json({
          success: true,
          logs,
          total: result.count,
          limit,
          offset
        });
      });
    }
  );
});

// Get logs for specific number
router.get('/logs/number/:numberId', (req, res) => {
  db.all(
    `SELECT * FROM audit_logs 
     WHERE number_id = ? 
     ORDER BY timestamp DESC`,
    [req.params.numberId],
    (err, logs) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ success: true, logs });
    }
  );
});

// Get logs for specific admin
router.get('/logs/admin/:username', (req, res) => {
  db.all(
    `SELECT * FROM audit_logs 
     WHERE admin_username = ? 
     ORDER BY timestamp DESC`,
    [req.params.username],
    (err, logs) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ success: true, logs });
    }
  );
});

// Get session logs
router.get('/sessions', (req, res) => {
  const limit = req.query.limit || 50;
  const offset = req.query.offset || 0;

  db.all(
    `SELECT * FROM session_logs 
     ORDER BY login_time DESC 
     LIMIT ? OFFSET ?`,
    [limit, offset],
    (err, sessions) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      db.get('SELECT COUNT(*) as count FROM session_logs', (err, result) => {
        res.json({
          success: true,
          sessions,
          total: result.count,
          limit,
          offset
        });
      });
    }
  );
});

// Get statistics
router.get('/stats', (req, res) => {
  db.serialize(() => {
    let stats = {};

    // Total actions by type
    db.all(
      `SELECT action, COUNT(*) as count FROM audit_logs GROUP BY action`,
      (err, actions) => {
        if (!err) {
          stats.actionsByType = actions;
        }
      }
    );

    // Most active admins
    db.all(
      `SELECT admin_username, COUNT(*) as count FROM audit_logs GROUP BY admin_username ORDER BY count DESC LIMIT 10`,
      (err, admins) => {
        if (!err) {
          stats.topAdmins = admins;
        }
      }
    );

    // Recent changes
    db.all(
      `SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 20`,
      (err, recent) => {
        if (!err) {
          stats.recentChanges = recent;
        }
        res.json({ success: true, stats });
      }
    );
  });
});

module.exports = router;
