import type { MetadataRoute } from 'next';
import { getSitemapPages } from '@/lib/cms/server';

const STATIC_PATHS = [
      '/',
      '/about',
      '/contact',
      '/services',
      '/therapists',
      '/privacy-policy',
      '/privacy-practices',
      '/no-surprises-act',
      '/nondiscrimination',
] as const;

function getBaseUrl(): string {
      const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
      if (configured && /^https?:\/\//.test(configured)) {
            return configured;
      }

      return 'http://localhost:3000';
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
      const baseUrl = getBaseUrl();
      const dynamicPages = await getSitemapPages();
      const paths = new Map<string, Date>();

      for (const path of STATIC_PATHS) {
            paths.set(path, new Date());
      }

      for (const page of dynamicPages) {
            paths.set(page.path, page.updatedAt ? new Date(page.updatedAt) : new Date());
      }

      return Array.from(paths.entries()).map(([path, lastModified]) => ({
            url: new URL(path, baseUrl).toString(),
            lastModified,
      }));
}
