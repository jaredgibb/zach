import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CmsPageRenderer from '@/components/cms/CmsPageRenderer';
import { RESERVED_SLUGS } from '@/lib/cms/constants';
import { buildJsonLdSchemas, buildSiteUrl, getPublishedPageBySlug, getPublicSnapshot } from '@/lib/cms/server';
import type { CmsBlock } from '@/lib/cms/types';

interface PageProps {
      params: Promise<{
            slug: string;
      }>;
}

function getFallbackDescription(blocks: CmsBlock[]): string {
      for (const block of blocks) {
            if (!block.visible) {
                  continue;
            }

            if (block.type === 'rich_text' && block.data.plainText.trim()) {
                  return block.data.plainText.slice(0, 155);
            }

            if (block.type === 'image_text' && block.data.body.trim()) {
                  return block.data.body.slice(0, 155);
            }

            if (block.type === 'hero' && block.data.subheadline.trim()) {
                  return block.data.subheadline.slice(0, 155);
            }
      }

      return '';
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
      const { slug } = await params;

      if (RESERVED_SLUGS.has(slug)) {
            return {};
      }

      const page = await getPublishedPageBySlug(slug);
      if (!page || !page.published) {
            return {};
      }

      const snapshot = getPublicSnapshot(page);
      const title = snapshot.seo.metaTitle || snapshot.title;
      const description = snapshot.seo.metaDescription || getFallbackDescription(snapshot.blocks);
      const canonicalPath = snapshot.seo.canonicalPath || page.path;
      const canonicalUrl = buildSiteUrl(canonicalPath);

      return {
            title,
            description,
            alternates: {
                  canonical: canonicalUrl,
            },
            robots: {
                  index: !snapshot.seo.noIndex,
                  follow: !snapshot.seo.noFollow,
            },
            openGraph: {
                  title: snapshot.seo.ogTitle || title,
                  description: snapshot.seo.ogDescription || description,
                  url: canonicalUrl,
                  images: snapshot.seo.ogImageUrl
                        ? [
                              {
                                    url: snapshot.seo.ogImageUrl,
                              },
                        ]
                        : undefined,
            },
            twitter: {
                  card: snapshot.seo.ogImageUrl ? 'summary_large_image' : 'summary',
                  title: snapshot.seo.ogTitle || title,
                  description: snapshot.seo.ogDescription || description,
                  images: snapshot.seo.ogImageUrl ? [snapshot.seo.ogImageUrl] : undefined,
            },
      };
}

export default async function CmsSlugPage({ params }: PageProps) {
      const { slug } = await params;

      if (RESERVED_SLUGS.has(slug)) {
            notFound();
      }

      const page = await getPublishedPageBySlug(slug);

      if (!page || !page.published) {
            notFound();
      }

      const schemas = buildJsonLdSchemas(page);

      return <CmsPageRenderer page={page} includeSchemas jsonLdSchemas={schemas} />;
}
