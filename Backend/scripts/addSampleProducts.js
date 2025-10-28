require('dotenv').config();
const admin = require('firebase-admin');

// Initialize Firebase Admin
let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  serviceAccount = require(`../${process.env.FIREBASE_SERVICE_ACCOUNT}`);
} else {
  serviceAccount = {
    type: 'service_account',
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
  };
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

/**
 * Add sample products to the database
 */
const addSampleProducts = async () => {
  try {
    console.log('🔍 Adding sample products...\n');

    const sampleProducts = [
      {
        name: 'Athletic Performance Tee',
        description: 'High-performance athletic t-shirt made with moisture-wicking fabric',
        category: 'Tops',
        brand: 'YourBrand',
        price: 49.99,
        comparePrice: 59.99,
        cost: 25.00,
        stock: 150,
        sku: 'ATH-TEE-001',
        status: 'Active',
        tags: ['athletic', 'performance', 'comfortable'],
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'],
        sales: 0,
        views: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        name: 'Premium Training Shorts',
        description: 'Comfortable training shorts with built-in compression liner',
        category: 'Bottoms',
        brand: 'YourBrand',
        price: 59.99,
        comparePrice: 79.99,
        cost: 30.00,
        stock: 75,
        sku: 'TRN-SHT-001',
        status: 'Active',
        tags: ['training', 'shorts', 'athletic'],
        images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800'],
        sales: 0,
        views: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        name: 'Seamless Sports Bra',
        description: 'Seamless design for maximum comfort during workouts',
        category: 'Tops',
        brand: 'YourBrand',
        price: 39.99,
        comparePrice: 49.99,
        cost: 20.00,
        stock: 100,
        sku: 'SPT-BRA-001',
        status: 'Active',
        tags: ['sports', 'bra', 'seamless'],
        images: ['https://images.unsplash.com/photo-1506629905607-45c9e9e46934?w=800'],
        sales: 0,
        views: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        name: 'Compression Leggings',
        description: 'High-waist compression leggings for optimal performance',
        category: 'Bottoms',
        brand: 'YourBrand',
        price: 69.99,
        comparePrice: 89.99,
        cost: 35.00,
        stock: 200,
        sku: 'CMP-LEG-001',
        status: 'Active',
        tags: ['compression', 'leggings', 'athletic'],
        images: ['https://images.unsplash.com/photo-1506629905607-45c9e9e46934?w=800'],
        sales: 0,
        views: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        name: 'Running Jacket',
        description: 'Lightweight, water-resistant running jacket',
        category: 'Outerwear',
        brand: 'YourBrand',
        price: 89.99,
        comparePrice: 119.99,
        cost: 45.00,
        stock: 50,
        sku: 'RUN-JKT-001',
        status: 'Active',
        tags: ['running', 'jacket', 'outerwear'],
        images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800'],
        sales: 0,
        views: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    const productsCollection = db.collection('products');

    for (const product of sampleProducts) {
      const docRef = await productsCollection.add(product);
      console.log(`✅ Added: ${product.name} (ID: ${docRef.id})`);
    }

    console.log(`\n🎉 Successfully added ${sampleProducts.length} sample products!`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit();
  }
};

// Run the script
addSampleProducts();
