const axios = require('axios');

const BASE_URL = 'http://localhost:5000';
const API_URL = `${BASE_URL}/api`;

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  cyan: '\x1b[36m'
};

const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

// Test configuration
let authToken = '';
let userId = '';
let productId = '';
let cartId = '';
let orderId = '';

async function testAPI() {
  log('\n🧪 Starting Clothing E-commerce API Tests', 'cyan');
  log('='.repeat(50), 'cyan');

  try {
    // Test 1: Health Check
    log('\n1. Testing Health Check...', 'blue');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    log(`✅ Health Check: ${healthResponse.data.message}`, 'green');

    // Test 2: User Registration
    log('\n2. Testing User Registration...', 'blue');
    const registerData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'Password123!',
      phone: '+1234567890'
    };

    try {
      const registerResponse = await axios.post(`${API_URL}/auth/register`, registerData);
      log(`✅ User Registration: ${registerResponse.data.message}`, 'green');
      authToken = registerResponse.data.token;
      userId = registerResponse.data.user.id;
    } catch (error) {
      if (error.response?.status === 400 && error.response.data.message.includes('already exists')) {
        log(`⚠️  User already exists, trying login...`, 'yellow');
        
        // Try login instead
        const loginResponse = await axios.post(`${API_URL}/auth/login`, {
          email: registerData.email,
          password: registerData.password
        });
        log(`✅ User Login: ${loginResponse.data.message}`, 'green');
        authToken = loginResponse.data.token;
        userId = loginResponse.data.user.id;
      } else {
        throw error;
      }
    }

    // Test 3: User Profile
    log('\n3. Testing User Profile...', 'blue');
    const profileResponse = await axios.get(`${API_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    log(`✅ User Profile: ${profileResponse.data.user.firstName} ${profileResponse.data.user.lastName}`, 'green');

    // Test 4: Create Product (Admin required)
    log('\n4. Testing Product Creation...', 'blue');
    const productData = {
      name: 'Premium Cotton T-Shirt',
      description: 'High-quality cotton t-shirt perfect for everyday wear',
      price: 29.99,
      category: 'T-Shirts',
      brand: 'TestBrand',
      variants: [
        { size: 'S', color: 'Black', stock: 10 },
        { size: 'M', color: 'Black', stock: 15 },
        { size: 'L', color: 'Black', stock: 8 },
        { size: 'S', color: 'White', stock: 12 }
      ],
      images: ['https://example.com/tshirt1.jpg', 'https://example.com/tshirt2.jpg'],
      tags: ['cotton', 'casual', 'basic']
    };

    try {
      const productResponse = await axios.post(`${API_URL}/products`, productData, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      log(`✅ Product Creation: ${productResponse.data.product.name}`, 'green');
      productId = productResponse.data.product._id;
    } catch (error) {
      if (error.response?.status === 403) {
        log(`⚠️  Admin access required for product creation`, 'yellow');
        
        // Get existing products instead
        const productsResponse = await axios.get(`${API_URL}/products`);
        if (productsResponse.data.products.length > 0) {
          productId = productsResponse.data.products[0]._id;
          log(`✅ Using existing product: ${productsResponse.data.products[0].name}`, 'green');
        }
      } else {
        throw error;
      }
    }

    // Test 5: Get Products
    log('\n5. Testing Get Products...', 'blue');
    const productsResponse = await axios.get(`${API_URL}/products`);
    log(`✅ Products Retrieved: ${productsResponse.data.products.length} products found`, 'green');

    // Test 6: Add to Cart
    if (productId) {
      log('\n6. Testing Add to Cart...', 'blue');
      const cartData = {
        productId: productId,
        quantity: 2,
        size: 'M',
        color: 'Black'
      };

      const cartResponse = await axios.post(`${API_URL}/cart/add`, cartData, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      log(`✅ Add to Cart: ${cartResponse.data.message}`, 'green');

      // Test 7: Get Cart
      log('\n7. Testing Get Cart...', 'blue');
      const getCartResponse = await axios.get(`${API_URL}/cart`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      log(`✅ Get Cart: ${getCartResponse.data.cart.items.length} items in cart`, 'green');
      cartId = getCartResponse.data.cart._id;
    }

    // Test 8: Search Products
    log('\n8. Testing Product Search...', 'blue');
    const searchResponse = await axios.get(`${API_URL}/products?search=shirt`);
    log(`✅ Product Search: ${searchResponse.data.products.length} products found`, 'green');

    // Test 9: Filter Products
    log('\n9. Testing Product Filtering...', 'blue');
    const filterResponse = await axios.get(`${API_URL}/products?category=T-Shirts&minPrice=20&maxPrice=50`);
    log(`✅ Product Filter: ${filterResponse.data.products.length} filtered products`, 'green');

    // Test 10: Analytics (Admin)
    log('\n10. Testing Analytics...', 'blue');
    try {
      const analyticsResponse = await axios.get(`${API_URL}/analytics/dashboard`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      log(`✅ Analytics: Dashboard data retrieved`, 'green');
    } catch (error) {
      if (error.response?.status === 403) {
        log(`⚠️  Admin access required for analytics`, 'yellow');
      } else {
        throw error;
      }
    }

    log('\n🎉 API Tests Completed Successfully!', 'green');
    log('='.repeat(50), 'cyan');

  } catch (error) {
    log(`\n❌ Test Failed: ${error.message}`, 'red');
    if (error.response) {
      log(`Status: ${error.response.status}`, 'red');
      log(`Data: ${JSON.stringify(error.response.data, null, 2)}`, 'red');
    }
  }
}

// Check if axios is available, if not, provide instructions
async function checkDependencies() {
  try {
    require('axios');
    return true;
  } catch (error) {
    log('\n❌ axios is required for API testing', 'red');
    log('Install it with: npm install axios', 'yellow');
    return false;
  }
}

async function main() {
  const hasAxios = await checkDependencies();
  if (hasAxios) {
    // Wait a moment for server to be ready
    setTimeout(testAPI, 2000);
  }
}

if (require.main === module) {
  main();
}

module.exports = { testAPI };
