'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { businessInfo } from '@/lib/data';
import type { CmsHeaderNavItem } from '@/lib/cms/types';

interface HeaderProps {
      cmsItems?: CmsHeaderNavItem[];
}

export default function Header({ cmsItems = [] }: HeaderProps) {
      const [isOpen, setIsOpen] = useState(false);
      const pathname = usePathname();

      if (pathname === '/admin' || pathname.startsWith('/admin/')) {
            return null;
      }

      const navigation = [
            { name: 'About Us', href: '/about' },
            { name: 'Our Therapists', href: '/therapists' },
            { name: 'Services', href: '/services' },
            { name: 'Contact Us', href: '/contact' },
            ...cmsItems.map((item) => ({
                  name: item.label,
                  href: item.href,
            })),
            { name: 'Client Portal', href: businessInfo.clientPortalUrl, external: true },
      ];

      return (
            <header className="bg-white/95 shadow-md sticky top-0 z-50 backdrop-blur">
                  <nav className="container-custom py-4">
                        <div className="flex justify-between items-center">
                              {/* Logo */}
                              <Link href="/" className="flex items-center">
                                    <div className="text-2xl font-bold text-primary-600">
                                          <span className="block">Diversified</span>
                                          <span className="block text-lg">Psychological Services</span>
                                    </div>
                              </Link>

                              {/* Desktop Navigation */}
                              <div className="hidden md:flex items-center gap-8">
                                    <div className="flex items-center space-x-6">
                                          {navigation.map((item) => (
                                                item.external ? (
                                                      <a
                                                            key={item.name}
                                                            href={item.href}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                                                      >
                                                            {item.name}
                                                      </a>
                                                ) : (
                                                      <Link
                                                            key={item.name}
                                                            href={item.href}
                                                            className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                                                      >
                                                            {item.name}
                                                      </Link>
                                                )
                                          ))}
                                    </div>
                                    <Link href="/contact" className="btn-primary text-sm px-5 py-2.5">
                                          Request Appointment
                                    </Link>
                              </div>

                              {/* Mobile menu button */}
                              <button
                                    onClick={() => setIsOpen(!isOpen)}
                                    className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                                    aria-expanded="false"
                              >
                                    <span className="sr-only">Open main menu</span>
                                    {!isOpen ? (
                                          <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                          </svg>
                                    ) : (
                                          <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                          </svg>
                                    )}
                              </button>
                        </div>

                        {/* Mobile menu */}
                        {isOpen && (
                              <div className="md:hidden mt-4 pb-3 space-y-1">
                                    <Link
                                          href="/contact"
                                          className="block px-3 py-2.5 rounded-md text-base font-semibold text-white bg-primary-600 hover:bg-primary-700"
                                          onClick={() => setIsOpen(false)}
                                    >
                                          Request Appointment
                                    </Link>
                                    {navigation.map((item) => (
                                          item.external ? (
                                                <a
                                                      key={item.name}
                                                      href={item.href}
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                                                >
                                                      {item.name}
                                                </a>
                                          ) : (
                                                <Link
                                                      key={item.name}
                                                      href={item.href}
                                                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                                                      onClick={() => setIsOpen(false)}
                                                >
                                                      {item.name}
                                                </Link>
                                          )
                                    ))}
                              </div>
                        )}
                  </nav>
            </header>
      );
}
