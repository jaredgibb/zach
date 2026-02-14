import type { Metadata } from 'next';
import CmsPageRenderer from '@/components/cms/CmsPageRenderer';
import { buildJsonLdSchemas, buildSiteUrl, getPublishedSystemPageBySlug, getPublicSnapshot } from '@/lib/cms/server';

const SYSTEM_SLUG = 'privacy-practices';
const FALLBACK_TITLE = 'Notice of Privacy Practices';
const FALLBACK_DESCRIPTION = 'HIPAA notice of privacy practices and patient rights information.';

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

export default async function PrivacyPracticesPage() {
      const page = await getPublishedSystemPageBySlug(SYSTEM_SLUG);

      if (page && page.published) {
            return <CmsPageRenderer page={page} includeSchemas jsonLdSchemas={buildJsonLdSchemas(page)} />;
      }

      return (
            <div className="py-16">
                  <div className="container-custom">
                        <div className="max-w-4xl mx-auto prose prose-lg">
                              <h1 className="text-4xl font-bold text-gray-900 mb-8">
                                    Notice of Privacy Practices
                              </h1>

                              <p className="text-gray-600 mb-8">
                                    <em>This page is under development. Content will be added soon.</em>
                              </p>

                              <div className="bg-gray-50 rounded-lg p-8">
                                    <h2>HIPAA Notice of Privacy Practices</h2>
                                    <p>
                                          This notice describes how medical information about you may be used and disclosed
                                          and how you can get access to this information.
                                    </p>

                                    <h3>Your Health Information Rights</h3>
                                    <p>Details about client rights under HIPAA will be provided here.</p>

                                    <h3>How We May Use and Disclose Health Information</h3>
                                    <p>Information about permitted uses and disclosures will be detailed here.</p>

                                    <h3>Our Responsibilities</h3>
                                    <p>Details about our responsibilities regarding protected health information will be outlined here.</p>

                                    <h3>Contact Information</h3>
                                    <p>
                                          For more information about this notice or our privacy practices, please contact us at{' '}
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
