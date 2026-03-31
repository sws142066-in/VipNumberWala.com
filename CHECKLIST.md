# ✅ Setup Verification Checklist

## 📦 Backend Files Status

Check these files exist in `server/` folder:

- ✅ `server.js` - Main server file
- ✅ `database.js` - SQLite database setup
- ✅ `package.json` - Dependencies list
- ✅ `.env` - Configuration file
- ✅ `start-server.bat` - Windows startup script
- ✅ `start-server.ps1` - PowerShell startup script
- ✅ `middleware/auth.js` - JWT authentication
- ✅ `routes/auth.js` - Login endpoints
- ✅ `routes/admin.js` - Admin operations
- ✅ `routes/numbers.js` - Public API
- ✅ `routes/audit.js` - Audit logging
- ✅ `data/` - Database folder (will be created)
- ✅ `README.md` - Backend documentation

## 🚀 First Time Setup

### Step 1: Install Node.js (if not installed)
```
Download from: https://nodejs.org/
Install the LTS version
```

### Step 2: Start Backend Server
**Option A - Windows Batch (EASIEST):**
```
Double-click: server/start-server.bat
```

**Option B - PowerShell:**
```powershell
cd server
.\start-server.ps1
```

**Option C - Command Line:**
```
cd server
npm install
npm start
```

### Step 3: Verify Server Started
Look for this output:
```
========================================
  LifetimeNumber Admin Server Started
========================================
  Server running on: http://localhost:5000
...
Default Admin Credentials:
- Username: admin
- Password: admin123
```

### Step 4: Open Frontend
1. Open `booking.html` in your browser
2. Scroll to bottom
3. Look for **"🔐 ADMIN"** button in footer

### Step 5: Login to Admin Panel
1. Click **🔐 ADMIN** button
2. Enter:
   - Username: `admin`
   - Password: `admin123`
3. Click **Login**

### Step 6: Manage Numbers
If login works, you can now:
- ✅ View all numbers in admin table
- ✅ Edit numbers by clicking pencil icon
- ✅ Delete numbers by clicking X
- ✅ Toggle sold status
- ✅ View audit logs

---

## 🔍 Troubleshooting

### Issue: "npm: command not found"
**Cause**: Node.js not installed or not in PATH  
**Fix**: Install Node.js from https://nodejs.org/

### Issue: Port 5000 already in use
**Cause**: Another application using port 5000  
**Fix**: 
```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force
npm start
```

### Issue: Admin button not visible
**Cause**: Frontend not loading or old cache  
**Fix**: 
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh (Ctrl+Shift+R)
- Reload page

### Issue: Login fails with error
**Cause**: Backend not responding  
**Fix**: Check if server is running on localhost:5000

### Issue: "Cannot find module"
**Cause**: Dependencies not installed  
**Fix**: Run `npm install` in server folder

---

## 📊 Database Verification

After first start, server creates:
- `server/data/lifetime_numbers.db` - SQLite database

To verify database:
```bash
cd server
node -e "const db = require('./database'); console.log('✓ Database connected');"
```

---

## 🎯 Test Admin Functions

After login, verify:

### 1. View Numbers
- [ ] Numbers appear in admin table
- [ ] Can see all number details
- [ ] Sold status shows correctly

### 2. Edit Number
- [ ] Click pencil icon on any number
- [ ] Edit field appears
- [ ] Changes save successfully
- [ ] Audit log shows the change

### 3. Delete Number
- [ ] Click X icon on any number
- [ ] Number disappears from list
- [ ] Confirmation appears (optional)

### 4. Toggle Sold
- [ ] Click status button
- [ ] Status changes from Available to Sold
- [ ] Number grays out on frontend

### 5. View Audit Logs
- [ ] Click "Audit Logs" button
- [ ] See list of changes
- [ ] Shows admin name, action, timestamp

---

## 🔐 Security Checklist

Before using in production:

- [ ] Backend server running
- [ ] Can login with admin/admin123
- [ ] Admin panel functional
- [ ] Database created successfully
- [ ] Changes logged in audit trail
- [ ] Frontend can manage numbers
- [ ] Logout button works
- [ ] Token expires after inactivity

---

## 📝 Configuration Files

**`.env` file contains:**
```
PORT=5000
NODE_ENV=development
JWT_SECRET=lifetime-number-secure-key-2024-change-in-production
DATABASE_PATH=./data/lifetime_numbers.db
CORS_ORIGIN=http://localhost:3000
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_PASSWORD=admin123
```

**All configuration is ready!** ✅

---

## 🎉 Complete!

When you see all checkmarks, your system is ready!

**Next:** Read `QUICK_START.md` for easy startup instructions.

Need help? Check backend `README.md` or `SETUP_GUIDE.md`
