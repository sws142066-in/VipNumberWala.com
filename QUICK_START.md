# ⚡ QUICK START GUIDE

## 🚀 Start Backend Server - 3 Easy Steps

### Option 1: Using Batch File (Windows - Easiest)
```
1. Open File Explorer
2. Go to: WEB DEVELOPMENT PRACTICE/server
3. Double-click: start-server.bat
4. Server will start automatically
```

### Option 2: Using PowerShell
```powershell
# 1. Open PowerShell
# 2. Navigate to server folder
cd "C:\Users\Lalit\OneDrive\Desktop\WEB DEVELOPMENT PRACTICE\server"

# 3. Run startup script
.\start-server.ps1

# If you get execution policy error, run:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Option 3: Manual (Terminal)
```bash
# Navigate to server folder
cd server

# Install dependencies (first time only)
npm install

# Start server
npm start
```

---

## ✅ Verify Server is Running

You should see:
```
========================================
  LifetimeNumber Admin Server Started
========================================
  Server running on: http://localhost:5000
```

**If you see this, the backend is working! ✓**

---

## 🔐 Login to Admin Panel

1. Open `booking.html` in your browser
2. Scroll to the bottom of the page
3. Click the **🔐 ADMIN** button
4. A login modal will appear
5. Enter:
   - **Username**: `admin`
   - **Password**: `admin123`
6. Click **Login**

---

## 📋 Admin Features

After logging in, you can:

- ✅ **View all numbers** in a table
- ✅ **Edit number** - Click the pencil icon
- ✅ **Delete number** - Click the X button
- ✅ **Toggle sold** - Mark numbers as sold/available
- ✅ **View audit logs** - See who changed what
- ✅ **Download backup** - Export numbers as JSON

---

## 🔧 Troubleshooting

### "Connection refused" error?
- **Solution**: Backend not running
- **Fix**: Run `start-server.bat` or `npm start`

### Login button doesn't work?
- **Solution**: Server is not responding
- **Check**: Port 5000 is not blocked by firewall
- **Fix**: Restart server with `npm start`

### "Cannot GET /api/auth/login"?
- **Solution**: Express server not started
- **Fix**: Make sure you see the startup message

### Port 5000 already in use?
```powershell
# Find and kill process using port 5000
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force
```

---

## 🛑 Stop Server

Press **CTRL + C** in the terminal

---

## 📁 Files Structure

```
server/
├── start-server.bat      ← Windows batch (double-click to start)
├── start-server.ps1      ← PowerShell script
├── server.js             ← Main server
├── database.js           ← Database setup
├── package.json          ← Dependencies
├── .env                  ← Configuration (created)
├── middleware/auth.js    ← Authentication
├── routes/
│   ├── auth.js
│   ├── admin.js
│   ├── numbers.js
│   └── audit.js
├── data/
│   └── lifetime_numbers.db  ← Database (auto-created)
└── README.md
```

---

## 🎯 Next Steps

1. ✅ Run `start-server.bat` (or use npm start)
2. ✅ Open booking.html
3. ✅ Click 🔐 ADMIN button
4. ✅ Login with admin/admin123
5. ✅ Manage your numbers securely!

---

## ⚠️ Important Notes

- **ALWAYS change default password** after first login
- **Keep JWT_SECRET secret** (.env file)
- **Backup your database** regularly
- **Check audit logs** to monitor activity

---

Good luck! Let me know if you need help. 🚀
