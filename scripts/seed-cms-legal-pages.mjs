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

function createHomeSnapshot({ title, path, metaDescription }) {
      return {
            title,
            blocks: [
                  {
                        id: randomUUID(),
                        type: 'hero',
                        visible: true,
                        data: {
                              headline: 'Therapy that meets you where you are',
                              subheadline: 'Compassionate, evidence-informed care with in-person and secure telehealth options. We accept many major insurance plans and make getting started straightforward.',
                              alignment: 'left',
                              theme: 'primary',
                              ctaPrimary: {
                                    label: 'Request Appointment',
                                    href: '/contact',
                              },
                              ctaSecondary: {
                                    label: 'Explore Services',
                                    href: '/services',
                              },
                        },
                  },
                  {
                        id: randomUUID(),
                        type: 'trust_bar',
                        visible: true,
                        data: {
                              title: 'Access-focused care for real life',
                              items: [
                                    {
                                          label: 'Insurance accepted',
                                          description: 'Most major plans accepted with support during intake.',
                                    },
                                    {
                                          label: 'Flexible formats',
                                          description: 'In-person visits and secure telehealth appointments.',
                                    },
                                    {
                                          label: 'Licensed clinicians',
                                          description: 'Experienced therapists delivering evidence-informed care.',
                                    },
                              ],
                        },
                  },
                  {
                        id: randomUUID(),
                        type: 'image_text',
                        visible: true,
                        data: {
                              headline: 'Support for what you are carrying right now',
                              body: 'Whether you are navigating anxiety, relationship stress, grief, or life transitions, therapy can provide practical tools and steady guidance. We tailor treatment plans to your goals and pace.',
                              imageUrl: '',
                              imageAlt: '',
                              imageSide: 'right',
                        },
                  },
                  {
                        id: randomUUID(),
                        type: 'process_steps',
                        visible: true,
                        data: {
                              title: 'A clear path from first contact to steady progress',
                              intro: 'We keep intake simple and collaborative from day one.',
                              steps: [
                                    {
                                          title: 'Request an appointment',
                                          description: 'Share your availability, insurance, and any therapist preferences.',
                                    },
                                    {
                                          title: 'Get matched',
                                          description: 'We connect you with a therapist who aligns with your goals.',
                                    },
                                    {
                                          title: 'Begin care',
                                          description: 'Start one-on-one sessions and build momentum over time.',
                                    },
                              ],
                        },
                  },
                  {
                        id: randomUUID(),
                        type: 'team_grid',
                        visible: true,
                        data: {
                              title: 'Meet our therapists',
                              intro: 'A multidisciplinary team committed to thoughtful, effective care.',
                              columns: 3,
                              members: [
                                    {
                                          name: 'Erin Alexander-Bell',
                                          role: 'MA, LPC',
                                          bio: 'Individual and family therapy with a compassionate, client-centered approach.',
                                          imageUrl: '',
                                          imageAlt: '',
                                          profileHref: '/therapists',
                                    },
                                    {
                                          name: 'Zach Dugger',
                                          role: 'MA, BCBA, LLP',
                                          bio: 'Behavioral psychology and evidence-based therapeutic interventions.',
                                          imageUrl: '',
                                          imageAlt: '',
                                          profileHref: '/therapists',
                                    },
                                    {
                                          name: 'Ian Warnsley',
                                          role: 'MA, LPC',
                                          bio: 'Compassionate therapy for individuals and couples.',
                                          imageUrl: '',
                                          imageAlt: '',
                                          profileHref: '/therapists',
                                    },
                              ],
                        },
                  },
                  {
                        id: randomUUID(),
                        type: 'insurance_strip',
                        visible: true,
                        data: {
                              title: 'Insurance and scheduling',
                              intro: 'We offer practical scheduling support and accept many major plans.',
                              providers: [
                                    'Blue Cross Blue Shield',
                                    'Blue Care Network',
                                    'Priority Health',
                                    'United Healthcare / UBH',
                                    'Aetna',
                                    'Michigan Medicaid',
                                    'Medicare',
                              ],
                              note: 'Have another plan? Contact us and we will confirm whether we can bill it.',
                              ctaLabel: 'Request Appointment',
                              ctaHref: '/contact',
                        },
                  },
                  {
                        id: randomUUID(),
                        type: 'faq',
                        visible: true,
                        data: {
                              title: 'Frequently asked questions',
                              enableSchema: true,
                              items: [
                                    {
                                          question: 'Do you offer telehealth sessions?',
                                          answer: 'Yes. We offer secure telehealth sessions in addition to in-person appointments.',
                                    },
                                    {
                                          question: 'How quickly will someone respond?',
                                          answer: 'We aim to respond to new appointment requests within 1-2 business days.',
                                    },
                                    {
                                          question: 'Can this practice help in a crisis?',
                                          answer: 'This practice is not an emergency service. If you are in immediate danger, call 911. For mental health crisis support, call or text 988.',
                                    },
                              ],
                        },
                  },
                  {
                        id: randomUUID(),
                        type: 'cta_band',
                        visible: true,
                        data: {
                              heading: 'Ready to take the next step?',
                              body: 'Request an appointment and our team will help you get started.',
                              buttonLabel: 'Request Appointment',
                              buttonHref: '/contact',
                              style: 'primary',
                        },
                  },
            ],
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
            slug: 'home',
            path: '/',
            title: 'Diversified Psychological Services | Therapy in Kalamazoo, MI',
            metaDescription: 'Compassionate and evidence-informed therapy in Kalamazoo, MI with in-person and secure telehealth options. Request an appointment with Diversified Psychological Services.',
            content: '',
      },
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

            const snapshot = definition.slug === 'home'
                  ? createHomeSnapshot(definition)
                  : createSnapshot(definition);

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

      console.log('System page seed report');
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
