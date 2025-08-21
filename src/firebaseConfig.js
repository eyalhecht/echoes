// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFunctions, connectFunctionsEmulator, httpsCallable } from 'firebase/functions';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage} from 'firebase/storage';

// --- YOUR ACTUAL FIREBASE PROJECT CONFIG ---
// Replace these with the values you copied from the Firebase Console
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Services
export const auth = getAuth(app);
export const functions = getFunctions(app);
export const db = getFirestore(app); // You'll need this for Firestore operations
export const storage = getStorage(app);

// --- Emulator Connection (Crucial for Local Development) ---
// This ensures your app connects to local emulators when running in development
// and to production Firebase services when deployed.
if (import.meta.env.DEV || window.location.hostname === 'localhost') {
    console.log('Connecting to Firebase Emulators...');
    // Connect to the Auth Emulator (default port 9099)
    // connectAuthEmulator(auth, 'http://localhost:9099');
    // Connect to the Functions Emulator (default port 5001)
    connectFunctionsEmulator(functions, 'localhost', 5001);
    // Connect to the Firestore Emulator (default port 8080)
    // connectFirestoreEmulator(db, 'localhost', 8080);
}

// --- Export Callable Function References ---
// Create a callable function reference for your apiGateway
export const callApiGateway = httpsCallable(functions, 'apiGateway');

// You can also export other specific callable functions if you have them separately
// e.g., export const callSpecificAction = httpsCallable(functions, 'specificAction');