import 'server-only';

import fs from 'node:fs';
import path from 'node:path';
import { applicationDefault, cert, getApps, initializeApp, type App, type ServiceAccount } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

const DEFAULT_SERVICE_ACCOUNT_PATH = path.join(
      process.cwd(),
      'secrets',
      'dps-website-zd-firebase-adminsdk-fbsvc-0f085f7df8.json',
);

function parseServiceAccount(json: string, source: string): ServiceAccount {
      try {
            return JSON.parse(json) as ServiceAccount;
      } catch (error) {
            throw new Error(`Invalid Firebase Admin service account JSON from ${source}: ${(error as Error).message}`);
      }
}

function readServiceAccount(): ServiceAccount | null {
      const rawJson = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON;
      if (rawJson) {
            return parseServiceAccount(rawJson, 'FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON');
      }

      const configuredPath = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_PATH;
      const resolvedPath = configuredPath
            ? path.resolve(configuredPath)
            : DEFAULT_SERVICE_ACCOUNT_PATH;

      if (!fs.existsSync(resolvedPath)) {
            return null;
      }

      const fileContents = fs.readFileSync(resolvedPath, 'utf8');
      return parseServiceAccount(fileContents, resolvedPath);
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
            credential: serviceAccount ? cert(serviceAccount) : applicationDefault(),
            storageBucket,
      });
}

export const adminAuth = getAuth(getAdminApp());
export const adminDb = getFirestore(getAdminApp());
export const adminStorage = getStorage(getAdminApp());
