import type { Metadata } from 'next';
import Link from 'next/link';
import StructuredData from '@/components/StructuredData';
import { buildSiteUrl } from '@/lib/cms/server';
import {
      buildBreadcrumbSchema,
      buildPracticeLocalBusinessSchema,
} from '@/lib/publicContentServer';

const PAGE_TITLE = 'About Diversified Psychological Services | Kalamazoo, MI';
const PAGE_DESCRIPTION =
      'Learn about Diversified Psychological Services, a Kalamazoo therapy practice offering compassionate, evidence-informed care for individuals, couples, and families.';
const PAGE_URL = buildSiteUrl('/about');

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

export default function AboutPage() {
      const schemas = [
            buildPracticeLocalBusinessSchema(PAGE_DESCRIPTION),
            buildBreadcrumbSchema([
                  { name: 'Home', path: '/' },
                  { name: 'About', path: '/about' },
            ]),
      ];

      return (
            <>
                  <div className="surface-warm py-16 md:py-20">
                        <div className="container-custom max-w-6xl">
                              <div className="max-w-4xl">
                                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-800">
                                          About our practice
                                    </p>
                                    <h1 className="mt-4 text-4xl text-slate-900 md:text-6xl">
                                          Therapy rooted in relationship, clarity, and practical support
                                    </h1>
                                    <p className="mt-6 text-lg leading-relaxed text-slate-700 md:text-xl">
                                          Diversified Psychological Services exists to serve people through safe, welcoming, and evidence-informed therapy in Kalamazoo, Michigan.
                                    </p>
                              </div>
                        </div>
                  </div>

                  <div className="bg-white py-16">
                        <div className="container-custom max-w-5xl">
                              <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
                                    <div className="space-y-8">
                                          <section>
                                                <h2 className="text-3xl text-slate-900">Who we are</h2>
                                                <p className="mt-4 text-base leading-relaxed text-slate-700 md:text-lg">
                                                      We work with individuals, couples, and families across a wide range of concerns, including anxiety, depression, trauma, relationship stress, grief, parenting challenges, and major life transitions.
                                                </p>
                                                <p className="mt-4 text-base leading-relaxed text-slate-700 md:text-lg">
                                                      Our clinicians bring different backgrounds, specialties, and life experience to the work. What they share is a commitment to thoughtful care, clear communication, and a therapeutic relationship that feels steady and collaborative.
                                                </p>
                                          </section>

                                          <section>
                                                <h2 className="text-3xl text-slate-900">How we approach care</h2>
                                                <p className="mt-4 text-base leading-relaxed text-slate-700 md:text-lg">
                                                      We believe therapy is most useful when it is grounded in both trust and practicality. That means listening carefully, understanding what is happening in your life right now, and helping you build tools that support lasting change.
                                                </p>
                                                <p className="mt-4 text-base leading-relaxed text-slate-700 md:text-lg">
                                                      We offer in-person appointments in Kalamazoo and telehealth options when appropriate, so care can fit more realistically into everyday life.
                                                </p>
                                          </section>
                                    </div>

                                    <aside className="rounded-3xl border border-stone-200 bg-stone-50 p-6 shadow-sm">
                                          <h2 className="text-xl font-semibold text-slate-900">What makes this practice different</h2>
                                          <ul className="mt-5 space-y-4 text-sm leading-relaxed text-slate-700">
                                                <li>Relationship-based therapy that stays focused on real-life needs.</li>
                                                <li>Support across different ages, concerns, and family situations.</li>
                                                <li>Clear next steps for scheduling, insurance questions, and finding the right fit.</li>
                                          </ul>
                                          <div className="mt-6 rounded-2xl bg-white p-5">
                                                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-800">Next step</h3>
                                                <p className="mt-3 text-sm text-slate-700">
                                                      Start by reviewing our therapists or services, then contact the practice when you are ready.
                                                </p>
                                                <div className="mt-4 space-y-3">
                                                      <Link href="/therapists" className="block text-sm font-semibold text-teal-800 underline underline-offset-4">
                                                            Meet our therapists
                                                      </Link>
                                                      <Link href="/services" className="block text-sm font-semibold text-teal-800 underline underline-offset-4">
                                                            Explore services
                                                      </Link>
                                                </div>
                                          </div>
                                    </aside>
                              </div>
                        </div>
                  </div>

                  <section className="surface-mint py-16">
                        <div className="container-custom max-w-5xl">
                              <div className="rounded-3xl bg-slate-900 px-8 py-12 text-center text-white shadow-md md:px-12">
                                    <h2 className="text-3xl md:text-4xl">Ready to talk through next steps?</h2>
                                    <p className="mx-auto mt-4 max-w-3xl text-lg text-slate-100">
                                          Reach out to the office for help with therapist fit, insurance questions, and current appointment availability.
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

                  <StructuredData schemas={schemas} idPrefix="about-page-schema" />
            </>
      );
}
