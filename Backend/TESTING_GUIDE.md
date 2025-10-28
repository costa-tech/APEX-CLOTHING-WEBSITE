# 🎯 Testing with Postman / Thunder Client

This guide will help you test your API using Postman or Thunder Client.

## Install Tools

- **Postman**: [Download](https://www.postman.com/downloads/)
- **Thunder Client**: VS Code Extension

## Quick Start

### 1. Create a New Collection

Name it: "Clothing Brand API"

Base URL: `http://localhost:5000/api/v1`

### 2. Add Environment Variables

Create variables:
- `baseUrl`: `http://localhost:5000/api/v1`
- `authToken`: (leave empty, will be filled after login)

## Test Requests

### 1. Health Check

**GET** `{{baseUrl}}/health`

Should return:
```json
{
  "status": "success",
  "message": "Server is running"
}
```

---

### 2. Register User

**POST** `{{baseUrl}}/auth/register`

**Body (JSON):**
```json
{
  "email": "test@example.com",
  "password": "Test123!",
  "name": "Test User"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "uid": "user123",
    "customToken": "eyJhbGci..."
  }
}
```

📝 **Note**: Save the `uid` and `customToken`

---

### 3. Get Firebase ID Token

You need to exchange the custom token for an ID token.

**Using cURL (in Terminal):**

```bash
curl -X POST https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=YOUR_FIREBASE_WEB_API_KEY -H "Content-Type: application/json" -d "{\"token\":\"YOUR_CUSTOM_TOKEN\",\"returnSecureToken\":true}"
```

**OR Create this helper endpoint in your frontend:**

```javascript
// Frontend code to get ID token
import { signInWithCustomToken } from 'firebase/auth';
import { auth } from './firebaseConfig';

const customToken = 'your-custom-token';
const userCredential = await signInWithCustomToken(auth, customToken);
const idToken = await userCredential.user.getIdToken();
console.log('ID Token:', idToken);
```

📝 **Save the ID token** - you'll need it for authenticated requests

---

### 4. Create Product (Admin Only)

**POST** `{{baseUrl}}/products`

**Headers:**
```
Authorization: Bearer YOUR_ID_TOKEN
```

**Body (JSON):**
```json
{
  "name": "Test Product",
  "description": "This is a test product",
  "category": "Tops",
  "brand": "TestBrand",
  "price": 29.99,
  "stock": 100,
  "status": "Active",
  "tags": ["test", "new"]
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Product created successfully",
  "data": {
    "id": "product123",
    "name": "Test Product",
    "price": 29.99
  }
}
```

---

### 5. Get All Products

**GET** `{{baseUrl}}/products`

**Query Params (optional):**
- `page`: 1
- `limit`: 20
- `category`: Tops
- `status`: Active

**Response:**
```json
{
  "status": "success",
  "data": {
    "products": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50
    }
  }
}
```

---

### 6. Get Product by ID

**GET** `{{baseUrl}}/products/:productId`

---

### 7. Update Product (Admin Only)

**PUT** `{{baseUrl}}/products/:productId`

**Headers:**
```
Authorization: Bearer YOUR_ID_TOKEN
```

**Body (JSON):**
```json
{
  "price": 34.99,
  "stock": 75
}
```

---

### 8. Create Order

**POST** `{{baseUrl}}/orders`

**Headers:**
```
Authorization: Bearer YOUR_ID_TOKEN
```

**Body (JSON):**
```json
{
  "items": [
    {
      "productId": "product123",
      "quantity": 2,
      "price": 29.99
    }
  ],
  "shippingAddress": "123 Main St, City, State 12345",
  "total": 59.98,
  "paymentMethod": "card"
}
```

---

### 9. Get My Orders

**GET** `{{baseUrl}}/orders/my-orders`

**Headers:**
```
Authorization: Bearer YOUR_ID_TOKEN
```

---

### 10. Get All Orders (Admin Only)

**GET** `{{baseUrl}}/orders`

**Headers:**
```
Authorization: Bearer YOUR_ID_TOKEN
```

**Query Params (optional):**
- `page`: 1
- `limit`: 20
- `status`: Pending
- `paymentStatus`: Paid

---

### 11. Update Order Status (Admin Only)

**PATCH** `{{baseUrl}}/orders/:orderId/status`

**Headers:**
```
Authorization: Bearer YOUR_ID_TOKEN
```

**Body (JSON):**
```json
{
  "status": "Shipped",
  "trackingNumber": "TRK123456789"
}
```

---

### 12. Get User Profile

**GET** `{{baseUrl}}/users/profile`

**Headers:**
```
Authorization: Bearer YOUR_ID_TOKEN
```

---

### 13. Get All Users (Admin Only)

**GET** `{{baseUrl}}/users`

**Headers:**
```
Authorization: Bearer YOUR_ID_TOKEN
```

---

### 14. Update User Role (Admin Only)

**PATCH** `{{baseUrl}}/users/:userId/role`

**Headers:**
```
Authorization: Bearer YOUR_ID_TOKEN
```

**Body (JSON):**
```json
{
  "role": "admin"
}
```

---

### 15. Get Dashboard Analytics (Admin Only)

**GET** `{{baseUrl}}/analytics/dashboard`

**Headers:**
```
Authorization: Bearer YOUR_ID_TOKEN
```

---

### 16. Get Revenue Stats (Admin Only)

**GET** `{{baseUrl}}/analytics/revenue?period=30days`

**Headers:**
```
Authorization: Bearer YOUR_ID_TOKEN
```

---

## Import Postman Collection

Create a file `postman_collection.json`:

```json
{
  "info": {
    "name": "Clothing Brand API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"test@example.com\",\n  \"password\": \"Test123!\",\n  \"name\": \"Test User\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/auth/register",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "register"]
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000/api/v1"
    }
  ]
}
```

Import this into Postman!

---

## Testing Workflow

### For Regular Users:
1. Register → Get custom token
2. Exchange for ID token
3. Create orders
4. View my orders
5. View products

### For Admin:
1. Create admin user (use scripts)
2. Login → Get custom token
3. Exchange for ID token
4. Create/update/delete products
5. View all orders
6. Update order status
7. Manage users
8. View analytics

---

## Common Issues

### Issue: "Unauthorized"
**Solution**: Make sure you're sending the Firebase ID token in the Authorization header:
```
Authorization: Bearer YOUR_FIREBASE_ID_TOKEN
```

### Issue: "Forbidden - Admin access required"
**Solution**: Your user needs admin role. Use the `makeAdmin.js` script:
```bash
npm run make-admin your-email@example.com
```

### Issue: "Token expired"
**Solution**: Get a new ID token from Firebase. Tokens expire after 1 hour.

---

## Pro Tips

1. **Save tokens**: Use Postman environment variables to store tokens
2. **Use scripts**: Automate token refresh with Postman scripts
3. **Collections**: Organize requests by endpoint type
4. **Pre-request scripts**: Auto-add auth headers
5. **Tests**: Add tests to validate responses

---

**Happy Testing! 🚀**
