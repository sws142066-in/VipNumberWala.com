<<<<<<< HEAD
# 🎯 System Overview & Architecture

## 📊 How Your 3-Tier System Works

```
┌─────────────────────────────────────────────────────────────┐
│                    USER BROWSER                             │
│                  (booking.html)                             │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐ │
│  │              FRONTEND (HTML/CSS/JS)                  │ │
│  │                                                      │ │
│  │  • Customer view (numbers catalog)                   │ │
│  │  • Checkout flow                                     │ │
│  │  • 🔐 ADMIN button (login)                           │ │
│  │  • Admin panel (if logged in)                        │ │
│  └──────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                          ↕️ API Calls
                   (HTTP Requests/Responses)
                          
┌─────────────────────────────────────────────────────────────┐
│              BACKEND SERVER (Node.js)                       │
│            (localhost:5000)                                 │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐ │
│  │          EXPRESS.JS HTTP SERVER                      │ │
│  │                                                      │ │
│  │  Routes:                                             │ │
│  │  • /api/auth/login .................. JWT Auth       │ │
│  │  • /api/auth/logout                                 │ │
│  │  • /api/admin/numbers .............. CRUD Ops       │ │
│  │  • /api/audit/logs ................. Audit Trail     │ │
│  │  • /api/numbers .................... Public API      │ │
│  └──────────────────────────────────────────────────────┘ │
│                          ↕️
│  ┌──────────────────────────────────────────────────────┐ │
│  │        AUTHENTICATION & AUTHORIZATION                │ │
│  │                                                      │ │
│  │  • JWT Token validation                              │ │
│  │  • Password hashing (BCrypt)                         │ │
│  │  • Role-based access control                         │ │
│  │  • Session logging                                   │ │
│  └──────────────────────────────────────────────────────┘ │
│                          ↕️
│  ┌──────────────────────────────────────────────────────┐ │
│  │          DATABASE (SQLite)                           │ │
│  │      server/data/lifetime_numbers.db                 │ │
│  │                                                      │ │
│  │  Tables:                                             │ │
│  │  • admin_users (secure credentials)                  │ │
│  │  • numbers (VIP phone numbers)                       │ │
│  │  • audit_logs (complete change history)              │ │
│  │  • session_logs (login/logout tracking)              │ │
│  └──────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 Security Flow

```
1. CUSTOMER
   ├─ Browse numbers ✓
   └─ Cannot access admin functions ✗

2. ADMIN (NOT LOGGED IN)
   ├─ See 🔐 ADMIN button
   └─ Click → Login modal appears

3. ADMIN (LOGIN ATTEMPT)
   ├─ Enter username/password
   ├─ Server hashes password using BCrypt
   ├─ Compares with stored hash
   ├─ IF MATCH → Generate JWT token
   └─ IF NO MATCH → Show error

4. ADMIN (LOGGED IN)
   ├─ Store JWT token in browser
   ├─ Every admin action sends token
   ├─ Server verifies token
   ├─ IF VALID → Allow action + Log in audit table
   └─ IF INVALID → Reject + Logout

5. TOKEN EXPIRATION
   ├─ Token valid for 24 hours
   ├─ After 24h → Auto logout
   └─ Must login again
```

---

## 📁 Complete File Structure

```
WEB DEVELOPMENT PRACTICE/
│
├─ booking.html ........................ Main frontend application
├─ SETUP_GUIDE.md ...................... Setup instructions
├─ QUICK_START.md ...................... Easy startup guide
├─ CHECKLIST.md ........................ Verification checklist
│
└─ server/ ............................ Backend folder
   │
   ├─ server.js ....................... Main Express server
   ├─ database.js ..................... SQLite initialization
   ├─ package.json .................... NPM dependencies
   ├─ .env ............................ Configuration (CREATED)
   ├─ .env.example .................... Configuration template
   ├─ README.md ....................... Backend documentation
   ├─ start-server.bat ................ Windows batch startup
   ├─ start-server.ps1 ................ PowerShell startup
   │
   ├─ middleware/
   │  └─ auth.js ...................... JWT authentication
   │
   ├─ routes/
   │  ├─ auth.js ...................... Login/logout
   │  ├─ admin.js ..................... Number management
   │  ├─ numbers.js ................... Public API
   │  └─ audit.js ..................... Audit logs
   │
   ├─ data/
   │  └─ lifetime_numbers.db .......... Database (auto-created)
   │
   └─ node_modules/ ................... NPM packages (auto-created)
```

---

## 🚀 Complete Startup Process

```
1. USER ACTION
   └─ Double-click: server/start-server.bat

2. BATCH FILE EXECUTION
   ├─ Checks if Node.js installed
   ├─ Checks if package.json exists
   ├─ Checks if node_modules exists
   │  └─ If not → runs: npm install
   └─ Runs: npm start

3. SERVER STARTUP (npm start)
   ├─ Loads environment variables from .env
   ├─ Imports Express, SQLite, JWT
   ├─ Connects to database
   ├─ Initializes database tables
   ├─ Creates default admin user
   ├─ Starts listening on port 5000
   └─ Prints startup message

4. DATABASE INITIALIZATION
   ├─ Creates table: admin_users
   │  └─ Inserts default user: admin/admin123
   ├─ Creates table: numbers
   ├─ Creates table: audit_logs
   └─ Creates table: session_logs

5. SERVER READY
   ├─ Print: "Server running on port 5000"
   ├─ Frontend can now connect
   └─ Admin can login
```

---

## 🔄 Admin Login Flow

```
┌─ Frontend: User clicks 🔐 ADMIN ─┐
                                    ↓
                    [Login Modal Appears]
                                    ↓
              User enters: admin / admin123
                                    ↓
        Frontend sends POST /api/auth/login
                                    ↓
        ┌─ BACKEND: Verify Login ─┐
        │                         │
        ├─ Check username exists?
        │  └─ Query admin_users table
        │
        ├─ Check password match?
        │  └─ BCrypt.compare(input, hash)
        │
        ├─ Generate JWT token
        │  └─ Sign token with secret
        │
        ├─ Log session
        │  └─ Insert into session_logs
        │
        └─ Return token to frontend
                                    ↓
        Frontend stores token in sessionStorage
                                    ↓
        ┌─ Show Admin Panel ─┐
        │                    │
        ├─ List all numbers
        ├─ Edit/Delete buttons
        ├─ Audit logs viewer
        └─ Logout button
```

---

## ✨ Key Features Breakdown

### 1. Authentication (Tier 1 - Frontend)
- Login modal with username/password
- Token-based authentication
- Logout button

### 2. Authorization (Tier 2 - Backend)
- JWT token validation
- Admin role verification
- Per-endpoint security checks

### 3. Data Security (Tier 3 - Database)
- BCrypt password hashing
- Encrypted connections
- Audit trail of all changes

### 4. Audit Logging
```
Every admin action is logged:
{
  admin_username: "admin",
  action: "UPDATE",
  number_id: "n1",
  old_value: {price: 10000},
  new_value: {price: 12000},
  timestamp: "2024-01-15 14:30:45",
  ip_address: "192.168.1.100"
}
```

---

## 📊 API Endpoints

### Public Endpoints (No Auth)
```
GET  /api/numbers                    - Get available numbers
GET  /api/numbers/:id                - Get specific number
GET  /api/numbers/categories/list    - Get categories
GET  /api/health                     - Server health check
```

### Auth Endpoints (Login/Logout)
```
POST /api/auth/login                 - Admin login (returns JWT)
POST /api/auth/logout                - Admin logout
POST /api/auth/verify                - Verify token
GET  /api/auth/me                    - Get current admin info
```

### Admin Endpoints (JWT Required)
```
GET  /api/admin/numbers              - Get all numbers
GET  /api/admin/numbers/:id          - Get specific number
POST /api/admin/numbers              - Add new number
PUT  /api/admin/numbers/:id          - Update number
DELETE /api/admin/numbers/:id        - Delete number
PATCH /api/admin/numbers/:id/toggle-sold - Toggle sold status
```

### Audit Endpoints (JWT + Admin Required)
```
GET  /api/audit/logs                 - Get all audit logs
GET  /api/audit/logs/number/:id      - Logs for specific number
GET  /api/audit/logs/admin/:username - Logs by admin
GET  /api/audit/sessions             - Get session logs
GET  /api/audit/stats                - Get statistics
```

---

## 🎯 Ready to Use!

Everything is configured and ready:
- ✅ Backend files created
- ✅ Configuration complete
- ✅ Startup scripts ready
- ✅ Documentation included
- ✅ Just needs to be started!

**Next Step:** Read `QUICK_START.md` to begin!
=======
# 🎯 System Overview & Architecture

## 📊 How Your 3-Tier System Works

```
┌─────────────────────────────────────────────────────────────┐
│                    USER BROWSER                             │
│                  (booking.html)                             │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐ │
│  │              FRONTEND (HTML/CSS/JS)                  │ │
│  │                                                      │ │
│  │  • Customer view (numbers catalog)                   │ │
│  │  • Checkout flow                                     │ │
│  │  • 🔐 ADMIN button (login)                           │ │
│  │  • Admin panel (if logged in)                        │ │
│  └──────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                          ↕️ API Calls
                   (HTTP Requests/Responses)
                          
┌─────────────────────────────────────────────────────────────┐
│              BACKEND SERVER (Node.js)                       │
│            (localhost:5000)                                 │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐ │
│  │          EXPRESS.JS HTTP SERVER                      │ │
│  │                                                      │ │
│  │  Routes:                                             │ │
│  │  • /api/auth/login .................. JWT Auth       │ │
│  │  • /api/auth/logout                                 │ │
│  │  • /api/admin/numbers .............. CRUD Ops       │ │
│  │  • /api/audit/logs ................. Audit Trail     │ │
│  │  • /api/numbers .................... Public API      │ │
│  └──────────────────────────────────────────────────────┘ │
│                          ↕️
│  ┌──────────────────────────────────────────────────────┐ │
│  │        AUTHENTICATION & AUTHORIZATION                │ │
│  │                                                      │ │
│  │  • JWT Token validation                              │ │
│  │  • Password hashing (BCrypt)                         │ │
│  │  • Role-based access control                         │ │
│  │  • Session logging                                   │ │
│  └──────────────────────────────────────────────────────┘ │
│                          ↕️
│  ┌──────────────────────────────────────────────────────┐ │
│  │          DATABASE (SQLite)                           │ │
│  │      server/data/lifetime_numbers.db                 │ │
│  │                                                      │ │
│  │  Tables:                                             │ │
│  │  • admin_users (secure credentials)                  │ │
│  │  • numbers (VIP phone numbers)                       │ │
│  │  • audit_logs (complete change history)              │ │
│  │  • session_logs (login/logout tracking)              │ │
│  └──────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 Security Flow

```
1. CUSTOMER
   ├─ Browse numbers ✓
   └─ Cannot access admin functions ✗

2. ADMIN (NOT LOGGED IN)
   ├─ See 🔐 ADMIN button
   └─ Click → Login modal appears

3. ADMIN (LOGIN ATTEMPT)
   ├─ Enter username/password
   ├─ Server hashes password using BCrypt
   ├─ Compares with stored hash
   ├─ IF MATCH → Generate JWT token
   └─ IF NO MATCH → Show error

4. ADMIN (LOGGED IN)
   ├─ Store JWT token in browser
   ├─ Every admin action sends token
   ├─ Server verifies token
   ├─ IF VALID → Allow action + Log in audit table
   └─ IF INVALID → Reject + Logout

5. TOKEN EXPIRATION
   ├─ Token valid for 24 hours
   ├─ After 24h → Auto logout
   └─ Must login again
```

---

## 📁 Complete File Structure

```
WEB DEVELOPMENT PRACTICE/
│
├─ booking.html ........................ Main frontend application
├─ SETUP_GUIDE.md ...................... Setup instructions
├─ QUICK_START.md ...................... Easy startup guide
├─ CHECKLIST.md ........................ Verification checklist
│
└─ server/ ............................ Backend folder
   │
   ├─ server.js ....................... Main Express server
   ├─ database.js ..................... SQLite initialization
   ├─ package.json .................... NPM dependencies
   ├─ .env ............................ Configuration (CREATED)
   ├─ .env.example .................... Configuration template
   ├─ README.md ....................... Backend documentation
   ├─ start-server.bat ................ Windows batch startup
   ├─ start-server.ps1 ................ PowerShell startup
   │
   ├─ middleware/
   │  └─ auth.js ...................... JWT authentication
   │
   ├─ routes/
   │  ├─ auth.js ...................... Login/logout
   │  ├─ admin.js ..................... Number management
   │  ├─ numbers.js ................... Public API
   │  └─ audit.js ..................... Audit logs
   │
   ├─ data/
   │  └─ lifetime_numbers.db .......... Database (auto-created)
   │
   └─ node_modules/ ................... NPM packages (auto-created)
```

---

## 🚀 Complete Startup Process

```
1. USER ACTION
   └─ Double-click: server/start-server.bat

2. BATCH FILE EXECUTION
   ├─ Checks if Node.js installed
   ├─ Checks if package.json exists
   ├─ Checks if node_modules exists
   │  └─ If not → runs: npm install
   └─ Runs: npm start

3. SERVER STARTUP (npm start)
   ├─ Loads environment variables from .env
   ├─ Imports Express, SQLite, JWT
   ├─ Connects to database
   ├─ Initializes database tables
   ├─ Creates default admin user
   ├─ Starts listening on port 5000
   └─ Prints startup message

4. DATABASE INITIALIZATION
   ├─ Creates table: admin_users
   │  └─ Inserts default user: admin/admin123
   ├─ Creates table: numbers
   ├─ Creates table: audit_logs
   └─ Creates table: session_logs

5. SERVER READY
   ├─ Print: "Server running on port 5000"
   ├─ Frontend can now connect
   └─ Admin can login
```

---

## 🔄 Admin Login Flow

```
┌─ Frontend: User clicks 🔐 ADMIN ─┐
                                    ↓
                    [Login Modal Appears]
                                    ↓
              User enters: admin / admin123
                                    ↓
        Frontend sends POST /api/auth/login
                                    ↓
        ┌─ BACKEND: Verify Login ─┐
        │                         │
        ├─ Check username exists?
        │  └─ Query admin_users table
        │
        ├─ Check password match?
        │  └─ BCrypt.compare(input, hash)
        │
        ├─ Generate JWT token
        │  └─ Sign token with secret
        │
        ├─ Log session
        │  └─ Insert into session_logs
        │
        └─ Return token to frontend
                                    ↓
        Frontend stores token in sessionStorage
                                    ↓
        ┌─ Show Admin Panel ─┐
        │                    │
        ├─ List all numbers
        ├─ Edit/Delete buttons
        ├─ Audit logs viewer
        └─ Logout button
```

---

## ✨ Key Features Breakdown

### 1. Authentication (Tier 1 - Frontend)
- Login modal with username/password
- Token-based authentication
- Logout button

### 2. Authorization (Tier 2 - Backend)
- JWT token validation
- Admin role verification
- Per-endpoint security checks

### 3. Data Security (Tier 3 - Database)
- BCrypt password hashing
- Encrypted connections
- Audit trail of all changes

### 4. Audit Logging
```
Every admin action is logged:
{
  admin_username: "admin",
  action: "UPDATE",
  number_id: "n1",
  old_value: {price: 10000},
  new_value: {price: 12000},
  timestamp: "2024-01-15 14:30:45",
  ip_address: "192.168.1.100"
}
```

---

## 📊 API Endpoints

### Public Endpoints (No Auth)
```
GET  /api/numbers                    - Get available numbers
GET  /api/numbers/:id                - Get specific number
GET  /api/numbers/categories/list    - Get categories
GET  /api/health                     - Server health check
```

### Auth Endpoints (Login/Logout)
```
POST /api/auth/login                 - Admin login (returns JWT)
POST /api/auth/logout                - Admin logout
POST /api/auth/verify                - Verify token
GET  /api/auth/me                    - Get current admin info
```

### Admin Endpoints (JWT Required)
```
GET  /api/admin/numbers              - Get all numbers
GET  /api/admin/numbers/:id          - Get specific number
POST /api/admin/numbers              - Add new number
PUT  /api/admin/numbers/:id          - Update number
DELETE /api/admin/numbers/:id        - Delete number
PATCH /api/admin/numbers/:id/toggle-sold - Toggle sold status
```

### Audit Endpoints (JWT + Admin Required)
```
GET  /api/audit/logs                 - Get all audit logs
GET  /api/audit/logs/number/:id      - Logs for specific number
GET  /api/audit/logs/admin/:username - Logs by admin
GET  /api/audit/sessions             - Get session logs
GET  /api/audit/stats                - Get statistics
```

---

## 🎯 Ready to Use!

Everything is configured and ready:
- ✅ Backend files created
- ✅ Configuration complete
- ✅ Startup scripts ready
- ✅ Documentation included
- ✅ Just needs to be started!

**Next Step:** Read `QUICK_START.md` to begin!
>>>>>>> c1fa83321915ae30f05e62dfb9345c798d540322
