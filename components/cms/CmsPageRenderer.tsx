'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type {
      CmsBlock,
      CmsCtaBandBlock,
      CmsFaqBlock,
      CmsHeroBlock,
      CmsImageCarouselBlock,
      CmsImageTextBlock,
      CmsLinksBlock,
      CmsPage,
      CmsPricingCardsBlock,
      CmsRichTextBlock,
      CmsTeamGridBlock,
      CmsTestimonialsBlock,
      CmsVideoEmbedBlock,
} from '@/lib/cms/types';

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

function HeroBlockSection({ block }: { block: CmsHeroBlock }) {
      const alignmentClass = block.data.alignment === 'center' ? 'text-center' : 'text-left';
      const themeClass =
            block.data.theme === 'light'
                  ? 'bg-gray-100 text-gray-900'
                  : block.data.theme === 'dark'
                        ? 'bg-gray-900 text-white'
                        : 'bg-primary-600 text-white';

      return (
            <section className={`py-16 md:py-24 ${themeClass}`}>
                  <div className="container-custom">
                        <div className={`max-w-4xl ${block.data.alignment === 'center' ? 'mx-auto' : ''} ${alignmentClass}`}>
                              <h1 className="text-4xl md:text-5xl font-bold mb-4">{block.data.headline}</h1>
                              {block.data.subheadline && (
                                    <p className="text-lg md:text-xl opacity-90 mb-8">{block.data.subheadline}</p>
                              )}
                              <div className={`flex flex-wrap gap-4 ${block.data.alignment === 'center' ? 'justify-center' : ''}`}>
                                    {block.data.ctaPrimary && renderHrefLink(block.data.ctaPrimary.href, block.data.ctaPrimary.label, 'btn-primary')}
                                    {block.data.ctaSecondary && renderHrefLink(block.data.ctaSecondary.href, block.data.ctaSecondary.label, 'btn-secondary')}
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
                              className="prose prose-lg max-w-4xl"
                              dangerouslySetInnerHTML={{ __html: block.data.html || '' }}
                        />
                  </div>
            </section>
      );
}

function ImageTextBlockSection({ block }: { block: CmsImageTextBlock }) {
      const imageFirst = block.data.imageSide === 'left';

      return (
            <section className="py-14">
                  <div className="container-custom">
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                              <div className={imageFirst ? '' : 'md:order-2'}>
                                    {block.data.imageUrl ? (
                                          <img
                                                src={block.data.imageUrl}
                                                alt={block.data.imageAlt || block.data.headline}
                                                className="w-full h-auto rounded-xl border border-gray-200"
                                          />
                                    ) : (
                                          <div className="h-64 rounded-xl border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-gray-500">
                                                Add image
                                          </div>
                                    )}
                              </div>
                              <div className={imageFirst ? '' : 'md:order-1'}>
                                    <h2 className="text-3xl font-bold text-gray-900 mb-4">{block.data.headline}</h2>
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{block.data.body}</p>
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
            <section className="py-14 bg-gray-50">
                  <div className="container-custom max-w-4xl">
                        {block.data.title && <h2 className="text-3xl font-bold text-gray-900 mb-6">{block.data.title}</h2>}
                        <div className="space-y-4">
                              {items.map((item, index) => (
                                    <details key={`${block.id}-${index}`} className="rounded-lg border border-gray-200 bg-white p-4">
                                          <summary className="cursor-pointer font-semibold text-gray-900">
                                                {item.question}
                                          </summary>
                                          <p className="mt-3 text-gray-700 whitespace-pre-line">{item.answer}</p>
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
                  ? 'bg-gray-100 text-gray-900'
                  : block.data.style === 'dark'
                        ? 'bg-gray-900 text-white'
                        : 'bg-primary-600 text-white';

      return (
            <section className={`py-16 ${themeClass}`}>
                  <div className="container-custom max-w-4xl text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">{block.data.heading}</h2>
                        {block.data.body && <p className="text-lg opacity-90 mb-8">{block.data.body}</p>}
                        {renderHrefLink(block.data.buttonHref, block.data.buttonLabel, 'btn-secondary inline-block')}
                  </div>
            </section>
      );
}

function CmsLinksSection({ block }: { block: CmsLinksBlock }) {
      const items = block.data.items.filter((item) => item.label.trim() && item.href.trim());
      if (items.length === 0) {
            return null;
      }

      return (
            <section className="py-14">
                  <div className="container-custom max-w-5xl">
                        {block.data.title && <h2 className="text-3xl font-bold text-gray-900 mb-4">{block.data.title}</h2>}
                        {block.data.intro && <p className="text-gray-600 mb-8">{block.data.intro}</p>}

                        <div className={block.data.layout === 'grid' ? 'grid gap-4 md:grid-cols-2' : 'space-y-3'}>
                              {items.map((item, index) => (
                                    <div key={`${block.id}-${index}`} className="rounded-lg border border-gray-200 bg-white p-4">
                                          {renderHrefLink(
                                                item.href,
                                                <span className="text-lg font-semibold text-primary-700 hover:underline">{item.label}</span>
                                          )}
                                          {item.description && <p className="mt-2 text-sm text-gray-600">{item.description}</p>}
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
            <section className="py-14 bg-gray-50">
                  <div className="container-custom max-w-5xl">
                        {block.data.title && <h2 className="text-3xl font-bold text-gray-900 mb-6">{block.data.title}</h2>}

                        <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-black">
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
                                    <p className="text-sm text-gray-700">{activeItem.caption}</p>
                                    {items.length > 1 && (
                                          <p className="text-xs text-gray-500">
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
                        {block.data.title && <h2 className="text-3xl font-bold text-gray-900 mb-4">{block.data.title}</h2>}
                        {block.data.intro && <p className="text-gray-600 mb-8">{block.data.intro}</p>}
                        <div className={layoutClass}>
                              {items.map((item, index) => (
                                    <article key={`${block.id}-${index}`} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                                          <p className="text-gray-700 leading-relaxed">"{item.quote}"</p>
                                          <div className="mt-4 flex items-center gap-3">
                                                {item.imageUrl && (
                                                      <img
                                                            src={item.imageUrl}
                                                            alt={item.imageAlt || item.name}
                                                            className="h-12 w-12 rounded-full object-cover"
                                                      />
                                                )}
                                                <div>
                                                      <p className="font-semibold text-gray-900">{item.name}</p>
                                                      {item.role && <p className="text-sm text-gray-600">{item.role}</p>}
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
            <section className="py-14 bg-gray-50">
                  <div className="container-custom max-w-6xl">
                        {block.data.title && <h2 className="text-3xl font-bold text-gray-900 mb-4">{block.data.title}</h2>}
                        {block.data.intro && <p className="text-gray-600 mb-8">{block.data.intro}</p>}
                        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                              {cards.map((card, index) => {
                                    const features = card.features.filter((feature) => feature.trim());
                                    return (
                                          <article
                                                key={`${block.id}-${index}`}
                                                className={`rounded-xl border p-6 ${
                                                      card.featured
                                                            ? 'border-primary-500 bg-white shadow-md'
                                                            : 'border-gray-200 bg-white shadow-sm'
                                                }`}
                                          >
                                                <div className="mb-4">
                                                      <h3 className="text-xl font-semibold text-gray-900">{card.name}</h3>
                                                      <p className="mt-2 text-3xl font-bold text-gray-900">
                                                            {card.price}
                                                            {card.interval && <span className="ml-1 text-base font-normal text-gray-600">{card.interval}</span>}
                                                      </p>
                                                      {card.description && <p className="mt-2 text-sm text-gray-600">{card.description}</p>}
                                                </div>

                                                {features.length > 0 && (
                                                      <ul className="mb-5 space-y-2 text-sm text-gray-700">
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
                        {block.data.title && <h2 className="text-3xl font-bold text-gray-900 mb-6">{block.data.title}</h2>}
                        <div className={`relative overflow-hidden rounded-xl border border-gray-200 bg-black ${getAspectClass(block.data.aspectRatio)}`}>
                              <iframe
                                    src={block.data.embedUrl}
                                    title={block.data.title || 'Embedded video'}
                                    className="absolute inset-0 h-full w-full"
                                    loading="lazy"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                              />
                        </div>
                        {block.data.caption && <p className="mt-3 text-sm text-gray-600">{block.data.caption}</p>}
                  </div>
            </section>
      );
}

function TeamGridSection({ block }: { block: CmsTeamGridBlock }) {
      const members = block.data.members.filter((member) => member.name.trim());
      if (members.length === 0) {
            return null;
      }

      const columnsClass =
            block.data.columns === 2 ? 'md:grid-cols-2' : block.data.columns === 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-3';

      return (
            <section className="py-14">
                  <div className="container-custom max-w-6xl">
                        {block.data.title && <h2 className="text-3xl font-bold text-gray-900 mb-4">{block.data.title}</h2>}
                        {block.data.intro && <p className="text-gray-600 mb-8">{block.data.intro}</p>}
                        <div className={`grid gap-4 ${columnsClass}`}>
                              {members.map((member, index) => (
                                    <article key={`${block.id}-${index}`} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                                          {member.imageUrl && (
                                                <img
                                                      src={member.imageUrl}
                                                      alt={member.imageAlt || member.name}
                                                      className="mb-4 h-40 w-full rounded-lg object-cover"
                                                />
                                          )}
                                          <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                                          {member.role && <p className="mt-1 text-sm text-primary-700">{member.role}</p>}
                                          {member.bio && <p className="mt-3 text-sm text-gray-600">{member.bio}</p>}
                                          {member.profileHref &&
                                                renderHrefLink(
                                                      member.profileHref,
                                                      'View profile',
                                                      'mt-4 inline-block text-sm font-medium text-primary-700 hover:underline'
                                                )}
                                    </article>
                              ))}
                        </div>
                  </div>
            </section>
      );
}

function renderBlock(block: CmsBlock) {
      if (!block.visible) {
            return null;
      }

      switch (block.type) {
            case 'hero':
                  return <HeroBlockSection block={block} />;
            case 'rich_text':
                  return <RichTextBlockSection block={block} />;
            case 'image_text':
                  return <ImageTextBlockSection block={block} />;
            case 'faq':
                  return <FaqBlockSection block={block} />;
            case 'cta_band':
                  return <CtaBandSection block={block} />;
            case 'cms_links':
                  return <CmsLinksSection block={block} />;
            case 'image_carousel':
                  return <ImageCarouselSection block={block} />;
            case 'testimonials':
                  return <TestimonialsSection block={block} />;
            case 'pricing_cards':
                  return <PricingCardsSection block={block} />;
            case 'video_embed':
                  return <VideoEmbedSection block={block} />;
            case 'team_grid':
                  return <TeamGridSection block={block} />;
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

      return (
            <>
                  {snapshot.blocks.map((block) => (
                        <div key={block.id}>{renderBlock(block)}</div>
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
