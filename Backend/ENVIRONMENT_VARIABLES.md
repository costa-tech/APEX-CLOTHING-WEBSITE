# Backend Environment Variables for Render

Add these environment variables in Render Dashboard:

## Required Variables:

### 1. NODE_ENV
- **Value**: `production`
- **Description**: Sets Node.js environment to production mode

### 2. PORT
- **Value**: `5000`
- **Description**: Port for the Express server

### 3. FIREBASE_PROJECT_ID
- **Value**: Get from Firebase Console → Project Settings
- **Example**: `clothing-brand-12345`
- **Where to find**: Firebase Console → Project Settings → General → Project ID

### 4. FIREBASE_PRIVATE_KEY
- **Value**: Get from Firebase Service Account JSON
- **How to get**:
  1. Go to Firebase Console → Project Settings → Service Accounts
  2. Click "Generate New Private Key"
  3. Download the JSON file
  4. Copy the `private_key` value (include the quotes and \n)
- **Example**: `"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBg...\n-----END PRIVATE KEY-----\n"`
- **IMPORTANT**: Keep the quotes and \n characters exactly as they are!

### 5. FIREBASE_CLIENT_EMAIL
- **Value**: Get from the same Firebase Service Account JSON
- **Example**: `firebase-adminsdk-xxxxx@clothing-brand-12345.iam.gserviceaccount.com`
- **Where to find**: Same JSON file, look for `client_email`

### 6. JWT_SECRET
- **Value**: Generate a random secure string
- **How to generate**: Run this command in your terminal:
  ```powershell
  -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
  ```
- **Example**: `aB3dE7fG9hJ1kL4mN6pQ8rS0tU2vW5xY`
- **Note**: Should be at least 32 characters long

### 7. CORS_ORIGIN
- **Value**: Your Netlify site URL (will be provided after frontend deployment)
- **Initial value**: `https://localhost:5173`
- **Final value**: `https://your-site-name.netlify.app`
- **IMPORTANT**: 
  - Include `https://`
  - NO trailing slash
  - Update this after deploying frontend to Netlify!

---

## How to Add in Render:

1. Go to your Render dashboard
2. Select your web service
3. Click "Environment" in the left sidebar
4. For each variable above:
   - Click "Add Environment Variable"
   - Enter the NAME (left field)
   - Enter the VALUE (right field)
   - Click "Save Changes"

---

## Quick Copy Format for Render:

```
NODE_ENV=production
PORT=5000
FIREBASE_PROJECT_ID=your-project-id-here
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour-key-here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
JWT_SECRET=your-generated-secret-here
CORS_ORIGIN=https://your-netlify-site.netlify.app
```

**Replace the placeholder values with your actual values!**

---

## After Adding Variables:

1. Click "Save Changes" in Render
2. Render will automatically redeploy your service
3. Wait 5-10 minutes for deployment to complete
4. Check logs for any errors
