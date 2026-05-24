import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getPreferredHostname } from '@/lib/site-url';

function isLocalHostname(hostname: string): boolean {
      return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1' || hostname.endsWith('.localhost');
}

export function proxy(request: NextRequest) {
      const hostname = request.nextUrl.hostname.toLowerCase();

      if (!hostname.startsWith('www.') || isLocalHostname(hostname)) {
            return NextResponse.next();
      }

      const preferredHostname = getPreferredHostname();
      const redirectUrl = request.nextUrl.clone();

      redirectUrl.hostname = preferredHostname && hostname === `www.${preferredHostname}`
            ? preferredHostname
            : hostname.slice(4);
      redirectUrl.protocol = 'https:';
      redirectUrl.port = '';

      return NextResponse.redirect(redirectUrl, 308);
}
