# Deployment Guide - Clothing Brand E-commerce

## 🚀 Backend Deployment on Render

### Step 1: Prepare Your Backend

1. Make sure your backend code is pushed to GitHub
2. Ensure `render.yaml` is in the Backend folder

### Step 2: Create Render Account & Deploy

1. Go to [render.com](https://render.com) and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select your repository and branch

### Step 3: Configure Build Settings

- **Name**: `clothing-brand-api`
- **Region**: Choose closest to your users
- **Branch**: `main` (or your default branch)
- **Root Directory**: `Backend`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### Step 4: Add Environment Variables

Go to "Environment" tab and add these variables:

```
NODE_ENV=production
PORT=5000
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY=your-firebase-private-key
FIREBASE_CLIENT_EMAIL=your-firebase-client-email
JWT_SECRET=generate-a-random-string
CORS_ORIGIN=https://your-netlify-site.netlify.app
```

**Important for FIREBASE_PRIVATE_KEY:**
- In Firebase Console, go to Project Settings → Service Accounts
- Generate new private key (downloads a JSON file)
- Copy the `private_key` value (keep the quotes and \n characters)

### Step 5: Deploy

1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes first time)
3. Your API will be available at: `https://your-app-name.onrender.com`

---

## 🌐 Frontend Deployment on Netlify

### Step 1: Prepare Your Frontend

1. Make sure your frontend code is pushed to GitHub
2. Ensure `netlify.toml` is in the root directory

### Step 2: Update Environment Variables Locally

Create `Frontend/.env.production`:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
VITE_API_URL=https://your-render-app.onrender.com/api
```

### Step 3: Create Netlify Account & Deploy

1. Go to [netlify.com](https://netlify.com) and sign up/login
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub repository
4. Select your repository

### Step 4: Configure Build Settings

- **Base directory**: `Frontend`
- **Build command**: `npm run build`
- **Publish directory**: `Frontend/dist`
- **Node version**: `18` (or higher)

### Step 5: Add Environment Variables

Go to "Site settings" → "Environment variables" and add all the `VITE_*` variables from above.

### Step 6: Deploy

1. Click "Deploy site"
2. Wait for build (3-5 minutes)
3. Your site will be available at: `https://random-name.netlify.app`
4. You can change the site name in "Site settings" → "Site details"

### Step 7: Update Backend CORS

Go back to Render and update the `CORS_ORIGIN` environment variable with your actual Netlify URL:

```
CORS_ORIGIN=https://your-actual-site.netlify.app
```

Then trigger a redeploy on Render.

---

## 🔄 Continuous Deployment

Both platforms are now set up for automatic deployment:

- **Push to GitHub** → Automatically deploys to Render (backend) and Netlify (frontend)
- **Preview deployments** available for pull requests on Netlify

---

## 🧪 Testing Deployment

### Backend Health Check
Visit: `https://your-render-app.onrender.com/api/health`

Should return:
```json
{
  "status": "ok",
  "timestamp": "..."
}
```

### Frontend Check
Visit: `https://your-netlify-site.netlify.app`

Should load the home page properly.

### Test API Connection
1. Open browser console on your Netlify site
2. Should see: `🔗 API Base URL: https://your-render-app.onrender.com/api/v1`
3. Try logging in or viewing products

---

## ⚠️ Important Notes

1. **Free Tier Limitations:**
   - Render: Service spins down after inactivity, first request may be slow (30s)
   - Netlify: 100GB bandwidth/month, 300 build minutes/month

2. **Firebase Rules:**
   - Update Firebase Security Rules to allow your Netlify domain
   - Add to authorized domains in Firebase Console

3. **Images:**
   - Backend stores images locally in Render (will be lost on redeploy)
   - Consider using Firebase Storage or Cloudinary for production

4. **Database:**
   - Firebase Firestore is already cloud-based ✅
   - No additional database setup needed

---

## 🐛 Troubleshooting

### Backend Issues

**Error: Cannot find module**
- Check `package.json` has all dependencies
- Trigger redeploy on Render

**CORS Error**
- Verify `CORS_ORIGIN` matches your Netlify URL exactly
- Include `https://` and no trailing slash

**Firebase Connection Failed**
- Check all Firebase environment variables are set correctly
- Verify FIREBASE_PRIVATE_KEY includes quotes and \n characters

### Frontend Issues

**Build Failed**
- Check all environment variables start with `VITE_`
- Verify Node version is 18 or higher

**API Requests Failing**
- Check `VITE_API_URL` is set correctly
- Verify backend is running on Render
- Check browser console for CORS errors

**Firebase Authentication Not Working**
- Verify all Firebase config values are correct
- Add Netlify domain to Firebase authorized domains

---

## 🎉 Success!

Your clothing brand e-commerce platform is now live!

- **Frontend**: https://your-site.netlify.app
- **Backend API**: https://your-api.onrender.com
- **Admin Panel**: https://your-site.netlify.app/admin

Share your live site URL and start selling! 🛍️
