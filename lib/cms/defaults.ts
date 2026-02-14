import type {
      CmsBlock,
      CmsCtaBandBlock,
      CmsFaqBlock,
      CmsHeroBlock,
      CmsImageTextBlock,
      CmsPageNav,
      CmsPageSeo,
      CmsPageSnapshot,
      CmsRichTextBlock,
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

export function createDefaultBlock(type: CmsBlock['type'], id: string): CmsBlock {
      switch (type) {
            case 'hero':
                  return createDefaultHeroBlock(id);
            case 'rich_text':
                  return createDefaultRichTextBlock(id);
            case 'image_text':
                  return createDefaultImageTextBlock(id);
            case 'faq':
                  return createDefaultFaqBlock(id);
            case 'cta_band':
                  return createDefaultCtaBandBlock(id);
            default:
                  return createDefaultRichTextBlock(id);
      }
}
