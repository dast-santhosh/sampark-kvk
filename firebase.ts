import { initializeApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

// Helper to safely get env vars from process (CRA/Next) or import.meta (Vite)
const getEnv = (key: string) => {
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
      // @ts-ignore
      return import.meta.env[key];
    }
  } catch (e) {}
  
  try {
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key];
    }
  } catch (e) {}

  return undefined;
};

const apiKey = getEnv('REACT_APP_FIREBASE_API_KEY');

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: getEnv('REACT_APP_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnv('REACT_APP_FIREBASE_PROJECT_ID'),
  storageBucket: getEnv('REACT_APP_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnv('REACT_APP_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnv('REACT_APP_FIREBASE_APP_ID')
};

// Check if configuration is present
export const isFirebaseConfigured = !!(apiKey && apiKey.length > 0 && !apiKey.includes("your-api-key"));

let app;
let auth: Auth;
let db: Firestore;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.error("Firebase Initialization Error:", error);
    // Fallback to prevent crash if config is technically present but invalid
    auth = {} as Auth; 
    db = {} as Firestore;
  }
} else {
  // Return dummy objects to satisfy imports in other files
  // The App component will check `isFirebaseConfigured` and block usage before these are accessed
  console.warn("Firebase config missing. App entering Setup Mode.");
  auth = {} as Auth;
  db = {} as Firestore;
}

export { auth, db };