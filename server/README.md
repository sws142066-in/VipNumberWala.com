# LifetimeNumber Admin Backend

Secure admin backend server for managing premium VIP mobile numbers with JWT authentication and audit logging.

## Features

✅ **JWT Authentication** - Secure token-based authentication
✅ **Role-Based Access Control** - Admin-only endpoints
✅ **Audit Logging** - Complete change history with timestamps
✅ **Session Management** - Track admin logins and activity
✅ **SQLite Database** - File-based, no external DB needed
✅ **CORS Enabled** - Frontend integration ready
✅ **Password Hashing** - BCrypt with salt rounds

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Create Environment File

```bash
# Copy the example file
cp .env.example .env

# Edit .env and update JWT_SECRET to a secure random string
```

### 3. Start the Server

```bash
npm start
```

Server will run on `http://localhost:5000`

## Default Admin Credentials

```
Username: admin
Password: admin123
```

**⚠️ Important**: Change these credentials immediately after first login!

## API Endpoints

### Authentication

- `POST /api/auth/login` - Admin login
- `POST /api/auth/verify` - Verify JWT token
- `GET /api/auth/me` - Get current admin info
- `POST /api/auth/logout` - Logout

### Admin Operations

- `GET /api/admin/numbers` - Get all numbers
- `GET /api/admin/numbers/:id` - Get specific number
- `POST /api/admin/numbers` - Add new number
- `PUT /api/admin/numbers/:id` - Update number
- `DELETE /api/admin/numbers/:id` - Delete number
- `PATCH /api/admin/numbers/:id/toggle-sold` - Toggle sold status

### Public Numbers API

- `GET /api/numbers` - Get available numbers
- `GET /api/numbers/:id` - Get specific number
- `GET /api/numbers/categories/list` - Get categories

### Audit & Logs

- `GET /api/audit/logs` - Get all audit logs
- `GET /api/audit/logs/number/:id` - Get logs for number
- `GET /api/audit/logs/admin/:username` - Get logs by admin
- `GET /api/audit/sessions` - Get session logs
- `GET /api/audit/stats` - Get statistics

## Database Schema

### admin_users
- id (INTEGER PRIMARY KEY)
- username (TEXT UNIQUE)
- password (TEXT - BCrypt hashed)
- role (TEXT)
- created_at (DATETIME)
- last_login (DATETIME)

### numbers
- id (TEXT PRIMARY KEY)
- number (TEXT)
- category (TEXT)
- price (INTEGER)
- operator (TEXT)
- tag (TEXT)
- label (TEXT)
- sold (INTEGER - 0 or 1)
- created_at (DATETIME)
- updated_at (DATETIME)

### audit_logs
- id (INTEGER PRIMARY KEY)
- admin_username (TEXT)
- action (TEXT)
- number_id (TEXT)
- old_value (JSON)
- new_value (JSON)
- timestamp (DATETIME)
- ip_address (TEXT)

### session_logs
- id (INTEGER PRIMARY KEY)
- admin_username (TEXT)
- login_time (DATETIME)
- logout_time (DATETIME)
- ip_address (TEXT)
- user_agent (TEXT)

## Security Features

1. **Password Hashing** - BCrypt with 10 salt rounds
2. **JWT Tokens** - 24-hour expiration
3. **Role-Based Access** - Admin verification on all admin endpoints
4. **Audit Trail** - All changes logged with IP and timestamp
5. **CORS Protection** - Restricted to frontend origin
6. **Input Validation** - Required field checks
7. **Error Handling** - No sensitive information in error messages

## Production Deployment

Before deploying to production:

1. Change `JWT_SECRET` to a strong, random string
2. Update `CORS_ORIGIN` to your production domain
3. Change default admin credentials
4. Use HTTPS only
5. Set `NODE_ENV=production`
6. Configure database backups
7. Implement rate limiting
8. Set up SSL/TLS certificates
9. Use environment variables for sensitive data
10. Enable logging and monitoring

## Troubleshooting

**Port already in use**
```bash
# Change PORT in .env or kill process on port 5000
lsof -i :5000
kill -9 <PID>
```

**Database locked**
- Ensure only one instance of the server is running
- Delete `.db-wal` and `.db-shm` files if corrupted

**Authentication failed**
- Check JWT_SECRET matches between login and verification
- Verify token is being sent in Authorization header
- Check token hasn't expired (24 hours)

## Support

For issues or questions, check the frontend integration guide.
