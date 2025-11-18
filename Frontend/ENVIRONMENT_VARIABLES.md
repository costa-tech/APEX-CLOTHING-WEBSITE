# Frontend Environment Variables for Netlify

Add these environment variables in Netlify Dashboard:

## Required Variables (All must start with VITE_):

### 1. VITE_FIREBASE_API_KEY
- **Value**: Get from Firebase Console
- **Where to find**: 
  1. Firebase Console → Project Settings → General
  2. Scroll down to "Your apps" section
  3. Select your Web app or create one
  4. Copy the `apiKey` value
- **Example**: `AIzaSyBxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxX`

### 2. VITE_FIREBASE_AUTH_DOMAIN
- **Value**: Get from same Firebase config
- **Example**: `clothing-brand-12345.firebaseapp.com`
- **Where to find**: Same location, look for `authDomain`

### 3. VITE_FIREBASE_PROJECT_ID
- **Value**: Your Firebase project ID
- **Example**: `clothing-brand-12345`
- **Where to find**: Same location, look for `projectId`

### 4. VITE_FIREBASE_STORAGE_BUCKET
- **Value**: Firebase storage bucket URL
- **Example**: `clothing-brand-12345.firebasestorage.app`
- **Where to find**: Same location, look for `storageBucket`

### 5. VITE_FIREBASE_MESSAGING_SENDER_ID
- **Value**: Firebase messaging sender ID
- **Example**: `123456789012`
- **Where to find**: Same location, look for `messagingSenderId`

### 6. VITE_FIREBASE_APP_ID
- **Value**: Firebase app ID
- **Example**: `1:123456789012:web:abcdef1234567890abcdef`
- **Where to find**: Same location, look for `appId`

### 7. VITE_FIREBASE_MEASUREMENT_ID
- **Value**: Google Analytics measurement ID (optional)
- **Example**: `G-XXXXXXXXXX`
- **Where to find**: Same location, look for `measurementId`
- **Note**: Only if you enabled Google Analytics

### 8. VITE_API_URL
- **Value**: Your Render backend URL + /api/v1
- **Initial value**: `http://localhost:5000/api/v1`
- **Final value**: `https://your-render-app.onrender.com/api/v1`
- **IMPORTANT**: 
  - Include `https://`
  - Include `/api/v1` at the end
  - NO trailing slash after v1
  - Update this after deploying backend to Render!

---

## How to Get Firebase Config (Step by Step):

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click the gear icon ⚙️ → Project settings
4. Scroll down to "Your apps"
5. If you don't have a web app, click "Add app" → Web icon
6. Copy all the config values from the code snippet shown

Example Firebase config you'll see:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxX",
  authDomain: "clothing-brand-12345.firebaseapp.com",
  projectId: "clothing-brand-12345",
  storageBucket: "clothing-brand-12345.firebasestorage.app",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef",
  measurementId: "G-XXXXXXXXXX"
};
```

---

## How to Add in Netlify:

1. Go to your Netlify dashboard
2. Select your site
3. Go to "Site settings" → "Environment variables"
4. Click "Add a variable" → "Add a single variable"
5. For each variable above:
   - Enter the KEY (e.g., `VITE_FIREBASE_API_KEY`)
   - Enter the VALUE (the actual value from Firebase)
   - Select "Same value for all deploys"
   - Click "Create variable"

---

## Quick Copy Format for Netlify:

```
VITE_FIREBASE_API_KEY=AIzaSyBxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxX
VITE_FIREBASE_AUTH_DOMAIN=clothing-brand-12345.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=clothing-brand-12345
VITE_FIREBASE_STORAGE_BUCKET=clothing-brand-12345.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890abcdef
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_API_URL=https://your-render-app.onrender.com/api/v1
```

**Replace the placeholder values with your actual Firebase config values!**

---

## After Adding Variables:

1. Click "Save" in Netlify
2. Go to "Deploys" tab
3. Click "Trigger deploy" → "Deploy site"
4. Wait 3-5 minutes for build to complete
5. Check deploy logs for any errors

---

## Important Notes:

- **ALL frontend variables MUST start with `VITE_`** (Vite requirement)
- Environment variables are embedded during build time
- If you change a variable, you must trigger a new deploy
- These variables will be visible in the browser (public)
- Never put secrets in frontend environment variables!
