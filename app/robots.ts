import type { MetadataRoute } from 'next';

function getBaseUrl(): string {
      const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
      if (configured && /^https?:\/\//.test(configured)) {
            return configured;
      }

      return 'http://localhost:3000';
}

export default function robots(): MetadataRoute.Robots {
      const baseUrl = getBaseUrl();

      return {
            rules: {
                  userAgent: '*',
                  allow: '/',
            },
            sitemap: `${baseUrl}/sitemap.xml`,
      };
}
