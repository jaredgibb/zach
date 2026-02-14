import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

type FirebaseWebConfig = {
      apiKey: string;
      authDomain: string;
      projectId: string;
      storageBucket?: string;
      messagingSenderId?: string;
      appId: string;
};

const CONFIG_ERROR =
      'Firebase web config is missing. Set NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, NEXT_PUBLIC_FIREBASE_PROJECT_ID, and NEXT_PUBLIC_FIREBASE_APP_ID.';

let cachedApp: FirebaseApp | null = null;
let cachedAuth: Auth | null = null;
let cachedDb: Firestore | null = null;
let cachedStorage: FirebaseStorage | null = null;

function readWebConfig(): FirebaseWebConfig {
      const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim();
      const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?.trim();
      const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim();
      const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID?.trim();

      if (!apiKey || !authDomain || !projectId || !appId) {
            throw new Error(CONFIG_ERROR);
      }

      return {
            apiKey,
            authDomain,
            projectId,
            appId,
            storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim(),
            messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?.trim(),
      };
}

export function getClientApp(): FirebaseApp {
      if (typeof window === 'undefined') {
            throw new Error('Firebase web app is only available in the browser.');
      }

      if (cachedApp) {
            return cachedApp;
      }

      const firebaseConfig = readWebConfig();
      cachedApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
      return cachedApp;
}

export function getClientAuth(): Auth {
      if (cachedAuth) {
            return cachedAuth;
      }

      cachedAuth = getAuth(getClientApp());
      return cachedAuth;
}

export function getClientDb(): Firestore {
      if (cachedDb) {
            return cachedDb;
      }

      cachedDb = getFirestore(getClientApp());
      return cachedDb;
}

export function getClientStorage(): FirebaseStorage {
      if (cachedStorage) {
            return cachedStorage;
      }

      cachedStorage = getStorage(getClientApp());
      return cachedStorage;
}
