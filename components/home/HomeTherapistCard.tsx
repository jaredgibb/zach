import Link from 'next/link';

export interface HomeTherapistPreview {
      imageUrl: string;
      imageAlt: string;
      name: string;
      credentials: string;
      specialty: string;
      href: string;
}

interface HomeTherapistCardProps {
      therapist: HomeTherapistPreview;
}

export function HomeTherapistCard({ therapist }: HomeTherapistCardProps) {
      return (
            <article className="group relative overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <img
                        src={therapist.imageUrl}
                        alt={therapist.imageAlt}
                        className="h-64 w-full object-cover"
                  />

                  <div className="p-6">
                        <p className="mb-2 inline-flex rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold tracking-wide text-teal-800">
                              {therapist.specialty}
                        </p>
                        <h3 className="text-xl font-bold text-gray-900">{therapist.name}</h3>
                        <p className="mt-1 text-sm font-semibold text-teal-700">{therapist.credentials}</p>

                        <Link
                              href={therapist.href}
                              className="mt-5 inline-flex items-center text-sm font-semibold text-teal-700 underline-offset-4 transition hover:text-teal-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
                        >
                              View Profile
                              <span aria-hidden="true" className="ml-1">→</span>
                        </Link>
                  </div>
            </article>
      );
}
