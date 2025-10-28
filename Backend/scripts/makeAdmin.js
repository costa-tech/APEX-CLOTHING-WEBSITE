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
 * Make a user an admin by email
 */
const makeAdmin = async (email) => {
  try {
    console.log(`🔍 Looking for user: ${email}`);
    
    // Get user by email
    const user = await admin.auth().getUserByEmail(email);
    console.log(`✅ User found: ${user.uid}`);
    
    // Set custom claims
    await admin.auth().setCustomUserClaims(user.uid, { role: 'admin' });
    console.log('✅ Custom claims set');
    
    // Update Firestore document
    const userRef = db.collection('users').doc(user.uid);
    const userDoc = await userRef.get();
    
    if (userDoc.exists) {
      await userRef.update({
        role: 'admin',
        updatedAt: new Date().toISOString(),
      });
      console.log('✅ Firestore document updated');
    } else {
      // Create user document if it doesn't exist
      await userRef.set({
        email: user.email,
        name: user.displayName || 'Admin User',
        role: 'admin',
        status: 'Active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        joinDate: new Date().toISOString(),
      });
      console.log('✅ Firestore document created');
    }
    
    console.log('\n🎉 Success! User is now an admin!');
    console.log(`\nUser Details:`);
    console.log(`- Email: ${user.email}`);
    console.log(`- UID: ${user.uid}`);
    console.log(`- Role: admin`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.code === 'auth/user-not-found') {
      console.log('\n💡 Tip: Make sure the user is registered first.');
      console.log('   You can register at: http://localhost:5000/api/v1/auth/register');
    }
  } finally {
    process.exit();
  }
};

// Get email from command line argument
const email = process.argv[2];

if (!email) {
  console.log('❌ Please provide an email address');
  console.log('\nUsage:');
  console.log('  node scripts/makeAdmin.js user@example.com');
  process.exit(1);
}

// Run the script
makeAdmin(email);
