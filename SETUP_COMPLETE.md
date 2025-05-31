# Clothing Brand E-commerce - Final Setup

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB Atlas account (already configured)
- Git

### 1. Install Dependencies

**Backend:**
```powershell
cd "c:\Users\COSTA\Desktop\Clothing Brand\Backend"
npm install
```

**Frontend:**
```powershell
cd "c:\Users\COSTA\Desktop\Clothing Brand\Frontend"
npm install
```

### 2. Start Development Environment

**Option 1: Use the automated script (Recommended)**
```powershell
cd "c:\Users\COSTA\Desktop\Clothing Brand"
.\start-dev.ps1
```

**Option 2: Manual startup**

Terminal 1 (Backend):
```powershell
cd "c:\Users\COSTA\Desktop\Clothing Brand\Backend"
npm run dev
```

Terminal 2 (Frontend):
```powershell
cd "c:\Users\COSTA\Desktop\Clothing Brand\Frontend"
npm run dev
```

### 3. Access Your Application

- **Frontend:** http://localhost:3001
- **Backend API:** http://localhost:5000
- **API Health Check:** http://localhost:5000/health
- **Connection Test:** http://localhost:3001/test-connection

### 4. Test the Connection

1. Navigate to http://localhost:3001/test-connection
2. You should see a green "✅ Connected" status
3. If you see connection errors, check that both servers are running

## 🔧 Configuration

### Environment Variables

**Backend (.env):**
- `MONGODB_URI` - MongoDB connection string (already configured)
- `JWT_SECRET` - JWT secret key
- `PORT` - Backend port (5000)
- `FRONTEND_URL` - Frontend URL for CORS (http://localhost:3001)

**Frontend (.env):**
- `VITE_API_URL` - Backend API URL (http://localhost:5000/api)
- `VITE_STRIPE_PUBLISHABLE_KEY` - Stripe public key (for payments)

### API Endpoints

- `GET /api/health` - Health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/cart/add` - Add to cart
- `GET /api/orders` - Get user orders

## 🛠️ Development Features

### Hot Reload
Both frontend and backend support hot reload:
- Frontend: Vite HMR (Hot Module Replacement)
- Backend: Nodemon for automatic restart

### Proxy Configuration
The frontend is configured to proxy API requests to the backend automatically.

### Error Handling
- Comprehensive error logging in both frontend and backend
- API request/response logging in development mode
- Automatic token refresh and logout handling

## 📱 Features Available

### Customer Features
- Product browsing and filtering
- Shopping cart functionality
- User authentication (register/login)
- Order placement and tracking
- Profile management

### Admin Features
- Product management (CRUD)
- Order management
- User management
- Analytics dashboard
- Settings configuration

## 🔍 Troubleshooting

### Backend Won't Start
1. Check if MongoDB URI is correct in `.env`
2. Ensure port 5000 is not in use
3. Run `npm install` in Backend folder

### Frontend Won't Start
1. Ensure port 3001 is not in use
2. Run `npm install` in Frontend folder
3. Check that Vite config is correct

### API Connection Issues
1. Visit http://localhost:3001/test-connection
2. Check browser console for errors
3. Verify both servers are running
4. Check CORS configuration in backend

### Database Connection Issues
1. Check MongoDB Atlas cluster is running
2. Verify IP whitelist includes your current IP
3. Check database credentials in `.env`

## 🚀 Production Deployment

For production deployment:

1. Update environment variables
2. Build the frontend: `npm run build`
3. Use PM2 or similar for backend process management
4. Configure reverse proxy (Nginx)
5. Set up SSL certificates
6. Configure production database

## 📦 Scripts

**Backend:**
- `npm start` - Production start
- `npm run dev` - Development with nodemon
- `npm test` - Run API tests
- `npm run seed` - Seed database with sample data

**Frontend:**
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run preview` - Preview production build

## 🔐 Security Features

- JWT authentication
- Password hashing (bcrypt)
- Rate limiting
- CORS configuration
- Helmet security headers
- Input validation
- SQL injection prevention

Your e-commerce application is now fully connected and ready for development! 🎉
