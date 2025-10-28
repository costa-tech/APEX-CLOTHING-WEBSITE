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
 * Create a new admin user
 */
const createAdmin = async (email, password, name) => {
  try {
    console.log(`🔍 Creating admin user...`);
    
    // Create user in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
      emailVerified: true, // Auto-verify admin email
    });
    
    console.log(`✅ User created in Firebase Auth: ${userRecord.uid}`);
    
    // Set custom claims
    await admin.auth().setCustomUserClaims(userRecord.uid, { role: 'admin' });
    console.log('✅ Custom claims set');
    
    // Create user document in Firestore
    const userData = {
      email,
      name,
      role: 'admin',
      status: 'Active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      joinDate: new Date().toISOString(),
    };
    
    await db.collection('users').doc(userRecord.uid).set(userData);
    console.log('✅ Firestore document created');
    
    console.log('\n🎉 Success! Admin user created!');
    console.log(`\nAdmin Credentials:`);
    console.log(`- Email: ${email}`);
    console.log(`- Password: ${password}`);
    console.log(`- Name: ${name}`);
    console.log(`- UID: ${userRecord.uid}`);
    console.log(`- Role: admin`);
    console.log(`\n⚠️  Save these credentials securely!`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.code === 'auth/email-already-exists') {
      console.log('\n💡 Tip: This email is already registered.');
      console.log('   Use makeAdmin.js to promote existing user to admin.');
    }
  } finally {
    process.exit();
  }
};

// Get details from command line arguments
const email = process.argv[2];
const password = process.argv[3];
const name = process.argv[4] || 'Admin User';

if (!email || !password) {
  console.log('❌ Please provide email and password');
  console.log('\nUsage:');
  console.log('  node scripts/createAdmin.js <email> <password> [name]');
  console.log('\nExample:');
  console.log('  node scripts/createAdmin.js admin@example.com Admin123! "Admin User"');
  process.exit(1);
}

if (password.length < 6) {
  console.log('❌ Password must be at least 6 characters');
  process.exit(1);
}

// Run the script
createAdmin(email, password, name);
