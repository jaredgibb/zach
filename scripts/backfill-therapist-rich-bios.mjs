import fs from 'fs';
import path from 'path';
import process from 'process';
import admin from 'firebase-admin';
import { randomUUID } from 'crypto';

const args = process.argv.slice(2);
const shouldWrite = args.includes('--write');
const includeExisting = args.includes('--include-existing');

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

function normalizeRichBio(value) {
      if (!value || typeof value !== 'object' || Array.isArray(value)) {
            return null;
      }

      return Object.keys(value).length > 0 ? value : null;
}

function createParagraphBlock(text, order) {
      const blockId = randomUUID();
      const elementId = randomUUID();

      return [
            blockId,
            {
                  id: blockId,
                  type: 'Paragraph',
                  value: [
                        {
                              id: elementId,
                              type: 'paragraph',
                              children: [{ text }],
                              props: { nodeType: 'block' },
                        },
                  ],
                  meta: {
                        order,
                        depth: 0,
                        align: 'left',
                  },
            },
      ];
}

function buildRichBioFromPlainText(fullBio) {
      if (typeof fullBio !== 'string') {
            return null;
      }

      const paragraphs = fullBio
            .trim()
            .split(/\n{2,}/)
            .map((paragraph) => paragraph.trim())
            .filter((paragraph) => paragraph.length > 0);

      if (paragraphs.length === 0) {
            return null;
      }

      return Object.fromEntries(
            paragraphs.map((paragraph, index) => createParagraphBlock(paragraph, index))
      );
}

async function run() {
      const db = admin.firestore();
      const snapshot = await db.collection('therapists').get();

      let scanned = 0;
      let eligible = 0;
      let updated = 0;
      let skipped = 0;

      const now = new Date().toISOString();
      const batch = db.batch();
      const writeDetails = [];

      for (const therapistDoc of snapshot.docs) {
            scanned += 1;
            const data = therapistDoc.data();

            const existingRichBio = normalizeRichBio(data.full_bio_rich);
            if (existingRichBio && !includeExisting) {
                  skipped += 1;
                  continue;
            }

            const richBio = buildRichBioFromPlainText(data.full_bio ?? '');
            if (!richBio) {
                  skipped += 1;
                  continue;
            }

            eligible += 1;
            writeDetails.push({
                  id: therapistDoc.id,
                  name: typeof data.name === 'string' ? data.name : '(unnamed)',
            });

            if (shouldWrite) {
                  batch.update(therapistDoc.ref, {
                        full_bio_rich: richBio,
                        updated_at: now,
                  });
                  updated += 1;
            }
      }

      if (shouldWrite && updated > 0) {
            await batch.commit();
      }

      console.log('Therapist rich bio backfill summary');
      console.log(`- Scanned: ${scanned}`);
      console.log(`- Eligible for backfill: ${eligible}`);
      console.log(`- Skipped: ${skipped}`);
      console.log(`- Updated: ${updated}`);
      console.log('');
      console.log('Profiles targeted:');
      for (const item of writeDetails) {
            console.log(`- ${item.name} (${item.id})`);
      }
      console.log('');
      console.log(
            shouldWrite
                  ? 'Mode: WRITE'
                  : 'Mode: DRY RUN (rerun with --write to apply updates)'
      );
}

run().catch((err) => {
      console.error(err);
      process.exit(1);
});
