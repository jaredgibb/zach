'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTherapists, useServices } from '@/lib/hooks/useDatabase';
import type { Therapist, Service } from '@/lib/hooks/useDatabase';

const STOCK_THERAPY_IMAGES = {
      hero: 'https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?auto=format&fit=crop&w=1800&q=80',
      team: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80',
      services: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&w=1400&q=80',
      wellbeing: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
};

const PLACEHOLDER_THERAPISTS: Therapist[] = [
      {
            id: 'placeholder-alex-carter',
            name: 'Alex Carter',
            credentials: 'MA, LPC',
            title: '',
            short_bio: '',
            full_bio: '',
            full_bio_rich: null,
            fun_fact: null,
            specialties: [],
            image_url: null,
            slug: 'alex-carter',
            order_index: 0,
            is_active: true,
            created_at: '',
            updated_at: '',
      },
      {
            id: 'placeholder-jordan-lee',
            name: 'Jordan Lee',
            credentials: 'MSW, LMSW',
            title: '',
            short_bio: '',
            full_bio: '',
            full_bio_rich: null,
            fun_fact: null,
            specialties: [],
            image_url: null,
            slug: 'jordan-lee',
            order_index: 1,
            is_active: true,
            created_at: '',
            updated_at: '',
      },
      {
            id: 'placeholder-taylor-morgan',
            name: 'Taylor Morgan',
            credentials: 'PhD, LP',
            title: '',
            short_bio: '',
            full_bio: '',
            full_bio_rich: null,
            fun_fact: null,
            specialties: [],
            image_url: null,
            slug: 'taylor-morgan',
            order_index: 2,
            is_active: true,
            created_at: '',
            updated_at: '',
      },
];

const PLACEHOLDER_SERVICES: Service[] = [
      {
            id: 'placeholder-individual-therapy',
            title: 'Individual Therapy',
            slug: 'individual-therapy',
            short_description: '',
            full_description: '',
            full_description_rich: null,
            image_url: null,
            features: [],
            order_index: 0,
            is_active: true,
            created_at: '',
            updated_at: '',
      },
      {
            id: 'placeholder-couples-counseling',
            title: 'Couples Counseling',
            slug: 'couples-counseling',
            short_description: '',
            full_description: '',
            full_description_rich: null,
            image_url: null,
            features: [],
            order_index: 1,
            is_active: true,
            created_at: '',
            updated_at: '',
      },
      {
            id: 'placeholder-family-therapy',
            title: 'Family Therapy',
            slug: 'family-therapy',
            short_description: '',
            full_description: '',
            full_description_rich: null,
            image_url: null,
            features: [],
            order_index: 2,
            is_active: true,
            created_at: '',
            updated_at: '',
      },
      {
            id: 'placeholder-telehealth',
            title: 'Telehealth Sessions',
            slug: 'telehealth-sessions',
            short_description: '',
            full_description: '',
            full_description_rich: null,
            image_url: null,
            features: [],
            order_index: 3,
            is_active: true,
            created_at: '',
            updated_at: '',
      },
];

export default function LegacyHomeFallback() {
      const { fetchTherapists } = useTherapists();
      const { fetchServices } = useServices();
      const [therapists, setTherapists] = useState<Therapist[]>([]);
      const [services, setServices] = useState<Service[]>([]);
      const [isLoading, setIsLoading] = useState(true);

      useEffect(() => {
            async function loadData() {
                  try {
                        const [therapistsData, servicesData] = await Promise.all([
                              fetchTherapists(),
                              fetchServices(),
                        ]);
                        setTherapists(therapistsData);
                        setServices(servicesData);
                  } catch (err) {
                        console.error('Failed to load data:', err);
                  } finally {
                        setIsLoading(false);
                  }
            }
            loadData();
      }, [fetchTherapists, fetchServices]);

      const visibleTherapists = therapists.length > 0 ? therapists : PLACEHOLDER_THERAPISTS;
      const visibleServices = services.length > 0 ? services : PLACEHOLDER_SERVICES;

      return (
            <div className="overflow-hidden">
                  {/* ===== SECTION 1: HERO ===== */}
                  <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary-600 via-primary-550 to-primary-700 text-white overflow-hidden">
                        <div className="absolute inset-0">
                              <img
                                    src={STOCK_THERAPY_IMAGES.hero}
                                    alt="Two people talking during a therapy session"
                                    className="h-full w-full object-cover"
                              />
                              <div className="absolute inset-0 bg-slate-950/55"></div>
                              <div className="absolute inset-0 bg-gradient-to-r from-primary-900/75 via-primary-700/55 to-primary-500/35"></div>
                        </div>
                        {/* Decorative gradient orbs */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -mr-32 -mt-32"></div>
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -ml-32 mb-32"></div>

                        <div className="container-custom relative z-10">
                              <div className="max-w-3xl mx-auto text-center">
                                    <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                                          Your Mental Health Matters
                                    </h1>
                                    <p className="text-xl md:text-2xl text-primary-100 mb-4 font-light">
                                          Expert therapy in a safe, welcoming environment
                                    </p>
                                    <p className="text-lg text-primary-100 mb-10">
                                          Meet with experienced, licensed therapists who are dedicated to supporting your journey toward greater wellbeing.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                          <Link
                                                href="/contact"
                                                className="inline-block bg-white text-primary-600 hover:bg-gray-50 font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                                          >
                                                Schedule a Session
                                          </Link>
                                          <Link
                                                href="/therapists"
                                                className="inline-block bg-primary-700 text-white hover:bg-primary-800 font-semibold px-8 py-4 rounded-lg transition-all duration-300 border border-white/20"
                                          >
                                                Meet Our Team
                                          </Link>
                                    </div>
                              </div>
                        </div>
                  </section>

                  {/* ===== SECTION 2: KEY BENEFITS/FEATURES ===== */}
                  <section className="py-20 bg-white">
                        <div className="container-custom">
                              <div className="text-center mb-16">
                                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
                                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                          We're committed to providing compassionate, evidence-based therapy that makes a real difference
                                    </p>
                              </div>

                              <div className="grid md:grid-cols-3 gap-8">
                                    {[
                                          {
                                                icon: '🎯',
                                                title: 'Personalized Treatment',
                                                description: 'Each therapy plan is tailored to your unique needs and goals'
                                          },
                                          {
                                                icon: '🤝',
                                                title: 'Expert Therapists',
                                                description: 'Licensed, experienced professionals dedicated to your growth'
                                          },
                                          {
                                                icon: '🔒',
                                                title: 'Safe & Confidential',
                                                description: 'A judgment-free space where you can be fully yourself'
                                          },
                                          {
                                                icon: '⏰',
                                                title: 'Flexible Scheduling',
                                                description: 'Sessions that fit your life and busy schedule'
                                          },
                                          {
                                                icon: '💡',
                                                title: 'Evidence-Based',
                                                description: 'Treatment methods grounded in research and proven results'
                                          },
                                          {
                                                icon: '🌱',
                                                title: 'Growth Focused',
                                                description: 'We help you build skills for lasting wellness'
                                          },
                                    ].map((benefit, idx) => (
                                          <div key={idx} className="group p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200">
                                                <div className="text-5xl mb-4">{benefit.icon}</div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                                                      {benefit.title}
                                                </h3>
                                                <p className="text-gray-600 leading-relaxed">
                                                      {benefit.description}
                                                </p>
                                          </div>
                                    ))}
                              </div>
                        </div>
                  </section>

                  {/* ===== SECTION 3: OUR THERAPISTS ===== */}
                  <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
                        <div className="container-custom">
                              <div className="text-center mb-16">
                                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
                                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                          {!isLoading && visibleTherapists.length > 0
                                                ? `${visibleTherapists.length} experienced professionals ready to help`
                                                : 'Experienced professionals ready to help you'
                                          }
                                    </p>
                              </div>

                              <div className="mb-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] items-center rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                                    <div>
                                          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-700 mb-2">
                                                Compassionate, Person-Centered Care
                                          </p>
                                          <p className="text-lg text-gray-700 leading-relaxed">
                                                We are building out each provider profile. Names and credentials can be added first, and bios/photos can be added as they are ready.
                                          </p>
                                    </div>
                                    <div className="relative h-60 overflow-hidden rounded-xl bg-gray-100">
                                          <img
                                                src={STOCK_THERAPY_IMAGES.team}
                                                alt="A therapist speaking with a client in a comfortable office"
                                                className="h-full w-full object-cover"
                                          />
                                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
                                    </div>
                              </div>

                              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                                    {visibleTherapists.slice(0, 3).map((therapist) => (
                                          <div key={therapist.id} className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
                                                {therapist.image_url ? (
                                                      <img
                                                            src={therapist.image_url}
                                                            alt={`Photo of ${therapist.name}`}
                                                            className="h-64 w-full object-cover"
                                                      />
                                                ) : (
                                                      <div className="h-64 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                                                            <svg className="w-32 h-32 text-primary-300" fill="currentColor" viewBox="0 0 24 24">
                                                                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                                            </svg>
                                                      </div>
                                                )}
                                                <div className="p-6 bg-white">
                                                      <h3 className="text-xl font-bold text-gray-900">{therapist.name}</h3>
                                                      {therapist.credentials.trim() && (
                                                            <p className="text-primary-600 font-semibold text-sm mb-1">{therapist.credentials}</p>
                                                      )}
                                                      {therapist.title.trim() && (
                                                            <p className="text-gray-600 text-sm mb-3">{therapist.title}</p>
                                                      )}
                                                      {therapist.short_bio.trim() && (
                                                            <p className="text-gray-700 text-sm leading-relaxed line-clamp-2">{therapist.short_bio}</p>
                                                      )}
                                                      <Link href="/therapists" className="inline-block mt-4 text-primary-600 font-semibold hover:underline">
                                                            View profile →
                                                      </Link>
                                                </div>
                                          </div>
                                    ))}
                              </div>

                              <div className="text-center">
                                    <Link
                                          href="/therapists"
                                          className="inline-block bg-primary-600 text-white hover:bg-primary-700 font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105"
                                    >
                                          View All Therapists
                                    </Link>
                              </div>
                        </div>
                  </section>

                  {/* ===== SECTION 4: SERVICES ===== */}
                  <section className="py-20 bg-white">
                        <div className="container-custom">
                              <div className="text-center mb-16">
                                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Services</h2>
                                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                          Comprehensive mental health services designed for your unique needs
                                    </p>
                              </div>

                              <div className="mb-10 relative overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
                                    <img
                                          src={STOCK_THERAPY_IMAGES.services}
                                          alt="Therapist and client talking in a counseling session"
                                          className="h-56 w-full object-cover md:h-72"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/65 via-slate-900/35 to-transparent" />
                                    <div className="absolute inset-y-0 left-0 flex max-w-xl items-center p-6 md:p-8">
                                          <p className="text-base md:text-lg leading-relaxed text-white">
                                                Service descriptions can be expanded over time while the current layout continues to provide a clear, easy-to-navigate overview.
                                          </p>
                                    </div>
                              </div>

                              <div className="grid md:grid-cols-2 gap-8">
                                    {visibleServices.slice(0, 4).map((service) => (
                                          <div key={service.id} className="group p-8 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-primary-300">
                                                <div className="flex items-start">
                                                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0 group-hover:bg-primary-200 transition-colors">
                                                            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                            </svg>
                                                      </div>
                                                      <div className="flex-1">
                                                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                                                                  {service.title}
                                                            </h3>
                                                            {service.short_description.trim() && (
                                                                  <p className="text-gray-600 mb-4 line-clamp-2">
                                                                        {service.short_description}
                                                                  </p>
                                                            )}
                                                            <Link href="/services" className="text-primary-600 font-semibold text-sm hover:underline">
                                                                  Learn more →
                                                            </Link>
                                                      </div>
                                                </div>
                                          </div>
                                    ))}
                              </div>

                              <div className="text-center mt-12">
                                    <Link
                                          href="/services"
                                          className="inline-block bg-primary-600 text-white hover:bg-primary-700 font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105"
                                    >
                                          Explore All Services
                                    </Link>
                              </div>
                        </div>
                  </section>

                  {/* ===== SECTION 5: HOW IT WORKS ===== */}
                  <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
                        <div className="container-custom">
                              <div className="text-center mb-16">
                                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Getting Started is Easy</h2>
                                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                          A simple process designed for your convenience
                                    </p>
                              </div>

                              <div className="grid md:grid-cols-4 gap-8">
                                    {[
                                          {
                                                step: '01',
                                                title: 'Schedule',
                                                description: 'Choose a time that works with your schedule'
                                          },
                                          {
                                                step: '02',
                                                title: 'Connect',
                                                description: 'Meet with your therapist in a safe space'
                                          },
                                          {
                                                step: '03',
                                                title: 'Progress',
                                                description: 'Work together toward your goals'
                                          },
                                          {
                                                step: '04',
                                                title: 'Thrive',
                                                description: 'Experience lasting positive change'
                                          },
                                    ].map((item, idx) => (
                                          <div key={idx} className="text-center">
                                                <div className="mb-6">
                                                      <span className="inline-block text-4xl font-bold text-primary-600 bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center">
                                                            {item.step}
                                                      </span>
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                                                <p className="text-gray-600">{item.description}</p>
                                                {idx < 3 && (
                                                      <div className="hidden md:block absolute top-1/3 right-0 transform translate-x-1/2 text-primary-300">
                                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                                  <path d="M9 5l7 7-7 7" />
                                                            </svg>
                                                      </div>
                                                )}
                                          </div>
                                    ))}
                              </div>
                        </div>
                  </section>

                  {/* ===== SECTION 6: WHY MENTAL HEALTH MATTERS ===== */}
                  <section className="py-20 bg-gradient-to-r from-primary-50 to-blue-50">
                        <div className="container-custom">
                              <div className="grid md:grid-cols-2 gap-12 items-center">
                                    <div>
                                          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                                                Prioritize Your Mental Wellbeing
                                          </h2>
                                          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                                                Your mental health is just as important as your physical health. Taking care of your emotional wellbeing is an investment in yourself.
                                          </p>
                                          <ul className="space-y-4">
                                                {[
                                                      'Reduce stress and anxiety',
                                                      'Improve relationships and communication',
                                                      'Develop healthy coping strategies',
                                                      'Build confidence and self-esteem',
                                                      'Create lasting positive change'
                                                ].map((item, idx) => (
                                                      <li key={idx} className="flex items-center text-gray-700">
                                                            <svg className="w-6 h-6 text-primary-600 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                            </svg>
                                                            {item}
                                                      </li>
                                                ))}
                                          </ul>
                                    </div>
                                    <div className="relative h-96 overflow-hidden rounded-2xl shadow-lg">
                                          <img
                                                src={STOCK_THERAPY_IMAGES.wellbeing}
                                                alt="Therapist and client meeting in a calm setting"
                                                className="h-full w-full object-cover"
                                          />
                                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/45 via-slate-900/10 to-transparent" />
                                          <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-white/90 p-4 backdrop-blur-sm">
                                                <p className="text-sm font-semibold text-primary-700 mb-1">A welcoming place to start</p>
                                                <p className="text-sm text-gray-700">
                                                      Therapy can support everyday stress, life transitions, relationships, and long-term growth.
                                                </p>
                                          </div>
                                    </div>
                              </div>
                        </div>
                  </section>

                  {/* ===== SECTION 7: CTA - READY TO START ===== */}
                  <section className="py-20 md:py-28 bg-gradient-to-r from-primary-600 to-primary-700 text-white relative overflow-hidden">
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -mr-48 -mt-48"></div>
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -ml-48 mb-48"></div>

                        <div className="container-custom relative z-10">
                              <div className="max-w-3xl mx-auto text-center">
                                    <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Take the Next Step?</h2>
                                    <p className="text-xl text-primary-100 mb-10 leading-relaxed">
                                          Start your journey toward better mental health today. With flexible scheduling and compassionate care, we're here to support you.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                          <Link
                                                href="/contact"
                                                className="inline-block bg-white text-primary-600 hover:bg-gray-50 font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                                          >
                                                Schedule Today
                                          </Link>
                                          <Link
                                                href="/about"
                                                className="inline-block bg-primary-700 text-white hover:bg-primary-800 font-semibold px-8 py-4 rounded-lg transition-all duration-300 border border-white/20"
                                          >
                                                Learn More
                                          </Link>
                                    </div>
                              </div>
                        </div>
                  </section>
            </div>
      );
}
