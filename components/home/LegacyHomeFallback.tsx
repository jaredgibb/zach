'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { insuranceProviders } from '@/lib/data';
import { HomeServiceCard, type HomeServicePreview } from '@/components/home/HomeServiceCard';
import { HomeTherapistCard, type HomeTherapistPreview } from '@/components/home/HomeTherapistCard';
import { useTherapists, useServices } from '@/lib/hooks/useDatabase';
import type { Therapist, Service } from '@/lib/hooks/useDatabase';

const STOCK_THERAPY_IMAGES = {
      hero: '/images/stock-therapy/hero.jpg',
      team: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=1400&q=80',
      services: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80',
      wellbeing: '/images/stock-therapy/stock-g-2.png',
};

const PLACEHOLDER_THERAPIST_IMAGES = [
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=900&q=80',
];

const HOME_THERAPIST_SPECIALTY_FALLBACK = 'General Mental Health Support';
const HOME_THERAPIST_FALLBACK_PROFILE_HREF = '/therapists';
const HOME_SERVICE_HREF = '/services';

const CURATED_HOME_SERVICE_TITLES = [
      'Anxiety & Depression',
      'Couples Counseling',
      'Trauma-Informed Care',
      'Child & Adolescent Therapy',
      'ADHD & Neurodivergence Support',
      'Life Transitions & Stress Management',
];

const SERVICE_DESCRIPTION_FALLBACKS: Record<string, string> = {
      'Anxiety & Depression':
            'Supportive, evidence-based care to help you manage stress, mood changes, and everyday overwhelm.',
      'Couples Counseling':
            'Strengthen communication, rebuild trust, and work through conflict with a compassionate therapist.',
      'Trauma-Informed Care':
            'Gentle, paced therapy that prioritizes safety, empowerment, and healing after difficult experiences.',
      'Child & Adolescent Therapy':
            'Age-appropriate counseling for emotional regulation, school stress, behavior concerns, and family changes.',
      'ADHD & Neurodivergence Support':
            'Practical tools and affirming care tailored to executive functioning, attention needs, and burnout.',
      'Life Transitions & Stress Management':
            'Therapy for career shifts, grief, caregiving stress, and major life changes with steady guidance.',
};

const PLACEHOLDER_THERAPISTS: Therapist[] = [
      {
            id: 'placeholder-maya-robinson',
            name: 'Maya Robinson',
            credentials: 'MA, LPC',
            title: 'Licensed Professional Counselor',
            short_bio: 'Warm, collaborative therapy for focus challenges, burnout, and life transitions.',
            full_bio: '',
            full_bio_rich: null,
            fun_fact: null,
            specialties: ['ADHD & Neurodivergence'],
            image_url: PLACEHOLDER_THERAPIST_IMAGES[0],
            slug: 'maya-robinson',
            order_index: 0,
            is_active: true,
            created_at: '',
            updated_at: '',
      },
      {
            id: 'placeholder-darius-bennett',
            name: 'Darius Bennett',
            credentials: 'MSW, LMSW',
            title: 'Licensed Master Social Worker',
            short_bio: 'Client-centered care for anxiety, depression, and relationship stress with practical tools.',
            full_bio: '',
            full_bio_rich: null,
            fun_fact: null,
            specialties: ['Anxiety & Depression'],
            image_url: PLACEHOLDER_THERAPIST_IMAGES[1],
            slug: 'darius-bennett',
            order_index: 1,
            is_active: true,
            created_at: '',
            updated_at: '',
      },
      {
            id: 'placeholder-imani-brooks',
            name: 'Imani Brooks',
            credentials: 'PhD, LP',
            title: 'Licensed Psychologist',
            short_bio: 'Trauma-focused, strengths-based therapy designed to help clients feel safe and supported.',
            full_bio: '',
            full_bio_rich: null,
            fun_fact: null,
            specialties: ['Trauma Recovery'],
            image_url: PLACEHOLDER_THERAPIST_IMAGES[2],
            slug: 'imani-brooks',
            order_index: 2,
            is_active: true,
            created_at: '',
            updated_at: '',
      },
];

const PLACEHOLDER_SERVICES: Service[] = [
      {
            id: 'placeholder-anxiety-depression',
            title: 'Anxiety & Depression',
            slug: 'anxiety-depression',
            short_description: SERVICE_DESCRIPTION_FALLBACKS['Anxiety & Depression'],
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
            short_description: SERVICE_DESCRIPTION_FALLBACKS['Couples Counseling'],
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
            id: 'placeholder-trauma-informed-care',
            title: 'Trauma-Informed Care',
            slug: 'trauma-informed-care',
            short_description: SERVICE_DESCRIPTION_FALLBACKS['Trauma-Informed Care'],
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
            id: 'placeholder-child-adolescent-therapy',
            title: 'Child & Adolescent Therapy',
            slug: 'child-adolescent-therapy',
            short_description: SERVICE_DESCRIPTION_FALLBACKS['Child & Adolescent Therapy'],
            full_description: '',
            full_description_rich: null,
            image_url: null,
            features: [],
            order_index: 3,
            is_active: true,
            created_at: '',
            updated_at: '',
      },
      {
            id: 'placeholder-adhd-neurodivergence-support',
            title: 'ADHD & Neurodivergence Support',
            slug: 'adhd-neurodivergence-support',
            short_description: SERVICE_DESCRIPTION_FALLBACKS['ADHD & Neurodivergence Support'],
            full_description: '',
            full_description_rich: null,
            image_url: null,
            features: [],
            order_index: 4,
            is_active: true,
            created_at: '',
            updated_at: '',
      },
      {
            id: 'placeholder-life-transitions-stress',
            title: 'Life Transitions & Stress Management',
            slug: 'life-transitions-stress-management',
            short_description: SERVICE_DESCRIPTION_FALLBACKS['Life Transitions & Stress Management'],
            full_description: '',
            full_description_rich: null,
            image_url: null,
            features: [],
            order_index: 5,
            is_active: true,
            created_at: '',
            updated_at: '',
      },
];

function looksLikeTestValue(value: string): boolean {
      const normalized = value.trim().toLowerCase();
      return (
            normalized === '' ||
            normalized === 'asdf' ||
            normalized.includes('asdf') ||
            normalized === 'test' ||
            normalized === 'demo' ||
            normalized === 'temp'
      );
}

function isUsableTherapistForPublicDisplay(therapist: Therapist): boolean {
      const name = therapist.name.trim();
      if (name.length < 5 || looksLikeTestValue(name)) {
            return false;
      }

      return true;
}

function isUsableServiceForPublicDisplay(service: Service): boolean {
      const title = service.title.trim();
      if (title.length < 4 || looksLikeTestValue(title)) {
            return false;
      }

      return true;
}

function normalizeLookupValue(value: string): string {
      return value.trim().toLowerCase();
}

function getHomeTherapistSpecialty(therapist: Therapist): string {
      return (
            therapist.specialties.find((specialty) => specialty.trim() && !looksLikeTestValue(specialty))?.trim() ??
            HOME_THERAPIST_SPECIALTY_FALLBACK
      );
}

function buildHomeTherapistPreviews(therapists: Therapist[]): HomeTherapistPreview[] {
      return therapists.slice(0, 3).map((therapist, index) => ({
            imageUrl:
                  therapist.image_url?.trim() ||
                  PLACEHOLDER_THERAPIST_IMAGES[index % PLACEHOLDER_THERAPIST_IMAGES.length],
            imageAlt: `Portrait of ${therapist.name}`,
            name: therapist.name,
            credentials: therapist.credentials.trim() || 'Licensed Therapist',
            specialty: getHomeTherapistSpecialty(therapist),
            href: HOME_THERAPIST_FALLBACK_PROFILE_HREF,
      }));
}

function buildHomeServicePreviews(services: Service[]): HomeServicePreview[] {
      const serviceLookup = new Map(
            services.map((service) => [normalizeLookupValue(service.title), service] as const)
      );

      return CURATED_HOME_SERVICE_TITLES.map((title) => {
            const matchedService = serviceLookup.get(normalizeLookupValue(title));
            const description =
                  matchedService?.short_description.trim() ||
                  SERVICE_DESCRIPTION_FALLBACKS[title] ||
                  'Compassionate care tailored to your needs.';

            return {
                  title,
                  description,
                  href: HOME_SERVICE_HREF,
            };
      });
}

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

      const sanitizedTherapists = therapists
            .filter(isUsableTherapistForPublicDisplay)
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name));
      const visibleTherapists = sanitizedTherapists.length > 0
            ? [
                  ...sanitizedTherapists,
                  ...PLACEHOLDER_THERAPISTS.filter(
                        (placeholder) =>
                              !sanitizedTherapists.some(
                                    (therapist) => therapist.name.toLowerCase() === placeholder.name.toLowerCase()
                              )
                  ),
            ]
            : PLACEHOLDER_THERAPISTS;
      const visibleTherapistCards = buildHomeTherapistPreviews(visibleTherapists);

      const sanitizedServices = services.filter(isUsableServiceForPublicDisplay);
      const visibleServices = sanitizedServices.length > 0 ? sanitizedServices : PLACEHOLDER_SERVICES;
      const visibleServiceCards = buildHomeServicePreviews(visibleServices);

      return (
            <div className="overflow-hidden">
                  {/* ===== SECTION 1: HERO ===== */}
                  <section className="relative overflow-hidden bg-slate-900 py-20 text-white md:py-32">
                        <div className="absolute inset-0">
                              <img
                                    src={STOCK_THERAPY_IMAGES.hero}
                                    alt="Comfortable therapy office in Kalamazoo with soft natural light"
                                    className="h-full w-full object-cover"
                              />
                              <div className="absolute inset-0 bg-slate-950/60"></div>
                              <div className="absolute inset-0 bg-gradient-to-r from-teal-950/80 via-teal-900/55 to-emerald-700/25"></div>
                        </div>
                        {/* Decorative gradient orbs */}
                        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-teal-400 opacity-20 mix-blend-screen blur-3xl"></div>
                        <div className="absolute bottom-0 -left-32 mb-32 h-96 w-96 rounded-full bg-emerald-400 opacity-15 mix-blend-screen blur-3xl"></div>

                        <div className="container-custom relative z-10">
                              <div className="max-w-3xl mx-auto text-center">
                                    <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                                          Your Mental Health Matters
                                    </h1>
                                    <p className="mb-4 text-xl font-light text-white/90 md:text-2xl">
                                          Expert therapy in a safe, welcoming environment
                                    </p>
                                    <p className="mb-10 text-lg text-white/85">
                                          Meet with experienced, licensed therapists who are dedicated to supporting your journey toward greater wellbeing.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                          <Link
                                                href="/contact"
                                                className="inline-block rounded-lg bg-white px-8 py-4 font-semibold text-teal-800 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-teal-900"
                                          >
                                                Request a Consultation
                                          </Link>
                                          <Link
                                                href="/therapists"
                                                className="inline-block rounded-lg border border-white/25 bg-white/10 px-8 py-4 font-semibold text-white transition-all duration-300 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-teal-900"
                                          >
                                                Meet Our Team
                                          </Link>
                                    </div>
                              </div>
                        </div>
                  </section>

                  {/* ===== SECTION 1.5: INSURANCE RIBBON ===== */}
                  <section className="bg-stone-50 py-8 md:py-10">
                        <div className="container-custom">
                              <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm md:p-6">
                                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                          <div className="max-w-2xl">
                                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-800">
                                                      Insurance Accepted
                                                </p>
                                                <h2 className="mt-2 text-xl font-bold text-gray-900 md:text-2xl">
                                                      We work with many major insurance plans
                                                </h2>
                                                <p className="mt-2 text-sm text-gray-600 md:text-base">
                                                      Contact us if you don&apos;t see your plan listed. We&apos;re happy to help verify coverage options.
                                                </p>
                                          </div>
                                          <Link
                                                href="/contact"
                                                className="inline-flex shrink-0 items-center justify-center rounded-lg border border-teal-200 bg-teal-50 px-4 py-2.5 text-sm font-semibold text-teal-800 transition hover:bg-teal-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
                                          >
                                                Ask About Coverage
                                          </Link>
                                    </div>
                                    <div className="mt-5 flex flex-wrap gap-2">
                                          {insuranceProviders.map((provider) => (
                                                <span
                                                      key={provider}
                                                      className="rounded-full border border-teal-100 bg-teal-50/70 px-3 py-1.5 text-sm font-medium text-teal-900"
                                                >
                                                      {provider}
                                                </span>
                                          ))}
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
                                                <h3 className="text-xl font-bold text-gray-900 mb-3 transition-colors group-hover:text-teal-700">
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
                                          {!isLoading && visibleTherapistCards.length > 0
                                                ? `${visibleTherapistCards.length} experienced professionals ready to help`
                                                : 'Experienced professionals ready to help you'
                                          }
                                    </p>
                              </div>

                              <div className="mb-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] items-center rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                                    <div>
                                          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-teal-800">
                                                Compassionate, Person-Centered Care
                                          </p>
                                          <p className="text-lg text-gray-700 leading-relaxed">
                                                We are building out each provider profile. Names and credentials can be added first, and bios/photos can be added as they are ready.
                                          </p>
                                    </div>
                                    <div className="relative h-60 overflow-hidden rounded-xl bg-gray-100">
                                          <img
                                                src={STOCK_THERAPY_IMAGES.team}
                                                alt="Warm therapy office seating area with natural light"
                                                className="h-full w-full object-cover"
                                          />
                                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
                                    </div>
                              </div>

                              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                                    {visibleTherapistCards.map((therapist) => (
                                          <HomeTherapistCard key={`${therapist.name}-${therapist.specialty}`} therapist={therapist} />
                                    ))}
                              </div>

                              <div className="text-center">
                                    <Link
                                          href="/therapists"
                                          className="inline-block rounded-lg bg-teal-700 px-8 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
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
                                          alt="Calm counseling room with comfortable chairs and natural light"
                                          className="h-56 w-full object-cover md:h-72"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/65 via-slate-900/35 to-transparent" />
                                    <div className="absolute inset-y-0 left-0 flex max-w-xl items-center p-6 md:p-8">
                                          <p className="text-base md:text-lg leading-relaxed text-white">
                                                Start with the areas you need support in most. We&apos;ll help you find the right therapist and next step.
                                          </p>
                                    </div>
                              </div>

                              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {visibleServiceCards.map((service) => (
                                          <HomeServiceCard key={service.title} service={service} />
                                    ))}
                              </div>

                              <div className="text-center mt-12">
                                    <Link
                                          href="/services"
                                          className="inline-block rounded-lg bg-teal-700 px-8 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
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
                                                title: 'Reach Out',
                                                description: 'Request a consultation and share what support you are looking for'
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
                                                      <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 text-4xl font-bold text-teal-700">
                                                            {item.step}
                                                      </span>
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                                                <p className="text-gray-600">{item.description}</p>
                                                {idx < 3 && (
                                                      <div className="absolute right-0 top-1/3 hidden -translate-x-1/2 transform text-teal-200 md:block">
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
                  <section className="bg-gradient-to-r from-stone-50 to-teal-50/50 py-20">
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
                                                            <svg className="mr-3 h-6 w-6 flex-shrink-0 text-teal-700" fill="currentColor" viewBox="0 0 20 20">
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
                                                alt="African American therapist meeting with an African American couple in a calm, sunlit office"
                                                className="h-full w-full object-cover"
                                          />
                                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/45 via-slate-900/10 to-transparent" />
                                          <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-white/90 p-4 backdrop-blur-sm">
                                                <p className="mb-1 text-sm font-semibold text-teal-800">A welcoming place to start</p>
                                                <p className="text-sm text-gray-700">
                                                      Therapy can support everyday stress, life transitions, relationships, and long-term growth.
                                                </p>
                                          </div>
                                    </div>
                              </div>
                        </div>
                  </section>

                  {/* ===== SECTION 7: CTA - READY TO START ===== */}
                  <section className="relative overflow-hidden bg-gradient-to-r from-teal-800 to-emerald-800 py-20 text-white md:py-28">
                        {/* Decorative elements */}
                        <div className="absolute -right-48 -top-48 h-96 w-96 rounded-full bg-teal-400 opacity-20 mix-blend-screen blur-3xl"></div>
                        <div className="absolute bottom-0 -left-48 mb-48 h-96 w-96 rounded-full bg-emerald-300 opacity-15 mix-blend-screen blur-3xl"></div>

                        <div className="container-custom relative z-10">
                              <div className="max-w-3xl mx-auto text-center">
                                    <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Take the Next Step?</h2>
                                    <p className="mb-10 text-xl leading-relaxed text-white/90">
                                          Start your journey toward better mental health today. With flexible scheduling and compassionate care, we're here to support you.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                          <Link
                                                href="/contact"
                                                className="inline-block rounded-lg bg-white px-8 py-4 font-semibold text-teal-800 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-teal-900"
                                          >
                                                Start Your Journey
                                          </Link>
                                          <Link
                                                href="/about"
                                                className="inline-block rounded-lg border border-white/25 bg-white/10 px-8 py-4 font-semibold text-white transition-all duration-300 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-teal-900"
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
