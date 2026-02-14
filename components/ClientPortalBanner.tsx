'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { businessInfo } from '@/lib/data';

export default function ClientPortalBanner() {
      const pathname = usePathname();

      if (pathname === '/admin' || pathname.startsWith('/admin/')) {
            return null;
      }

      return (
            <div className="bg-primary-700 text-white py-2 text-center text-sm">
                  <div className="container-custom">
                        <span className="font-medium">Client Portal Available - </span>
                        <Link
                              href={businessInfo.clientPortalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline hover:text-primary-100 font-medium"
                        >
                              Click here to complete forms, make a payment, or update your information
                        </Link>
                  </div>
            </div>
      );
}
