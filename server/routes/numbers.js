const express = require('express');
const db = require('../database');

const router = express.Router();

// Get all available numbers (public endpoint)
router.get('/', (req, res) => {
  const category = req.query.category;

  let query = 'SELECT * FROM numbers WHERE sold = 0';
  const params = [];

  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }

  query += ' ORDER BY created_at DESC';

  db.all(query, params, (err, numbers) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ success: true, numbers });
  });
});

// Get single number
router.get('/:id', (req, res) => {
  db.get(
    'SELECT * FROM numbers WHERE id = ? AND sold = 0',
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

// Get categories
router.get('/categories/list', (req, res) => {
  db.all(
    'SELECT DISTINCT category FROM numbers WHERE sold = 0 ORDER BY category',
    (err, categories) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ 
        success: true, 
        categories: categories.map(c => c.category) 
      });
    }
  );
});

module.exports = router;
