import Link from 'next/link';
import { getMeaningfulList } from '@/lib/publicContent';
import type { Service } from '@/lib/hooks/useDatabase';

interface ServiceCardProps {
      service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
      const featurePreview = getMeaningfulList(service.features).slice(0, 3);
      const href = `/services/${service.slug}`;

      return (
            <article className="group rounded-3xl border border-stone-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <Link href={href} className="block h-full">
                        <div className="flex h-full flex-col p-6">
                              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                              </div>

                              <div className="space-y-3">
                                    <h2 className="text-2xl font-bold text-slate-900 transition-colors group-hover:text-teal-800">
                                          {service.title}
                                    </h2>
                                    <p className="text-sm leading-relaxed text-slate-700">{service.short_description}</p>
                              </div>

                              {featurePreview.length > 0 && (
                                    <ul className="mt-5 space-y-2 text-sm text-slate-700">
                                          {featurePreview.map((feature) => (
                                                <li key={feature} className="flex items-start gap-2">
                                                      <span className="mt-0.5 text-teal-700">•</span>
                                                      <span>{feature}</span>
                                                </li>
                                          ))}
                                    </ul>
                              )}

                              <span className="mt-6 inline-flex items-center text-sm font-semibold text-teal-700 underline-offset-4 transition group-hover:text-teal-800 group-hover:underline">
                                    View service details
                                    <span aria-hidden="true" className="ml-1">→</span>
                              </span>
                        </div>
                  </Link>
            </article>
      );
}
