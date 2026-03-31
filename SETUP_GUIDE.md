# LifetimeNumber - Complete Secure Admin System Setup Guide

## Overview

Your application now has a complete 3-tier secure admin system:

1. **Backend Server** - Node.js/Express with JWT auth and SQLite
2. **Enhanced Frontend** - Secure admin panel with token management
3. **Audit System** - Complete logging of all admin activities

## Quick Start

### Step 1: Start Backend Server

```bash
# Navigate to server folder
cd server

# Install dependencies (first time only)
npm install

# Start the server
npm start
```

Expected output:
```
========================================
  LifetimeNumber Admin Server Started
========================================
  Server running on: http://localhost:5000
```

### Step 2: Update Frontend Configuration

In your booking.html file, look for the API configuration section at the top of the `<script>` tag and ensure it has:

```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

### Step 3: Open the Application

Open `booking.html` in your browser. 

**Important**: The admin features now require backend authentication.

## Admin Login

1. Click the **"🔐 ADMIN"** button in the footer
2. A login modal will appear
3. Enter credentials:
   - **Username**: `admin`
   - **Password**: `admin123`
4. After successful login, you can manage numbers and view audit logs

## Features

### Enhanced Admin Panel

✅ **Login System** - JWT token-based authentication  
✅ **Number Management** - Add, edit, delete, toggle sold status  
✅ **Real-time sync** - Changes saved to backend automatically  
✅ **Audit Viewer** - See all changes with admin name, timestamp, IP  
✅ **Session Tracking** - Know when admins logged in/out  

### Security Features

- JWT tokens with 24-hour expiration
- Password hashing with BCrypt
- Role-based access control
- IP address logging
- User agent tracking
- No sensitive data in error messages
- CORS protection

### Audit Logging

Every change is logged with:
- Admin username
- Action type (CREATE, UPDATE, DELETE, TOGGLE_SOLD)
- Previous value
- New value
- Timestamp
- IP address

View audit logs by clicking "📋 Audit Logs" button in admin panel.

## Database Initialization

The backend automatically creates and initializes:
- ✅ SQLite database in `server/data/lifetime_numbers.db`
- ✅ All required tables
- ✅ Default admin user

## File Structure

```
WEB DEVELOPMENT PRACTICE/
├── booking.html                  (Updated with backend integration)
├── server/                       (New - Backend)
│   ├── server.js                (Main server file)
│   ├── database.js              (SQLite setup)
│   ├── package.json             (Dependencies)
│   ├── .env.example             (Configuration template)
│   ├── middleware/
│   │   └── auth.js              (JWT authentication)
│   ├── routes/
│   │   ├── auth.js              (Login/logout)
│   │   ├── admin.js             (Number management)
│   │   ├── numbers.js           (Public API)
│   │   └── audit.js             (Audit logs)
│   ├── data/
│   │   └── lifetime_numbers.db  (Database file - auto-created)
│   └── README.md                (Backend documentation)
```

## Admin Panel Functions

### Manage Numbers
- **Edit Number** - Click pencil icon to edit any number
- **Delete Number** - Click trash icon to remove number
- **Toggle Sold** - Mark numbers as sold/available
- **Add Number** - Use "Add New Number" form

### View Changes
- **Audit Logs** - See who changed what and when
- **Session Logs** - Track admin login/logout times
- **Statistics** - View top admins and action history

## API Endpoints (Admin Access)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/login` | Admin login |
| POST | `/api/auth/logout` | Admin logout |
| GET | `/api/admin/numbers` | Get all numbers |
| POST | `/api/admin/numbers` | Add number |
| PUT | `/api/admin/numbers/:id` | Update number |
| DELETE | `/api/admin/numbers/:id` | Delete number |
| PATCH | `/api/admin/numbers/:id/toggle-sold` | Toggle sold |
| GET | `/api/audit/logs` | View audit logs |
| GET | `/api/audit/stats` | View statistics |

## Troubleshooting

### Admin Button Not Working

**Problem**: Backend not running
**Solution**: 
```bash
cd server
npm start
```

**Problem**: Wrong API URL
**Solution**: Check `API_BASE_URL` in booking.html matches server port

### Login Failed

**Problem**: Incorrect credentials
**Solution**: Use `admin` / `admin123`

**Problem**: CORS error
**Solution**: Ensure backend is running on port 5000

**Problem**: Token expired
**Solution**: Login again (tokens expire after 24 hours)

### Database Issues

**Problem**: Database locked
**Solution**: Restart backend server

**Problem**: Database not created
**Solution**: Server automatically creates it on first run

## Security Best Practices (Important!)

### Before Going Live

1. **Change Admin Password**
   ```javascript
   // Login and use admin panel to change password
   ```

2. **Update JWT Secret**
   - Edit `server/.env`
   - Change `JWT_SECRET` to a long random string

3. **Enable HTTPS**
   - Use SSL certificates
   - Update `CORS_ORIGIN` to HTTPS URL

4. **Change Default Credentials**
   - Delete default admin user
   - Create new admin with strong password

5. **Database Backups**
   - Backup `server/data/lifetime_numbers.db` regularly
   - Keep copies secure

6. **Monitor Audit Logs**
   - Regularly check audit logs
   - Alert on suspicious activities
   - Monitor IP addresses

7. **Session Security**
   - Use secure cookies
   - Implement session timeout
   - Log out inactive sessions

## Backend Commands

```bash
# Start server
npm start

# Install dependencies
npm install

# Check version
npm list

# View database
sqlite3 data/lifetime_numbers.db
```

## Frontend Integration Example

The frontend automatically handles:
- Login/logout
- Token storage in sessionStorage
- Automatic token refresh
- Error handling with user-friendly messages
- Admin function calls with authorization

## Monitoring Admin Activity

Check audit logs to see:
- Which admin made changes
- Exactly what changed
- When the change was made
- What IP address they used

Example log entry:
```
Admin: admin
Action: UPDATE
Number: n1
Previous: {price: 10000}
New: {price: 12000}
Timestamp: 2024-01-15 14:30:45
IP: 192.168.1.100
```

## Support & Maintenance

### Regular Maintenance Tasks

1. **Weekly**: Review audit logs
2. **Monthly**: Backup database
3. **Quarterly**: Update credentials
4. **Quarterly**: Review access logs

### Emergency Procedures

If unauthorized access detected:
1. Stop the server immediately
2. Review audit logs for suspicious activity
3. Change all admin credentials
4. Backup database before making changes
5. Restart server with clean database if needed

## Next Steps

1. ✅ Start backend server (`cd server && npm start`)
2. ✅ Open booking.html in browser
3. ✅ Click admin button and login
4. ✅ Change default admin password
5. ✅ Update JWT_SECRET in `.env`
6. ✅ Configure production settings

Enjoy your secure admin system! 🔒
