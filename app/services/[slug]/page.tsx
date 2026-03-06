import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import StructuredData from '@/components/StructuredData';
import { buildSiteUrl } from '@/lib/cms/server';
import { businessInfo } from '@/lib/data';
import {
      buildBreadcrumbSchema,
      buildPracticeLocalBusinessSchema,
      buildTherapyServiceSchema,
      getPublicServiceBySlug,
} from '@/lib/publicContentServer';

export const dynamic = 'force-dynamic';

interface PageProps {
      params: Promise<{
            slug: string;
      }>;
}

function buildDescription(fullDescription: string, fallback: string): string {
      const trimmed = fullDescription.trim();
      if (!trimmed) {
            return fallback;
      }

      return trimmed.slice(0, 160);
}

function splitParagraphs(value: string): string[] {
      return value
            .split(/\n{2,}/)
            .map((paragraph) => paragraph.trim())
            .filter((paragraph) => paragraph.length > 0);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
      const { slug } = await params;
      const service = await getPublicServiceBySlug(slug);

      if (!service) {
            return {};
      }

      const title = `${service.title} in Kalamazoo, MI | ${businessInfo.name}`;
      const description = buildDescription(service.full_description, service.short_description);
      const url = buildSiteUrl(`/services/${service.slug}`);

      return {
            title,
            description,
            alternates: {
                  canonical: url,
            },
            openGraph: {
                  title,
                  description,
                  url,
                  images: service.image_url ? [{ url: service.image_url }] : undefined,
            },
            twitter: {
                  card: service.image_url ? 'summary_large_image' : 'summary',
                  title,
                  description,
                  images: service.image_url ? [service.image_url] : undefined,
            },
      };
}

export default async function ServiceDetailPage({ params }: PageProps) {
      const { slug } = await params;
      const service = await getPublicServiceBySlug(slug);

      if (!service) {
            notFound();
      }

      const description = buildDescription(service.full_description, service.short_description);
      const paragraphs = splitParagraphs(service.full_description);
      const schemas = [
            buildPracticeLocalBusinessSchema(description),
            buildTherapyServiceSchema(service),
            buildBreadcrumbSchema([
                  { name: 'Home', path: '/' },
                  { name: 'Services', path: '/services' },
                  { name: service.title, path: `/services/${service.slug}` },
            ]),
      ];

      return (
            <>
                  <div className="surface-warm py-12 md:py-16">
                        <div className="container-custom max-w-6xl">
                              <nav aria-label="Breadcrumb" className="text-sm text-slate-600">
                                    <ol className="flex flex-wrap items-center gap-2">
                                          <li><Link href="/" className="hover:text-teal-700">Home</Link></li>
                                          <li aria-hidden="true">/</li>
                                          <li><Link href="/services" className="hover:text-teal-700">Services</Link></li>
                                          <li aria-hidden="true">/</li>
                                          <li className="text-slate-900">{service.title}</li>
                                    </ol>
                              </nav>

                              <div className="mt-8 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
                                    <div>
                                          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-800">
                                                Therapy service
                                          </p>
                                          <h1 className="mt-4 text-4xl text-slate-900 md:text-6xl">{service.title}</h1>
                                          <p className="mt-6 text-lg leading-relaxed text-slate-700 md:text-xl">
                                                {service.short_description}
                                          </p>
                                          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                                                <Link
                                                      href="/contact"
                                                      className="inline-flex items-center justify-center rounded-lg bg-teal-700 px-6 py-3 font-semibold text-white transition hover:bg-teal-800"
                                                >
                                                      Contact the practice
                                                </Link>
                                                <Link
                                                      href="/therapists"
                                                      className="inline-flex items-center justify-center rounded-lg border border-teal-200 bg-white px-6 py-3 font-semibold text-teal-800 transition hover:bg-teal-50"
                                                >
                                                      Meet our therapists
                                                </Link>
                                          </div>
                                    </div>

                                    <aside className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                                          <h2 className="text-xl font-semibold text-slate-900">Before you start</h2>
                                          <ul className="mt-5 space-y-3 text-sm leading-relaxed text-slate-700">
                                                <li>Call or email us to ask about openings, insurance, and the best next step.</li>
                                                <li>We offer in-person appointments in Kalamazoo and telehealth when appropriate.</li>
                                                <li>This page is informational. Contact us directly to discuss current availability.</li>
                                          </ul>
                                          <div className="mt-6 rounded-2xl bg-teal-50 p-5">
                                                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-800">Reach out</p>
                                                <p className="mt-3 text-sm text-slate-700">
                                                      <a href={`tel:${businessInfo.phone}`} className="font-semibold text-teal-800 underline underline-offset-4">
                                                            {businessInfo.phone}
                                                      </a>
                                                </p>
                                                <p className="mt-2 text-sm text-slate-700">
                                                      <a href={`mailto:${businessInfo.email}`} className="font-semibold text-teal-800 underline underline-offset-4">
                                                            {businessInfo.email}
                                                      </a>
                                                </p>
                                          </div>
                                    </aside>
                              </div>
                        </div>
                  </div>

                  <div className="bg-white py-16">
                        <div className="container-custom max-w-6xl">
                              <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
                                    <div>
                                          <h2 className="text-3xl text-slate-900">What this service can support</h2>
                                          <div className="mt-6 space-y-5">
                                                {paragraphs.length > 0 ? (
                                                      paragraphs.map((paragraph, index) => (
                                                            <p key={index} className="text-base leading-relaxed text-slate-700 md:text-lg">
                                                                  {paragraph}
                                                            </p>
                                                      ))
                                                ) : (
                                                      <p className="text-base leading-relaxed text-slate-700 md:text-lg">
                                                            {service.short_description}
                                                      </p>
                                                )}
                                          </div>
                                    </div>

                                    <div>
                                          {service.image_url && (
                                                <div className="overflow-hidden rounded-3xl border border-stone-200 shadow-sm">
                                                      <img
                                                            src={service.image_url}
                                                            alt={service.title}
                                                            className="h-72 w-full object-cover"
                                                      />
                                                </div>
                                          )}

                                          {service.features.length > 0 && (
                                                <div className={`rounded-3xl border border-stone-200 bg-stone-50 p-6 shadow-sm ${service.image_url ? 'mt-6' : ''}`}>
                                                      <h2 className="text-xl font-semibold text-slate-900">What to expect</h2>
                                                      <ul className="mt-5 space-y-3 text-sm leading-relaxed text-slate-700">
                                                            {service.features.map((feature) => (
                                                                  <li key={feature} className="flex items-start gap-3">
                                                                        <span className="mt-0.5 text-teal-700">•</span>
                                                                        <span>{feature}</span>
                                                                  </li>
                                                            ))}
                                                      </ul>
                                                </div>
                                          )}
                                    </div>
                              </div>
                        </div>
                  </div>

                  <section className="surface-mint py-16">
                        <div className="container-custom max-w-5xl">
                              <div className="rounded-3xl bg-slate-900 px-8 py-12 text-center text-white shadow-md md:px-12">
                                    <h2 className="text-3xl md:text-4xl">Need help deciding if this service is right for you?</h2>
                                    <p className="mx-auto mt-4 max-w-3xl text-lg text-slate-100">
                                          Contact the practice and we can talk through your goals, insurance, and current therapist availability.
                                    </p>
                                    <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                                          <Link
                                                href="/contact"
                                                className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 font-semibold text-emerald-700 transition hover:bg-emerald-50"
                                          >
                                                Contact the practice
                                          </Link>
                                          <Link
                                                href="/therapists"
                                                className="inline-flex items-center justify-center rounded-lg border border-white/25 bg-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/20"
                                          >
                                                Meet our therapists
                                          </Link>
                                    </div>
                              </div>
                        </div>
                  </section>

                  <StructuredData schemas={schemas} idPrefix={`service-${service.slug}-schema`} />
            </>
      );
}
