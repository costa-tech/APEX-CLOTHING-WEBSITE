# 🚀 Quick Setup Guide

Follow these steps to get your Clothing Brand Backend up and running in minutes!

## Step 1: Install Node.js

Make sure you have Node.js installed (v14 or higher).

Check your version:
```bash
node --version
npm --version
```

If not installed, download from: https://nodejs.org/

## Step 2: Install Dependencies

Open PowerShell in the Backend folder and run:

```powershell
cd "C:\Users\COSTA\Desktop\Clothing Brand\Backend"
npm install
```

This will install all required packages:
- express
- firebase-admin
- cors
- helmet
- and more...

## Step 3: Setup Firebase

### 3.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Name your project (e.g., "clothing-brand")
4. Follow the setup wizard

### 3.2 Enable Firestore Database

1. In Firebase Console, go to "Firestore Database"
2. Click "Create Database"
3. Choose "Start in production mode"
4. Select your preferred location

### 3.3 Enable Firebase Authentication

1. Go to "Authentication" in Firebase Console
2. Click "Get Started"
3. Enable "Email/Password" sign-in method

### 3.4 Get Service Account Credentials

**Option A: Download Service Account File (Easiest)**

1. Go to Project Settings (⚙️ icon)
2. Click "Service Accounts" tab
3. Click "Generate New Private Key"
4. Save the JSON file as `firebase-service-account.json`
5. Place it in the Backend folder
6. Your folder should look like:
   ```
   Backend/
   ├── firebase-service-account.json  ← Add this file here
   ├── server.js
   ├── package.json
   └── ...
   ```

**Option B: Use Environment Variables**

If you prefer not to download the file, copy the credentials from the JSON and add them to your `.env` file (see Step 4).

## Step 4: Configure Environment Variables

### 4.1 Create .env file

Copy the example file:
```powershell
copy .env.example .env
```

### 4.2 Edit .env file

Open `.env` in a text editor and configure:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Firebase Configuration (if using service account file)
FIREBASE_SERVICE_ACCOUNT=./firebase-service-account.json

# OR (if using environment variables)
# FIREBASE_PROJECT_ID=your-project-id
# FIREBASE_PRIVATE_KEY_ID=your-private-key-id
# FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
# FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
# FIREBASE_CLIENT_ID=your-client-id
# FIREBASE_CLIENT_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/...

# Frontend URL (update if your frontend runs on different port)
FRONTEND_URL=http://localhost:5173

# Upload Configuration (optional, these are defaults)
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp,image/jpg
```

**Important:** If using the service account file, just set:
```env
FIREBASE_SERVICE_ACCOUNT=./firebase-service-account.json
```

That's it! The other Firebase variables are not needed.

## Step 5: Start the Server

### Development Mode (with auto-reload)

```powershell
npm run dev
```

### Production Mode

```powershell
npm start
```

You should see:
```
╔════════════════════════════════════════════════╗
║   🚀 Clothing Brand API Server                ║
║                                                ║
║   Server running on port: 5000                 ║
║   Environment: development                     ║
║   API Base URL: http://localhost:5000/api/v1   ║
╚════════════════════════════════════════════════╝
```

## Step 6: Test the API

Open your browser and go to:
```
http://localhost:5000/health
```

You should see:
```json
{
  "status": "success",
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456
}
```

## Step 7: Create Your First Admin User

### 7.1 Register a User

Use Postman, Thunder Client, or cURL:

```powershell
curl -X POST http://localhost:5000/api/v1/auth/register `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"admin@example.com\",\"password\":\"admin123\",\"name\":\"Admin User\"}'
```

### 7.2 Make User an Admin

#### Option A: Using Firebase Console

1. Go to Firebase Console > Firestore Database
2. Find the `users` collection
3. Click on your user document
4. Edit the `role` field to `"admin"`
5. Save

#### Option B: Using Node.js Script

Create a file `scripts/makeAdmin.js`:

```javascript
const admin = require('firebase-admin');
const serviceAccount = require('../firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const makeAdmin = async (email) => {
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { role: 'admin' });
    await admin.firestore().collection('users').doc(user.uid).update({ role: 'admin' });
    console.log('✅ User is now an admin!');
  } catch (error) {
    console.error('❌ Error:', error);
  }
  process.exit();
};

makeAdmin('admin@example.com');
```

Run it:
```powershell
node scripts/makeAdmin.js
```

## Step 8: Connect Frontend

Update your frontend API configuration to point to:
```
http://localhost:5000/api/v1
```

In your frontend's `.env` file:
```env
VITE_API_URL=http://localhost:5000/api/v1
```

## 🎉 You're All Set!

Your backend is now running and ready to use!

## 📚 Next Steps

1. **Read API Documentation**: Check `API_DOCUMENTATION.md` for all endpoints
2. **Test Endpoints**: Use Postman or Thunder Client to test
3. **Connect Frontend**: Update frontend to use the API
4. **Add Products**: Use the admin panel to add products
5. **Deploy**: When ready, deploy to your hosting service

## 🐛 Troubleshooting

### Issue: "Firebase Admin initialization error"

**Solution:**
- Check that your `firebase-service-account.json` file is in the Backend folder
- Verify the path in `.env` is correct: `FIREBASE_SERVICE_ACCOUNT=./firebase-service-account.json`
- Make sure the JSON file is valid

### Issue: "CORS error"

**Solution:**
- Check that `FRONTEND_URL` in `.env` matches your frontend URL
- Make sure your frontend is running on the correct port

### Issue: "Module not found"

**Solution:**
```powershell
npm install
```

### Issue: "Port 5000 already in use"

**Solution:**
Change the port in `.env`:
```env
PORT=5001
```

### Issue: "Cannot find module 'uuid'"

**Solution:**
```powershell
npm install uuid
```

## 📞 Need Help?

- Check the main `README.md` for detailed documentation
- Review `API_DOCUMENTATION.md` for API usage
- Check Firebase Console for database issues
- Verify all environment variables are set correctly

## 🔒 Security Checklist

Before deploying to production:

- [ ] Change default passwords
- [ ] Set strong Firebase rules
- [ ] Enable HTTPS
- [ ] Set `NODE_ENV=production`
- [ ] Add `.env` to `.gitignore` (already done)
- [ ] Never commit `firebase-service-account.json`
- [ ] Enable Firebase App Check
- [ ] Set up proper CORS origins
- [ ] Enable rate limiting (already configured)
- [ ] Review and test all endpoints

---

**Happy Coding! 🚀**
