const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
require('dotenv').config();

const db = require('./server/database');
const authRoutes = require('./server/routes/auth');
const adminRoutes = require('./server/routes/admin');
const numberRoutes = require('./server/routes/numbers');
const auditRoutes = require('./server/routes/audit');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/numbers', numberRoutes);
app.use('/api/audit', auditRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    status: err.status || 500
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`
========================================
  LifetimeNumber Admin Server Started
========================================
  Server running on: http://localhost:${PORT}
  Environment: ${process.env.NODE_ENV || 'development'}
  Database: SQLite
  
  Default Admin Credentials:
  - Username: admin
  - Password: admin123
  
  IMPORTANT: Change default credentials in production!
========================================
  `);
});

module.exports = app;
