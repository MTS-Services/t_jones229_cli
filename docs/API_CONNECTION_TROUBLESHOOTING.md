# API Connection Troubleshooting Guide

## Problem: FETCH_ERROR when Login/Register

If you see an error like this in the console:
```
{status: 'FETCH_ERROR', endpoint: '/auth/login', possibleCause: 'Network/CORS issue'}
```

This means the frontend cannot connect to the backend API.

---

## ✅ Solution: Start the Backend API

### Step 1: Open a new terminal

### Step 2: Navigate to the API folder
```bash
cd api
```

### Step 3: Install dependencies (if not already done)
```bash
npm install
```

### Step 4: Start the backend server
```bash
npm run dev
```

You should see output like:
```
🚀 Server is running on http://localhost:3001
✅ Database connected successfully
```

### Step 5: Keep the backend running while testing

The backend must stay running in its own terminal while you use the frontend.

---

## 🔧 Configuration Check

### 1. Check Frontend Environment Variables

File: `cli/.env.local`

Ensure you have:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 2. Check Backend CORS Settings

File: `api/src/app.ts`

The CORS configuration should include your frontend URL:
```typescript
app.use(
  cors({
    origin: [
      'http://localhost:3000',  // Frontend URL
      'http://localhost:3001',  // Backend URL
    ],
    credentials: true,
  })
);
```

### 3. Verify Port Numbers

- **Frontend**: Runs on `http://localhost:3000` (Next.js default)
- **Backend**: Runs on `http://localhost:3001` (configured in API)

---

## 🚀 Quick Start Script

To run both frontend and backend together, use two terminals:

**Terminal 1 (Backend):**
```bash
cd api
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd cli
npm run dev
```

---

## ⚠️ Common Issues

### Issue 1: Port Already in Use
**Error:** `Port 3001 is already in use`

**Solution:**
1. Kill the process using port 3001:
   ```bash
   # Windows
   netstat -ano | findstr :3001
   taskkill /PID <PID> /F
   
   # Mac/Linux
   lsof -ti:3001 | xargs kill -9
   ```

2. Or change the port in `api/src/server.ts`

### Issue 2: Database Connection Failed
**Error:** `Database connection error`

**Solution:**
1. Check your database is running (PostgreSQL/MySQL/MongoDB)
2. Verify connection string in `api/.env`
3. Run database migrations if needed

### Issue 3: Module Not Found
**Error:** `Cannot find module...`

**Solution:**
```bash
cd api
rm -rf node_modules
npm install
```

---

## 📝 Improved Error Messages

The app now shows user-friendly error messages:

- **Before:** Generic "Something went wrong"
- **After:** "⚠️ Cannot connect to server. Please ensure the API is running on http://localhost:3001"

Console logs will also show:
```
🔴 API Connection Error: Make sure your backend API is running!
💡 Run 'cd api && npm run dev' to start the backend server
```

---

## 🎯 Testing Connection

To verify the API is running, open `http://localhost:3001` in your browser. You should see a response from the API (not an error page).

You can also test a specific endpoint:
```bash
curl http://localhost:3001/api/v1/users/me
```

---

## 📞 Need Help?

If you still experience issues after following this guide:

1. Check backend terminal for error messages
2. Check frontend browser console for errors
3. Verify all environment variables are set correctly
4. Ensure no firewall is blocking ports 3000 or 3001
