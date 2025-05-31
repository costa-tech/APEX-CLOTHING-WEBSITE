const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Product = require('../models/Product');

dotenv.config();

// Sample users
const users = [
  {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    password: 'Admin123!',
    role: 'admin'
  },
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'User123!',
    role: 'user'
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    password: 'User123!',
    role: 'user'
  }
];

// Sample products
const products = [
  {
    name: 'Athletic Performance T-Shirt',
    description: 'High-performance moisture-wicking t-shirt perfect for workouts and casual wear. Made with premium fabric that keeps you cool and dry.',
    shortDescription: 'Moisture-wicking performance tee',
    price: 29.99,
    comparePrice: 39.99,
    category: 'men',
    subcategory: 't-shirts',
    brand: 'Your Brand',
    sizes: [
      { size: 'S', stock: 25 },
      { size: 'M', stock: 30 },
      { size: 'L', stock: 35 },
      { size: 'XL', stock: 20 },
      { size: 'XXL', stock: 15 }
    ],
    colors: [
      { name: 'Black', hexCode: '#000000' },
      { name: 'White', hexCode: '#FFFFFF' },
      { name: 'Navy', hexCode: '#1e293b' },
      { name: 'Gray', hexCode: '#6b7280' }
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', alt: 'Athletic T-Shirt Front', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500', alt: 'Athletic T-Shirt Back', isPrimary: false }
    ],
    sku: 'MEN-ATH-001',
    tags: ['athletic', 'performance', 'moisture-wicking', 'casual'],
    isFeatured: true,
    seoTitle: 'Athletic Performance T-Shirt - Premium Workout Gear',
    seoDescription: 'Shop our premium athletic performance t-shirt. Moisture-wicking fabric keeps you cool during workouts.'
  },
  {
    name: 'Classic Pullover Hoodie',
    description: 'Comfortable and stylish pullover hoodie made from premium cotton blend. Perfect for layering or wearing alone.',
    shortDescription: 'Premium cotton blend hoodie',
    price: 59.99,
    comparePrice: 79.99,
    category: 'unisex',
    subcategory: 'hoodies',
    brand: 'Your Brand',
    sizes: [
      { size: 'XS', stock: 15 },
      { size: 'S', stock: 20 },
      { size: 'M', stock: 25 },
      { size: 'L', stock: 30 },
      { size: 'XL', stock: 25 },
      { size: 'XXL', stock: 15 }
    ],
    colors: [
      { name: 'Black', hexCode: '#000000' },
      { name: 'Heather Gray', hexCode: '#9ca3af' },
      { name: 'Navy', hexCode: '#1e293b' },
      { name: 'Maroon', hexCode: '#7f1d1d' }
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500', alt: 'Classic Hoodie Front', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500', alt: 'Classic Hoodie Side', isPrimary: false }
    ],
    sku: 'UNI-HOO-001',
    tags: ['hoodie', 'cotton', 'casual', 'comfort'],
    isFeatured: true,
    seoTitle: 'Classic Pullover Hoodie - Premium Cotton Blend',
    seoDescription: 'Stay comfortable in our classic pullover hoodie made from premium cotton blend.'
  },
  {
    name: 'High-Waist Leggings',
    description: 'Supportive high-waist leggings with four-way stretch fabric. Perfect for yoga, running, or everyday wear.',
    shortDescription: 'High-waist performance leggings',
    price: 39.99,
    comparePrice: 49.99,
    category: 'women',
    subcategory: 'leggings',
    brand: 'Your Brand',
    sizes: [
      { size: 'XS', stock: 20 },
      { size: 'S', stock: 25 },
      { size: 'M', stock: 30 },
      { size: 'L', stock: 25 },
      { size: 'XL', stock: 20 }
    ],
    colors: [
      { name: 'Black', hexCode: '#000000' },
      { name: 'Charcoal', hexCode: '#374151' },
      { name: 'Navy', hexCode: '#1e293b' },
      { name: 'Olive', hexCode: '#365314' }
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1506629905607-bb84e895742e?w=500', alt: 'High-Waist Leggings', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1544966503-7e532dcae1c2?w=500', alt: 'Leggings Detail', isPrimary: false }
    ],
    sku: 'WOM-LEG-001',
    tags: ['leggings', 'high-waist', 'performance', 'yoga'],
    isFeatured: true,
    seoTitle: 'High-Waist Performance Leggings - Four-Way Stretch',
    seoDescription: 'Experience comfort and support with our high-waist leggings featuring four-way stretch fabric.'
  },
  {
    name: 'Training Shorts',
    description: 'Lightweight training shorts with moisture-wicking technology and secure pockets. Ideal for gym sessions and outdoor activities.',
    shortDescription: 'Lightweight training shorts',
    price: 24.99,
    category: 'men',
    subcategory: 'shorts',
    brand: 'Your Brand',
    sizes: [
      { size: 'S', stock: 20 },
      { size: 'M', stock: 25 },
      { size: 'L', stock: 30 },
      { size: 'XL', stock: 20 },
      { size: 'XXL', stock: 10 }
    ],
    colors: [
      { name: 'Black', hexCode: '#000000' },
      { name: 'Gray', hexCode: '#6b7280' },
      { name: 'Navy', hexCode: '#1e293b' }
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500', alt: 'Training Shorts', isPrimary: true }
    ],
    sku: 'MEN-SHO-001',
    tags: ['shorts', 'training', 'gym', 'lightweight'],
    isFeatured: false,
    seoTitle: 'Training Shorts - Lightweight & Moisture-Wicking',
    seoDescription: 'Stay comfortable during workouts with our lightweight training shorts.'
  },
  {
    name: 'Sports Bra',
    description: 'Medium support sports bra with removable padding and moisture-wicking fabric. Perfect for various fitness activities.',
    shortDescription: 'Medium support sports bra',
    price: 34.99,
    category: 'women',
    subcategory: 'tanks',
    brand: 'Your Brand',
    sizes: [
      { size: 'XS', stock: 15 },
      { size: 'S', stock: 20 },
      { size: 'M', stock: 25 },
      { size: 'L', stock: 20 },
      { size: 'XL', stock: 15 }
    ],
    colors: [
      { name: 'Black', hexCode: '#000000' },
      { name: 'White', hexCode: '#FFFFFF' },
      { name: 'Pink', hexCode: '#ec4899' },
      { name: 'Purple', hexCode: '#8b5cf6' }
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1506629905607-bb84e895742e?w=500', alt: 'Sports Bra', isPrimary: true }
    ],
    sku: 'WOM-BRA-001',
    tags: ['sports-bra', 'medium-support', 'fitness', 'moisture-wicking'],
    isFeatured: false,
    seoTitle: 'Medium Support Sports Bra - Comfort & Performance',
    seoDescription: 'Get the support you need with our medium support sports bra featuring moisture-wicking fabric.'
  },
  {
    name: 'Windbreaker Jacket',
    description: 'Lightweight windbreaker jacket with water-resistant coating. Perfect for outdoor activities and layering.',
    shortDescription: 'Lightweight windbreaker jacket',
    price: 79.99,
    comparePrice: 99.99,
    category: 'unisex',
    subcategory: 'jackets',
    brand: 'Your Brand',
    sizes: [
      { size: 'S', stock: 15 },
      { size: 'M', stock: 20 },
      { size: 'L', stock: 25 },
      { size: 'XL', stock: 20 },
      { size: 'XXL', stock: 10 }
    ],
    colors: [
      { name: 'Black', hexCode: '#000000' },
      { name: 'Navy', hexCode: '#1e293b' },
      { name: 'Olive', hexCode: '#365314' }
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1544966503-7e532dcae1c2?w=500', alt: 'Windbreaker Jacket', isPrimary: true }
    ],
    sku: 'UNI-JAC-001',
    tags: ['windbreaker', 'water-resistant', 'outdoor', 'lightweight'],
    isFeatured: true,
    seoTitle: 'Lightweight Windbreaker Jacket - Water Resistant',
    seoDescription: 'Stay protected from the elements with our lightweight water-resistant windbreaker jacket.'
  }
];

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected for seeding...');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Product.deleteMany({});

    // Hash passwords for users
    console.log('Creating users...');
    const hashedUsers = await Promise.all(
      users.map(async (user) => {
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return { ...user, password: hashedPassword };
      })
    );

    // Insert users
    const createdUsers = await User.insertMany(hashedUsers);
    console.log(`✓ Created ${createdUsers.length} users`);

    // Insert products
    console.log('Creating products...');
    const createdProducts = await Product.insertMany(products);
    console.log(`✓ Created ${createdProducts.length} products`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\nSample login credentials:');
    console.log('Admin: admin@example.com / Admin123!');
    console.log('User: john@example.com / User123!');
    console.log('User: jane@example.com / User123!');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
