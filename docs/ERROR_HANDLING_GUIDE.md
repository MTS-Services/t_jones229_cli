# Error Handling Guide

## Overview
This document explains the comprehensive error handling system implemented in the application to help developers and users understand API connection issues.

## Error Types

### 1. FETCH_ERROR
**When it occurs:**
- Backend API server is not running
- Network connectivity issues
- CORS configuration problems
- Wrong API endpoint URL

**User sees:**
```
⚠️ Cannot connect to server. Please ensure the API is running on http://localhost:3001
```

**Console output:**
```
🔴 API Connection Error: Make sure your backend API is running!
💡 Run 'cd api && npm run dev' to start the backend server
```

**How to fix:**
1. Check if backend is running: `cd api && npm run dev`
2. Verify API URL in `.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1`
3. Ensure no firewall blocking localhost:3001
4. Check CORS settings in backend

---

### 2. TIMEOUT_ERROR
**When it occurs:**
- Backend is running but responding too slowly (>30 seconds)
- Heavy database queries
- Unoptimized endpoints
- Server overload

**User sees:**
```
⏱️ Request timed out. The server is taking too long to respond.
```

**Console output:**
```
🔴 API Timeout Error: Backend is running but responding too slowly!
💡 Check backend terminal for errors or restart: cd api && npm run dev
Timeout: No response within 30 seconds
```

**How to fix:**
1. Check backend terminal for errors
2. Verify database connection is fast
3. Look for slow queries in logs
4. Restart backend: `cd api && npm run dev`
5. Consider increasing timeout in `baseApi.ts` if needed
6. Optimize slow endpoints

---

## Implementation Details

### Base API Configuration
File: `cli/src/services/baseApi.ts`

```typescript
const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  timeout: 30000, // 30 seconds
  // ... other config
});

const baseQueryWithHandling = async (args, api, extraOptions) => {
  try {
    const result = await rawBaseQuery(args, api, extraOptions);
    
    // Handle FETCH_ERROR
    if (result.error && result.error.status === "FETCH_ERROR") {
      console.error("🔴 API Connection Error");
      console.error("Possible causes:");
      console.error("  1. Backend server not running");
      console.error("  2. Wrong API URL");
      console.error("  3. CORS issues");
      console.error("Solution: cd api && npm run dev");
      return result;
    }
    
    return result;
  } catch (error: any) {
    // Handle TIMEOUT_ERROR
    if (error.name === "TimeoutError" || error.message?.includes("timeout")) {
      console.error("🔴 API Timeout Error");
      console.error("Endpoint:", args);
      console.error("Timeout: No response within 30 seconds");
      console.error("Possible causes:");
      console.error("  1. Backend responding too slowly");
      console.error("  2. Database queries taking too long");
      // ... more logging
      return {
        error: {
          status: "TIMEOUT_ERROR",
          data: { message: "Request timed out" },
        },
      };
    }
    throw error;
  }
};
```

### Component Error Handling
Files: 
- `cli/src/components/Auth/Login.tsx`
- `cli/src/app/(auth)/signup/page.tsx`

```typescript
try {
  const res = await loginMutation(data).unwrap();
  // ... success handling
} catch (error: any) {
  let errorMessage = "Login failed. Please try again.";

  if (error?.status === "FETCH_ERROR") {
    errorMessage = "⚠️ Cannot connect to server...";
    console.error("🔴 API Connection Error");
    console.error("💡 Run 'cd api && npm run dev'");
  } else if (error?.status === "TIMEOUT_ERROR") {
    errorMessage = "⏱️ Request timed out...";
    console.error("🔴 API Timeout Error");
    console.error("💡 Check backend terminal for errors");
  } else if (error?.data?.message) {
    errorMessage = error.data.message;
  }

  toast.error(errorMessage, { autoClose: 5000 });
}
```

---

## Debugging Steps

### If you see FETCH_ERROR:

1. **Check backend status:**
   ```bash
   # In terminal 1
   cd api
   npm run dev
   ```

2. **Verify environment:**
   ```bash
   # Check .env.local
   cat cli/.env.local
   # Should have: NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
   ```

3. **Test API directly:**
   ```bash
   curl http://localhost:3001/api/v1/health
   ```

4. **Check logs:**
   - Frontend console (browser DevTools)
   - Backend terminal output

---

### If you see TIMEOUT_ERROR:

1. **Check backend logs:**
   - Look for slow query warnings
   - Check for database connection issues
   - Look for unhandled errors

2. **Test endpoint performance:**
   ```bash
   # Time the API call
   time curl -X POST http://localhost:3001/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password"}'
   ```

3. **Database optimization:**
   - Add indexes to frequently queried columns
   - Optimize N+1 queries
   - Use query profiling tools

4. **Increase timeout (if justified):**
   ```typescript
   // In baseApi.ts, change timeout
   const rawBaseQuery = fetchBaseQuery({
     timeout: 60000, // Increase to 60 seconds
   });
   ```

5. **Check system resources:**
   - CPU usage
   - Memory usage
   - Database connection pool

---

## Best Practices

### For Developers:

1. **Always handle both error types** in components making API calls
2. **Provide clear console logs** with actionable solutions
3. **Show user-friendly messages** in the UI
4. **Test error scenarios** during development
5. **Monitor production timeouts** to identify slow endpoints

### For Users/Testers:

1. **Check browser console** for detailed error information
2. **Verify backend is running** before reporting bugs
3. **Include console logs** in bug reports
4. **Note the endpoint** that caused the error

---

## Files Modified

### Error Handling Implementation:
1. ✅ `cli/src/services/baseApi.ts` - Core error detection & logging
2. ✅ `cli/src/components/Auth/Login.tsx` - Login error handling
3. ✅ `cli/src/app/(auth)/signup/page.tsx` - Signup error handling

### Documentation:
1. ✅ `cli/API_CONNECTION_TROUBLESHOOTING.md` - Troubleshooting guide
2. ✅ `cli/ERROR_HANDLING_GUIDE.md` - This file

---

## Testing

To test error handling:

```typescript
// Test FETCH_ERROR
// 1. Stop backend server
// 2. Try to login/signup
// Expected: "Cannot connect to server" message

// Test TIMEOUT_ERROR
// 1. Add artificial delay in backend:
app.use((req, res, next) => {
  setTimeout(next, 35000); // 35 seconds > 30 second timeout
});
// 2. Try to login/signup
// Expected: "Request timed out" message
```

---

## Future Improvements

- [ ] Add retry mechanism for failed requests
- [ ] Implement exponential backoff
- [ ] Add offline mode detection
- [ ] Create error boundary for uncaught errors
- [ ] Add Sentry or similar error tracking
- [ ] Monitor API performance metrics
- [ ] Add loading indicators during slow requests
- [ ] Implement request cancellation on timeout

---

## Support

If you encounter errors not covered here:
1. Check browser console for detailed logs
2. Check backend terminal for error messages
3. Review API documentation: `api/docs/API_DOCUMENTATION.md`
4. Open an issue with console logs and steps to reproduce
