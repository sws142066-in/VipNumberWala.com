const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');

const db = require('../database');
const { generateToken, verifyToken } = require('../middleware/auth');

const router = express.Router();

// Rate limiter: limit logins to 5 attempts per 15 minutes per IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  message: { error: 'Too many login attempts from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Validation rules
const loginValidation = [
  body('username').trim().notEmpty().withMessage('Username is required').escape(),
  body('password').notEmpty().withMessage('Password is required')
];

// Admin login
router.post('/login', loginLimiter, loginValidation, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  const { username, password } = req.body;

  db.get(
    'SELECT * FROM admin_users WHERE username = ?',
    [username],
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!user) {
        // Log failed login attempt
        const fakeHash = bcrypt.hashSync('fake', 10);
        bcrypt.compare(password, fakeHash, () => {
          // Dummy compare for timing attack protection
        });
        
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Compare password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          return res.status(500).json({ error: 'Authentication error' });
        }

        if (!isMatch) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Update last login
        db.run(
          'UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
          [user.id]
        );

        // Generate JWT
        const token = generateToken(user);

        // Log session
        const userAgent = req.headers['user-agent'] || 'Unknown';
        const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        
        db.run(
          'INSERT INTO session_logs (admin_username, ip_address, user_agent) VALUES (?, ?, ?)',
          [user.username, clientIp, userAgent]
        );

        res.json({
          success: true,
          token,
          user: {
            id: user.id,
            username: user.username,
            role: user.role
          },
          message: 'Login successful'
        });
      });
    }
  );
});

// Verify token
router.post('/verify', verifyToken, (req, res) => {
  res.json({
    success: true,
    user: req.user,
    message: 'Token is valid'
  });
});

// Get current admin info
router.get('/me', verifyToken, (req, res) => {
  db.get(
    'SELECT id, username, role, created_at, last_login FROM admin_users WHERE id = ?',
    [req.user.id],
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ success: true, user });
    }
  );
});

// Logout (client-side token destruction)
router.post('/logout', verifyToken, (req, res) => {
  const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  
  db.run(
    `UPDATE session_logs 
     SET logout_time = CURRENT_TIMESTAMP 
     WHERE admin_username = ? AND logout_time IS NULL
     ORDER BY login_time DESC LIMIT 1`,
    [req.user.username]
  );

  res.json({ success: true, message: 'Logged out successfully' });
});

module.exports = router;
