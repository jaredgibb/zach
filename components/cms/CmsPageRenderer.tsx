'use client';

import Link from 'next/link';
import type {
      CmsBlock,
      CmsCtaBandBlock,
      CmsFaqBlock,
      CmsHeroBlock,
      CmsImageTextBlock,
      CmsPage,
      CmsRichTextBlock,
} from '@/lib/cms/types';

interface CmsPageRendererProps {
      page: CmsPage;
      useDraft?: boolean;
      includeSchemas?: boolean;
      jsonLdSchemas?: Array<Record<string, unknown> | unknown[]>;
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
                                    {block.data.ctaPrimary && (
                                          <Link href={block.data.ctaPrimary.href} className="btn-primary">
                                                {block.data.ctaPrimary.label}
                                          </Link>
                                    )}
                                    {block.data.ctaSecondary && (
                                          <Link href={block.data.ctaSecondary.href} className="btn-secondary">
                                                {block.data.ctaSecondary.label}
                                          </Link>
                                    )}
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
                        <Link href={block.data.buttonHref} className="btn-secondary inline-block">
                              {block.data.buttonLabel}
                        </Link>
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
