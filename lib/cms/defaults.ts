import type {
      CmsBlock,
      CmsCtaBandBlock,
      CmsFaqBlock,
      CmsHeroBlock,
      CmsInsuranceStripBlock,
      CmsImageCarouselBlock,
      CmsImageTextBlock,
      CmsLinksBlock,
      CmsPageNav,
      CmsPageSeo,
      CmsProcessStepsBlock,
      CmsPageSnapshot,
      CmsPricingCardsBlock,
      CmsRichTextBlock,
      CmsTeamGridBlock,
      CmsTestimonialsBlock,
      CmsTrustBarBlock,
      CmsVideoEmbedBlock,
} from '@/lib/cms/types';

export const DEFAULT_CMS_SEO: CmsPageSeo = {
      metaTitle: '',
      metaDescription: '',
      canonicalPath: '',
      ogTitle: '',
      ogDescription: '',
      ogImageUrl: '',
      noIndex: false,
      noFollow: false,
      schemaJson: '',
};

export const DEFAULT_CMS_NAV: CmsPageNav = {
      showInHeader: false,
      headerLabel: '',
      headerOrder: 100,
      showInFooter: false,
      footerLabel: '',
      footerOrder: 100,
};

export function createDefaultSnapshot(title = ''): CmsPageSnapshot {
      return {
            title,
            blocks: [],
            seo: { ...DEFAULT_CMS_SEO },
            nav: { ...DEFAULT_CMS_NAV },
      };
}

export function createDefaultHeroBlock(id: string): CmsHeroBlock {
      return {
            id,
            type: 'hero',
            visible: true,
            data: {
                  headline: 'Add a headline',
                  subheadline: '',
                  alignment: 'left',
                  theme: 'primary',
                  ctaPrimary: null,
                  ctaSecondary: null,
            },
      };
}

export function createDefaultTrustBarBlock(id: string): CmsTrustBarBlock {
      return {
            id,
            type: 'trust_bar',
            visible: true,
            data: {
                  title: 'Why Clients Choose Diversified Psychological Services',
                  items: [
                        {
                              label: 'Insurance accepted',
                              description: 'Most major plans accepted with straightforward intake support.',
                        },
                        {
                              label: 'Flexible care formats',
                              description: 'In-person and secure telehealth appointments across Michigan.',
                        },
                        {
                              label: 'Licensed clinicians',
                              description: 'Evidence-informed care from experienced, credentialed therapists.',
                        },
                  ],
            },
      };
}

export function createDefaultProcessStepsBlock(id: string): CmsProcessStepsBlock {
      return {
            id,
            type: 'process_steps',
            visible: true,
            data: {
                  title: 'How to Get Started',
                  intro: 'A simple path from first call to steady progress.',
                  steps: [
                        {
                              title: '1. Request an appointment',
                              description: 'Share your availability, insurance, and preferences.',
                        },
                        {
                              title: '2. Get matched',
                              description: 'We connect you with the right therapist for your goals.',
                        },
                        {
                              title: '3. Begin care',
                              description: 'Start one-on-one sessions and build momentum over time.',
                        },
                  ],
            },
      };
}

export function createDefaultInsuranceStripBlock(id: string): CmsInsuranceStripBlock {
      return {
            id,
            type: 'insurance_strip',
            visible: true,
            data: {
                  title: 'Insurance and Scheduling',
                  intro: 'We accept many major insurance plans and respond quickly to new appointment requests.',
                  providers: [
                        'Blue Cross Blue Shield',
                        'Blue Care Network',
                        'Priority Health',
                        'United Healthcare / UBH',
                  ],
                  note: 'Not sure if your plan is accepted? Contact us and we will confirm coverage options.',
                  ctaLabel: 'Request Appointment',
                  ctaHref: '/contact',
            },
      };
}

export function createDefaultRichTextBlock(id: string): CmsRichTextBlock {
      return {
            id,
            type: 'rich_text',
            visible: true,
            data: {
                  yoopta: null,
                  html: '',
                  plainText: '',
            },
      };
}

export function createDefaultImageTextBlock(id: string): CmsImageTextBlock {
      return {
            id,
            type: 'image_text',
            visible: true,
            data: {
                  headline: 'Add a section title',
                  body: '',
                  imageUrl: '',
                  imageAlt: '',
                  imageSide: 'right',
            },
      };
}

export function createDefaultFaqBlock(id: string): CmsFaqBlock {
      return {
            id,
            type: 'faq',
            visible: true,
            data: {
                  title: 'Frequently Asked Questions',
                  enableSchema: true,
                  items: [
                        {
                              question: '',
                              answer: '',
                        },
                  ],
            },
      };
}

export function createDefaultCtaBandBlock(id: string): CmsCtaBandBlock {
      return {
            id,
            type: 'cta_band',
            visible: true,
            data: {
                  heading: 'Ready to get started?',
                  body: '',
                  buttonLabel: 'Contact Us',
                  buttonHref: '/contact',
                  style: 'primary',
            },
      };
}

export function createDefaultCmsLinksBlock(id: string): CmsLinksBlock {
      return {
            id,
            type: 'cms_links',
            visible: true,
            data: {
                  title: 'Related Pages',
                  intro: '',
                  layout: 'grid',
                  items: [
                        {
                              label: '',
                              href: '',
                              description: '',
                        },
                  ],
            },
      };
}

export function createDefaultImageCarouselBlock(id: string): CmsImageCarouselBlock {
      return {
            id,
            type: 'image_carousel',
            visible: true,
            data: {
                  title: 'Image Carousel',
                  autoplay: false,
                  intervalMs: 5000,
                  items: [
                        {
                              imageUrl: '',
                              imageAlt: '',
                              caption: '',
                              href: '',
                        },
                  ],
            },
      };
}

export function createDefaultTestimonialsBlock(id: string): CmsTestimonialsBlock {
      return {
            id,
            type: 'testimonials',
            visible: true,
            data: {
                  title: 'Testimonials',
                  intro: '',
                  layout: 'grid',
                  items: [
                        {
                              quote: '',
                              name: '',
                              role: '',
                              imageUrl: '',
                              imageAlt: '',
                        },
                  ],
            },
      };
}

export function createDefaultPricingCardsBlock(id: string): CmsPricingCardsBlock {
      return {
            id,
            type: 'pricing_cards',
            visible: true,
            data: {
                  title: 'Pricing',
                  intro: '',
                  cards: [
                        {
                              name: 'Starter',
                              price: '$99',
                              interval: '/month',
                              description: '',
                              features: [''],
                              ctaLabel: 'Get started',
                              ctaHref: '/contact',
                              featured: false,
                        },
                  ],
            },
      };
}

export function createDefaultVideoEmbedBlock(id: string): CmsVideoEmbedBlock {
      return {
            id,
            type: 'video_embed',
            visible: true,
            data: {
                  title: 'Video',
                  embedUrl: '',
                  caption: '',
                  aspectRatio: '16:9',
            },
      };
}

export function createDefaultTeamGridBlock(id: string): CmsTeamGridBlock {
      return {
            id,
            type: 'team_grid',
            visible: true,
            data: {
                  title: 'Meet the Team',
                  intro: '',
                  columns: 3,
                  members: [
                        {
                              name: '',
                              role: '',
                              bio: '',
                              imageUrl: '',
                              imageAlt: '',
                              profileHref: '',
                        },
                  ],
            },
      };
}

export function createDefaultBlock(type: CmsBlock['type'], id: string): CmsBlock {
      switch (type) {
            case 'hero':
                  return createDefaultHeroBlock(id);
            case 'trust_bar':
                  return createDefaultTrustBarBlock(id);
            case 'process_steps':
                  return createDefaultProcessStepsBlock(id);
            case 'insurance_strip':
                  return createDefaultInsuranceStripBlock(id);
            case 'rich_text':
                  return createDefaultRichTextBlock(id);
            case 'image_text':
                  return createDefaultImageTextBlock(id);
            case 'faq':
                  return createDefaultFaqBlock(id);
            case 'cta_band':
                  return createDefaultCtaBandBlock(id);
            case 'cms_links':
                  return createDefaultCmsLinksBlock(id);
            case 'image_carousel':
                  return createDefaultImageCarouselBlock(id);
            case 'testimonials':
                  return createDefaultTestimonialsBlock(id);
            case 'pricing_cards':
                  return createDefaultPricingCardsBlock(id);
            case 'video_embed':
                  return createDefaultVideoEmbedBlock(id);
            case 'team_grid':
                  return createDefaultTeamGridBlock(id);
            default:
                  return createDefaultRichTextBlock(id);
      }
}
