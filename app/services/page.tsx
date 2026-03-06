import type { Metadata } from 'next';
import Link from 'next/link';
import StructuredData from '@/components/StructuredData';
import { ServiceCard } from '@/components/ServiceCard';
import { buildSiteUrl } from '@/lib/cms/server';
import {
      buildBreadcrumbSchema,
      buildPracticeLocalBusinessSchema,
      getPublicServices,
} from '@/lib/publicContentServer';

export const dynamic = 'force-dynamic';

const PAGE_TITLE = 'Therapy Services in Kalamazoo, MI | Diversified Psychological Services';
const PAGE_DESCRIPTION =
      'Explore individual therapy, couples counseling, family therapy, and other mental health services from Diversified Psychological Services in Kalamazoo, Michigan.';
const PAGE_URL = buildSiteUrl('/services');

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

export default async function ServicesPage() {
      const services = await getPublicServices();
      const schemas = [
            buildPracticeLocalBusinessSchema(PAGE_DESCRIPTION),
            buildBreadcrumbSchema([
                  { name: 'Home', path: '/' },
                  { name: 'Services', path: '/services' },
            ]),
      ];

      return (
            <>
                  <div className="surface-warm py-16 md:py-20">
                        <div className="container-custom max-w-6xl">
                              <div className="max-w-4xl">
                                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-800">
                                          Therapy services in Kalamazoo
                                    </p>
                                    <h1 className="mt-4 text-4xl text-slate-900 md:text-6xl">
                                          Mental health services with clear, practical support
                                    </h1>
                                    <p className="mt-6 text-lg leading-relaxed text-slate-700 md:text-xl">
                                          Explore therapy services offered through Diversified Psychological Services, including care for individuals, couples, families, and major life transitions.
                                    </p>
                              </div>

                              <div className="mt-10 grid gap-5 md:grid-cols-3">
                                    <article className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                                          <h2 className="text-lg font-semibold text-slate-900">Support matched to your goals</h2>
                                          <p className="mt-3 text-sm leading-relaxed text-slate-700">
                                                Each service page outlines what support can look like and which kinds of concerns may be a fit.
                                          </p>
                                    </article>
                                    <article className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                                          <h2 className="text-lg font-semibold text-slate-900">In-person and telehealth options</h2>
                                          <p className="mt-3 text-sm leading-relaxed text-slate-700">
                                                We offer care from our Kalamazoo office and telehealth sessions when clinically appropriate.
                                          </p>
                                    </article>
                                    <article className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                                          <h2 className="text-lg font-semibold text-slate-900">Questions before you start</h2>
                                          <p className="mt-3 text-sm leading-relaxed text-slate-700">
                                                Contact us to ask about insurance, therapist availability, and the best next step for your situation.
                                          </p>
                                    </article>
                              </div>
                        </div>
                  </div>

                  <div className="bg-white py-16">
                        <div className="container-custom max-w-6xl">
                              {services.length > 0 ? (
                                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                          {services.map((service) => (
                                                <ServiceCard key={service.id} service={service} />
                                          ))}
                                    </div>
                              ) : (
                                    <div className="rounded-3xl border border-stone-200 bg-stone-50 p-8 text-center shadow-sm">
                                          <h2 className="text-2xl text-slate-900">Services are being updated</h2>
                                          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-700">
                                                Contact the practice directly and we will help you understand which therapy services and openings are currently available.
                                          </p>
                                    </div>
                              )}
                        </div>
                  </div>

                  <section className="surface-mint py-16">
                        <div className="container-custom max-w-5xl">
                              <div className="rounded-3xl bg-slate-900 px-8 py-12 text-center text-white shadow-md md:px-12">
                                    <h2 className="text-3xl md:text-4xl">Need help figuring out the right fit?</h2>
                                    <p className="mx-auto mt-4 max-w-3xl text-lg text-slate-100">
                                          Start with our therapist profiles or contact the office and we can help guide you toward the best next step.
                                    </p>
                                    <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                                          <Link
                                                href="/therapists"
                                                className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 font-semibold text-emerald-700 transition hover:bg-emerald-50"
                                          >
                                                Meet our therapists
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

                  <StructuredData schemas={schemas} idPrefix="services-page-schema" />
            </>
      );
}
