import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyCmZuV0HUYxDApirBKfvLYJu0FhVjwFgMA',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'explore-hub-fca42.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'explore-hub-fca42',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'explore-hub-fca42.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export default app;
