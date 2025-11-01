// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDGjwEIZSwiojyOun-GGstkdU-v8xg1jzk",
  authDomain: "clothing-brand-apex.firebaseapp.com",
  projectId: "clothing-brand-apex",
  storageBucket: "clothing-brand-apex.firebasestorage.app",
  messagingSenderId: "934577496902",
  appId: "1:934577496902:web:edf153b24f8848ce5dfb47",
  measurementId: "G-ZRVK4W4WNC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Set auth persistence to LOCAL (survives browser refresh)
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log('✅ Firebase auth persistence enabled');
  })
  .catch((error) => {
    console.error('❌ Firebase auth persistence error:', error);
  });

// Export Firebase services for use in your app
export { app, analytics, auth, db, storage };
export default app;
