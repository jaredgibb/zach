import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import StructuredData from '@/components/StructuredData';
import { buildSiteUrl } from '@/lib/cms/server';
import { businessInfo } from '@/lib/data';
import { getMeaningfulList } from '@/lib/publicContent';
import {
      buildBreadcrumbSchema,
      buildPracticeLocalBusinessSchema,
      buildTherapistPersonSchema,
      getPublicTherapistBySlug,
} from '@/lib/publicContentServer';

export const dynamic = 'force-dynamic';

interface PageProps {
      params: Promise<{
            slug: string;
      }>;
}

function buildDescription(fullBio: string, fallback: string): string {
      const trimmed = fullBio.trim();
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
      const therapist = await getPublicTherapistBySlug(slug);

      if (!therapist) {
            return {};
      }

      const title = `${therapist.name} | Therapist in Kalamazoo, MI | ${businessInfo.name}`;
      const description = buildDescription(therapist.full_bio, therapist.short_bio);
      const url = buildSiteUrl(`/therapists/${therapist.slug}`);

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
                  images: therapist.image_url ? [{ url: therapist.image_url }] : undefined,
            },
            twitter: {
                  card: therapist.image_url ? 'summary_large_image' : 'summary',
                  title,
                  description,
                  images: therapist.image_url ? [therapist.image_url] : undefined,
            },
      };
}

export default async function TherapistDetailPage({ params }: PageProps) {
      const { slug } = await params;
      const therapist = await getPublicTherapistBySlug(slug);

      if (!therapist) {
            notFound();
      }

      const description = buildDescription(therapist.full_bio, therapist.short_bio);
      const paragraphs = splitParagraphs(therapist.full_bio);
      const specialties = getMeaningfulList(therapist.specialties);
      const firstName = therapist.name.trim().split(/\s+/)[0] || therapist.name;
      const schemas = [
            buildPracticeLocalBusinessSchema(description),
            buildTherapistPersonSchema(therapist),
            buildBreadcrumbSchema([
                  { name: 'Home', path: '/' },
                  { name: 'Therapists', path: '/therapists' },
                  { name: therapist.name, path: `/therapists/${therapist.slug}` },
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
                                          <li><Link href="/therapists" className="hover:text-teal-700">Therapists</Link></li>
                                          <li aria-hidden="true">/</li>
                                          <li className="text-slate-900">{therapist.name}</li>
                                    </ol>
                              </nav>

                              <div className="mt-8 grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
                                    <div>
                                          <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
                                                {therapist.image_url ? (
                                                      <img
                                                            src={therapist.image_url}
                                                            alt={`Portrait of ${therapist.name}`}
                                                            className="h-[420px] w-full object-cover"
                                                      />
                                                ) : (
                                                      <div className="flex h-[420px] items-center justify-center bg-gradient-to-br from-stone-100 via-white to-teal-50 text-center">
                                                            <div className="rounded-full border border-teal-200 bg-white px-5 py-2 text-sm font-semibold text-teal-800 shadow-sm">
                                                                  {therapist.credentials}
                                                            </div>
                                                      </div>
                                                )}
                                          </div>
                                    </div>

                                    <div>
                                          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-800">
                                                Therapist profile
                                          </p>
                                          <h1 className="mt-4 text-4xl text-slate-900 md:text-6xl">{therapist.name}</h1>
                                          <p className="mt-4 text-lg font-semibold text-teal-700 md:text-xl">{therapist.credentials}</p>
                                          <p className="mt-2 text-lg text-slate-700 md:text-xl">{therapist.title}</p>
                                          <p className="mt-6 text-lg leading-relaxed text-slate-700 md:text-xl">
                                                {therapist.short_bio}
                                          </p>

                                          {specialties.length > 0 && (
                                                <div className="mt-8">
                                                      <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-900">
                                                            Areas of focus
                                                      </h2>
                                                      <div className="mt-4 flex flex-wrap gap-2">
                                                            {specialties.map((specialty) => (
                                                                  <span
                                                                        key={specialty}
                                                                        className="rounded-full border border-teal-200 bg-white px-3 py-1.5 text-sm font-medium text-teal-800"
                                                                  >
                                                                        {specialty}
                                                                  </span>
                                                            ))}
                                                      </div>
                                                </div>
                                          )}

                                          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                                                <Link
                                                      href="/contact"
                                                      className="inline-flex items-center justify-center rounded-lg bg-teal-700 px-6 py-3 font-semibold text-white transition hover:bg-teal-800"
                                                >
                                                      Contact the practice
                                                </Link>
                                                <Link
                                                      href="/services"
                                                      className="inline-flex items-center justify-center rounded-lg border border-teal-200 bg-white px-6 py-3 font-semibold text-teal-800 transition hover:bg-teal-50"
                                                >
                                                      Browse services
                                                </Link>
                                          </div>
                                    </div>
                              </div>
                        </div>
                  </div>

                  <div className="bg-white py-16">
                        <div className="container-custom max-w-6xl">
                              <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
                                    <div>
                                          <h2 className="text-3xl text-slate-900">About {firstName}</h2>
                                          <div className="mt-6 space-y-5">
                                                {paragraphs.map((paragraph, index) => (
                                                      <p key={index} className="text-base leading-relaxed text-slate-700 md:text-lg">
                                                            {paragraph}
                                                      </p>
                                                ))}
                                          </div>

                                          {therapist.fun_fact && (
                                                <div className="mt-8 rounded-3xl border border-teal-100 bg-teal-50 p-6">
                                                      <h2 className="text-lg font-semibold text-slate-900">A little more about {firstName}</h2>
                                                      <p className="mt-3 text-base leading-relaxed text-slate-700">{therapist.fun_fact}</p>
                                                </div>
                                          )}
                                    </div>

                                    <aside className="rounded-3xl border border-stone-200 bg-stone-50 p-6 shadow-sm">
                                          <h2 className="text-xl font-semibold text-slate-900">Next steps</h2>
                                          <ul className="mt-5 space-y-3 text-sm leading-relaxed text-slate-700">
                                                <li>Review services if you want a clearer sense of care options before reaching out.</li>
                                                <li>Call or email us to ask about availability, insurance, and fit.</li>
                                                <li>We can help you figure out whether {firstName} or another therapist may be the best match.</li>
                                          </ul>
                                          <div className="mt-6 rounded-2xl bg-white p-5">
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

                  <StructuredData schemas={schemas} idPrefix={`therapist-${therapist.slug}-schema`} />
            </>
      );
}
