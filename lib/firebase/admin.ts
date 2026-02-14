import 'server-only';

import fs from 'node:fs';
import path from 'node:path';
import { cert, getApps, initializeApp, type App, type ServiceAccount } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

const DEFAULT_SERVICE_ACCOUNT_PATH = path.join(
      process.cwd(),
      'secrets',
      'dps-website-zd-firebase-adminsdk-fbsvc-0f085f7df8.json',
);

function readServiceAccount(): ServiceAccount {
      const rawJson = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON;
      if (rawJson) {
            return JSON.parse(rawJson) as ServiceAccount;
      }

      const configuredPath = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_PATH;
      const resolvedPath = configuredPath
            ? path.resolve(configuredPath)
            : DEFAULT_SERVICE_ACCOUNT_PATH;

      if (!fs.existsSync(resolvedPath)) {
            throw new Error(
                  'Firebase Admin credentials not found. Set FIREBASE_ADMIN_SERVICE_ACCOUNT_PATH or FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON.',
            );
      }

      const fileContents = fs.readFileSync(resolvedPath, 'utf8');
      return JSON.parse(fileContents) as ServiceAccount;
}

function getStorageBucket(): string | undefined {
      const configured = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim();
      if (configured) {
            return configured;
      }

      const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim();
      if (!projectId) {
            return undefined;
      }

      return `${projectId}.firebasestorage.app`;
}

function getAdminApp(): App {
      if (getApps().length > 0) {
            return getApps()[0]!;
      }

      const serviceAccount = readServiceAccount();
      const storageBucket = getStorageBucket();

      return initializeApp({
            credential: cert(serviceAccount),
            storageBucket,
      });
}

export const adminAuth = getAuth(getAdminApp());
export const adminDb = getFirestore(getAdminApp());
export const adminStorage = getStorage(getAdminApp());
