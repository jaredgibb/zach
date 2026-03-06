import type { Metadata } from 'next';
import Link from 'next/link';
import StructuredData from '@/components/StructuredData';
import { buildSiteUrl } from '@/lib/cms/server';
import { businessInfo, insuranceProviders } from '@/lib/data';
import {
      buildBreadcrumbSchema,
      buildPracticeLocalBusinessSchema,
} from '@/lib/publicContentServer';

const PAGE_TITLE = 'Contact Diversified Psychological Services | Kalamazoo, MI';
const PAGE_DESCRIPTION =
      'Contact Diversified Psychological Services in Kalamazoo, Michigan by phone or email to ask about therapist availability, insurance, and next steps for getting started.';
const PAGE_URL = buildSiteUrl('/contact');

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

export default function ContactPage() {
      const schemas = [
            buildPracticeLocalBusinessSchema(PAGE_DESCRIPTION),
            buildBreadcrumbSchema([
                  { name: 'Home', path: '/' },
                  { name: 'Contact', path: '/contact' },
            ]),
      ];

      return (
            <>
                  <div className="surface-warm py-16 md:py-20">
                        <div className="container-custom max-w-6xl">
                              <div className="max-w-4xl">
                                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-800">
                                          Contact our Kalamazoo office
                                    </p>
                                    <h1 className="mt-4 text-4xl text-slate-900 md:text-6xl">
                                          Reach out to ask about appointments, insurance, and therapist fit
                                    </h1>
                                    <p className="mt-6 text-lg leading-relaxed text-slate-700 md:text-xl">
                                          Call or email Diversified Psychological Services directly. We can help you understand current availability, which therapist may be a fit, and what to expect next.
                                    </p>
                              </div>
                        </div>
                  </div>

                  <div className="bg-white py-16">
                        <div className="container-custom max-w-6xl">
                              <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
                                    <section className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
                                          <h2 className="text-2xl text-slate-900">Contact details</h2>
                                          <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-700">
                                                <p>
                                                      <strong className="text-slate-900">Phone:</strong>{' '}
                                                      <a href={`tel:${businessInfo.phone}`} className="font-semibold text-teal-800 underline underline-offset-4">
                                                            {businessInfo.phone}
                                                      </a>
                                                </p>
                                                <p>
                                                      <strong className="text-slate-900">Email:</strong>{' '}
                                                      <a href={`mailto:${businessInfo.email}`} className="font-semibold text-teal-800 underline underline-offset-4">
                                                            {businessInfo.email}
                                                      </a>
                                                </p>
                                                <p>
                                                      <strong className="text-slate-900">Office:</strong><br />
                                                      {businessInfo.address}<br />
                                                      {businessInfo.city}, {businessInfo.state} {businessInfo.zip}
                                                </p>
                                          </div>

                                          <div className="mt-8 rounded-2xl bg-teal-50 p-5">
                                                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-800">
                                                      Helpful to include when you reach out
                                                </h3>
                                                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700">
                                                      <li>Your preferred days or times for appointments</li>
                                                      <li>Your insurance plan or payer</li>
                                                      <li>Whether you prefer in-person or telehealth care</li>
                                                      <li>Any therapist preference or main reason you are seeking support</li>
                                                </ul>
                                          </div>
                                    </section>

                                    <section className="rounded-3xl border border-red-200 bg-red-50 p-8 shadow-sm">
                                          <h2 className="text-2xl text-red-950">Emergency notice</h2>
                                          <p className="mt-4 text-base leading-relaxed text-red-900">
                                                This practice is not an emergency service. If you are experiencing a mental health crisis, do not wait for a callback from the office.
                                          </p>
                                          <ul className="mt-5 space-y-3 text-sm leading-relaxed text-red-900">
                                                <li>Dial or text <strong>988</strong> for the Suicide and Crisis Lifeline.</li>
                                                <li>Call <strong>911</strong> or go to the nearest emergency room if you are in immediate danger.</li>
                                          </ul>
                                    </section>
                              </div>
                        </div>
                  </div>

                  <section className="surface-mint py-16">
                        <div className="container-custom max-w-6xl">
                              <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
                                    <section className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
                                          <h2 className="text-2xl text-slate-900">Insurance information</h2>
                                          <p className="mt-4 text-base leading-relaxed text-slate-700">
                                                We accept many major insurance plans. If you do not see your plan listed, reach out and we can help clarify current options.
                                          </p>
                                          <div className="mt-5 flex flex-wrap gap-2">
                                                {insuranceProviders.map((provider) => (
                                                      <span
                                                            key={provider}
                                                            className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700"
                                                      >
                                                            {provider}
                                                      </span>
                                                ))}
                                          </div>
                                    </section>

                                    <section className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
                                          <h2 className="text-2xl text-slate-900">Need more context first?</h2>
                                          <p className="mt-4 text-base leading-relaxed text-slate-700">
                                                Review our therapist profiles and services before you reach out if you want a clearer sense of fit.
                                          </p>
                                          <div className="mt-6 space-y-4">
                                                <Link href="/therapists" className="block text-sm font-semibold text-teal-800 underline underline-offset-4">
                                                      Meet our therapists
                                                </Link>
                                                <Link href="/services" className="block text-sm font-semibold text-teal-800 underline underline-offset-4">
                                                      Explore services
                                                </Link>
                                                <Link href="/about" className="block text-sm font-semibold text-teal-800 underline underline-offset-4">
                                                      Learn about the practice
                                                </Link>
                                          </div>
                                    </section>
                              </div>
                        </div>
                  </section>

                  <StructuredData schemas={schemas} idPrefix="contact-page-schema" />
            </>
      );
}
