import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 🔧 Replace these placeholders with your real Firebase project config.
// Get them from: Firebase Console → Project Settings → Your apps → Web app
const firebaseConfig = {
  apiKey: "AIzaSyDF8brkfyIA0JT-e0WayvRZ5ffO0uKmtRU",
  authDomain: "dine-time-c8c05.firebaseapp.com",
  projectId: "dine-time-c8c05",
  storageBucket: "dine-time-c8c05.firebasestorage.app",
  messagingSenderId: "627365526506",
  appId: "1:627365526506:web:58098662e6a46e79995093",
  measurementId: "G-VGHMNPBVGC"
};

// Auto-detect demo mode when keys aren't filled in — app still runs fully offline.
export const DEMO_MODE = firebaseConfig.apiKey === 'YOUR_API_KEY';

let app = null;
let auth = null;
let db = null;

if (!DEMO_MODE) {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    try {
        auth = initializeAuth(app, {
            persistence: getReactNativePersistence(AsyncStorage),
        });
    } catch {
        auth = getAuth(app);
    }
    db = getFirestore(app);
}

export { app, auth, db };
