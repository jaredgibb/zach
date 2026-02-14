import 'server-only';

import { CMS_COLLECTION } from '@/lib/cms/constants';
import { createDefaultSnapshot } from '@/lib/cms/defaults';
import { getCmsPageById, getCmsPageBySlug } from '@/lib/cms/server';
import type { CmsPageSnapshot } from '@/lib/cms/types';
import { buildPathFromSlug, validateCustomSlug } from '@/lib/cms/validators';
import { adminDb } from '@/lib/firebase/admin';

async function ensureSlugAvailable(slug: string, excludePageId?: string): Promise<void> {
      const existing = await getCmsPageBySlug(slug);
      if (!existing) {
            return;
      }

      if (excludePageId && existing.id === excludePageId) {
            return;
      }

      throw new Error('A page with that slug already exists.');
}

export async function createCustomPage(params: {
      uid: string;
      title: string;
      slug: string;
}) {
      validateCustomSlug(params.slug);
      await ensureSlugAvailable(params.slug);

      const now = new Date().toISOString();
      const draft = createDefaultSnapshot(params.title);

      const docRef = await adminDb.collection(CMS_COLLECTION).add({
            kind: 'custom',
            status: 'draft',
            title: params.title,
            slug: params.slug,
            path: buildPathFromSlug(params.slug),
            createdAt: now,
            createdBy: params.uid,
            updatedAt: now,
            updatedBy: params.uid,
            publishedAt: null,
            publishedBy: null,
            draft,
            published: null,
      });

      return getCmsPageById(docRef.id);
}

export async function updatePageDraft(params: {
      pageId: string;
      uid: string;
      title: string;
      slug: string;
      draft: CmsPageSnapshot;
}) {
      const page = await getCmsPageById(params.pageId);
      if (!page) {
            throw new Error('Page not found.');
      }

      if (page.kind === 'custom') {
            validateCustomSlug(params.slug);
            await ensureSlugAvailable(params.slug, page.id);
      } else if (params.slug !== page.slug) {
            throw new Error('System page slugs cannot be changed.');
      }

      if (page.published && params.slug !== page.slug) {
            throw new Error('Published page slugs cannot be changed in phase 1.');
      }

      const now = new Date().toISOString();
      const path = page.kind === 'system' ? page.path : buildPathFromSlug(params.slug);

      await adminDb.collection(CMS_COLLECTION).doc(page.id).set(
            {
                  title: params.title,
                  slug: params.slug,
                  path,
                  draft: params.draft,
                  updatedAt: now,
                  updatedBy: params.uid,
            },
            { merge: true }
      );

      return getCmsPageById(page.id);
}

export async function publishPage(params: { pageId: string; uid: string }) {
      const page = await getCmsPageById(params.pageId);
      if (!page) {
            throw new Error('Page not found.');
      }

      const now = new Date().toISOString();

      await adminDb.collection(CMS_COLLECTION).doc(page.id).set(
            {
                  status: 'published',
                  title: page.draft.title,
                  published: page.draft,
                  publishedAt: now,
                  publishedBy: params.uid,
                  updatedAt: now,
                  updatedBy: params.uid,
            },
            { merge: true }
      );

      return getCmsPageById(page.id);
}

export async function unpublishPage(params: { pageId: string; uid: string }) {
      const page = await getCmsPageById(params.pageId);
      if (!page) {
            throw new Error('Page not found.');
      }

      const now = new Date().toISOString();

      await adminDb.collection(CMS_COLLECTION).doc(page.id).set(
            {
                  status: 'unpublished',
                  updatedAt: now,
                  updatedBy: params.uid,
            },
            { merge: true }
      );

      return getCmsPageById(page.id);
}

export async function deletePage(params: { pageId: string }) {
      const page = await getCmsPageById(params.pageId);
      if (!page) {
            throw new Error('Page not found.');
      }

      if (page.status === 'published') {
            throw new Error('Unpublish the page before deleting it.');
      }

      await adminDb.collection(CMS_COLLECTION).doc(page.id).delete();
}
