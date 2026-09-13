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

// 1. POSTS DATABASE (open-confees) - Ab ye complete key ke sath hai
const postsConfig = {
  apiKey: "AIzaSyApMJTBvr7zbzJTP85xZAb994NfLWUBSz8",
  authDomain: "open-confees.firebaseapp.com",
  projectId: "open-confees",
  storageBucket: "open-confees.firebasestorage.app",
  messagingSenderId: "516455021498",
  appId: "1:516455021498:web:7e97a52d0fbd1088a1fb83",
  measurementId: "G-DR6LPC8RS2",
};

// 2. INTERACTIONS DATABASE (ageless-lamp-461817-i8)
const interactionsConfig = {
  apiKey: "AIzaSyBnbNobd6s1GY9c7bdt6aEhPxP26Wa2VF4",
  authDomain: "ageless-lamp-461817-i8.firebaseapp.com",
  projectId: "ageless-lamp-461817-i8",
  storageBucket: "ageless-lamp-461817-i8.firebasestorage.app",
  messagingSenderId: "990239046881",
  appId: "1:990239046881:web:b0f47572c499a0f0120ba0",
  measurementId: "G-ZHMZ54PBCD",
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

// Initialize Posts Project with Fast Offline Cache
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

// Initialize Interactions Project with Fast Offline Cache
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
