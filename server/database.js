const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'data', 'lifetime_numbers.db');

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Database connected');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  db.serialize(() => {
    // Numbers table
    db.run(`
      CREATE TABLE IF NOT EXISTS numbers (
        id TEXT PRIMARY KEY,
        number TEXT NOT NULL,
        category TEXT NOT NULL,
        price INTEGER NOT NULL,
        operator TEXT,
        tag TEXT,
        label TEXT,
        sold INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Admin users table
    db.run(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'admin',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login DATETIME
      )
    `, (err) => {
      if (!err) {
        // Insert default admin user if not exists
        const adminPassword = bcrypt.hashSync('admin123', 10);
        db.run(
          'INSERT OR IGNORE INTO admin_users (username, password, role) VALUES (?, ?, ?)',
          ['admin', adminPassword, 'admin'],
          (err) => {
            if (!err) {
              console.log('Default admin user ensured');
            }
          }
        );
      }
    });

    // Audit logs table
    db.run(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        admin_username TEXT NOT NULL,
        action TEXT NOT NULL,
        number_id TEXT,
        old_value TEXT,
        new_value TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        ip_address TEXT,
        FOREIGN KEY(number_id) REFERENCES numbers(id)
      )
    `);

    // Session logs table
    db.run(`
      CREATE TABLE IF NOT EXISTS session_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        admin_username TEXT NOT NULL,
        login_time DATETIME DEFAULT CURRENT_TIMESTAMP,
        logout_time DATETIME,
        ip_address TEXT,
        user_agent TEXT
      )
    `);
  });
}

module.exports = db;
