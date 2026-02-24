import Link from 'next/link';

export interface HomeServicePreview {
      title: string;
      description: string;
      href: string;
}

interface HomeServiceCardProps {
      service: HomeServicePreview;
}

export function HomeServiceCard({ service }: HomeServiceCardProps) {
      return (
            <article className="group rounded-2xl border border-stone-200 bg-gradient-to-br from-white to-stone-50 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-lg">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700 transition-colors group-hover:bg-teal-100">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 transition-colors group-hover:text-teal-800">{service.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">{service.description}</p>

                  <Link
                        href={service.href}
                        className="mt-5 inline-flex items-center text-sm font-semibold text-teal-700 underline-offset-4 transition hover:text-teal-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
                  >
                        Learn more
                        <span aria-hidden="true" className="ml-1">→</span>
                  </Link>
            </article>
      );
}
