import slugify from 'slugify';
import { z } from 'zod';
import { RESERVED_SLUGS } from '@/lib/cms/constants';

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function isValidHref(value: string): boolean {
      if (!value) {
            return false;
      }

      return (
            value.startsWith('/') ||
            value.startsWith('http://') ||
            value.startsWith('https://') ||
            value.startsWith('mailto:') ||
            value.startsWith('tel:')
      );
}

function isValidEmbedUrl(value: string): boolean {
      return value.startsWith('https://') || value.startsWith('http://');
}

function parseSchemaJson(value: string): unknown {
      if (!value.trim()) {
            return null;
      }

      try {
            const parsed = JSON.parse(value);
            const validRootType =
                  typeof parsed === 'object' &&
                  parsed !== null &&
                  (Array.isArray(parsed) || !Array.isArray(parsed));

            return validRootType ? parsed : null;
      } catch {
            return null;
      }
}

export function normalizeSlug(value: string): string {
      return slugify(value, {
            lower: true,
            strict: true,
            trim: true,
      });
}

export function isReservedSlug(slug: string): boolean {
      return RESERVED_SLUGS.has(slug);
}

export function buildPathFromSlug(slug: string): string {
      return `/${slug}`;
}

export function parseOptionalSchemaJson(schemaJson: string): Record<string, unknown> | unknown[] | null {
      const parsed = parseSchemaJson(schemaJson);

      if (!parsed) {
            return null;
      }

      if (typeof parsed !== 'object') {
            return null;
      }

      return parsed as Record<string, unknown> | unknown[];
}

const slugInputSchema = z
      .string()
      .trim()
      .min(1)
      .max(120)
      .transform((value) => normalizeSlug(value))
      .refine((value) => slugRegex.test(value), {
            message: 'Slug must use lowercase letters, numbers, and hyphens only.',
      });

const ctaLinkSchema = z
      .object({
            label: z.string().trim().min(1).max(80),
            href: z.string().trim().min(1).max(1024),
      })
      .refine((value) => isValidHref(value.href), {
            message: 'CTA link must start with /, http://, https://, mailto:, or tel:.',
      });

const heroBlockSchema = z.object({
      id: z.string().trim().min(1).max(80),
      type: z.literal('hero'),
      visible: z.boolean(),
      data: z.object({
            headline: z.string().trim().min(1).max(160),
            subheadline: z.string().trim().max(500),
            alignment: z.enum(['left', 'center']),
            theme: z.enum(['primary', 'light', 'dark']),
            ctaPrimary: ctaLinkSchema.nullable(),
            ctaSecondary: ctaLinkSchema.nullable(),
      }),
});

const richTextBlockSchema = z.object({
      id: z.string().trim().min(1).max(80),
      type: z.literal('rich_text'),
      visible: z.boolean(),
      data: z.object({
            yoopta: z.record(z.string(), z.unknown()).nullable(),
            html: z.string().trim().max(50000),
            plainText: z.string().trim().max(30000),
      }),
});

const imageTextBlockSchema = z.object({
      id: z.string().trim().min(1).max(80),
      type: z.literal('image_text'),
      visible: z.boolean(),
      data: z.object({
            headline: z.string().trim().min(1).max(160),
            body: z.string().trim().max(5000),
            imageUrl: z.string().trim().max(2048),
            imageAlt: z.string().trim().max(300),
            imageSide: z.enum(['left', 'right']),
      }),
});

const faqBlockSchema = z.object({
      id: z.string().trim().min(1).max(80),
      type: z.literal('faq'),
      visible: z.boolean(),
      data: z.object({
            title: z.string().trim().max(160),
            enableSchema: z.boolean(),
            items: z
                  .array(
                        z.object({
                              question: z.string().trim().min(1).max(500),
                              answer: z.string().trim().min(1).max(4000),
                        })
                  )
                  .max(40),
      }),
});

const ctaBandBlockSchema = z.object({
      id: z.string().trim().min(1).max(80),
      type: z.literal('cta_band'),
      visible: z.boolean(),
      data: z.object({
            heading: z.string().trim().min(1).max(160),
            body: z.string().trim().max(2000),
            buttonLabel: z.string().trim().min(1).max(80),
            buttonHref: z.string().trim().min(1).max(1024),
            style: z.enum(['primary', 'light', 'dark']),
      }),
});

const cmsLinksBlockSchema = z.object({
      id: z.string().trim().min(1).max(80),
      type: z.literal('cms_links'),
      visible: z.boolean(),
      data: z.object({
            title: z.string().trim().max(160),
            intro: z.string().trim().max(1000),
            layout: z.enum(['list', 'grid']),
            items: z
                  .array(
                        z
                              .object({
                                    label: z.string().trim().min(1).max(120),
                                    href: z.string().trim().min(1).max(1024),
                                    description: z.string().trim().max(300),
                              })
                              .refine((item) => isValidHref(item.href), {
                                    message: 'Link href must start with /, http://, https://, mailto:, or tel:.',
                                    path: ['href'],
                              })
                  )
                  .max(30),
      }),
});

const imageCarouselBlockSchema = z.object({
      id: z.string().trim().min(1).max(80),
      type: z.literal('image_carousel'),
      visible: z.boolean(),
      data: z.object({
            title: z.string().trim().max(160),
            autoplay: z.boolean(),
            intervalMs: z.coerce.number().int().min(1000).max(30000),
            items: z
                  .array(
                        z
                              .object({
                                    imageUrl: z.string().trim().min(1).max(2048),
                                    imageAlt: z.string().trim().max(300),
                                    caption: z.string().trim().max(300),
                                    href: z.string().trim().max(1024),
                              })
                              .refine((item) => !item.href || isValidHref(item.href), {
                                    message: 'Slide link must start with /, http://, https://, mailto:, or tel:.',
                                    path: ['href'],
                              })
                  )
                  .max(20),
      }),
});

const testimonialsBlockSchema = z.object({
      id: z.string().trim().min(1).max(80),
      type: z.literal('testimonials'),
      visible: z.boolean(),
      data: z.object({
            title: z.string().trim().max(160),
            intro: z.string().trim().max(1500),
            layout: z.enum(['grid', 'stack']),
            items: z
                  .array(
                        z.object({
                              quote: z.string().trim().min(1).max(2400),
                              name: z.string().trim().min(1).max(120),
                              role: z.string().trim().max(160),
                              imageUrl: z.string().trim().max(2048),
                              imageAlt: z.string().trim().max(300),
                        })
                  )
                  .max(30),
      }),
});

const pricingCardsBlockSchema = z.object({
      id: z.string().trim().min(1).max(80),
      type: z.literal('pricing_cards'),
      visible: z.boolean(),
      data: z.object({
            title: z.string().trim().max(160),
            intro: z.string().trim().max(1500),
            cards: z
                  .array(
                        z
                              .object({
                                    name: z.string().trim().min(1).max(120),
                                    price: z.string().trim().min(1).max(80),
                                    interval: z.string().trim().max(80),
                                    description: z.string().trim().max(2000),
                                    features: z.array(z.string().trim().min(1).max(180)).max(20),
                                    ctaLabel: z.string().trim().min(1).max(80),
                                    ctaHref: z.string().trim().min(1).max(1024),
                                    featured: z.boolean(),
                              })
                              .refine((card) => isValidHref(card.ctaHref), {
                                    message: 'Pricing card CTA href must start with /, http://, https://, mailto:, or tel:.',
                                    path: ['ctaHref'],
                              })
                  )
                  .max(12),
      }),
});

const videoEmbedBlockSchema = z.object({
      id: z.string().trim().min(1).max(80),
      type: z.literal('video_embed'),
      visible: z.boolean(),
      data: z
            .object({
                  title: z.string().trim().max(160),
                  embedUrl: z.string().trim().min(1).max(2048),
                  caption: z.string().trim().max(500),
                  aspectRatio: z.enum(['16:9', '4:3', '1:1']),
            })
            .refine((data) => isValidEmbedUrl(data.embedUrl), {
                  message: 'Video embed URL must start with http:// or https://.',
                  path: ['embedUrl'],
            }),
});

const teamGridBlockSchema = z.object({
      id: z.string().trim().min(1).max(80),
      type: z.literal('team_grid'),
      visible: z.boolean(),
      data: z.object({
            title: z.string().trim().max(160),
            intro: z.string().trim().max(1500),
            columns: z.union([z.literal(2), z.literal(3), z.literal(4)]),
            members: z
                  .array(
                        z
                              .object({
                                    name: z.string().trim().min(1).max(120),
                                    role: z.string().trim().max(160),
                                    bio: z.string().trim().max(2000),
                                    imageUrl: z.string().trim().max(2048),
                                    imageAlt: z.string().trim().max(300),
                                    profileHref: z.string().trim().max(1024),
                              })
                              .refine((member) => !member.profileHref || isValidHref(member.profileHref), {
                                    message: 'Profile link must start with /, http://, https://, mailto:, or tel:.',
                                    path: ['profileHref'],
                              })
                  )
                  .max(24),
      }),
});

export const cmsBlockSchema = z.discriminatedUnion('type', [
      heroBlockSchema,
      richTextBlockSchema,
      imageTextBlockSchema,
      faqBlockSchema,
      ctaBandBlockSchema,
      cmsLinksBlockSchema,
      imageCarouselBlockSchema,
      testimonialsBlockSchema,
      pricingCardsBlockSchema,
      videoEmbedBlockSchema,
      teamGridBlockSchema,
]);

export const cmsSeoSchema = z
      .object({
            metaTitle: z.string().trim().max(160),
            metaDescription: z.string().trim().max(320),
            canonicalPath: z.string().trim().max(255),
            ogTitle: z.string().trim().max(160),
            ogDescription: z.string().trim().max(320),
            ogImageUrl: z.string().trim().max(2048),
            noIndex: z.boolean(),
            noFollow: z.boolean(),
            schemaJson: z.string().trim().max(40000),
      })
      .refine((value) => {
            if (!value.canonicalPath) {
                  return true;
            }

            return value.canonicalPath.startsWith('/');
      }, {
            message: 'Canonical path must start with /.',
            path: ['canonicalPath'],
      })
      .refine((value) => {
            if (!value.schemaJson) {
                  return true;
            }

            return parseSchemaJson(value.schemaJson) !== null;
      }, {
            message: 'schemaJson must be valid JSON.',
            path: ['schemaJson'],
      });

export const cmsNavSchema = z.object({
      showInHeader: z.boolean(),
      headerLabel: z.string().trim().max(80),
      headerOrder: z.coerce.number().int().min(0).max(9999),
      showInFooter: z.boolean(),
      footerLabel: z.string().trim().max(80),
      footerOrder: z.coerce.number().int().min(0).max(9999),
});

export const cmsPageSnapshotSchema = z.object({
      title: z.string().trim().min(1).max(160),
      blocks: z.array(cmsBlockSchema).max(80),
      seo: cmsSeoSchema,
      nav: cmsNavSchema,
});

export const createCmsPageInputSchema = z.object({
      title: z.string().trim().min(1).max(160),
      slug: z.string().trim().max(120).optional().default(''),
});

export const updateCmsPageInputSchema = z.object({
      title: z.string().trim().min(1).max(160),
      slug: slugInputSchema,
      draft: cmsPageSnapshotSchema,
});

export const publishCmsPageInputSchema = z.object({
      note: z.string().trim().max(240).optional(),
});

export function resolveCreateSlug(title: string, slugInput: string): string {
      const source = slugInput || title;
      const resolved = normalizeSlug(source);

      if (!slugRegex.test(resolved)) {
            throw new Error('Unable to create a valid slug from title.');
      }

      return resolved;
}

export function validateCustomSlug(slug: string): void {
      if (!slugRegex.test(slug)) {
            throw new Error('Slug must use lowercase letters, numbers, and hyphens only.');
      }

      if (isReservedSlug(slug)) {
            throw new Error('That slug is reserved and cannot be used.');
      }
}
