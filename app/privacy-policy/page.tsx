import type { Metadata } from 'next';
import CmsPageRenderer from '@/components/cms/CmsPageRenderer';
import { buildJsonLdSchemas, buildSiteUrl, getPublishedSystemPageBySlug, getPublicSnapshot } from '@/lib/cms/server';

const SYSTEM_SLUG = 'privacy-policy';
const FALLBACK_TITLE = 'Privacy Policy';
const FALLBACK_DESCRIPTION = 'Diversified Psychological Services privacy policy and information handling practices.';

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

export default async function PrivacyPolicyPage() {
      const page = await getPublishedSystemPageBySlug(SYSTEM_SLUG);

      if (page && page.published) {
            return <CmsPageRenderer page={page} includeSchemas jsonLdSchemas={buildJsonLdSchemas(page)} />;
      }

      return (
            <div className="py-16">
                  <div className="container-custom">
                        <div className="max-w-4xl mx-auto prose prose-lg">
                              <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

                              <p className="text-gray-600 mb-8">
                                    <em>This page is under development. Content will be added soon.</em>
                              </p>

                              <div className="bg-gray-50 rounded-lg p-8">
                                    <h2>Your Privacy Matters</h2>
                                    <p>
                                          Diversified Psychological Services is committed to protecting your privacy and personal information.
                                          This privacy policy will outline how we collect, use, and protect your information.
                                    </p>

                                    <h3>Information We Collect</h3>
                                    <p>Details about information collection practices will be provided here.</p>

                                    <h3>How We Use Your Information</h3>
                                    <p>Information about how we use client data will be detailed here.</p>

                                    <h3>Information Security</h3>
                                    <p>Details about our security measures and practices will be outlined here.</p>

                                    <h3>Contact Us</h3>
                                    <p>
                                          If you have questions about this privacy policy, please contact us at{' '}
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
