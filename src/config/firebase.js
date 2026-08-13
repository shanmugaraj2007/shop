import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Replace the values below with your Firebase project config from Firebase Console:
// Firebase Console -> Project Settings -> General -> Your Apps -> Web App
const firebaseConfig = {
  apiKey: "AIzaSyCb_0_7xcm_9Hj6xFSDB9VS1033vP2gH9g",
  authDomain: "stocksummary123.firebaseapp.com",
  projectId: "stocksummary123",
  storageBucket: "stocksummary123.appspot.com",
  messagingSenderId: "101688092476",
  appId: "1:101688092476:web:b53b2c2d8ed724df06a039"
};

// Check if valid credentials are set
export const isFirebaseConfigured = () => {
  return firebaseConfig.apiKey && 
    firebaseConfig.apiKey !== "YOUR_API_KEY" && 
    firebaseConfig.apiKey !== "Paste_Your_API_Key_Here";
};

let db = null;

if (isFirebaseConfigured()) {
  try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("⚡ Firebase Firestore initialized successfully.");
  } catch (err) {
    console.error("Firebase initialization error:", err);
  }
} else {
  console.warn("⚠️ Firebase credentials not configured yet. Using local database mode.");
}

export { db };
