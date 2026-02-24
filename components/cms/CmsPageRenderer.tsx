'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { HomeServiceCard, type HomeServicePreview } from '@/components/home/HomeServiceCard';
import { HomeTherapistCard, type HomeTherapistPreview } from '@/components/home/HomeTherapistCard';
import { useServices, useTherapists } from '@/lib/hooks/useDatabase';
import type {
      CmsBlock,
      CmsCtaBandBlock,
      CmsFaqBlock,
      CmsHeroBlock,
      CmsImageCarouselBlock,
      CmsImageTextBlock,
      CmsInsuranceStripBlock,
      CmsLinksBlock,
      CmsPage,
      CmsPricingCardsBlock,
      CmsProcessStepsBlock,
      CmsRichTextBlock,
      CmsTeamGridBlock,
      CmsTestimonialsBlock,
      CmsTrustBarBlock,
      CmsVideoEmbedBlock,
} from '@/lib/cms/types';
import type { Service, Therapist } from '@/lib/hooks/useDatabase';

interface CmsPageRendererProps {
      page: CmsPage;
      useDraft?: boolean;
      includeSchemas?: boolean;
      jsonLdSchemas?: Array<Record<string, unknown> | unknown[]>;
}

function isExternalHref(href: string): boolean {
      return href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:') || href.startsWith('tel:');
}

function renderHrefLink(href: string, children: React.ReactNode, className?: string) {
      if (isExternalHref(href)) {
            return (
                  <a href={href} className={className} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}>
                        {children}
                  </a>
            );
      }

      return (
            <Link href={href} className={className}>
                  {children}
            </Link>
      );
}

function parseTeamMemberBio(bio: string): { specialty: string | null; body: string } {
      const trimmed = bio.trim();
      if (!trimmed) {
            return { specialty: null, body: '' };
      }

      const match = trimmed.match(/^(?:focus|specialty)\s*:\s*([^.\n]+)[.\n]?\s*(.*)$/i);
      if (!match) {
            return { specialty: null, body: trimmed };
      }

      const specialty = match[1]?.trim() || null;
      const body = match[2]?.trim() || '';
      return { specialty, body };
}

const HOME_THERAPIST_IMAGE_FALLBACK =
      'https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=900&q=80';
const HOME_THERAPIST_SPECIALTY_FALLBACK = 'General Mental Health Support';

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
      return !(name.length < 5 || looksLikeTestValue(name));
}

function isUsableServiceForPublicDisplay(service: Service): boolean {
      const title = service.title.trim();
      return !(title.length < 4 || looksLikeTestValue(title));
}

function buildHomeTherapistPreviewsFromCms(therapists: Therapist[]): HomeTherapistPreview[] {
      return therapists.slice(0, 3).map((therapist) => {
            const specialty =
                  therapist.specialties.find((item) => item.trim() && !looksLikeTestValue(item))?.trim() ??
                  HOME_THERAPIST_SPECIALTY_FALLBACK;
            const imageUrl = therapist.image_url?.trim() || HOME_THERAPIST_IMAGE_FALLBACK;
            const hasPortrait = Boolean(therapist.image_url?.trim());

            return {
                  imageUrl,
                  imageAlt: hasPortrait
                        ? `Portrait of ${therapist.name}`
                        : 'Comfortable therapy office in Kalamazoo with natural light',
                  name: therapist.name,
                  credentials: therapist.credentials || therapist.title || '',
                  specialty,
                  href: '/therapists',
            };
      });
}

function buildHomeServicePreviewsFromCms(services: Service[]): HomeServicePreview[] {
      return services.slice(0, 6).map((service) => ({
            title: service.title,
            description:
                  service.short_description.trim() ||
                  'Compassionate, evidence-informed support tailored to your goals and stage of life.',
            href: '/services',
      }));
}

function HeroBlockSection({ block }: { block: CmsHeroBlock }) {
      const alignmentClass = block.data.alignment === 'center' ? 'text-center' : 'text-left';
      const alignItemsClass = block.data.alignment === 'center' ? 'mx-auto items-center' : 'items-start';
      const hasBackgroundImage = Boolean(block.data.backgroundImageUrl?.trim());
      const themeClass =
            block.data.theme === 'light'
                  ? 'surface-warm text-slate-900'
                  : block.data.theme === 'dark'
                        ? 'bg-slate-900 text-slate-100'
                        : 'bg-gradient-to-br from-teal-800 via-emerald-700 to-teal-600 text-white';
      const isDarkTheme = block.data.theme === 'dark' || block.data.theme === 'primary';
      const overlayOpacity = Math.min(0.95, Math.max(0, Number.isFinite(block.data.overlayOpacity) ? block.data.overlayOpacity : 0.55));
      const darkPrimaryButtonClass =
            'inline-flex items-center justify-center rounded-lg bg-emerald-500 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900';
      const darkSecondaryButtonClass =
            'inline-flex items-center justify-center rounded-lg border border-white/70 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900';
      const lightPrimaryButtonClass = 'btn-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2';
      const lightSecondaryButtonClass = 'btn-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2';

      return (
            <section className={`relative overflow-hidden py-20 md:py-28 ${themeClass}`}>
                  {hasBackgroundImage && (
                        <>
                              <img
                                    src={block.data.backgroundImageUrl}
                                    alt={block.data.backgroundImageAlt || block.data.headline}
                                    className="absolute inset-0 h-full w-full object-cover"
                              />
                              <div
                                    className={block.data.theme === 'light' ? 'absolute inset-0 bg-white' : 'absolute inset-0 bg-slate-950'}
                                    style={{ opacity: overlayOpacity }}
                              />
                              {block.data.theme !== 'light' && <div className="absolute inset-0 bg-gradient-to-br from-slate-950/70 via-slate-900/40 to-emerald-950/35" />}
                              {block.data.theme === 'light' && (
                                    <div
                                          className="absolute inset-0 bg-gradient-to-r from-white to-white/60"
                                          style={{ opacity: Math.min(0.85, overlayOpacity + 0.1) }}
                                    />
                              )}
                        </>
                  )}
                  <div className="pointer-events-none absolute inset-0">
                        <div className="absolute -top-20 right-0 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
                        <div className="absolute -bottom-20 left-0 h-72 w-72 rounded-full bg-emerald-300/15 blur-3xl" />
                  </div>

                  <div className="container-custom relative z-10">
                        <div className={`home-animate-rise flex max-w-4xl flex-col gap-8 ${alignItemsClass} ${alignmentClass}`}>
                              <div className="space-y-5">
                                    <p className={`text-sm font-semibold uppercase tracking-[0.24em] ${isDarkTheme ? 'text-teal-100' : 'text-primary-700'}`}>
                                          Diversified Psychological Services
                                    </p>
                                    <h1 className="text-4xl leading-tight md:text-6xl">{block.data.headline}</h1>
                                    {block.data.subheadline && (
                                          <p className={`max-w-3xl text-lg leading-relaxed md:text-2xl ${isDarkTheme ? 'text-slate-100' : 'text-slate-700'}`}>
                                                {block.data.subheadline}
                                          </p>
                                    )}
                              </div>

                              <div className={`flex flex-wrap gap-4 ${block.data.alignment === 'center' ? 'justify-center' : 'justify-start'}`}>
                                    {block.data.ctaPrimary &&
                                          renderHrefLink(
                                                block.data.ctaPrimary.href,
                                                block.data.ctaPrimary.label,
                                                isDarkTheme ? darkPrimaryButtonClass : lightPrimaryButtonClass
                                          )}
                                    {block.data.ctaSecondary &&
                                          renderHrefLink(
                                                block.data.ctaSecondary.href,
                                                block.data.ctaSecondary.label,
                                                isDarkTheme ? darkSecondaryButtonClass : lightSecondaryButtonClass
                                          )}
                              </div>
                        </div>
                  </div>
            </section>
      );
}

function TrustBarSection({ block }: { block: CmsTrustBarBlock }) {
      const items = block.data.items.filter((item) => item.label.trim());
      if (items.length === 0) {
            return null;
      }

      return (
            <section className="surface-mint py-10 editorial-divider">
                  <div className="container-custom">
                        {block.data.title && <h2 className="mb-6 text-xl text-slate-900 md:text-2xl">{block.data.title}</h2>}
                        <div className="grid gap-4 md:grid-cols-3">
                              {items.map((item, index) => (
                                    <article key={`${block.id}-${index}`} className="rounded-2xl border border-teal-100 bg-white p-5 shadow-sm">
                                          <p className="text-base font-semibold text-emerald-700">{item.label}</p>
                                          {item.description && <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>}
                                    </article>
                              ))}
                        </div>
                  </div>
            </section>
      );
}

function ProcessStepsSection({ block }: { block: CmsProcessStepsBlock }) {
      const steps = block.data.steps.filter((step) => step.title.trim());
      if (steps.length === 0) {
            return null;
      }

      return (
            <section className="py-16 md:py-20">
                  <div className="container-custom max-w-6xl">
                        {block.data.title && <h2 className="mb-3 text-3xl text-slate-900 md:text-4xl">{block.data.title}</h2>}
                        {block.data.intro && <p className="mb-8 text-lg text-slate-600">{block.data.intro}</p>}
                        <div className="grid gap-5 md:grid-cols-3">
                              {steps.map((step, index) => (
                                    <article key={`${block.id}-${index}`} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
                                                {index + 1}
                                          </span>
                                          <h3 className="mt-4 text-xl text-slate-900">{step.title}</h3>
                                          {step.description && <p className="mt-3 text-sm leading-relaxed text-slate-600">{step.description}</p>}
                                    </article>
                              ))}
                        </div>
                  </div>
            </section>
      );
}

function InsuranceStripSection({ block }: { block: CmsInsuranceStripBlock }) {
      const providers = block.data.providers.filter((provider) => provider.trim());
      if (providers.length === 0) {
            return null;
      }

      return (
            <section className="surface-warm py-14">
                  <div className="container-custom">
                        <div className="rounded-3xl border border-teal-100 bg-white p-7 shadow-sm md:p-10">
                              <div className="grid gap-8 md:grid-cols-[1.35fr_1fr] md:items-start">
                                    <div>
                                          {block.data.title && <h2 className="text-3xl text-slate-900 md:text-4xl">{block.data.title}</h2>}
                                          {block.data.intro && <p className="mt-3 text-base leading-relaxed text-slate-600">{block.data.intro}</p>}
                                          <div className="mt-5 flex flex-wrap gap-2">
                                                {providers.map((provider) => (
                                                      <span
                                                            key={`${block.id}-${provider}`}
                                                            className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700"
                                                      >
                                                            {provider}
                                                      </span>
                                                ))}
                                          </div>
                                          {block.data.note && <p className="mt-5 text-sm text-slate-600">{block.data.note}</p>}
                                    </div>
                                    <div className="rounded-2xl bg-slate-900 p-6 text-white">
                                          <p className="text-sm uppercase tracking-[0.18em] text-teal-200">Ready to begin?</p>
                                          <p className="mt-2 text-lg leading-relaxed text-slate-100">Request a consultation and our team will follow up with scheduling options.</p>
                                          <div className="mt-5">
                                                {renderHrefLink(
                                                      block.data.ctaHref,
                                                      block.data.ctaLabel,
                                                      'inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 font-semibold text-emerald-700 transition hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900'
                                                )}
                                          </div>
                                    </div>
                              </div>
                        </div>
                  </div>
            </section>
      );
}

function RichTextBlockSection({ block }: { block: CmsRichTextBlock }) {
      return (
            <section className="py-12">
                  <div className="container-custom">
                        <div
                              className="prose prose-lg max-w-4xl prose-headings:text-slate-900 prose-p:text-slate-700"
                              dangerouslySetInnerHTML={{ __html: block.data.html || '' }}
                        />
                  </div>
            </section>
      );
}

function ImageTextBlockSection({ block }: { block: CmsImageTextBlock }) {
      const imageFirst = block.data.imageSide === 'left';

      return (
            <section className="py-16">
                  <div className="container-custom">
                        <div className="grid items-center gap-10 md:grid-cols-2">
                              <div className={imageFirst ? '' : 'md:order-2'}>
                                    {block.data.imageUrl ? (
                                          <img
                                                src={block.data.imageUrl}
                                                alt={block.data.imageAlt || block.data.headline}
                                                className="h-[320px] w-full rounded-2xl object-cover shadow-md md:h-[420px]"
                                          />
                                    ) : (
                                          <div className="flex h-[320px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-slate-500 md:h-[420px]">
                                                Add image
                                          </div>
                                    )}
                              </div>
                              <div className={`${imageFirst ? '' : 'md:order-1'} space-y-4`}>
                                    <h2 className="text-3xl text-slate-900 md:text-4xl">{block.data.headline}</h2>
                                    <p className="whitespace-pre-line text-lg leading-relaxed text-slate-700">{block.data.body}</p>
                              </div>
                        </div>
                  </div>
            </section>
      );
}

function FaqBlockSection({ block }: { block: CmsFaqBlock }) {
      const items = block.data.items.filter((item) => item.question.trim() && item.answer.trim());
      if (items.length === 0) {
            return null;
      }

      return (
            <section className="surface-mint py-16">
                  <div className="container-custom max-w-4xl">
                        {block.data.title && <h2 className="mb-6 text-3xl text-slate-900 md:text-4xl">{block.data.title}</h2>}
                        <div className="space-y-4">
                              {items.map((item, index) => (
                                    <details key={`${block.id}-${index}`} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                          <summary className="cursor-pointer list-none pr-6 text-lg font-semibold text-slate-900">
                                                {item.question}
                                          </summary>
                                          <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-slate-700">{item.answer}</p>
                                    </details>
                              ))}
                        </div>
                  </div>
            </section>
      );
}

function CtaBandSection({ block }: { block: CmsCtaBandBlock }) {
      const themeClass =
            block.data.style === 'light'
                  ? 'bg-white text-slate-900 border border-slate-200'
                  : block.data.style === 'dark'
                        ? 'bg-slate-900 text-white'
                        : 'bg-gradient-to-r from-teal-800 to-emerald-700 text-white';

      return (
            <section className="py-16 md:py-20">
                  <div className="container-custom max-w-5xl">
                        <div className={`rounded-3xl px-8 py-12 text-center shadow-md md:px-12 ${themeClass}`}>
                              <h2 className="text-3xl md:text-4xl">{block.data.heading}</h2>
                              {block.data.body && <p className="mx-auto mt-4 max-w-3xl text-lg opacity-90">{block.data.body}</p>}
                              <div className="mt-8">
                                    {renderHrefLink(
                                          block.data.buttonHref,
                                          block.data.buttonLabel,
                                          block.data.style === 'light'
                                                ? 'btn-primary inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2'
                                                : 'inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 font-semibold text-emerald-700 transition hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900'
                                    )}
                              </div>
                        </div>
                  </div>
            </section>
      );
}

function CmsLinksSection({ block, isHomePage = false }: { block: CmsLinksBlock; isHomePage?: boolean }) {
      const baseItems = block.data.items.filter((item) => item.label.trim() && item.href.trim());
      const isServicesSection =
            block.data.title.toLowerCase().includes('service') || baseItems.some((item) => item.href.trim() === '/services') || block.id === 'dps-home-services-grid';
      const ctaLabel = isServicesSection ? 'Learn more' : 'Open page';
      const { fetchServices, loading: servicesLoading } = useServices();
      const [cmsServices, setCmsServices] = useState<Service[]>([]);

      useEffect(() => {
            if (!isHomePage || !isServicesSection) {
                  return;
            }

            let cancelled = false;
            async function loadServices() {
                  const data = await fetchServices();
                  if (!cancelled) {
                        setCmsServices(data);
                  }
            }

            loadServices();

            return () => {
                  cancelled = true;
            };
      }, [fetchServices, isHomePage, isServicesSection]);

      const cmsServiceCards = buildHomeServicePreviewsFromCms(cmsServices.filter(isUsableServiceForPublicDisplay));
      const items = baseItems;

      if (isHomePage && isServicesSection && cmsServiceCards.length > 0) {
            return (
                  <section className="py-14">
                        <div className="container-custom max-w-6xl">
                              {block.data.title && <h2 className="mb-4 text-3xl text-slate-900 md:text-4xl">{block.data.title}</h2>}
                              {block.data.intro && <p className="mb-8 max-w-3xl text-slate-600">{block.data.intro}</p>}
                              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {cmsServiceCards.map((service) => (
                                          <HomeServiceCard key={`${block.id}-${service.title}`} service={service} />
                                    ))}
                              </div>
                        </div>
                  </section>
            );
      }

      if (isHomePage && isServicesSection && servicesLoading && cmsServiceCards.length === 0) {
            return (
                  <section className="py-14">
                        <div className="container-custom max-w-6xl">
                              {block.data.title && <h2 className="mb-4 text-3xl text-slate-900 md:text-4xl">{block.data.title}</h2>}
                              {block.data.intro && <p className="mb-8 max-w-3xl text-slate-600">{block.data.intro}</p>}
                              <p className="text-sm text-slate-500">Loading services...</p>
                        </div>
                  </section>
            );
      }

      if (items.length === 0) {
            return null;
      }

      return (
            <section className="py-14">
                  <div className="container-custom max-w-5xl">
                        {block.data.title && <h2 className="mb-4 text-3xl text-slate-900">{block.data.title}</h2>}
                        {block.data.intro && <p className="mb-8 text-slate-600">{block.data.intro}</p>}

                        <div className={block.data.layout === 'grid' ? 'grid gap-4 md:grid-cols-2' : 'space-y-3'}>
                              {items.map((item, index) => (
                                    <div
                                          key={`${block.id}-${index}`}
                                          className={`rounded-2xl border bg-white p-5 shadow-sm ${
                                                block.data.layout === 'grid' && isServicesSection ? 'border-emerald-100' : 'border-slate-200'
                                          }`}
                                    >
                                          <p className={`text-lg font-semibold ${isServicesSection ? 'text-slate-900' : 'text-primary-700'}`}>{item.label}</p>
                                          {item.description && <p className="mt-2 text-sm text-slate-600">{item.description}</p>}
                                          <div className="mt-4">
                                                {renderHrefLink(
                                                      item.href,
                                                      ctaLabel,
                                                      'inline-flex items-center text-sm font-semibold text-emerald-700 transition hover:text-emerald-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2'
                                                )}
                                          </div>
                                    </div>
                              ))}
                        </div>
                  </div>
            </section>
      );
}

function ImageCarouselSection({ block }: { block: CmsImageCarouselBlock }) {
      const items = useMemo(
            () => block.data.items.filter((item) => item.imageUrl.trim().length > 0),
            [block.data.items]
      );
      const [activeIndex, setActiveIndex] = useState(0);

      useEffect(() => {
            if (!block.data.autoplay || items.length < 2) {
                  return;
            }

            const intervalMs = Number.isFinite(block.data.intervalMs) ? block.data.intervalMs : 5000;
            const timer = window.setInterval(() => {
                  setActiveIndex((current) => (current + 1) % items.length);
            }, Math.max(intervalMs, 1000));

            return () => window.clearInterval(timer);
      }, [block.data.autoplay, block.data.intervalMs, items.length]);

      if (items.length === 0) {
            return null;
      }

      const safeActiveIndex = activeIndex % items.length;
      const activeItem = items[safeActiveIndex] ?? items[0];
      if (!activeItem) {
            return null;
      }

      const goNext = () => setActiveIndex((current) => (current + 1) % items.length);
      const goPrev = () => setActiveIndex((current) => (current - 1 + items.length) % items.length);

      return (
            <section className="surface-warm py-14">
                  <div className="container-custom max-w-5xl">
                        {block.data.title && <h2 className="mb-6 text-3xl text-slate-900">{block.data.title}</h2>}

                        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-black shadow-md">
                              {activeItem.href
                                    ? renderHrefLink(
                                            activeItem.href,
                                            <img
                                                  src={activeItem.imageUrl}
                                                  alt={activeItem.imageAlt || activeItem.caption || block.data.title || 'Carousel image'}
                                                  className="h-[320px] w-full object-cover md:h-[420px]"
                                            />,
                                            'block'
                                      )
                                    : (
                                          <img
                                                src={activeItem.imageUrl}
                                                alt={activeItem.imageAlt || activeItem.caption || block.data.title || 'Carousel image'}
                                                className="h-[320px] w-full object-cover md:h-[420px]"
                                          />
                                    )}

                              {items.length > 1 && (
                                    <>
                                          <button
                                                type="button"
                                                onClick={goPrev}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 px-3 py-2 text-white hover:bg-black/75"
                                                aria-label="Previous slide"
                                          >
                                                ‹
                                          </button>
                                          <button
                                                type="button"
                                                onClick={goNext}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 px-3 py-2 text-white hover:bg-black/75"
                                                aria-label="Next slide"
                                          >
                                                ›
                                          </button>
                                    </>
                              )}
                        </div>

                        {(activeItem.caption || items.length > 1) && (
                              <div className="mt-3 flex items-center justify-between gap-4">
                                    <p className="text-sm text-slate-700">{activeItem.caption}</p>
                                    {items.length > 1 && (
                                          <p className="text-xs text-slate-500">
                                                {safeActiveIndex + 1} / {items.length}
                                          </p>
                                    )}
                              </div>
                        )}
                  </div>
            </section>
      );
}

function TestimonialsSection({ block }: { block: CmsTestimonialsBlock }) {
      const items = block.data.items.filter((item) => item.quote.trim() && item.name.trim());
      if (items.length === 0) {
            return null;
      }

      const layoutClass = block.data.layout === 'grid' ? 'grid gap-4 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4';

      return (
            <section className="py-14">
                  <div className="container-custom max-w-6xl">
                        {block.data.title && <h2 className="mb-4 text-3xl text-slate-900">{block.data.title}</h2>}
                        {block.data.intro && <p className="mb-8 text-slate-600">{block.data.intro}</p>}
                        <div className={layoutClass}>
                              {items.map((item, index) => (
                                    <article key={`${block.id}-${index}`} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                          <p className="leading-relaxed text-slate-700">"{item.quote}"</p>
                                          <div className="mt-4 flex items-center gap-3">
                                                {item.imageUrl && (
                                                      <img
                                                            src={item.imageUrl}
                                                            alt={item.imageAlt || item.name}
                                                            className="h-12 w-12 rounded-full object-cover"
                                                      />
                                                )}
                                                <div>
                                                      <p className="font-semibold text-slate-900">{item.name}</p>
                                                      {item.role && <p className="text-sm text-slate-600">{item.role}</p>}
                                                </div>
                                          </div>
                                    </article>
                              ))}
                        </div>
                  </div>
            </section>
      );
}

function PricingCardsSection({ block }: { block: CmsPricingCardsBlock }) {
      const cards = block.data.cards.filter((card) => card.name.trim() && card.price.trim());
      if (cards.length === 0) {
            return null;
      }

      return (
            <section className="surface-mint py-14">
                  <div className="container-custom max-w-6xl">
                        {block.data.title && <h2 className="mb-4 text-3xl text-slate-900">{block.data.title}</h2>}
                        {block.data.intro && <p className="mb-8 text-slate-600">{block.data.intro}</p>}
                        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                              {cards.map((card, index) => {
                                    const features = card.features.filter((feature) => feature.trim());
                                    return (
                                          <article
                                                key={`${block.id}-${index}`}
                                                className={`rounded-2xl border p-6 ${
                                                      card.featured
                                                            ? 'border-primary-500 bg-white shadow-md'
                                                            : 'border-slate-200 bg-white shadow-sm'
                                                }`}
                                          >
                                                <div className="mb-4">
                                                      <h3 className="text-xl font-semibold text-slate-900">{card.name}</h3>
                                                      <p className="mt-2 text-3xl font-bold text-slate-900">
                                                            {card.price}
                                                            {card.interval && <span className="ml-1 text-base font-normal text-slate-600">{card.interval}</span>}
                                                      </p>
                                                      {card.description && <p className="mt-2 text-sm text-slate-600">{card.description}</p>}
                                                </div>

                                                {features.length > 0 && (
                                                      <ul className="mb-5 space-y-2 text-sm text-slate-700">
                                                            {features.map((feature, featureIndex) => (
                                                                  <li key={`${block.id}-${index}-${featureIndex}`}>• {feature}</li>
                                                            ))}
                                                      </ul>
                                                )}

                                                {renderHrefLink(
                                                      card.ctaHref,
                                                      card.ctaLabel || 'Learn more',
                                                      card.featured ? 'btn-primary w-full text-center' : 'btn-secondary w-full text-center'
                                                )}
                                          </article>
                                    );
                              })}
                        </div>
                  </div>
            </section>
      );
}

function getAspectClass(aspectRatio: CmsVideoEmbedBlock['data']['aspectRatio']): string {
      switch (aspectRatio) {
            case '4:3':
                  return 'pt-[75%]';
            case '1:1':
                  return 'pt-[100%]';
            case '16:9':
            default:
                  return 'pt-[56.25%]';
      }
}

function VideoEmbedSection({ block }: { block: CmsVideoEmbedBlock }) {
      if (!block.data.embedUrl.trim()) {
            return null;
      }

      return (
            <section className="py-14">
                  <div className="container-custom max-w-5xl">
                        {block.data.title && <h2 className="mb-6 text-3xl text-slate-900">{block.data.title}</h2>}
                        <div className={`relative overflow-hidden rounded-2xl border border-slate-200 bg-black ${getAspectClass(block.data.aspectRatio)}`}>
                              <iframe
                                    src={block.data.embedUrl}
                                    title={block.data.title || 'Embedded video'}
                                    className="absolute inset-0 h-full w-full"
                                    loading="lazy"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                              />
                        </div>
                        {block.data.caption && <p className="mt-3 text-sm text-slate-600">{block.data.caption}</p>}
                  </div>
            </section>
      );
}

function TeamGridSection({ block, isHomePage = false }: { block: CmsTeamGridBlock; isHomePage?: boolean }) {
      const members = block.data.members.filter((member) => member.name.trim());
      const { fetchTherapists, loading: therapistsLoading } = useTherapists();
      const [cmsTherapists, setCmsTherapists] = useState<Therapist[]>([]);

      useEffect(() => {
            if (!isHomePage) {
                  return;
            }

            let cancelled = false;
            async function loadTherapists() {
                  const data = await fetchTherapists();
                  if (!cancelled) {
                        setCmsTherapists(data);
                  }
            }

            loadTherapists();

            return () => {
                  cancelled = true;
            };
      }, [fetchTherapists, isHomePage]);

      const cmsTherapistCards = buildHomeTherapistPreviewsFromCms(cmsTherapists.filter(isUsableTherapistForPublicDisplay));

      if (isHomePage && cmsTherapistCards.length > 0) {
            return (
                  <section className="py-16">
                        <div className="container-custom max-w-6xl">
                              {block.data.title && <h2 className="mb-4 text-3xl text-slate-900 md:text-4xl">{block.data.title}</h2>}
                              {block.data.intro && <p className="mb-8 max-w-3xl text-slate-600">{block.data.intro}</p>}
                              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                                    {cmsTherapistCards.map((therapist) => (
                                          <HomeTherapistCard key={`${block.id}-${therapist.name}`} therapist={therapist} />
                                    ))}
                              </div>
                        </div>
                  </section>
            );
      }

      if (isHomePage && therapistsLoading && cmsTherapistCards.length === 0) {
            return (
                  <section className="py-16">
                        <div className="container-custom max-w-6xl">
                              {block.data.title && <h2 className="mb-4 text-3xl text-slate-900 md:text-4xl">{block.data.title}</h2>}
                              {block.data.intro && <p className="mb-8 max-w-3xl text-slate-600">{block.data.intro}</p>}
                              <p className="text-sm text-slate-500">Loading therapists...</p>
                        </div>
                  </section>
            );
      }

      if (members.length === 0) {
            return null;
      }

      const columnsClass =
            block.data.columns === 2 ? 'md:grid-cols-2' : block.data.columns === 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-3';

      return (
            <section className="py-16">
                  <div className="container-custom max-w-6xl">
                        {block.data.title && <h2 className="mb-4 text-3xl text-slate-900 md:text-4xl">{block.data.title}</h2>}
                        {block.data.intro && <p className="mb-8 text-slate-600">{block.data.intro}</p>}
                        <div className={`grid gap-5 ${columnsClass}`}>
                              {members.map((member, index) => {
                                    const parsedBio = parseTeamMemberBio(member.bio || '');

                                    return (
                                          <article key={`${block.id}-${index}`} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                          {member.imageUrl && (
                                                <img
                                                      src={member.imageUrl}
                                                      alt={member.imageAlt || member.name}
                                                      className="mb-4 h-52 w-full rounded-xl object-cover"
                                                />
                                          )}
                                          {parsedBio.specialty ? (
                                                      <p className="mb-3 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-800">
                                                            {parsedBio.specialty}
                                                      </p>
                                          ) : null}
                                          <h3 className="text-lg font-semibold text-slate-900">{member.name}</h3>
                                          {member.role && <p className="mt-1 text-sm text-emerald-700">{member.role}</p>}
                                          {parsedBio.body ? <p className="mt-3 text-sm text-slate-600">{parsedBio.body}</p> : null}
                                          {member.profileHref &&
                                                renderHrefLink(
                                                      member.profileHref,
                                                      'View Profile',
                                                      'mt-4 inline-block text-sm font-medium text-emerald-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2'
                                                )}
                                          </article>
                                    );
                              })}
                        </div>
                  </div>
            </section>
      );
}

function renderBlock(block: CmsBlock, context: { isHomePage: boolean }) {
      if (!block.visible) {
            return null;
      }

      switch (block.type) {
            case 'hero':
                  return <HeroBlockSection block={block} />;
            case 'trust_bar':
                  return <TrustBarSection block={block} />;
            case 'process_steps':
                  return <ProcessStepsSection block={block} />;
            case 'insurance_strip':
                  return <InsuranceStripSection block={block} />;
            case 'rich_text':
                  return <RichTextBlockSection block={block} />;
            case 'image_text':
                  return <ImageTextBlockSection block={block} />;
            case 'faq':
                  return <FaqBlockSection block={block} />;
            case 'cta_band':
                  return <CtaBandSection block={block} />;
            case 'cms_links':
                  return <CmsLinksSection block={block} isHomePage={context.isHomePage} />;
            case 'image_carousel':
                  return <ImageCarouselSection block={block} />;
            case 'testimonials':
                  return <TestimonialsSection block={block} />;
            case 'pricing_cards':
                  return <PricingCardsSection block={block} />;
            case 'video_embed':
                  return <VideoEmbedSection block={block} />;
            case 'team_grid':
                  return <TeamGridSection block={block} isHomePage={context.isHomePage} />;
            default:
                  return null;
      }
}

export default function CmsPageRenderer({
      page,
      useDraft = false,
      includeSchemas = false,
      jsonLdSchemas = [],
}: CmsPageRendererProps) {
      const snapshot = useDraft || !page.published ? page.draft : page.published;
      const isHomePage = page.path === '/' || page.slug === 'home';

      return (
            <>
                  {snapshot.blocks.map((block) => (
                        <div key={block.id}>{renderBlock(block, { isHomePage })}</div>
                  ))}

                  {includeSchemas &&
                        jsonLdSchemas.map((schema, index) => (
                              <script
                                    key={`${page.id}-schema-${index}`}
                                    type="application/ld+json"
                                    dangerouslySetInnerHTML={{
                                          __html: JSON.stringify(schema),
                                    }}
                              />
                        ))}
            </>
      );
}
