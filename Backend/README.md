# Clothing Brand Backend API

A comprehensive Node.js + Express backend API with Firebase Firestore for a clothing e-commerce platform. This backend powers the admin panel with full CRUD operations for products, orders, and users.

## 🚀 Features

### Admin Panel Features
- **Product Management**
  - Create, read, update, and delete products
  - Upload product images
  - Manage product variants (sizes, colors, etc.)
  - Track inventory and stock levels
  - Product search and filtering

- **Order Management**
  - View all orders
  - Update order status (Pending, Processing, Shipped, Completed, Cancelled)
  - View order details and customer information
  - Order statistics and analytics

- **User Management**
  - View all users
  - Update user roles (Customer, Admin, Moderator)
  - Manage user status (Active, Inactive, Suspended)
  - View user order history
  - User statistics

- **Analytics Dashboard**
  - Revenue statistics
  - Top selling products
  - Low stock alerts
  - Top customers
  - Recent orders
  - Trends analysis

### Authentication & Security
- Firebase Authentication integration
- JWT token verification
- Role-based access control (RBAC)
- Protected admin routes
- Rate limiting
- Input validation
- Helmet security headers

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase project with Firestore enabled
- Firebase Admin SDK credentials

## 🛠️ Installation

### 1. Clone and Navigate

```bash
cd "C:\Users\COSTA\Desktop\Clothing Brand\Backend"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Firebase Setup

#### Option A: Using Service Account File (Recommended)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings > Service Accounts
4. Click "Generate New Private Key"
5. Save the JSON file as `firebase-service-account.json` in the Backend folder
6. In `.env`, set:
   ```env
   FIREBASE_SERVICE_ACCOUNT=./firebase-service-account.json
   ```

#### Option B: Using Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Firebase credentials in `.env`:
   ```env
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_PRIVATE_KEY_ID=your-private-key-id
   FIREBASE_PRIVATE_KEY="your-private-key"
   FIREBASE_CLIENT_EMAIL=your-client-email
   FIREBASE_CLIENT_ID=your-client-id
   FIREBASE_CLIENT_CERT_URL=your-client-cert-url
   ```

### 4. Configure Environment Variables

Edit `.env` file:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Upload Configuration
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp,image/jpg
```

### 5. Initialize Firebase Collections

The backend will automatically create collections when you add data. The required collections are:
- `products`
- `orders`
- `users`

## 🚀 Running the Server

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start on `http://localhost:5000`

## 📡 API Endpoints

### Base URL: `http://localhost:5000/api/v1`

### Authentication Routes (`/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| POST | `/auth/logout` | Logout user | Yes |
| POST | `/auth/refresh-token` | Refresh auth token | No |
| POST | `/auth/forgot-password` | Request password reset | No |
| POST | `/auth/reset-password` | Reset password | No |

### Product Routes (`/products`)

| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| GET | `/products` | Get all products | No | No |
| GET | `/products/:id` | Get product by ID | No | No |
| GET | `/products/category/:category` | Get products by category | No | No |
| GET | `/products/search/:query` | Search products | No | No |
| POST | `/products` | Create product | Yes | Yes |
| PUT | `/products/:id` | Update product | Yes | Yes |
| DELETE | `/products/:id` | Delete product | Yes | Yes |
| PATCH | `/products/:id/stock` | Update stock | Yes | Yes |
| POST | `/products/:id/images` | Upload images | Yes | Yes |
| DELETE | `/products/:id/images/:imageId` | Delete image | Yes | Yes |

### Order Routes (`/orders`)

| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| GET | `/orders` | Get all orders | Yes | Yes |
| GET | `/orders/:id` | Get order by ID | Yes | No* |
| GET | `/orders/my-orders` | Get user's orders | Yes | No |
| POST | `/orders` | Create order | Yes | No |
| PATCH | `/orders/:id/status` | Update order status | Yes | Yes |
| DELETE | `/orders/:id` | Delete order | Yes | Yes |
| GET | `/orders/stats/summary` | Get order statistics | Yes | Yes |

*Users can only view their own orders

### User Routes (`/users`)

| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| GET | `/users` | Get all users | Yes | Yes |
| GET | `/users/:id` | Get user by ID | Yes | Yes |
| GET | `/users/profile` | Get current user profile | Yes | No |
| PUT | `/users/profile` | Update current user profile | Yes | No |
| PUT | `/users/:id` | Update user | Yes | Yes |
| DELETE | `/users/:id` | Delete user | Yes | Yes |
| PATCH | `/users/:id/status` | Update user status | Yes | Yes |
| PATCH | `/users/:id/role` | Update user role | Yes | Yes |
| GET | `/users/stats/summary` | Get user statistics | Yes | Yes |

### Analytics Routes (`/analytics`)

| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| GET | `/analytics/dashboard` | Get dashboard stats | Yes | Yes |
| GET | `/analytics/revenue` | Get revenue stats | Yes | Yes |
| GET | `/analytics/products/top-selling` | Get top selling products | Yes | Yes |
| GET | `/analytics/products/low-stock` | Get low stock products | Yes | Yes |
| GET | `/analytics/customers/top` | Get top customers | Yes | Yes |
| GET | `/analytics/orders/recent` | Get recent orders | Yes | Yes |
| GET | `/analytics/trends` | Get trends | Yes | Yes |

## 📝 Request Examples

### Create Product

```bash
POST /api/v1/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Athletic Performance Tee",
  "description": "High-performance athletic t-shirt",
  "category": "Tops",
  "brand": "YourBrand",
  "price": 49.99,
  "comparePrice": 59.99,
  "stock": 150,
  "status": "Active",
  "tags": ["athletic", "performance", "comfortable"],
  "images": ["https://example.com/image1.jpg"]
}
```

### Create Order

```bash
POST /api/v1/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "productId": "product123",
      "quantity": 2,
      "price": 49.99
    }
  ],
  "shippingAddress": "123 Main St, City, State 12345",
  "total": 99.98,
  "paymentMethod": "card"
}
```

### Update User Role

```bash
PATCH /api/v1/users/:userId/role
Authorization: Bearer <token>
Content-Type: application/json

{
  "role": "admin"
}
```

## 🔒 Authentication

### Getting Auth Token

1. Register or login to get a custom token
2. Use the custom token to sign in with Firebase on the client
3. Get the ID token from Firebase
4. Include the ID token in requests:

```bash
Authorization: Bearer <firebase-id-token>
```

### Setting Admin Role

To make a user an admin, you need to update their role in Firestore and set custom claims:

```javascript
// In Firebase Console or using Admin SDK
await admin.auth().setCustomUserClaims(uid, { role: 'admin' });
```

Or use the API (requires existing admin):

```bash
PATCH /api/v1/users/:userId/role
Authorization: Bearer <admin-token>

{
  "role": "admin"
}
```

## 📁 Project Structure

```
Backend/
├── config/
│   └── firebase.js           # Firebase configuration
├── controllers/
│   ├── authController.js     # Authentication logic
│   ├── productController.js  # Product CRUD operations
│   ├── orderController.js    # Order management
│   ├── userController.js     # User management
│   └── analyticsController.js# Analytics & statistics
├── middleware/
│   ├── authMiddleware.js     # JWT verification & RBAC
│   ├── errorHandler.js       # Global error handler
│   ├── notFoundHandler.js    # 404 handler
│   ├── uploadMiddleware.js   # File upload handling
│   └── validationMiddleware.js# Input validation
├── routes/
│   ├── authRoutes.js         # Auth endpoints
│   ├── productRoutes.js      # Product endpoints
│   ├── orderRoutes.js        # Order endpoints
│   ├── userRoutes.js         # User endpoints
│   └── analyticsRoutes.js    # Analytics endpoints
├── .env                      # Environment variables
├── .env.example              # Environment template
├── .gitignore               # Git ignore rules
├── package.json             # Dependencies
├── server.js                # Entry point
└── README.md                # Documentation
```

## 🔧 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | 5000 |
| `NODE_ENV` | Environment | No | development |
| `FIREBASE_PROJECT_ID` | Firebase project ID | Yes | - |
| `FIREBASE_PRIVATE_KEY` | Firebase private key | Yes | - |
| `FIREBASE_CLIENT_EMAIL` | Firebase client email | Yes | - |
| `FRONTEND_URL` | Frontend URL for CORS | No | http://localhost:5173 |
| `MAX_FILE_SIZE` | Max upload size in bytes | No | 5242880 (5MB) |

## 🛡️ Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Prevents DDoS attacks
- **Input Validation**: Validates all inputs
- **JWT Verification**: Secure authentication
- **Role-Based Access**: Admin-only routes
- **Firebase Auth**: Industry-standard authentication

## 📊 Database Schema

### Users Collection

```javascript
{
  id: "user123",
  email: "user@example.com",
  name: "John Doe",
  role: "customer", // or "admin", "moderator"
  status: "Active", // or "Inactive", "Suspended"
  phone: "+1234567890",
  address: "123 Main St",
  avatar: "https://...",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
  lastLogin: "2024-01-01T00:00:00.000Z"
}
```

### Products Collection

```javascript
{
  id: "product123",
  name: "Athletic Tee",
  description: "High-performance tee",
  category: "Tops",
  brand: "YourBrand",
  price: 49.99,
  comparePrice: 59.99,
  cost: 25.00,
  stock: 150,
  sku: "ATH-TEE-001",
  status: "Active",
  tags: ["athletic", "performance"],
  images: ["https://..."],
  sales: 234,
  views: 1500,
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
  createdBy: "adminId"
}
```

### Orders Collection

```javascript
{
  id: "order123",
  userId: "user123",
  items: [
    {
      productId: "product123",
      quantity: 2,
      price: 49.99,
      name: "Athletic Tee"
    }
  ],
  total: 99.98,
  status: "Pending", // or "Processing", "Shipped", "Completed", "Cancelled"
  paymentStatus: "Paid", // or "Pending", "Failed", "Refunded"
  paymentMethod: "card",
  shippingAddress: "123 Main St",
  trackingNumber: "TRK123456789",
  orderDate: "2024-01-01T00:00:00.000Z",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z"
}
```

## 🧪 Testing

Test the API using tools like:
- Postman
- Thunder Client (VS Code extension)
- cURL
- Insomnia

Example cURL request:

```bash
curl -X GET http://localhost:5000/api/v1/products
```

## 🐛 Error Handling

The API returns consistent error responses:

```javascript
{
  "status": "error",
  "message": "Error description",
  "errors": [] // For validation errors
}
```

## 📈 Rate Limiting

- **Window**: 15 minutes
- **Max Requests**: 100 per IP
- **Applies to**: All `/api/` routes

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

ISC License

## 👥 Support

For issues and questions, please contact the development team.

## 🔄 Version

Current Version: 1.0.0

---

**Made with ❤️ for Clothing Brand E-commerce Platform**
