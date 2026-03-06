import fs from 'fs';
import path from 'path';
import process from 'process';
import admin from 'firebase-admin';
import { randomUUID } from 'crypto';

const shouldWrite = process.argv.includes('--write');

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

const therapistProfiles = [
      {
            name: 'Aaron Wilson',
            slug: 'aaron-wilson',
            credentials: 'LMSW',
            title: "Licensed Master's Social Worker",
            short_bio:
                  'Therapist since 2009 with broad experience supporting adolescents, families, couples, adults, and older adults.',
            full_bio: `I enjoy working with clients with many different issues and backgrounds. I have been a therapist since 2009. I have experience working with adolescents, families, couples, adults, and the elderly. I have experience helping clients with behavior problems, assisting parents with managing behaviors of their children, helping couples and families work out their issues, and assisting individuals with traumatic pasts, depression, anxiety, and OCD.

I seek to understand my clients' challenges and help them develop skills and strategies to overcome them.

Approaches: Motivational Interviewing, Cognitive Behavioral Therapy, Brief Therapy, Solution Focused Therapy, and Relaxation Therapy.`,
            specialties: [
                  'Behavior challenges',
                  'Parent coaching',
                  'Couples therapy',
                  'Family therapy',
                  'Trauma',
                  'Depression',
                  'Anxiety',
                  'OCD',
                  'Motivational Interviewing',
                  'Cognitive Behavioral Therapy',
                  'Brief Therapy',
                  'Solution Focused Therapy',
                  'Relaxation Therapy',
            ],
      },
      {
            name: 'Erin Alexander-Bell',
            slug: 'erin-alexander-bell',
            credentials: 'MA, LPC',
            title: 'Licensed Professional Counselor',
            short_bio:
                  'Licensed Professional Counselor with over 15 years of experience supporting children, individuals, and families across Southwest Michigan.',
            full_bio: `Erin D. Alexander-Bell, MA, LPC, is a Licensed Professional Counselor with more than 15 years of experience supporting children, individuals, and families across Southwest Michigan. She earned her master's degree in counseling from Spring Arbor University and her bachelor's degree in Community Health and Family Studies from Western Michigan University.

Throughout her career, Erin has worked in a variety of roles focused on helping families navigate difficult seasons. She has spent many years with the Michigan Department of Health and Human Services, where she worked in child welfare and later served in leadership positions. In these roles, she supported and guided teams, helped strengthen services for children in foster care, developed training programs, and worked to improve how agencies respond to concerns about child safety.

Alongside her leadership work, Erin has provided counseling services to individuals, couples, and families through West Michigan Psychological Services. She has supported people facing challenges such as trauma, family conflict, substance use, domestic violence, anger concerns, and major life transitions.

Erin believes in creating a safe, welcoming space where clients feel heard and respected. Her approach is compassionate, practical, and centered on helping people build on their strengths. With a deep understanding of both family systems and community resources, she is committed to walking alongside clients as they work toward healing, stability, and positive change.`,
            specialties: [
                  'Children and family support',
                  'Trauma',
                  'Family conflict',
                  'Substance use',
                  'Domestic violence',
                  'Anger concerns',
                  'Life transitions',
                  'Couples counseling',
                  'Family counseling',
                  'Child welfare and foster care',
            ],
      },
      {
            name: 'Melanie Lockett',
            slug: 'melanie-lockett',
            credentials: 'MSW, SST',
            title: 'Social Services Technician',
            short_bio:
                  'Warm, candid therapist supporting clients through anxiety, depression, trauma, grief, and life stressors.',
            full_bio: `Life consists of many expected and unexpected challenges, losses, and traumas. These challenges can negatively affect us mentally, emotionally, and physically. I believe there are times in our lives when we may benefit from support and opportunities to learn and address root causes, establish healthy coping skills, and set future goals. I believe life's greatest challenges are best met in a safe environment where you're empowered to heal from the past and create the future you desire.

I specialize in anxiety, depression, stress, abuse, child/parent relationships, past and present trauma, and grief and loss. I provide personalized therapy for individuals, families, teens, and the elderly. It is truly a privilege to support people as they heal and grow.

With a candid and warm therapeutic style, I work with clients to achieve sustainable success within various areas of life and circumstances. I guide client commitment to affirm innate strengths, act skillfully in the present, and practice intention for the future.`,
            specialties: [
                  'Anxiety',
                  'Depression',
                  'Stress management',
                  'Abuse recovery',
                  'Child-parent relationships',
                  'Trauma',
                  'Grief and loss',
                  'Family therapy',
                  'Teen counseling',
                  'Older adult support',
            ],
      },
      {
            name: 'Beyza Niefert',
            slug: 'beyza-niefert',
            credentials: 'LLMSW',
            title: 'Limited Licensed Clinical Social Worker',
            short_bio:
                  'Client-centered, trauma-informed therapist helping children, teens, adults, and families build resilience and lasting change.',
            full_bio: `Welcome! I'm Beyza Niefert, a Limited Licensed Clinical Social Worker dedicated to helping children, teens, adults, and families navigate life's challenges with empathy and understanding. My approach is client-centered, trauma-informed, and strengths-based, focusing on building resilience and equipping you with practical tools for meaningful, lasting change.

I work with clients experiencing anxiety, depression, trauma, and major life transitions. In my current role within elementary schools, I use play therapy to help young children express and manage their emotions in a healthy way.

I also have a strong passion for supporting refugees and immigrants. My experience as a case manager in a family and adult resettlement program deepened my commitment to helping individuals heal, adjust, and thrive while honoring their cultural identity.

Drawing from evidence-based practices such as mindfulness, cognitive-behavioral techniques, and trauma-informed care, I tailor therapy to meet your unique needs and goals.

Whether you're seeking support for yourself or a loved one, I'm here to walk with you on your path to healing and growth. Let's take the next step together.`,
            specialties: [
                  'Anxiety',
                  'Depression',
                  'Trauma',
                  'Life transitions',
                  'Play therapy',
                  'Refugee support',
                  'Immigrant support',
                  'Mindfulness',
                  'Cognitive Behavioral Therapy',
                  'Trauma-informed care',
            ],
      },
];

function normalize(value) {
      return value.trim().toLowerCase();
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
      const col = db.collection('therapists');
      const snapshot = await col.get();
      const now = new Date().toISOString();

      const bySlug = new Map();
      const byName = new Map();
      let maxOrderIndex = -1;

      for (const therapistDoc of snapshot.docs) {
            const data = therapistDoc.data();
            const slug = typeof data.slug === 'string' ? normalize(data.slug) : '';
            const name = typeof data.name === 'string' ? normalize(data.name) : '';
            if (slug) {
                  bySlug.set(slug, therapistDoc);
            }
            if (name) {
                  byName.set(name, therapistDoc);
            }

            const orderIndex =
                  typeof data.order_index === 'number' && Number.isFinite(data.order_index)
                        ? data.order_index
                        : -1;
            if (orderIndex > maxOrderIndex) {
                  maxOrderIndex = orderIndex;
            }
      }

      let nextOrderIndex = maxOrderIndex + 1;
      if (!Number.isFinite(nextOrderIndex) || nextOrderIndex < 0) {
            nextOrderIndex = 0;
      }

      const batch = db.batch();
      const results = [];

      for (const profile of therapistProfiles) {
            const slugKey = normalize(profile.slug);
            const nameKey = normalize(profile.name);
            const existingDoc = bySlug.get(slugKey) ?? byName.get(nameKey) ?? null;
            const richBio = normalizeRichBio(buildRichBioFromPlainText(profile.full_bio));

            if (existingDoc) {
                  const existing = existingDoc.data();
                  const orderIndex =
                        typeof existing.order_index === 'number' && Number.isFinite(existing.order_index)
                              ? existing.order_index
                              : nextOrderIndex++;

                  const payload = {
                        name: profile.name,
                        slug: profile.slug,
                        credentials:
                              typeof existing.credentials === 'string' && existing.credentials.trim().length > 0
                                    ? existing.credentials
                                    : profile.credentials,
                        title: profile.title,
                        short_bio: profile.short_bio,
                        full_bio: profile.full_bio,
                        full_bio_rich: richBio,
                        specialties: profile.specialties,
                        order_index: orderIndex,
                        is_active: existing.is_active !== false,
                        updated_at: now,
                  };

                  if (shouldWrite) {
                        batch.set(existingDoc.ref, payload, { merge: true });
                  }

                  results.push({
                        action: 'update',
                        id: existingDoc.id,
                        name: profile.name,
                        slug: profile.slug,
                        order_index: orderIndex,
                  });
                  continue;
            }

            const newRef = col.doc();
            const payload = {
                  name: profile.name,
                  slug: profile.slug,
                  credentials: profile.credentials,
                  title: profile.title,
                  short_bio: profile.short_bio,
                  full_bio: profile.full_bio,
                  full_bio_rich: richBio,
                  specialties: profile.specialties,
                  fun_fact: null,
                  image_url: null,
                  order_index: nextOrderIndex++,
                  is_active: true,
                  created_at: now,
                  updated_at: now,
            };

            if (shouldWrite) {
                  batch.set(newRef, payload, { merge: true });
            }

            results.push({
                  action: 'insert',
                  id: newRef.id,
                  name: profile.name,
                  slug: profile.slug,
                  order_index: payload.order_index,
            });
      }

      if (shouldWrite) {
            await batch.commit();
      }

      console.log('Therapist bio upsert summary');
      console.log(`- Existing profiles scanned: ${snapshot.size}`);
      console.log(`- Target profiles: ${therapistProfiles.length}`);
      console.log(`- Planned changes: ${results.length}`);
      console.log(`- Mode: ${shouldWrite ? 'WRITE' : 'DRY RUN'}`);
      console.log('');
      for (const result of results) {
            console.log(
                  `- ${result.action.toUpperCase()}: ${result.name} (id=${result.id}, slug=${result.slug}, order=${result.order_index})`
            );
      }
}

run().catch((err) => {
      console.error(err);
      process.exit(1);
});
