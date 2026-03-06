import Link from 'next/link';
import { HomeServiceCard } from '@/components/home/HomeServiceCard';
import { HomeTherapistCard } from '@/components/home/HomeTherapistCard';
import { businessInfo, insuranceProviders } from '@/lib/data';
import { getPrimaryTherapistSpecialty } from '@/lib/publicContent';
import type { Service, Therapist } from '@/lib/hooks/useDatabase';

interface LegacyHomeFallbackProps {
      therapists?: Therapist[];
      services?: Service[];
}

function buildTherapistPreviews(therapists: Therapist[]) {
      return therapists.slice(0, 3).map((therapist) => ({
            imageUrl: therapist.image_url?.trim() || '/images/stock-therapy/hero.jpg',
            imageAlt: therapist.image_url?.trim()
                  ? `Portrait of ${therapist.name}`
                  : 'Comfortable therapy office in Kalamazoo with natural light',
            name: therapist.name,
            credentials: therapist.credentials || therapist.title || '',
            specialty: getPrimaryTherapistSpecialty(therapist) ?? 'Therapy Support',
            href: `/therapists/${therapist.slug}`,
      }));
}

function buildServicePreviews(services: Service[]) {
      return services.slice(0, 6).map((service) => ({
            title: service.title,
            description: service.short_description,
            href: `/services/${service.slug}`,
      }));
}

export default function LegacyHomeFallback({
      therapists = [],
      services = [],
}: LegacyHomeFallbackProps) {
      const therapistPreviews = buildTherapistPreviews(therapists);
      const servicePreviews = buildServicePreviews(services);

      return (
            <div className="overflow-hidden">
                  <section className="relative overflow-hidden bg-slate-900 py-20 text-white md:py-32">
                        <div className="absolute inset-0">
                              <img
                                    src="/images/stock-therapy/hero.jpg"
                                    alt="Comfortable therapy office in Kalamazoo with soft natural light"
                                    className="h-full w-full object-cover"
                              />
                              <div className="absolute inset-0 bg-slate-950/65" />
                              <div className="absolute inset-0 bg-gradient-to-r from-teal-950/85 via-teal-900/60 to-emerald-700/20" />
                        </div>

                        <div className="container-custom relative z-10">
                              <div className="mx-auto max-w-4xl text-center">
                                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-100">
                                          Diversified Psychological Services
                                    </p>
                                    <h1 className="mt-5 text-5xl font-bold leading-tight md:text-6xl">
                                          Therapy in Kalamazoo, Michigan with clear next steps
                                    </h1>
                                    <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-white/90 md:text-2xl">
                                          Compassionate, evidence-informed care for anxiety, relationships, trauma, stress, and life transitions with in-person and telehealth options.
                                    </p>
                                    <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
                                          <Link
                                                href="/contact"
                                                className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 font-semibold text-teal-800 shadow-lg transition hover:bg-stone-50"
                                          >
                                                Contact the practice
                                          </Link>
                                          <Link
                                                href="/therapists"
                                                className="inline-flex items-center justify-center rounded-lg border border-white/25 bg-white/10 px-8 py-4 font-semibold text-white transition hover:bg-white/20"
                                          >
                                                Meet our therapists
                                          </Link>
                                    </div>
                              </div>
                        </div>
                  </section>

                  <section className="surface-warm py-14">
                        <div className="container-custom">
                              <div className="grid gap-6 md:grid-cols-3">
                                    <article className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                                          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-800">Insurance accepted</p>
                                          <p className="mt-3 text-lg leading-relaxed text-slate-700">
                                                We work with many major insurance plans and can help you understand next steps before your first appointment.
                                          </p>
                                    </article>
                                    <article className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                                          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-800">Flexible care</p>
                                          <p className="mt-3 text-lg leading-relaxed text-slate-700">
                                                Choose in-person sessions in Kalamazoo or telehealth appointments anywhere in Michigan when appropriate.
                                          </p>
                                    </article>
                                    <article className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                                          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-800">Licensed clinicians</p>
                                          <p className="mt-3 text-lg leading-relaxed text-slate-700">
                                                Our team focuses on practical, relationship-based therapy that meets you where you are.
                                          </p>
                                    </article>
                              </div>
                        </div>
                  </section>

                  <section className="bg-white py-16">
                        <div className="container-custom">
                              <div className="rounded-3xl border border-teal-100 bg-teal-50/50 p-8 shadow-sm md:p-10">
                                    <div className="grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-start">
                                          <div>
                                                <h2 className="text-3xl text-slate-900 md:text-4xl">Insurance and scheduling</h2>
                                                <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-700">
                                                      Contact us if you do not see your insurance listed. We can confirm coverage details and help you understand the best next step.
                                                </p>
                                                <div className="mt-5 flex flex-wrap gap-2">
                                                      {insuranceProviders.map((provider) => (
                                                            <span
                                                                  key={provider}
                                                                  className="rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-sm font-medium text-emerald-700"
                                                            >
                                                                  {provider}
                                                            </span>
                                                      ))}
                                                </div>
                                          </div>
                                          <div className="rounded-2xl bg-slate-900 p-6 text-white">
                                                <p className="text-sm uppercase tracking-[0.18em] text-teal-200">Call or email us</p>
                                                <p className="mt-3 text-lg leading-relaxed text-slate-100">
                                                      We typically respond to new appointment requests within 1 to 2 business days.
                                                </p>
                                                <div className="mt-5 space-y-3 text-sm text-slate-100">
                                                      <p>
                                                            <strong className="text-white">Phone:</strong>{' '}
                                                            <a href={`tel:${businessInfo.phone}`} className="underline underline-offset-4">
                                                                  {businessInfo.phone}
                                                            </a>
                                                      </p>
                                                      <p>
                                                            <strong className="text-white">Email:</strong>{' '}
                                                            <a href={`mailto:${businessInfo.email}`} className="underline underline-offset-4">
                                                                  {businessInfo.email}
                                                            </a>
                                                      </p>
                                                </div>
                                          </div>
                                    </div>
                              </div>
                        </div>
                  </section>

                  <section className="py-16">
                        <div className="container-custom max-w-6xl">
                              <div className="mb-8 flex items-end justify-between gap-6">
                                    <div>
                                          <h2 className="text-3xl text-slate-900 md:text-4xl">Meet our therapists</h2>
                                          <p className="mt-3 max-w-3xl text-slate-600">
                                                Browse therapist profiles to learn about specialties, experience, and who may be the best fit for what you are navigating.
                                          </p>
                                    </div>
                                    <Link href="/therapists" className="hidden text-sm font-semibold text-teal-700 md:inline-flex">
                                          View all profiles
                                    </Link>
                              </div>

                              {therapistPreviews.length > 0 ? (
                                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                                          {therapistPreviews.map((therapist) => (
                                                <HomeTherapistCard key={therapist.name} therapist={therapist} />
                                          ))}
                                    </div>
                              ) : (
                                    <div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
                                          <p className="text-lg leading-relaxed text-slate-700">
                                                Our therapist profiles are being updated. Contact the office and we will help match you with the right clinician.
                                          </p>
                                    </div>
                              )}
                        </div>
                  </section>

                  <section className="surface-mint py-16">
                        <div className="container-custom max-w-6xl">
                              <div className="mb-8 flex items-end justify-between gap-6">
                                    <div>
                                          <h2 className="text-3xl text-slate-900 md:text-4xl">Therapy services</h2>
                                          <p className="mt-3 max-w-3xl text-slate-600">
                                                Learn more about the therapy services we offer and what support can look like here.
                                          </p>
                                    </div>
                                    <Link href="/services" className="hidden text-sm font-semibold text-teal-700 md:inline-flex">
                                          Browse all services
                                    </Link>
                              </div>

                              {servicePreviews.length > 0 ? (
                                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                                          {servicePreviews.map((service) => (
                                                <HomeServiceCard key={service.title} service={service} />
                                          ))}
                                    </div>
                              ) : (
                                    <div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
                                          <p className="text-lg leading-relaxed text-slate-700">
                                                We provide individual, couples, and family therapy. Contact the practice for current availability and service details.
                                          </p>
                                    </div>
                              )}
                        </div>
                  </section>

                  <section className="bg-white py-16">
                        <div className="container-custom max-w-6xl">
                              <h2 className="text-3xl text-slate-900 md:text-4xl">What getting started looks like</h2>
                              <div className="mt-8 grid gap-5 md:grid-cols-3">
                                    <article className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                                          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-800">1. Reach out</p>
                                          <p className="mt-3 text-lg leading-relaxed text-slate-700">
                                                Call or email us with your availability, insurance, and any therapist preference.
                                          </p>
                                    </article>
                                    <article className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                                          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-800">2. Find the fit</p>
                                          <p className="mt-3 text-lg leading-relaxed text-slate-700">
                                                We will help you understand current openings and who may align with your goals.
                                          </p>
                                    </article>
                                    <article className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                                          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-800">3. Begin care</p>
                                          <p className="mt-3 text-lg leading-relaxed text-slate-700">
                                                Start therapy with a plan that matches your pace, priorities, and practical needs.
                                          </p>
                                    </article>
                              </div>
                        </div>
                  </section>

                  <section className="relative overflow-hidden bg-gradient-to-r from-teal-800 to-emerald-800 py-20 text-white">
                        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-teal-300/20 blur-3xl" />
                        <div className="absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-emerald-200/15 blur-3xl" />

                        <div className="container-custom relative z-10">
                              <div className="mx-auto max-w-3xl text-center">
                                    <h2 className="text-4xl font-bold md:text-5xl">Ready to take the next step?</h2>
                                    <p className="mt-6 text-xl leading-relaxed text-white/90">
                                          Reach out for a conversation about your goals, insurance, and current appointment options.
                                    </p>
                                    <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
                                          <Link
                                                href="/contact"
                                                className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 font-semibold text-teal-800 shadow-lg transition hover:bg-stone-50"
                                          >
                                                Contact us
                                          </Link>
                                          <Link
                                                href="/services"
                                                className="inline-flex items-center justify-center rounded-lg border border-white/25 bg-white/10 px-8 py-4 font-semibold text-white transition hover:bg-white/20"
                                          >
                                                Explore services
                                          </Link>
                                    </div>
                              </div>
                        </div>
                  </section>
            </div>
      );
}
