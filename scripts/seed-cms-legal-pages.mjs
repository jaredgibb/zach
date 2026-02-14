import fs from 'fs';
import path from 'path';
import process from 'process';
import admin from 'firebase-admin';
import { randomUUID } from 'crypto';

const args = process.argv.slice(2);
const shouldWrite = args.includes('--write');
const overwrite = args.includes('--overwrite');

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

function escapeHtml(value) {
      return value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
}

function plainTextToHtml(value) {
      const normalized = value.trim();
      if (!normalized) {
            return '';
      }

      return normalized
            .split(/\n{2,}/)
            .map((paragraph) => paragraph.trim())
            .filter(Boolean)
            .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, '<br />')}</p>`)
            .join('');
}

function createRichTextBlock(plainText) {
      return {
            id: randomUUID(),
            type: 'rich_text',
            visible: true,
            data: {
                  yoopta: null,
                  plainText,
                  html: plainTextToHtml(plainText),
            },
      };
}

function createSnapshot({ title, path, metaDescription, content }) {
      return {
            title,
            blocks: [createRichTextBlock(content)],
            seo: {
                  metaTitle: title,
                  metaDescription,
                  canonicalPath: path,
                  ogTitle: title,
                  ogDescription: metaDescription,
                  ogImageUrl: '',
                  noIndex: false,
                  noFollow: false,
                  schemaJson: '',
            },
            nav: {
                  showInHeader: false,
                  headerLabel: '',
                  headerOrder: 100,
                  showInFooter: false,
                  footerLabel: '',
                  footerOrder: 100,
            },
      };
}

const systemPages = [
      {
            slug: 'privacy-policy',
            path: '/privacy-policy',
            title: 'Privacy Policy',
            metaDescription: 'Diversified Psychological Services privacy policy and information handling practices.',
            content: [
                  'Diversified Psychological Services is committed to protecting your privacy and personal information. This privacy policy outlines how we collect, use, and protect your information.',
                  'Information We Collect\nDetails about information collection practices will be provided here.',
                  'How We Use Your Information\nInformation about how we use client data will be detailed here.',
                  'Information Security\nDetails about our security measures and practices will be outlined here.',
                  'Contact Us\nIf you have questions about this privacy policy, please contact us at zachd@diversifiedpsychservices.com.',
            ].join('\n\n'),
      },
      {
            slug: 'privacy-practices',
            path: '/privacy-practices',
            title: 'Notice of Privacy Practices',
            metaDescription: 'HIPAA notice of privacy practices and patient rights information.',
            content: [
                  'This notice describes how medical information about you may be used and disclosed and how you can get access to this information.',
                  'Your Health Information Rights\nDetails about client rights under HIPAA will be provided here.',
                  'How We May Use and Disclose Health Information\nInformation about permitted uses and disclosures will be detailed here.',
                  'Our Responsibilities\nDetails about our responsibilities regarding protected health information will be outlined here.',
                  'Contact Information\nFor more information about this notice or our privacy practices, please contact zachd@diversifiedpsychservices.com.',
            ].join('\n\n'),
      },
      {
            slug: 'no-surprises-act',
            path: '/no-surprises-act',
            title: 'No Surprises Act',
            metaDescription: 'Your rights and protections under the No Surprises Act.',
            content: [
                  'The No Surprises Act protects you from unexpected medical bills. You have the right to receive a Good Faith Estimate explaining how much your medical care will cost.',
                  'What is the No Surprises Act?\nThe No Surprises Act is a federal law that took effect January 1, 2022, and provides protections against surprise medical bills.',
                  'Good Faith Estimate\nUnder the law, healthcare providers need to give patients who do not have insurance or who are not using insurance an estimate of the bill for medical items and services.',
                  'For More Information\nVisit www.cms.gov/nosurprises or call 1-800-985-3059 for more information about your rights under federal law.',
                  'Questions\nIf you have questions, contact zachd@diversifiedpsychservices.com.',
            ].join('\n\n'),
      },
      {
            slug: 'nondiscrimination',
            path: '/nondiscrimination',
            title: 'Notice of Nondiscrimination',
            metaDescription: 'Our commitment to equal access and nondiscrimination in care.',
            content: [
                  'Diversified Psychological Services complies with applicable Federal civil rights laws and does not discriminate on the basis of race, color, national origin, age, disability, or sex.',
                  'Accessibility\nDetails about accessibility accommodations and language assistance services will be provided here.',
                  'Complaints\nIf you believe you have been discriminated against, you have the right to file a complaint. Information about the complaint process will be detailed here.',
                  'Contact Us\nFor questions or concerns, contact zachd@diversifiedpsychservices.com.',
            ].join('\n\n'),
      },
];

async function run() {
      const db = admin.firestore();
      const now = new Date().toISOString();

      const report = [];

      for (const definition of systemPages) {
            const querySnapshot = await db
                  .collection('pages')
                  .where('slug', '==', definition.slug)
                  .limit(1)
                  .get();

            const snapshot = createSnapshot(definition);

            if (querySnapshot.empty) {
                  report.push(`create ${definition.slug}`);

                  if (shouldWrite) {
                        await db.collection('pages').add({
                              kind: 'system',
                              status: 'published',
                              title: definition.title,
                              slug: definition.slug,
                              path: definition.path,
                              createdAt: now,
                              createdBy: 'system',
                              updatedAt: now,
                              updatedBy: 'system',
                              publishedAt: now,
                              publishedBy: 'system',
                              draft: snapshot,
                              published: snapshot,
                        });
                  }

                  continue;
            }

            const existingDoc = querySnapshot.docs[0];
            const existing = existingDoc.data();

            if (existing.kind !== 'system') {
                  report.push(`skip ${definition.slug} (existing non-system page)`);
                  continue;
            }

            report.push(overwrite ? `update ${definition.slug}` : `skip ${definition.slug} (already exists)`);

            if (shouldWrite && overwrite) {
                  await existingDoc.ref.set(
                        {
                              title: definition.title,
                              path: definition.path,
                              updatedAt: now,
                              updatedBy: 'system',
                              publishedAt: now,
                              publishedBy: 'system',
                              draft: snapshot,
                              published: snapshot,
                        },
                        { merge: true }
                  );
            }
      }

      console.log('System legal page seed report');
      for (const line of report) {
            console.log(`- ${line}`);
      }
      console.log('');
      console.log(shouldWrite ? 'Mode: WRITE' : 'Mode: DRY RUN (add --write to apply)');
      if (overwrite) {
            console.log('Overwrite mode enabled.');
      }
}

run().catch((error) => {
      console.error(error);
      process.exit(1);
});
