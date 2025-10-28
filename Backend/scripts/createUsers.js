// Load environment variables first
require('dotenv').config();

const { admin, auth, db } = require('../config/firebase');

/**
 * Script to create admin and normal users in Firebase
 * Run with: node scripts/createUsers.js
 */

const createUsers = async () => {
  try {
    console.log('🔥 Starting user creation process...\n');

    // ============================================
    // CREATE ADMIN USER
    // ============================================
    console.log('👤 Creating Admin User...');
    
    const adminEmail = 'admin@clothingbrand.com';
    const adminPassword = 'Admin123!';
    
    let adminUser;
    try {
      // Create admin in Firebase Authentication
      adminUser = await auth.createUser({
        email: adminEmail,
        password: adminPassword,
        displayName: 'Admin User',
        emailVerified: true,
      });

      // Set custom claims for admin role
      await auth.setCustomUserClaims(adminUser.uid, { role: 'admin' });

      // Create admin document in Firestore
      await db.collection('users').doc(adminUser.uid).set({
        uid: adminUser.uid,
        email: adminEmail,
        name: 'Admin User',
        role: 'admin',
        emailVerified: true,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        profile: {
          phone: '+1234567890',
          address: {
            street: '123 Admin Street',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'USA'
          }
        }
      });

      console.log('✅ Admin User Created Successfully!');
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Password: ${adminPassword}`);
      console.log(`   UID: ${adminUser.uid}`);
      console.log(`   Role: admin\n`);

    } catch (error) {
      if (error.code === 'auth/email-already-exists') {
        console.log('⚠️  Admin user already exists, skipping...\n');
      } else {
        throw error;
      }
    }

    // ============================================
    // CREATE NORMAL USER
    // ============================================
    console.log('👤 Creating Normal User...');
    
    const userEmail = 'user@example.com';
    const userPassword = 'User123!';
    
    let normalUser;
    try {
      // Create user in Firebase Authentication
      normalUser = await auth.createUser({
        email: userEmail,
        password: userPassword,
        displayName: 'John Doe',
        emailVerified: true,
      });

      // Set custom claims for customer role
      await auth.setCustomUserClaims(normalUser.uid, { role: 'customer' });

      // Create user document in Firestore
      await db.collection('users').doc(normalUser.uid).set({
        uid: normalUser.uid,
        email: userEmail,
        name: 'John Doe',
        role: 'customer',
        emailVerified: true,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        profile: {
          phone: '+9876543210',
          address: {
            street: '456 Customer Lane',
            city: 'Los Angeles',
            state: 'CA',
            zipCode: '90001',
            country: 'USA'
          }
        },
        stats: {
          totalOrders: 0,
          totalSpent: 0
        }
      });

      console.log('✅ Normal User Created Successfully!');
      console.log(`   Email: ${userEmail}`);
      console.log(`   Password: ${userPassword}`);
      console.log(`   UID: ${normalUser.uid}`);
      console.log(`   Role: customer\n`);

    } catch (error) {
      if (error.code === 'auth/email-already-exists') {
        console.log('⚠️  Normal user already exists, skipping...\n');
      } else {
        throw error;
      }
    }

    // ============================================
    // SUMMARY
    // ============================================
    console.log('═══════════════════════════════════════════');
    console.log('✅ USER CREATION COMPLETED!');
    console.log('═══════════════════════════════════════════');
    console.log('\n📋 Login Credentials:\n');
    console.log('ADMIN USER:');
    console.log(`  Email: ${adminEmail}`);
    console.log(`  Password: ${adminPassword}`);
    console.log(`  Access: /admin routes\n`);
    
    console.log('NORMAL USER:');
    console.log(`  Email: ${userEmail}`);
    console.log(`  Password: ${userPassword}`);
    console.log(`  Access: /profile, /checkout routes\n`);
    
    console.log('🔗 Next Steps:');
    console.log('  1. Start your backend: npm run dev');
    console.log('  2. Start your frontend: npm run dev');
    console.log('  3. Login with the credentials above');
    console.log('  4. Admin can access /admin dashboard');
    console.log('  5. Normal user can shop and checkout\n');

    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error creating users:', error);
    console.error('Error details:', error.message);
    process.exit(1);
  }
};

// Run the script
createUsers();
