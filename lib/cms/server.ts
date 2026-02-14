import 'server-only';

import { CMS_COLLECTION } from '@/lib/cms/constants';
import { createDefaultSnapshot } from '@/lib/cms/defaults';
import type {
      CmsFaqBlock,
      CmsFooterNavItem,
      CmsHeaderNavItem,
      CmsPage,
      CmsPageListItem,
      CmsPageSnapshot,
      CmsPageStatus,
} from '@/lib/cms/types';
import { cmsPageSnapshotSchema, parseOptionalSchemaJson } from '@/lib/cms/validators';

async function getAdminDb() {
      const { adminDb } = await import('@/lib/firebase/admin');
      return adminDb;
}

function toIsoString(value: unknown): string {
      if (typeof value === 'string') {
            return value;
      }

      if (value instanceof Date) {
            return value.toISOString();
      }

      if (
            value &&
            typeof value === 'object' &&
            'toDate' in value &&
            typeof (value as { toDate: () => Date }).toDate === 'function'
      ) {
            return (value as { toDate: () => Date }).toDate().toISOString();
      }

      return '';
}

function parseSnapshot(value: unknown, fallbackTitle = ''): CmsPageSnapshot {
      const parsed = cmsPageSnapshotSchema.safeParse(value);
      if (parsed.success) {
            return parsed.data;
      }

      return createDefaultSnapshot(fallbackTitle);
}

function normalizeStatus(value: unknown): CmsPageStatus {
      if (value === 'draft' || value === 'published' || value === 'unpublished') {
            return value;
      }

      return 'draft';
}

function mapPageDocument(snapshot: FirebaseFirestore.QueryDocumentSnapshot | FirebaseFirestore.DocumentSnapshot): CmsPage | null {
      const raw = snapshot.data() as Record<string, unknown> | undefined;

      if (!raw) {
            return null;
      }

      const slug = typeof raw.slug === 'string' ? raw.slug : '';
      if (!slug) {
            return null;
      }

      const title = typeof raw.title === 'string' ? raw.title : '';
      const path = typeof raw.path === 'string' && raw.path ? raw.path : `/${slug}`;
      const draft = parseSnapshot(raw.draft, title);
      const published = raw.published ? parseSnapshot(raw.published, title) : null;

      return {
            id: snapshot.id,
            kind: raw.kind === 'system' ? 'system' : 'custom',
            status: normalizeStatus(raw.status),
            slug,
            path,
            createdAt: toIsoString(raw.createdAt),
            createdBy: typeof raw.createdBy === 'string' ? raw.createdBy : null,
            updatedAt: toIsoString(raw.updatedAt),
            updatedBy: typeof raw.updatedBy === 'string' ? raw.updatedBy : null,
            publishedAt: toIsoString(raw.publishedAt) || null,
            publishedBy: typeof raw.publishedBy === 'string' ? raw.publishedBy : null,
            draft,
            published,
      };
}

export async function getCmsPageById(pageId: string): Promise<CmsPage | null> {
      try {
            const db = await getAdminDb();
            const snapshot = await db.collection(CMS_COLLECTION).doc(pageId).get();
            return mapPageDocument(snapshot);
      } catch {
            return null;
      }
}

export async function listCmsPages(): Promise<CmsPageListItem[]> {
      const db = await getAdminDb();
      const snapshot = await db.collection(CMS_COLLECTION).get();

      return snapshot.docs
            .map((docSnapshot) => mapPageDocument(docSnapshot))
            .filter((page): page is CmsPage => Boolean(page))
            .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
            .map((page) => ({
                  id: page.id,
                  kind: page.kind,
                  status: page.status,
                  slug: page.slug,
                  path: page.path,
                  title: page.draft.title,
                  updatedAt: page.updatedAt,
                  publishedAt: page.publishedAt,
            }));
}

export async function getCmsPageBySlug(slug: string): Promise<CmsPage | null> {
      const db = await getAdminDb();
      const snapshot = await db.collection(CMS_COLLECTION).where('slug', '==', slug).limit(1).get();

      if (snapshot.empty) {
            return null;
      }

      return mapPageDocument(snapshot.docs[0] as FirebaseFirestore.QueryDocumentSnapshot);
}

export async function getPublishedPageBySlug(slug: string): Promise<CmsPage | null> {
      const page = await getCmsPageBySlug(slug);
      if (!page || page.status !== 'published' || !page.published) {
            return null;
      }

      return page;
}

export async function getPublishedSystemPageBySlug(slug: string): Promise<CmsPage | null> {
      const page = await getPublishedPageBySlug(slug);
      if (!page || page.kind !== 'system') {
            return null;
      }

      return page;
}

export async function getPublishedNavItems(): Promise<{
      headerItems: CmsHeaderNavItem[];
      footerItems: CmsFooterNavItem[];
}> {
      let snapshot: FirebaseFirestore.QuerySnapshot;
      try {
            const db = await getAdminDb();
            snapshot = await db.collection(CMS_COLLECTION).where('status', '==', 'published').get();
      } catch {
            return {
                  headerItems: [],
                  footerItems: [],
            };
      }

      const pages = snapshot.docs
            .map((docSnapshot) => mapPageDocument(docSnapshot))
            .filter((page): page is CmsPage => Boolean(page) && Boolean(page?.published));

      const headerItems = pages
            .filter((page) => page.published?.nav.showInHeader)
            .map((page) => ({
                  id: page.id,
                  label: page.published?.nav.headerLabel || page.published?.title || page.slug,
                  href: page.path,
                  order: page.published?.nav.headerOrder ?? 100,
            }))
            .sort((a, b) => {
                  const orderDiff = a.order - b.order;
                  if (orderDiff !== 0) {
                        return orderDiff;
                  }

                  return a.label.localeCompare(b.label);
            });

      const footerItems = pages
            .filter((page) => page.published?.nav.showInFooter)
            .map((page) => ({
                  id: page.id,
                  label: page.published?.nav.footerLabel || page.published?.title || page.slug,
                  href: page.path,
                  order: page.published?.nav.footerOrder ?? 100,
            }))
            .sort((a, b) => {
                  const orderDiff = a.order - b.order;
                  if (orderDiff !== 0) {
                        return orderDiff;
                  }

                  return a.label.localeCompare(b.label);
            });

      return {
            headerItems,
            footerItems,
      };
}

export async function getSitemapPages(): Promise<Array<{ path: string; updatedAt: string }>> {
      try {
            const db = await getAdminDb();
            const snapshot = await db.collection(CMS_COLLECTION).where('status', '==', 'published').get();

            return snapshot.docs
                  .map((docSnapshot) => mapPageDocument(docSnapshot))
                  .filter((page): page is CmsPage => Boolean(page) && page?.status === 'published')
                  .map((page) => ({
                        path: page.path,
                        updatedAt: page.updatedAt || page.publishedAt || new Date(0).toISOString(),
                  }));
      } catch {
            return [];
      }
}

export function getPublicSnapshot(page: CmsPage): CmsPageSnapshot {
      return page.published ?? page.draft;
}

export function buildSiteUrl(pathname: string): string {
      const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
      const baseUrl = configured && /^https?:\/\//.test(configured)
            ? configured
            : 'http://localhost:3000';

      const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
      return new URL(normalizedPath, baseUrl).toString();
}

export function buildJsonLdSchemas(page: CmsPage): Array<Record<string, unknown> | unknown[]> {
      const snapshot = getPublicSnapshot(page);
      const schemas: Array<Record<string, unknown> | unknown[]> = [];

      const customSchema = parseOptionalSchemaJson(snapshot.seo.schemaJson);
      if (customSchema) {
            schemas.push(customSchema);
      }

      const faqSchemas = snapshot.blocks
            .filter((block): block is CmsFaqBlock => block.type === 'faq' && block.visible)
            .filter((block) => block.data.enableSchema)
            .map((block) => {
                  const entities = block.data.items
                        .filter((item) => item.question.trim() && item.answer.trim())
                        .map((item) => ({
                              '@type': 'Question',
                              name: item.question,
                              acceptedAnswer: {
                                    '@type': 'Answer',
                                    text: item.answer,
                              },
                        }));

                  if (entities.length === 0) {
                        return null;
                  }

                  return {
                        '@context': 'https://schema.org',
                        '@type': 'FAQPage',
                        mainEntity: entities,
                  };
            })
            .filter((item) => Boolean(item)) as Array<Record<string, unknown>>;

      return [...schemas, ...faqSchemas];
}
