'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { businessInfo, insuranceProviders } from '@/lib/data';
import type { CmsFooterNavItem } from '@/lib/cms/types';

interface FooterProps {
      cmsItems?: CmsFooterNavItem[];
}

export default function Footer({ cmsItems = [] }: FooterProps) {
      const pathname = usePathname();

      if (pathname === '/admin' || pathname.startsWith('/admin/')) {
            return null;
      }

      return (
            <footer className="bg-slate-900 text-slate-300">
                  <div className="container-custom py-12">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                              {/* Left Column - About */}
                              <div>
                                    <div className="text-xl font-bold text-white mb-4">
                                          Diversified<br />Psychological Services
                                    </div>
                                    <p className="text-sm mb-4">
                                          {businessInfo.aboutShort}
                                    </p>
                                    <div className="space-y-2 text-sm">
                                          <p>{businessInfo.address}</p>
                                          <p>{businessInfo.city}, {businessInfo.state} {businessInfo.zip}</p>
                                          <p>
                                                <a href={`tel:${businessInfo.phone}`} className="hover:text-primary-300">
                                                      {businessInfo.phone}
                                                </a>
                                          </p>
                                          <p>
                                                <a href={`mailto:${businessInfo.email}`} className="hover:text-primary-300">
                                                      {businessInfo.email}
                                                </a>
                                          </p>
                                    </div>
                              </div>

                              {/* Middle Column - Insurance */}
                              <div>
                                    <h3 className="text-lg font-semibold text-white mb-4">Insurance Accepted</h3>
                                    <ul className="space-y-1 text-sm">
                                          {insuranceProviders.map((insurance) => (
                                                <li key={insurance} className="flex items-start">
                                                      <span className="text-primary-300 mr-2">•</span>
                                                      {insurance}
                                                </li>
                                          ))}
                                          <li className="flex items-start">
                                                <span className="text-primary-300 mr-2">•</span>
                                                More to come
                                          </li>
                                          <li className="flex items-start font-medium text-primary-300">
                                                <span className="mr-2">•</span>
                                                Ask if we accept your insurance!
                                          </li>
                                    </ul>
                              </div>

                              {/* Right Column - CTA */}
                              <div>
                                    <h3 className="text-lg font-semibold text-white mb-4">Get Started</h3>
                                    <Link
                                          href="/contact"
                                          className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors mb-6"
                                    >
                                          Request Appointment
                                    </Link>

                                    <div className="mt-8">
                                          <h4 className="text-sm font-semibold text-white mb-3">Crisis Resources</h4>
                                          <div className="text-sm space-y-2">
                                                <p>
                                                      <strong className="text-white">Emergency:</strong> Call 911
                                                </p>
                                                <p>
                                                      <strong className="text-white">Crisis Line:</strong> Dial or Text 988
                                                </p>
                                                <p className="text-xs text-slate-400 mt-3">
                                                      This is not an emergency service. If you are experiencing a mental health emergency, please use the resources above.
                                                </p>
                                          </div>
                                    </div>
                              </div>
                        </div>

                        {/* Bottom Links */}
                        <div className="border-t border-slate-700 mt-8 pt-8">
                              <div className="flex flex-wrap justify-center gap-6 text-sm">
                                    <Link href="/privacy-policy" className="hover:text-primary-300">
                                          Privacy Policy
                                    </Link>
                                    <Link href="/privacy-practices" className="hover:text-primary-300">
                                          Notice of Privacy Practices
                                    </Link>
                                    <Link href="/no-surprises-act" className="hover:text-primary-300">
                                          No Surprises Act
                                    </Link>
                                    <Link href="/nondiscrimination" className="hover:text-primary-300">
                                          Notice of Nondiscrimination
                                    </Link>
                                    {cmsItems.map((item) => (
                                          <Link key={item.id} href={item.href} className="hover:text-primary-300">
                                                {item.label}
                                          </Link>
                                    ))}
                              </div>
                              <div className="text-center text-sm text-slate-500 mt-6">
                                    © {new Date().getFullYear()} Diversified Psychological Services. All rights reserved.
                              </div>
                        </div>
                  </div>
            </footer>
      );
}
