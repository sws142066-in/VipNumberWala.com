const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      error: 'No token provided',
      message: 'Authentication required'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ 
      error: 'Invalid or expired token',
      message: 'Please login again'
    });
  }
};

// Verify admin role
const verifyAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ 
      error: 'Unauthorized',
      message: 'Admin access required'
    });
  }
};

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

module.exports = {
  verifyToken,
  verifyAdmin,
  generateToken,
  JWT_SECRET
};
