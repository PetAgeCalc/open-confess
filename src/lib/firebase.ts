import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

/**
 * Dual Firebase architecture:
 *  - postsApp / postsDb        -> stores the `confessions` collection (text, images, location, meta)
 *  - interactionsApp / interactionsDb -> stores `post_interactions` (likes/reactions) and their
 *    `comments` sub-collection.
 */

// 1. POSTS DATABASE (open-confees)
const postsConfig = {
  apiKey: import.meta.env.VITE_POSTS_FIREBASE_API_KEY || "AIzaSyDa-wzQxXm1q5lE8vI4q2Fq...", // Fallback to env if present
  authDomain: "open-confees.firebaseapp.com",
  projectId: "open-confees",
  storageBucket: "open-confees.firebasestorage.app",
  messagingSenderId: "729352945763",
  appId: "1:729352945763:web:9c97793fc3e0d8cb3fdfc7",
};

// 2. INTERACTIONS DATABASE (ageless-lamp-461817-i8)
const interactionsConfig = {
  apiKey: "AIzaSyBnbNobd6s1GY9c7bdt6aEhPxP26Wa2VF4",
  authDomain: "ageless-lamp-461817-i8.firebaseapp.com",
  projectId: "ageless-lamp-461817-i8",
  storageBucket: "ageless-lamp-461817-i8.firebasestorage.app",
  messagingSenderId: "990239046881",
  appId: "1:990239046881:web:b0f47572c499a0f0120ba0",
};

function isConfigComplete(config: Record<string, unknown>): boolean {
  return Object.values(config).every((v) => typeof v === 'string' && v.length > 0 && !v.includes('...'));
}

export const isPostsFirebaseConfigured = isConfigComplete(postsConfig) || Boolean(import.meta.env.VITE_POSTS_FIREBASE_API_KEY);
export const isInteractionsFirebaseConfigured = isConfigComplete(interactionsConfig);
export const isFirebaseConfigured = isPostsFirebaseConfigured && isInteractionsFirebaseConfigured;

let postsApp: FirebaseApp | null = null;
let interactionsApp: FirebaseApp | null = null;
export let postsDb: Firestore | null = null;
export let interactionsDb: Firestore | null = null;

// Initialize Posts Project
try {
  const finalPostsConfig = {
    ...postsConfig,
    apiKey: import.meta.env.VITE_POSTS_FIREBASE_API_KEY || postsConfig.apiKey,
  };
  postsApp = initializeApp(finalPostsConfig as Record<string, string>, 'postsApp');
  postsDb = getFirestore(postsApp);
} catch (e) {
  console.error("Error initializing posts Firebase:", e);
}

// Initialize Interactions Project
try {
  interactionsApp = initializeApp(interactionsConfig as Record<string, string>, 'interactionsApp');
  interactionsDb = getFirestore(interactionsApp);
} catch (e) {
  console.error("Error initializing interactions Firebase:", e);
}
