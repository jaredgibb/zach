'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

interface CmsImageCarouselItem {
      imageUrl: string;
      imageAlt?: string;
      caption?: string;
      href?: string;
}

interface CmsImageCarouselProps {
      title?: string;
      items: CmsImageCarouselItem[];
      autoplay: boolean;
      intervalMs: number;
}

function isExternalHref(href: string): boolean {
      return href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:') || href.startsWith('tel:');
}

function renderHrefLink(href: string, children: React.ReactNode, className?: string) {
      if (isExternalHref(href)) {
            return (
                  <a
                        href={href}
                        className={className}
                        target={href.startsWith('http') ? '_blank' : undefined}
                        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
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

export default function CmsImageCarousel({
      title,
      items,
      autoplay,
      intervalMs,
}: CmsImageCarouselProps) {
      const slides = useMemo(
            () => items.filter((item) => item.imageUrl.trim().length > 0),
            [items]
      );
      const [activeIndex, setActiveIndex] = useState(0);

      useEffect(() => {
            if (!autoplay || slides.length < 2) {
                  return;
            }

            const timer = window.setInterval(() => {
                  setActiveIndex((current) => (current + 1) % slides.length);
            }, Math.max(intervalMs, 1000));

            return () => window.clearInterval(timer);
      }, [autoplay, intervalMs, slides.length]);

      if (slides.length === 0) {
            return null;
      }

      const safeActiveIndex = activeIndex % slides.length;
      const activeItem = slides[safeActiveIndex] ?? slides[0];
      if (!activeItem) {
            return null;
      }

      const goNext = () => setActiveIndex((current) => (current + 1) % slides.length);
      const goPrev = () => setActiveIndex((current) => (current - 1 + slides.length) % slides.length);

      return (
            <section className="surface-warm py-14">
                  <div className="container-custom max-w-5xl">
                        {title && <h2 className="mb-6 text-3xl text-slate-900">{title}</h2>}

                        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-black shadow-md">
                              {activeItem.href
                                    ? renderHrefLink(
                                            activeItem.href,
                                            <img
                                                  src={activeItem.imageUrl}
                                                  alt={activeItem.imageAlt || activeItem.caption || title || 'Carousel image'}
                                                  className="h-[320px] w-full object-cover md:h-[420px]"
                                            />,
                                            'block'
                                      )
                                    : (
                                          <img
                                                src={activeItem.imageUrl}
                                                alt={activeItem.imageAlt || activeItem.caption || title || 'Carousel image'}
                                                className="h-[320px] w-full object-cover md:h-[420px]"
                                          />
                                    )}

                              {slides.length > 1 && (
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

                        {(activeItem.caption || slides.length > 1) && (
                              <div className="mt-3 flex items-center justify-between gap-4">
                                    <p className="text-sm text-slate-700">{activeItem.caption}</p>
                                    {slides.length > 1 && (
                                          <p className="text-xs text-slate-500">
                                                {safeActiveIndex + 1} / {slides.length}
                                          </p>
                                    )}
                              </div>
                        )}
                  </div>
            </section>
      );
}
