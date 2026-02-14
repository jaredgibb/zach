'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTherapists, useServices } from '@/lib/hooks/useDatabase';
import type { Therapist, Service } from '@/lib/hooks/useDatabase';

export default function Home() {
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

      return (
            <div className="overflow-hidden">
                  {/* ===== SECTION 1: HERO ===== */}
                  <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary-600 via-primary-550 to-primary-700 text-white overflow-hidden">
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
                                          {!isLoading && therapists.length > 0
                                                ? `${therapists.length} experienced professionals ready to help`
                                                : 'Experienced professionals ready to help you'
                                          }
                                    </p>
                              </div>

                              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                                    {therapists.slice(0, 3).map((therapist) => (
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
                                                      <p className="text-primary-600 font-semibold text-sm mb-1">{therapist.credentials}</p>
                                                      <p className="text-gray-600 text-sm mb-3">{therapist.title}</p>
                                                      <p className="text-gray-700 text-sm leading-relaxed line-clamp-2">{therapist.short_bio}</p>
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

                              <div className="grid md:grid-cols-2 gap-8">
                                    {services.slice(0, 4).map((service) => (
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
                                                            <p className="text-gray-600 mb-4 line-clamp-2">
                                                                  {service.short_description}
                                                            </p>
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
                                    <div className="relative h-96 bg-gradient-to-br from-primary-100 to-blue-100 rounded-2xl flex items-center justify-center shadow-lg">
                                          <svg className="w-48 h-48 text-primary-300" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m0 0l-2-1m2 1v2.5M12 3l-2 1m0 0L8 3m2 1v2.5" />
                                          </svg>
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
