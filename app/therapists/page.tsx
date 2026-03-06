import type { Metadata } from 'next';
import Link from 'next/link';
import StructuredData from '@/components/StructuredData';
import { TherapistCard } from '@/components/TherapistCard';
import { buildSiteUrl } from '@/lib/cms/server';
import {
      buildBreadcrumbSchema,
      buildPracticeLocalBusinessSchema,
      getPublicTherapists,
} from '@/lib/publicContentServer';

export const dynamic = 'force-dynamic';

const PAGE_TITLE = 'Therapists in Kalamazoo, MI | Diversified Psychological Services';
const PAGE_DESCRIPTION =
      'Meet the therapists at Diversified Psychological Services in Kalamazoo, Michigan and learn more about their experience, specialties, and approach to care.';
const PAGE_URL = buildSiteUrl('/therapists');

export const metadata: Metadata = {
      title: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      alternates: {
            canonical: PAGE_URL,
      },
      openGraph: {
            title: PAGE_TITLE,
            description: PAGE_DESCRIPTION,
            url: PAGE_URL,
      },
      twitter: {
            card: 'summary',
            title: PAGE_TITLE,
            description: PAGE_DESCRIPTION,
      },
};

export default async function TherapistsPage() {
      const therapists = await getPublicTherapists();
      const schemas = [
            buildPracticeLocalBusinessSchema(PAGE_DESCRIPTION),
            buildBreadcrumbSchema([
                  { name: 'Home', path: '/' },
                  { name: 'Therapists', path: '/therapists' },
            ]),
      ];

      return (
            <>
                  <div className="surface-warm py-16 md:py-20">
                        <div className="container-custom max-w-6xl">
                              <div className="max-w-4xl">
                                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-800">
                                          Find a therapist in Kalamazoo
                                    </p>
                                    <h1 className="mt-4 text-4xl text-slate-900 md:text-6xl">
                                          Meet the therapists at Diversified Psychological Services
                                    </h1>
                                    <p className="mt-6 text-lg leading-relaxed text-slate-700 md:text-xl">
                                          Review therapist profiles to learn about specialties, experience, and the kinds of support each clinician provides.
                                    </p>
                              </div>

                              <div className="mt-10 grid gap-5 md:grid-cols-3">
                                    <article className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                                          <h2 className="text-lg font-semibold text-slate-900">Read before you reach out</h2>
                                          <p className="mt-3 text-sm leading-relaxed text-slate-700">
                                                Each profile includes a fuller biography, areas of focus, and credentials so you can make a more informed choice.
                                          </p>
                                    </article>
                                    <article className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                                          <h2 className="text-lg font-semibold text-slate-900">Not sure who fits best?</h2>
                                          <p className="mt-3 text-sm leading-relaxed text-slate-700">
                                                Contact the office and we can help you think through availability, specialties, and practical fit.
                                          </p>
                                    </article>
                                    <article className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                                          <h2 className="text-lg font-semibold text-slate-900">Serving Kalamazoo and Michigan</h2>
                                          <p className="mt-3 text-sm leading-relaxed text-slate-700">
                                                We offer care from our Kalamazoo office and telehealth options when appropriate.
                                          </p>
                                    </article>
                              </div>
                        </div>
                  </div>

                  <div className="bg-white py-16">
                        <div className="container-custom max-w-6xl">
                              {therapists.length > 0 ? (
                                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                          {therapists.map((therapist) => (
                                                <TherapistCard key={therapist.id} therapist={therapist} />
                                          ))}
                                    </div>
                              ) : (
                                    <div className="rounded-3xl border border-stone-200 bg-stone-50 p-8 text-center shadow-sm">
                                          <h2 className="text-2xl text-slate-900">Therapist profiles are being updated</h2>
                                          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-700">
                                                Contact the practice directly and we will help you understand current therapist availability.
                                          </p>
                                    </div>
                              )}
                        </div>
                  </div>

                  <section className="surface-mint py-16">
                        <div className="container-custom max-w-5xl">
                              <div className="rounded-3xl bg-slate-900 px-8 py-12 text-center text-white shadow-md md:px-12">
                                    <h2 className="text-3xl md:text-4xl">Want to compare services before choosing a therapist?</h2>
                                    <p className="mx-auto mt-4 max-w-3xl text-lg text-slate-100">
                                          Browse the therapy services we offer, then contact us to talk through the best next step.
                                    </p>
                                    <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                                          <Link
                                                href="/services"
                                                className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 font-semibold text-emerald-700 transition hover:bg-emerald-50"
                                          >
                                                Explore services
                                          </Link>
                                          <Link
                                                href="/contact"
                                                className="inline-flex items-center justify-center rounded-lg border border-white/25 bg-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/20"
                                          >
                                                Contact the practice
                                          </Link>
                                    </div>
                              </div>
                        </div>
                  </section>

                  <StructuredData schemas={schemas} idPrefix="therapists-page-schema" />
            </>
      );
}
