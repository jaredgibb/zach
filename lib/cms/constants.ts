export const CMS_COLLECTION = 'pages';

export const SYSTEM_PAGE_DEFINITIONS = [
      {
            key: 'privacy-policy',
            slug: 'privacy-policy',
            path: '/privacy-policy',
            title: 'Privacy Policy',
      },
      {
            key: 'privacy-practices',
            slug: 'privacy-practices',
            path: '/privacy-practices',
            title: 'Notice of Privacy Practices',
      },
      {
            key: 'no-surprises-act',
            slug: 'no-surprises-act',
            path: '/no-surprises-act',
            title: 'No Surprises Act',
      },
      {
            key: 'nondiscrimination',
            slug: 'nondiscrimination',
            path: '/nondiscrimination',
            title: 'Notice of Nondiscrimination',
      },
] as const;

export type SystemPageKey = (typeof SYSTEM_PAGE_DEFINITIONS)[number]['key'];

const STATIC_RESERVED = [
      '',
      'admin',
      'api',
      'about',
      'contact',
      'services',
      'therapists',
      'privacy-policy',
      'privacy-practices',
      'no-surprises-act',
      'nondiscrimination',
      'favicon.ico',
      'robots.txt',
      'sitemap.xml',
      'manifest.webmanifest',
] as const;

export const RESERVED_SLUGS = new Set<string>([
      ...STATIC_RESERVED,
      ...SYSTEM_PAGE_DEFINITIONS.map((item) => item.slug),
]);

export const CMS_BLOCK_TYPES = [
      'hero',
      'rich_text',
      'image_text',
      'faq',
      'cta_band',
] as const;
