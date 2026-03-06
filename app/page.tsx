import type { Metadata } from 'next';
import CmsPageRenderer from '@/components/cms/CmsPageRenderer';
import LegacyHomeFallback from '@/components/home/LegacyHomeFallback';
import { buildJsonLdSchemas, buildSiteUrl, getPublicSnapshot, getPublishedHomePage } from '@/lib/cms/server';
import type { CmsBlock } from '@/lib/cms/types';
import { buildHomeLocalBusinessSchema, enhanceCmsHomePage } from '@/lib/cms/homeEnhancements';
import { getPublicContentCollections } from '@/lib/publicContentServer';

export const dynamic = 'force-dynamic';

const FALLBACK_TITLE = 'Diversified Psychological Services | Therapy in Kalamazoo, MI';
const FALLBACK_DESCRIPTION =
      'Professional therapy services in Kalamazoo, MI. Individual therapy, couples counseling, and family therapy. Accepting most major insurance providers.';

function getFallbackDescription(blocks: CmsBlock[]): string {
      for (const block of blocks) {
            if (!block.visible) {
                  continue;
            }

            if (block.type === 'hero' && block.data.subheadline.trim()) {
                  return block.data.subheadline.slice(0, 155);
            }

            if (block.type === 'trust_bar') {
                  const firstItem = block.data.items.find((item) => item.description.trim())?.description ?? '';
                  if (firstItem) {
                        return firstItem.slice(0, 155);
                  }
            }

            if (block.type === 'process_steps' && block.data.intro.trim()) {
                  return block.data.intro.slice(0, 155);
            }

            if (block.type === 'insurance_strip' && block.data.intro.trim()) {
                  return block.data.intro.slice(0, 155);
            }

            if (block.type === 'rich_text' && block.data.plainText.trim()) {
                  return block.data.plainText.slice(0, 155);
            }

            if (block.type === 'image_text' && block.data.body.trim()) {
                  return block.data.body.slice(0, 155);
            }

            if (block.type === 'faq') {
                  const firstAnswer = block.data.items.find((item) => item.answer.trim())?.answer ?? '';
                  if (firstAnswer) {
                        return firstAnswer.slice(0, 155);
                  }
            }
      }

      return FALLBACK_DESCRIPTION;
}

export async function generateMetadata(): Promise<Metadata> {
      const page = await getPublishedHomePage();
      if (!page || !page.published) {
            return {
                  title: FALLBACK_TITLE,
                  description: FALLBACK_DESCRIPTION,
            };
      }

      const enhancedPage = enhanceCmsHomePage(page);
      const snapshot = getPublicSnapshot(enhancedPage);
      const title = snapshot.seo.metaTitle || snapshot.title || FALLBACK_TITLE;
      const description = snapshot.seo.metaDescription || getFallbackDescription(snapshot.blocks);
      const canonicalPath = snapshot.seo.canonicalPath || '/';
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

export default async function HomePage() {
      const [page, { therapists, services }] = await Promise.all([
            getPublishedHomePage(),
            getPublicContentCollections(),
      ]);

      if (!page || !page.published) {
            const fallbackLocalBusinessSchema = buildHomeLocalBusinessSchema(FALLBACK_DESCRIPTION);

            return (
                  <>
                        <LegacyHomeFallback therapists={therapists} services={services} />
                        <script
                              type="application/ld+json"
                              dangerouslySetInnerHTML={{
                                    __html: JSON.stringify(fallbackLocalBusinessSchema),
                              }}
                        />
                  </>
            );
      }

      const enhancedPage = enhanceCmsHomePage(page);
      const snapshot = getPublicSnapshot(enhancedPage);
      const description = snapshot.seo.metaDescription || getFallbackDescription(snapshot.blocks) || FALLBACK_DESCRIPTION;
      const schemas = [...buildJsonLdSchemas(enhancedPage), buildHomeLocalBusinessSchema(description)];

      return (
            <CmsPageRenderer
                  page={enhancedPage}
                  includeSchemas
                  jsonLdSchemas={schemas}
                  therapists={therapists}
                  services={services}
            />
      );
}
