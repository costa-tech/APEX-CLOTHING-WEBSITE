// Test script to verify cart and wishlist functionality
const API_BASE = 'http://localhost:5000/api';

// Mock user token (you'll need to get this from a real login)
let authToken = '';

// Test authentication first
async function testAuth() {
    console.log('🧪 Testing Authentication...');
    
    try {
        // Test registration
        const registerResponse = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            })
        });
        
        const registerData = await registerResponse.json();
        console.log('Register response:', registerData);
        
        if (registerData.success) {
            authToken = registerData.token;
            console.log('✅ Registration successful');
        } else {
            // Try login instead
            const loginResponse = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: 'test@example.com',
                    password: 'password123'
                })
            });
            
            const loginData = await loginResponse.json();
            console.log('Login response:', loginData);
            
            if (loginData.success) {
                authToken = loginData.token;
                console.log('✅ Login successful');
            } else {
                console.log('❌ Authentication failed');
                return false;
            }
        }
        
        return true;
    } catch (error) {
        console.error('❌ Auth error:', error);
        return false;
    }
}

// Test cart functionality
async function testCart() {
    console.log('\n🛒 Testing Cart Functionality...');
    
    if (!authToken) {
        console.log('❌ No auth token available');
        return;
    }
    
    try {
        // Get cart
        let response = await fetch(`${API_BASE}/cart`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        let data = await response.json();
        console.log('Get cart:', data);
        
        // Add item to cart (using a mock product ID)
        response = await fetch(`${API_BASE}/cart/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                productId: '507f1f77bcf86cd799439011', // Mock ObjectId
                size: 'M',
                color: 'Black',
                quantity: 2
            })
        });
        data = await response.json();
        console.log('Add to cart:', data);
        
        if (data.success) {
            console.log('✅ Cart functionality working');
        } else {
            console.log('❌ Cart add failed:', data.message);
        }
        
    } catch (error) {
        console.error('❌ Cart error:', error);
    }
}

// Test wishlist functionality
async function testWishlist() {
    console.log('\n❤️ Testing Wishlist Functionality...');
    
    if (!authToken) {
        console.log('❌ No auth token available');
        return;
    }
    
    try {
        // Get wishlist
        let response = await fetch(`${API_BASE}/wishlist`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        let data = await response.json();
        console.log('Get wishlist:', data);
        
        // Add item to wishlist
        response = await fetch(`${API_BASE}/wishlist/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                productId: '507f1f77bcf86cd799439012' // Mock ObjectId
            })
        });
        data = await response.json();
        console.log('Add to wishlist:', data);
        
        if (data.success) {
            console.log('✅ Wishlist functionality working');
        } else {
            console.log('❌ Wishlist add failed:', data.message);
        }
        
    } catch (error) {
        console.error('❌ Wishlist error:', error);
    }
}

// Run all tests
async function runTests() {
    console.log('🚀 Starting Backend API Tests\n');
    
    const authSuccess = await testAuth();
    if (authSuccess) {
        await testCart();
        await testWishlist();
    }
    
    console.log('\n✅ Tests completed');
}

// Check if running in Node.js
if (typeof window === 'undefined') {
    // Node.js environment
    const fetch = require('node-fetch');
    runTests();
} else {
    // Browser environment - make functions available globally
    window.runTests = runTests;
    console.log('Test functions loaded. Run runTests() in console to start.');
}
