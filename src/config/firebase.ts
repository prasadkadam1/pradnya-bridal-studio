import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration using Vite environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Require the full Firebase client configuration before enabling live services.
const requiredFirebaseValues = [
  firebaseConfig.apiKey,
  firebaseConfig.authDomain,
  firebaseConfig.projectId,
  firebaseConfig.storageBucket,
  firebaseConfig.messagingSenderId,
  firebaseConfig.appId,
];

export const isFirebaseConfigured = requiredFirebaseValues.every(
  (value) => typeof value === 'string' && value.trim() !== '' && !value.startsWith('YOUR_'),
);

let app: FirebaseApp;
let auth: ReturnType<typeof getAuth> | null = null;
let db: ReturnType<typeof getFirestore> | null = null;
let storage: ReturnType<typeof getStorage> | null = null;
let analytics: Awaited<ReturnType<typeof getAnalytics>> | null = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    if (firebaseConfig.measurementId) {
      isSupported().then((supported) => {
        if (supported) {
          analytics = getAnalytics(app);
        }
      });
    }
    console.log("Firebase initialized successfully in Live Mode.");
  } catch (error) {
    console.error("Firebase initialization failed. Live Firebase services are unavailable:", error);
  }
} else {
  console.log("Firebase credentials are incomplete. Live Firebase services are unavailable.");
}

export { auth, db, storage, analytics };
