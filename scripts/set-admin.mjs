import fs from 'fs';
import path from 'path';
import process from 'process';
import admin from 'firebase-admin';

const uid = process.argv[2];

if (!uid) {
      console.error('Usage: node scripts/set-admin.mjs <uid>');
      process.exit(1);
}

const credentialsPath =
      process.env.FIREBASE_ADMIN_CREDENTIALS_PATH ||
      'secrets/dps-website-zd-firebase-adminsdk-fbsvc-0f085f7df8.json';

const resolvedPath = path.isAbsolute(credentialsPath)
      ? credentialsPath
      : path.join(process.cwd(), credentialsPath);

const serviceAccount = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'));

if (!admin.apps.length) {
      admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
      });
}

const db = admin.firestore();
const now = new Date().toISOString();

(async () => {
      await db.collection('admins').doc(uid).set(
            {
                  role: 'admin',
                  active: true,
                  created_at: now,
                  updated_at: now,
            },
            { merge: true }
      );

      console.log(`Admin role set for ${uid}`);
})().catch((err) => {
      console.error(err);
      process.exit(1);
});
