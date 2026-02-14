import type { Metadata } from 'next';
import CmsPageRenderer from '@/components/cms/CmsPageRenderer';
import { buildJsonLdSchemas, buildSiteUrl, getPublishedSystemPageBySlug, getPublicSnapshot } from '@/lib/cms/server';

const SYSTEM_SLUG = 'no-surprises-act';
const FALLBACK_TITLE = 'No Surprises Act';
const FALLBACK_DESCRIPTION = 'Your rights and protections under the No Surprises Act.';

export async function generateMetadata(): Promise<Metadata> {
      const page = await getPublishedSystemPageBySlug(SYSTEM_SLUG);

      if (!page || !page.published) {
            return {
                  title: FALLBACK_TITLE,
                  description: FALLBACK_DESCRIPTION,
            };
      }

      const snapshot = getPublicSnapshot(page);
      const title = snapshot.seo.metaTitle || snapshot.title;
      const description = snapshot.seo.metaDescription || FALLBACK_DESCRIPTION;
      const canonicalUrl = buildSiteUrl(snapshot.seo.canonicalPath || page.path);

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
                  images: snapshot.seo.ogImageUrl ? [{ url: snapshot.seo.ogImageUrl }] : undefined,
            },
      };
}

export default async function NoSurprisesActPage() {
      const page = await getPublishedSystemPageBySlug(SYSTEM_SLUG);

      if (page && page.published) {
            return <CmsPageRenderer page={page} includeSchemas jsonLdSchemas={buildJsonLdSchemas(page)} />;
      }

      return (
            <div className="py-16">
                  <div className="container-custom">
                        <div className="max-w-4xl mx-auto prose prose-lg">
                              <h1 className="text-4xl font-bold text-gray-900 mb-8">
                                    No Surprises Act
                              </h1>

                              <p className="text-gray-600 mb-8">
                                    <em>This page is under development. Content will be added soon.</em>
                              </p>

                              <div className="bg-gray-50 rounded-lg p-8">
                                    <h2>Your Rights Under the No Surprises Act</h2>
                                    <p>
                                          The No Surprises Act protects you from unexpected medical bills. You have the right to receive
                                          a "Good Faith Estimate" explaining how much your medical care will cost.
                                    </p>

                                    <h3>What is the No Surprises Act?</h3>
                                    <p>
                                          The No Surprises Act is a federal law that took effect January 1, 2022, and provides protections
                                          against surprise medical bills.
                                    </p>

                                    <h3>Good Faith Estimate</h3>
                                    <p>
                                          Under the law, healthcare providers need to give patients who don't have insurance or who are not using
                                          insurance an estimate of the bill for medical items and services.
                                    </p>

                                    <h3>For More Information</h3>
                                    <p>
                                          Visit{' '}
                                          <a
                                                href="https://www.cms.gov/nosurprises"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary-600 hover:underline"
                                          >
                                                www.cms.gov/nosurprises
                                          </a>
                                          {' '}or call 1-800-985-3059 for more information about your rights under federal law.
                                    </p>

                                    <h3>Questions?</h3>
                                    <p>
                                          If you have questions, please contact us at{' '}
                                          <a href="mailto:zachd@diversifiedpsychservices.com">
                                                zachd@diversifiedpsychservices.com
                                          </a>
                                    </p>
                              </div>
                        </div>
                  </div>
            </div>
      );
}
