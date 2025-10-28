const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Initialize Firebase Admin
let serviceAccount;

// Check if using service account file or environment variables
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  // Using service account file - resolve path from project root
  const serviceAccountPath = path.resolve(__dirname, '..', process.env.FIREBASE_SERVICE_ACCOUNT);
  try {
    // Read the file as text first, then parse to ensure proper encoding
    const fileContent = fs.readFileSync(serviceAccountPath, 'utf8');
    serviceAccount = JSON.parse(fileContent);
    
    // Validate service account has required fields
    if (!serviceAccount.project_id) {
      console.error('❌ Service account file is missing project_id');
      console.log('💡 Tip: Make sure you downloaded the correct JSON file from Firebase Console');
      process.exit(1);
    }
    
    console.log('✅ Service account loaded successfully');
    console.log(`   Project ID: ${serviceAccount.project_id}`);
  } catch (error) {
    console.error('❌ Error loading service account file:', error.message);
    console.log('💡 Tip: Make sure firebase-service-account.json exists in the Backend folder');
    process.exit(1);
  }
} else {
  // Using environment variables
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

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'clothing-brand-apex.firebasestorage.app',
  });

  console.log('✅ Firebase Admin initialized successfully');
} catch (error) {
  console.error('❌ Firebase Admin initialization error:', error.message);
  process.exit(1);
}

// Export Firebase services
const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage();

module.exports = {
  admin,
  db,
  auth,
  storage,
};
