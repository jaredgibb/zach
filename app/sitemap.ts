import type { MetadataRoute } from 'next';
import { getSitemapPages } from '@/lib/cms/server';
import { getSiteUrl } from '@/lib/site-url';

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
      const baseUrl = getSiteUrl();
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
