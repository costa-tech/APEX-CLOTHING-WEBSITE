# API Documentation

## Table of Contents
1. [Authentication](#authentication)
2. [Products](#products)
3. [Orders](#orders)
4. [Users](#users)
5. [Analytics](#analytics)

---

## Authentication

### Register User
Create a new user account.

**Endpoint:** `POST /api/v1/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "uid": "user123",
    "email": "user@example.com",
    "name": "John Doe",
    "customToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Login User
Authenticate a user and get access token.

**Endpoint:** `POST /api/v1/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "uid": "user123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "customer",
    "customToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## Products

### Get All Products
Retrieve all products with optional filters.

**Endpoint:** `GET /api/v1/products`

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `category` (string): Filter by category
- `status` (string): Filter by status
- `minPrice` (number): Minimum price
- `maxPrice` (number): Maximum price
- `sortBy` (string): Sort field (default: createdAt)
- `order` (string): Sort order (asc/desc, default: desc)

**Response:**
```json
{
  "status": "success",
  "data": {
    "products": [
      {
        "id": "product123",
        "name": "Athletic Performance Tee",
        "category": "Tops",
        "price": 49.99,
        "stock": 150,
        "status": "Active",
        "images": ["https://..."],
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

---

### Create Product (Admin Only)
Add a new product to the catalog.

**Endpoint:** `POST /api/v1/products`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Athletic Performance Tee",
  "description": "High-performance athletic t-shirt",
  "category": "Tops",
  "brand": "YourBrand",
  "price": 49.99,
  "comparePrice": 59.99,
  "stock": 150,
  "sku": "ATH-TEE-001",
  "status": "Active",
  "tags": ["athletic", "performance", "comfortable"],
  "images": ["https://example.com/image1.jpg"]
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Product created successfully",
  "data": {
    "id": "product123",
    "name": "Athletic Performance Tee",
    "price": 49.99,
    "stock": 150,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### Update Product (Admin Only)
Update an existing product.

**Endpoint:** `PUT /api/v1/products/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Updated Product Name",
  "price": 54.99,
  "stock": 200
}
```

---

### Delete Product (Admin Only)
Remove a product from the catalog.

**Endpoint:** `DELETE /api/v1/products/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": "success",
  "message": "Product deleted successfully"
}
```

---

## Orders

### Get All Orders (Admin Only)
Retrieve all orders with filters.

**Endpoint:** `GET /api/v1/orders`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `status` (string): Filter by order status
- `paymentStatus` (string): Filter by payment status
- `sortBy` (string): Sort field
- `order` (string): Sort order

**Response:**
```json
{
  "status": "success",
  "data": {
    "orders": [
      {
        "id": "order123",
        "customer": {
          "name": "John Doe",
          "email": "john@example.com"
        },
        "items": [
          {
            "productId": "product123",
            "quantity": 2,
            "price": 49.99
          }
        ],
        "total": 99.98,
        "status": "Pending",
        "paymentStatus": "Paid",
        "orderDate": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "totalPages": 3
    }
  }
}
```

---

### Create Order
Place a new order.

**Endpoint:** `POST /api/v1/orders`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
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

**Response:**
```json
{
  "status": "success",
  "message": "Order created successfully",
  "data": {
    "id": "order123",
    "userId": "user123",
    "items": [...],
    "total": 99.98,
    "status": "Pending",
    "orderDate": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### Update Order Status (Admin Only)
Change the status of an order.

**Endpoint:** `PATCH /api/v1/orders/:id/status`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "Shipped",
  "trackingNumber": "TRK123456789"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Order status updated successfully",
  "data": {
    "id": "order123",
    "status": "Shipped",
    "trackingNumber": "TRK123456789"
  }
}
```

---

## Users

### Get All Users (Admin Only)
Retrieve all users with filters.

**Endpoint:** `GET /api/v1/users`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `role` (string): Filter by role
- `status` (string): Filter by status

---

### Get User Profile
Get current user's profile.

**Endpoint:** `GET /api/v1/users/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "user123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "customer",
    "status": "Active",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### Update User Role (Admin Only)
Change a user's role.

**Endpoint:** `PATCH /api/v1/users/:id/role`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "role": "admin"
}
```

**Valid roles:**
- `customer`
- `admin`
- `moderator`

---

## Analytics

### Get Dashboard Statistics (Admin Only)
Get comprehensive dashboard stats.

**Endpoint:** `GET /api/v1/analytics/dashboard`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "overview": {
      "totalRevenue": "12345.67",
      "totalOrders": 150,
      "totalProducts": 50,
      "totalUsers": 200
    },
    "orders": {
      "total": 150,
      "pending": 10,
      "completed": 130,
      "thisMonth": 25
    },
    "revenue": {
      "total": "12345.67",
      "thisMonth": "2500.00",
      "averageOrderValue": "82.30"
    }
  }
}
```

---

### Get Revenue Statistics (Admin Only)
Get revenue data for charts.

**Endpoint:** `GET /api/v1/analytics/revenue`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `period` (string): Time period (7days, 30days, 90days, 365days)

**Response:**
```json
{
  "status": "success",
  "data": {
    "period": "30days",
    "totalRevenue": "5000.00",
    "chartData": [
      {
        "date": "2024-01-01",
        "revenue": 150.50
      }
    ]
  }
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "status": "error",
  "message": "Error description"
}
```

### Common Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

---

## Rate Limiting

- **Window**: 15 minutes
- **Max Requests**: 100 per IP
- **Header**: `X-RateLimit-Remaining`

When rate limit is exceeded:
```json
{
  "status": "error",
  "message": "Too many requests from this IP, please try again later."
}
```
