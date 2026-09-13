import { initializeApp, FirebaseApp } from 'firebase/app';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  Firestore,
} from 'firebase/firestore';

/**
 * Dual Firebase architecture:
 *  - postsApp / postsDb        -> stores the `confessions` collection (text, images, location, meta)
 *  - interactionsApp / interactionsDb -> stores `reactions` and `comments`
 */

// 1. POSTS DATABASE (open-confees)
const postsConfig = {
  apiKey: import.meta.env.VITE_POSTS_FIREBASE_API_KEY || "AIzaSyApMJTBvr7zbzJTP85xZAb994NfLWUBSz8",
  authDomain: import.meta.env.VITE_POSTS_FIREBASE_AUTH_DOMAIN || "open-confees.firebaseapp.com",
  projectId: import.meta.env.VITE_POSTS_FIREBASE_PROJECT_ID || "open-confees",
  storageBucket: import.meta.env.VITE_POSTS_FIREBASE_STORAGE_BUCKET || "open-confees.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_POSTS_FIREBASE_MESSAGING_SENDER_ID || "516455021498",
  appId: import.meta.env.VITE_POSTS_FIREBASE_APP_ID || "1:516455021498:web:7e97a52d0fbd1088a1fb83",
  measurementId: import.meta.env.VITE_POSTS_FIREBASE_MEASUREMENT_ID || "G-DR6LPC8RS2",
};

// 2. INTERACTIONS DATABASE (ageless-lamp-461817-i8)
const interactionsConfig = {
  apiKey: import.meta.env.VITE_INTERACTIONS_FIREBASE_API_KEY || "AIzaSyBnbNobd6s1GY9c7bdt6aEhPxP26Wa2VF4",
  authDomain: import.meta.env.VITE_INTERACTIONS_FIREBASE_AUTH_DOMAIN || "ageless-lamp-461817-i8.firebaseapp.com",
  projectId: import.meta.env.VITE_INTERACTIONS_FIREBASE_PROJECT_ID || "ageless-lamp-461817-i8",
  storageBucket: import.meta.env.VITE_INTERACTIONS_FIREBASE_STORAGE_BUCKET || "ageless-lamp-461817-i8.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_INTERACTIONS_FIREBASE_MESSAGING_SENDER_ID || "990239046881",
  appId: import.meta.env.VITE_INTERACTIONS_FIREBASE_APP_ID || "1:990239046881:web:b0f47572c499a0f0120ba0",
  measurementId: import.meta.env.VITE_INTERACTIONS_FIREBASE_MEASUREMENT_ID || "G-ZHMZ54PBCD",
};

function isConfigComplete(config: Record<string, unknown>): boolean {
  return Object.values(config).every(
    (v) => typeof v === 'string' && v.length > 0 && !v.includes('...')
  );
}

export const isPostsFirebaseConfigured = isConfigComplete(postsConfig);
export const isInteractionsFirebaseConfigured = isConfigComplete(interactionsConfig);
export const isFirebaseConfigured = isPostsFirebaseConfigured && isInteractionsFirebaseConfigured;

let postsApp: FirebaseApp | null = null;
let interactionsApp: FirebaseApp | null = null;
export let postsDb: Firestore | null = null;
export let interactionsDb: Firestore | null = null;

// Initialize Posts Project with Fast Local Cache
try {
  postsApp = initializeApp(postsConfig as Record<string, string>, 'postsApp');
  postsDb = initializeFirestore(postsApp, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager(),
    }),
  });
} catch (e) {
  console.error("Error initializing posts Firebase:", e);
}

// Initialize Interactions Project with Fast Local Cache
try {
  interactionsApp = initializeApp(interactionsConfig as Record<string, string>, 'interactionsApp');
  interactionsDb = initializeFirestore(interactionsApp, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager(),
    }),
  });
} catch (e) {
  console.error("Error initializing interactions Firebase:", e);
}
