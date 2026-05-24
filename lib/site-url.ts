const fallbackSiteUrl = 'http://localhost:3000';

function normalizeSiteUrl(value: string | undefined): string | null {
      const trimmed = value?.trim();
      if (!trimmed) {
            return null;
      }

      try {
            const parsed = new URL(trimmed);
            if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
                  return null;
            }

            return parsed.toString();
      } catch {
            return null;
      }
}

export function getConfiguredSiteUrl(): string | null {
      return normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
}

export function getSiteUrl(): string {
      return getConfiguredSiteUrl() ?? fallbackSiteUrl;
}

export function getSiteUrlObject(): URL {
      return new URL(getSiteUrl());
}

export function getPreferredHostname(): string | null {
      const configuredSiteUrl = getConfiguredSiteUrl();
      if (!configuredSiteUrl) {
            return null;
      }

      return new URL(configuredSiteUrl).hostname.toLowerCase();
}
