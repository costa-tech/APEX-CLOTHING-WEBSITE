# 🔒 Backend Environment Variables - YOUR VALUES

## Copy these exact values to Render:

### 1. NODE_ENV
```
production
```

### 2. PORT
```
5000
```

### 3. FIREBASE_PROJECT_ID
```
clothing-brand-apex
```

### 4. FIREBASE_PRIVATE_KEY
⚠️ **IMPORTANT**: Copy the ENTIRE value below, including the quotes and \n characters!
```
"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDJhQS1pvjL2ZrN\niFvFLRKw+Q3kAjeyNugn6b+2mXfwzIe8nA77loVl3UvT5B+iiGdoxEOU3raNyJ8W\nptMacXwu6Jx918umkm+gc15NrWJwiJ8SG7XFBUH01EKOAi3aGwEtKXznPGfJpUkK\nGtZ2YIzG3Zp1fDodXcaEMeMsZU3yZKKFOJe8iLNgUBFebBoe45mBK4VQjC09Xo3u\nO8qz9LtGNtat5bMs5msjwhhRYzZ672gZwwdaZSPSEwzWbf9G5JqtEXUl34790uWl\njekwmSlCTIanKYxcbiIcQBr+ulV0AIr4UDP1Vjswxid2v5+SShDmbZS67EmxqHBY\nTIuGRg43AgMBAAECggEACPfK9FyIYOX/rhrd3qH5XXfP5vA0U1F/NluAJRuiS0yG\n091sC0UxDY3yFG1n/P8t/usRCNx6akfd0I+/AEPBn4LJiA4k6XZF0nGf5jwLj+98\niL1D8w8fVsplZdVx/e1KuZxJiy7UfZRF8lWsaps0WJs/BvBu06S7M2HW9sBRXjKJ\nC5jy/N1sxZxDpRjTtn0PiPhHrq9UmWpyCZW6TkukH/aPmydMeyA4ktOc008bLwqs\nVCnRxmtvQcM6LugEXSZB6oJ8zbV7LS3LHxw2V57DnvzjFst4jKZ+OUWgICVUu896\n+q78K/78XmFP1Vcy+JL8BxLqwO/b04zSZcxhQfwzFQKBgQDwPkdI6PMxlWUxNGB4\nZy0VQEHMsgCUfMjFQDAGY5Q0ysx68IJyCEoLYyyvzD98MOpTwWpoFkIhcZeCMrEY\nEMfgMqnyr9ZLkBda+z+/MHQd9gYev8Vwin3jRlJwdU2hOb5zGe0GF0IgApXaB2X4\nkQq/9gK2MBfMxinlk95B+NiGqwKBgQDWvJBDecvfW/cCoPDrpD8YPfHe+w9/7w8N\nGVRS3GKYVd/tx+3is8GpWUEhKipPwmr0lZnjqrqgqhWjSwWwpMmkbDylr6LtFiJj\nqDaZqrqYEbo4W2HiUNwGJxdH++OQW8UeN9WyPGyj/eVSmbMRt5Aa/tFRzjuDr8sW\nc/WW+63GpQKBgQDsY/t0jHMvqNbHUchS8QL1VCLqrYPQl/Bd1sjqoHUmdR47IgjY\n97sT9WP1Hz6gjukjvL9c5/nuOn1gSUzkZy6lNnTvLYHpHEE+7tZM4/p9uKVRAFXg\nZQV16q4XpfTa3Zy+WRZW1e/k22ZkAL+fk+hF9mW4qx3gCmUTVyptM9SqvQKBgA8G\nvumZ2kRVASHz9SfoJGoj24sI8nq3VcxK23W46kVSrQrMlL7qaUDaeA5EDxXpuuZG\nmbAuwESB4mW82DcWMO4KjOvjMHl6tQlYOgniwo/lnaxX6K+XjO35Sk3FOJVfdpm4\nuoFwbQHEwIlZLAivWawp7KfW0J9Ua9e0YZkhH3XpAoGADEU2G/7MpNxAvzuO1HND\n2jMUrWC4t63y0EjIHvZmG58jglouIuL5bFlJT4iaOEZN1l8GilfpDNzywEu2yEJu\nEklQ9mZsPyB6WCZhleYWDoVgifJdhhlLbjZfPrkwEeqjDXv9H9n3dbW2k5jxB9rG\n1RUGR7pNH5poLxHzdOky4NQ=\n-----END PRIVATE KEY-----\n"
```

### 5. FIREBASE_CLIENT_EMAIL
```
firebase-adminsdk-fbsvc@clothing-brand-apex.iam.gserviceaccount.com
```

### 6. JWT_SECRET
Generate a random secret by running this in PowerShell:
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```
Then paste the generated value here (keep it secret!)

### 7. CORS_ORIGIN
⚠️ **UPDATE THIS AFTER DEPLOYING FRONTEND!**
Initial value (for now):
```
http://localhost:5173
```

After deploying to Netlify, update to:
```
https://your-actual-site-name.netlify.app
```

---

## 📋 Quick Copy Format (for Render Dashboard):

```env
NODE_ENV=production
PORT=5000
FIREBASE_PROJECT_ID=clothing-brand-apex
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDJhQS1pvjL2ZrN\niFvFLRKw+Q3kAjeyNugn6b+2mXfwzIe8nA77loVl3UvT5B+iiGdoxEOU3raNyJ8W\nptMacXwu6Jx918umkm+gc15NrWJwiJ8SG7XFBUH01EKOAi3aGwEtKXznPGfJpUkK\nGtZ2YIzG3Zp1fDodXcaEMeMsZU3yZKKFOJe8iLNgUBFebBoe45mBK4VQjC09Xo3u\nO8qz9LtGNtat5bMs5msjwhhRYzZ672gZwwdaZSPSEwzWbf9G5JqtEXUl34790uWl\njekwmSlCTIanKYxcbiIcQBr+ulV0AIr4UDP1Vjswxid2v5+SShDmbZS67EmxqHBY\nTIuGRg43AgMBAAECggEACPfK9FyIYOX/rhrd3qH5XXfP5vA0U1F/NluAJRuiS0yG\n091sC0UxDY3yFG1n/P8t/usRCNx6akfd0I+/AEPBn4LJiA4k6XZF0nGf5jwLj+98\niL1D8w8fVsplZdVx/e1KuZxJiy7UfZRF8lWsaps0WJs/BvBu06S7M2HW9sBRXjKJ\nC5jy/N1sxZxDpRjTtn0PiPhHrq9UmWpyCZW6TkukH/aPmydMeyA4ktOc008bLwqs\nVCnRxmtvQcM6LugEXSZB6oJ8zbV7LS3LHxw2V57DnvzjFst4jKZ+OUWgICVUu896\n+q78K/78XmFP1Vcy+JL8BxLqwO/b04zSZcxhQfwzFQKBgQDwPkdI6PMxlWUxNGB4\nZy0VQEHMsgCUfMjFQDAGY5Q0ysx68IJyCEoLYyyvzD98MOpTwWpoFkIhcZeCMrEY\nEMfgMqnyr9ZLkBda+z+/MHQd9gYev8Vwin3jRlJwdU2hOb5zGe0GF0IgApXaB2X4\nkQq/9gK2MBfMxinlk95B+NiGqwKBgQDWvJBDecvfW/cCoPDrpD8YPfHe+w9/7w8N\nGVRS3GKYVd/tx+3is8GpWUEhKipPwmr0lZnjqrqgqhWjSwWwpMmkbDylr6LtFiJj\nqDaZqrqYEbo4W2HiUNwGJxdH++OQW8UeN9WyPGyj/eVSmbMRt5Aa/tFRzjuDr8sW\nc/WW+63GpQKBgQDsY/t0jHMvqNbHUchS8QL1VCLqrYPQl/Bd1sjqoHUmdR47IgjY\n97sT9WP1Hz6gjukjvL9c5/nuOn1gSUzkZy6lNnTvLYHpHEE+7tZM4/p9uKVRAFXg\nZQV16q4XpfTa3Zy+WRZW1e/k22ZkAL+fk+hF9mW4qx3gCmUTVyptM9SqvQKBgA8G\nvumZ2kRVASHz9SfoJGoj24sI8nq3VcxK23W46kVSrQrMlL7qaUDaeA5EDxXpuuZG\nmbAuwESB4mW82DcWMO4KjOvjMHl6tQlYOgniwo/lnaxX6K+XjO35Sk3FOJVfdpm4\nuoFwbQHEwIlZLAivWawp7KfW0J9Ua9e0YZkhH3XpAoGADEU2G/7MpNxAvzuO1HND\n2jMUrWC4t63y0EjIHvZmG58jglouIuL5bFlJT4iaOEZN1l8GilfpDNzywEu2yEJu\nEklQ9mZsPyB6WCZhleYWDoVgifJdhhlLbjZfPrkwEeqjDXv9H9n3dbW2k5jxB9rG\n1RUGR7pNH5poLxHzdOky4NQ=\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@clothing-brand-apex.iam.gserviceaccount.com
JWT_SECRET=YOUR_GENERATED_SECRET_HERE
CORS_ORIGIN=http://localhost:5173
```

---

## ⚡ Next Steps:

1. **Generate JWT_SECRET** - Run the PowerShell command above
2. **Add all variables to Render** - Copy each value to Render dashboard
3. **Deploy Backend** - Render will build and start your API
4. **Get Render URL** - Will be like `https://clothing-brand-api-xxxx.onrender.com`
5. **Update CORS_ORIGIN** - After deploying frontend, update with Netlify URL

---

## 🔐 Security Notes:

- ✅ This file is in `.gitignore` (never commit to GitHub!)
- ✅ Keep `firebase-service-account.json` secret
- ✅ Environment variables in Render are encrypted
- ✅ Only backend needs the private key (frontend uses different config)

---

## 🆘 Need Help?

If you get errors, check:
1. FIREBASE_PRIVATE_KEY has quotes and \n exactly as shown
2. FIREBASE_CLIENT_EMAIL matches your Firebase console
3. JWT_SECRET is at least 32 characters
4. CORS_ORIGIN will need updating after frontend deployment
