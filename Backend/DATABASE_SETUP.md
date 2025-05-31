# 🚀 Database Setup Guide

## Current Status: ✅ Server Running | ❌ Database Connection Issue

Your clothing e-commerce backend server is running successfully on port 5000, but there's a database connection issue that needs to be resolved.

## Issue: MongoDB Atlas IP Whitelist

**Error Message:** `Could not connect to any servers in your MongoDB Atlas cluster`

**Cause:** Your current IP address is not whitelisted in MongoDB Atlas

## 🔧 Solution Options

### Option 1: Whitelist Your IP in MongoDB Atlas (Recommended)

1. **Go to MongoDB Atlas Dashboard:**
   - Visit: https://cloud.mongodb.com
   - Log in with your credentials

2. **Navigate to Network Access:**
   - Click on "Network Access" in the left sidebar
   - Click "Add IP Address"

3. **Add Current IP:**
   - Click "Add Current IP Address" (easiest option)
   - Or manually add your IP address
   - Add description: "Development Machine"
   - Click "Confirm"

4. **Wait for Activation:**
   - Changes take 1-2 minutes to propagate
   - You'll see a green status indicator when ready

### Option 2: Allow Access from Anywhere (Development Only)

⚠️ **Warning:** Only use this for development/testing

1. In MongoDB Atlas Network Access
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere"
4. Enter `0.0.0.0/0` as the IP address
5. Click "Confirm"

### Option 3: Use Local MongoDB (Alternative)

If you prefer a local database:

```bash
# Install MongoDB locally (Windows)
# Download from: https://www.mongodb.com/try/download/community

# Or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

Then update your `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/clothing-ecommerce
```

## 🧪 Testing After Database Fix

Once your IP is whitelisted, run these commands:

```bash
# Test the database connection
node test-api.js

# Or run the seed script to populate initial data
npm run seed
```

## 📊 Expected Test Results

After database connection is restored:

✅ Health Check  
✅ User Registration  
✅ User Login  
✅ User Profile  
✅ Product Operations  
✅ Cart Functionality  
✅ Search & Filtering  

## 🎯 Next Steps

1. **Fix Database Connection** (choose option above)
2. **Run API Tests** to verify everything works
3. **Seed Initial Data** for testing
4. **Test All Endpoints** with provided test script
5. **Deploy to Production** (optional)

## 📞 Need Help?

If you encounter issues:
1. Check MongoDB Atlas status
2. Verify your IP in Network Access
3. Ensure credentials are correct in `.env`
4. Restart the server after changes

---

**Current Server Status:** 🟢 Running on http://localhost:5000  
**Database Status:** 🔴 Connection Blocked (IP Whitelist Issue)  
**Action Required:** Whitelist IP in MongoDB Atlas
