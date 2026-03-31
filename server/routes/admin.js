const express = require('express');
const db = require('../database');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

const router = express.Router();

// Middleware to check admin access on all routes
router.use(verifyToken);
router.use(verifyAdmin);

// Helper function to log changes
function logAudit(username, action, numberId, oldValue, newValue, req) {
  const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  db.run(
    `INSERT INTO audit_logs 
     (admin_username, action, number_id, old_value, new_value, ip_address) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [username, action, numberId, JSON.stringify(oldValue), JSON.stringify(newValue), clientIp]
  );
}

// Get all numbers
router.get('/numbers', (req, res) => {
  db.all('SELECT * FROM numbers ORDER BY created_at DESC', (err, numbers) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ success: true, numbers });
  });
});

// Get single number
router.get('/numbers/:id', (req, res) => {
  db.get(
    'SELECT * FROM numbers WHERE id = ?',
    [req.params.id],
    (err, number) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (!number) {
        return res.status(404).json({ error: 'Number not found' });
      }
      res.json({ success: true, number });
    }
  );
});

// Add new number
router.post('/numbers', (req, res) => {
  const { id, number, category, price, operator, tag, label } = req.body;

  if (!id || !number || !category || price === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  db.run(
    `INSERT INTO numbers (id, number, category, price, operator, tag, label) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, number, category, price, operator || '', tag || '', label || ''],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to add number' });
      }

      logAudit(
        req.user.username,
        'CREATE',
        id,
        null,
        { id, number, category, price, operator, tag, label },
        req
      );

      res.status(201).json({ 
        success: true, 
        message: 'Number added successfully',
        id 
      });
    }
  );
});

// Update number
router.put('/numbers/:id', (req, res) => {
  const { number, category, price, operator, tag, label, sold } = req.body;

  // Get old values
  db.get(
    'SELECT * FROM numbers WHERE id = ?',
    [req.params.id],
    (err, oldNumber) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (!oldNumber) {
        return res.status(404).json({ error: 'Number not found' });
      }

      // Prepare update query
      const updates = [];
      const values = [];

      if (number !== undefined) {
        updates.push('number = ?');
        values.push(number);
      }
      if (category !== undefined) {
        updates.push('category = ?');
        values.push(category);
      }
      if (price !== undefined) {
        updates.push('price = ?');
        values.push(price);
      }
      if (operator !== undefined) {
        updates.push('operator = ?');
        values.push(operator);
      }
      if (tag !== undefined) {
        updates.push('tag = ?');
        values.push(tag);
      }
      if (label !== undefined) {
        updates.push('label = ?');
        values.push(label);
      }
      if (sold !== undefined) {
        updates.push('sold = ?');
        values.push(sold ? 1 : 0);
      }

      if (updates.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }

      updates.push('updated_at = CURRENT_TIMESTAMP');
      values.push(req.params.id);

      db.run(
        `UPDATE numbers SET ${updates.join(', ')} WHERE id = ?`,
        values,
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Failed to update number' });
          }

          // Log the change
          const newValues = {
            number: number !== undefined ? number : oldNumber.number,
            category: category !== undefined ? category : oldNumber.category,
            price: price !== undefined ? price : oldNumber.price,
            operator: operator !== undefined ? operator : oldNumber.operator,
            tag: tag !== undefined ? tag : oldNumber.tag,
            label: label !== undefined ? label : oldNumber.label,
            sold: sold !== undefined ? sold : oldNumber.sold
          };

          logAudit(
            req.user.username,
            'UPDATE',
            req.params.id,
            oldNumber,
            newValues,
            req
          );

          res.json({ 
            success: true, 
            message: 'Number updated successfully' 
          });
        }
      );
    }
  );
});

// Delete number
router.delete('/numbers/:id', (req, res) => {
  db.get(
    'SELECT * FROM numbers WHERE id = ?',
    [req.params.id],
    (err, oldNumber) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (!oldNumber) {
        return res.status(404).json({ error: 'Number not found' });
      }

      db.run(
        'DELETE FROM numbers WHERE id = ?',
        [req.params.id],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Failed to delete number' });
          }

          logAudit(
            req.user.username,
            'DELETE',
            req.params.id,
            oldNumber,
            null,
            req
          );

          res.json({ 
            success: true, 
            message: 'Number deleted successfully' 
          });
        }
      );
    }
  );
});

// Toggle sold status
router.patch('/numbers/:id/toggle-sold', (req, res) => {
  db.get(
    'SELECT sold FROM numbers WHERE id = ?',
    [req.params.id],
    (err, number) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (!number) {
        return res.status(404).json({ error: 'Number not found' });
      }

      const newSold = number.sold ? 0 : 1;

      db.run(
        'UPDATE numbers SET sold = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [newSold, req.params.id],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Failed to update' });
          }

          logAudit(
            req.user.username,
            'TOGGLE_SOLD',
            req.params.id,
            { sold: number.sold },
            { sold: newSold },
            req
          );

          res.json({ 
            success: true, 
            message: `Number marked as ${newSold ? 'sold' : 'available'}`,
            sold: newSold
          });
        }
      );
    }
  );
});

module.exports = router;
