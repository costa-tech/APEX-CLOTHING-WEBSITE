# Clothing E-commerce Backend API

A complete backend solution for a clothing e-commerce website built with Node.js, Express, and MongoDB. Features user authentication, product management, shopping cart, order processing, Stripe payments, and admin analytics.

## 🚀 Features

### 🔐 Authentication & User Management
- User registration and login with JWT tokens
- Password hashing with bcrypt
- Role-based access control (user, admin)
- Protected routes middleware
- User profile management

### 👕 Product Management
- Complete CRUD operations for products
- Product categories and subcategories
- Size and color variants with stock tracking
- Product search and filtering
- Featured products
- Image management
- SEO optimization fields

### 🛒 Shopping Cart
- Add/remove items from cart
- Update item quantities
- Size and color selection
- Stock validation
- Persistent cart storage

### 📦 Order Management
- Order creation and tracking
- Order status updates (Pending, Processing, Shipped, Delivered)
- Order history for users
- Admin order management
- Inventory management with stock reduction

### 💳 Payment Integration
- Stripe payment processing
- Secure payment handling
- Payment status tracking
- Test environment support

### 📊 Admin Analytics
- Dashboard overview with key metrics
- Orders per month analytics
- Revenue tracking
- Top-selling products
- Inventory analytics
- Low stock alerts

### 🔒 Security Features
- Rate limiting
- CORS configuration
- Helmet security headers
- Input validation
- Error handling

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Payment Processing**: Stripe
- **Validation**: express-validator
- **Security**: helmet, cors, express-rate-limit
- **Development**: nodemon

## 📁 Project Structure

```
backend/
├── config/
│   ├── database.js          # MongoDB connection
│   └── stripe.js            # Stripe configuration
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── productController.js # Product management
│   ├── cartController.js    # Shopping cart logic
│   ├── orderController.js   # Order processing
│   └── analyticsController.js # Admin analytics
├── middleware/
│   ├── auth.js              # JWT authentication
│   ├── roleAuth.js          # Role-based authorization
│   ├── rateLimiter.js       # Rate limiting
│   └── validation.js        # Input validation
├── models/
│   ├── User.js              # User schema
│   ├── Product.js           # Product schema
│   ├── Cart.js              # Cart schema
│   └── Order.js             # Order schema
├── routes/
│   ├── authRoutes.js        # Authentication routes
│   ├── productRoutes.js     # Product routes
│   ├── cartRoutes.js        # Cart routes
│   ├── orderRoutes.js       # Order routes
│   └── analyticsRoutes.js   # Analytics routes
├── scripts/
│   └── seedData.js          # Database seeding
├── utils/
│   └── helpers.js           # Utility functions
├── .env                     # Environment variables
├── server.js                # Main application file
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Stripe account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/clothing-ecommerce
   
   # JWT Secret
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   
   # Server
   PORT=5000
   NODE_ENV=development
   
   # Stripe Keys (Test Environment)
   STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key-here
   STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key-here
   STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret-here
   
   # CORS
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Seed the database (optional)**
   ```bash
   npm run seed
   ```

6. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

The API will be available at `http://localhost:5000`

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "User123!"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "User123!"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Product Endpoints

#### Get All Products
```http
GET /api/products?page=1&limit=12&category=men&sort=price_asc
```

Query Parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 12)
- `category`: men, women, unisex, accessories
- `subcategory`: t-shirts, hoodies, joggers, etc.
- `minPrice`, `maxPrice`: Price range
- `size`: Size filter
- `color`: Color filter
- `search`: Search term
- `sort`: price_asc, price_desc, rating, popular, newest

#### Get Single Product
```http
GET /api/products/:id
```

#### Create Product (Admin Only)
```http
POST /api/products
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Athletic T-Shirt",
  "description": "High-performance t-shirt...",
  "price": 29.99,
  "category": "men",
  "subcategory": "t-shirts",
  "sizes": [
    {"size": "M", "stock": 30},
    {"size": "L", "stock": 25}
  ],
  "colors": [
    {"name": "Black", "hexCode": "#000000"}
  ],
  "images": [
    {"url": "image-url", "isPrimary": true}
  ],
  "sku": "MEN-ATH-001"
}
```

### Cart Endpoints

#### Get User Cart
```http
GET /api/cart
Authorization: Bearer <token>
```

#### Add to Cart
```http
POST /api/cart/add
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "product-id",
  "quantity": 2,
  "size": "M",
  "color": "Black"
}
```

### Order Endpoints

#### Create Order
```http
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [...],
  "shippingAddress": {...},
  "paymentMethodId": "stripe-payment-method-id"
}
```

#### Get User Orders
```http
GET /api/orders
Authorization: Bearer <token>
```

### Admin Analytics Endpoints

#### Get Dashboard Analytics
```http
GET /api/admin/analytics/dashboard
Authorization: Bearer <admin-token>
```

#### Get Monthly Orders
```http
GET /api/admin/analytics/orders-monthly?year=2025
Authorization: Bearer <admin-token>
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Prevents spam and brute force attacks
- **Input Validation**: Validates all user inputs
- **CORS**: Configured for frontend domain
- **Helmet**: Security headers
- **Password Hashing**: bcrypt with salt rounds

## 💳 Stripe Integration

The API integrates with Stripe for secure payment processing:

1. **Setup Stripe Account**: Create a Stripe account and get test keys
2. **Add Keys to .env**: Add your Stripe keys to environment variables
3. **Frontend Integration**: Use Stripe.js in your frontend
4. **Webhook Handling**: Set up webhooks for payment confirmations

## 📊 Database Schema

### User Model
- Personal information (name, email, phone)
- Authentication (hashed password, role)
- Address information
- Account status and last login

### Product Model
- Product details (name, description, price)
- Variants (sizes, colors, stock)
- Media (images with alt text)
- SEO fields and metadata
- Sales tracking

### Order Model
- Order information and status
- Customer and shipping details
- Payment information
- Order items with product snapshots
- Tracking information

### Cart Model
- User association
- Cart items with product references
- Quantity and variant selection
- Automatic total calculation

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ecommerce
JWT_SECRET=complex-secret-key-for-production
STRIPE_SECRET_KEY=sk_live_your-live-stripe-key
FRONTEND_URL=https://yourdomain.com
```

### Deployment Platforms
- **Heroku**: Easy deployment with MongoDB Atlas
- **Vercel**: Serverless deployment
- **AWS**: EC2 or Lambda deployment
- **DigitalOcean**: VPS deployment

## 🧪 Testing

Sample test credentials (after running seed):
- **Admin**: admin@example.com / Admin123!
- **User**: john@example.com / User123!

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

For support and questions, please open an issue on GitHub.

---

Built with ❤️ for modern e-commerce needs
