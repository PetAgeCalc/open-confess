import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

/**
 * Dual Firebase architecture:
 *  - postsApp / postsDb   -> stores the `confessions` collection (text, images, location, meta)
 *  - interactionsApp / interactionsDb -> stores `post_interactions` (likes/reactions) and their
 *    `comments` sub-collection.
 *
 * Splitting these across two Firebase projects lets you put confession
 * content and high-churn interaction writes (likes/comments) on separate
 * billing/quota boundaries, and lets you lock down security rules
 * independently (e.g. interactions are far more write-heavy).
 *
 * Both are optional: if env vars are absent, `isFirebaseConfigured()`
 * returns false and confessionService.ts transparently serves the local
 * seed dataset with localStorage persistence instead.
 */

const postsConfig = {
  apiKey: import.meta.env.VITE_POSTS_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_POSTS_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_POSTS_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_POSTS_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_POSTS_FIREBASE_SENDER_ID,
  appId: import.meta.env.VITE_POSTS_FIREBASE_APP_ID,
};

const interactionsConfig = {
  apiKey: import.meta.env.VITE_INTERACTIONS_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_INTERACTIONS_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_INTERACTIONS_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_INTERACTIONS_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_INTERACTIONS_FIREBASE_SENDER_ID,
  appId: import.meta.env.VITE_INTERACTIONS_FIREBASE_APP_ID,
};

function isConfigComplete(config: Record<string, unknown>): boolean {
  return Object.values(config).every((v) => typeof v === 'string' && v.length > 0);
}

export const isPostsFirebaseConfigured = isConfigComplete(postsConfig);
export const isInteractionsFirebaseConfigured = isConfigComplete(interactionsConfig);
export const isFirebaseConfigured = isPostsFirebaseConfigured && isInteractionsFirebaseConfigured;

let postsApp: FirebaseApp | null = null;
let interactionsApp: FirebaseApp | null = null;
export let postsDb: Firestore | null = null;
export let interactionsDb: Firestore | null = null;

if (isPostsFirebaseConfigured) {
  postsApp = initializeApp(postsConfig as Record<string, string>, 'postsApp');
  postsDb = getFirestore(postsApp);
}

if (isInteractionsFirebaseConfigured) {
  interactionsApp = initializeApp(interactionsConfig as Record<string, string>, 'interactionsApp');
  interactionsDb = getFirestore(interactionsApp);
}
