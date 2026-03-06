import Link from 'next/link';
import { getPrimaryTherapistSpecialty } from '@/lib/publicContent';
import type { Therapist } from '@/lib/hooks/useDatabase';

interface TherapistCardProps {
      therapist: Therapist;
}

export function TherapistCard({ therapist }: TherapistCardProps) {
      const primarySpecialty = getPrimaryTherapistSpecialty(therapist) ?? 'Therapy Support';
      const profileHref = `/therapists/${therapist.slug}`;

      return (
            <article className="group overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <Link href={profileHref} className="block">
                        <div className="relative h-72 overflow-hidden bg-gradient-to-br from-stone-100 via-white to-teal-50">
                              {therapist.image_url ? (
                                    <img
                                          src={therapist.image_url}
                                          alt={`Portrait of ${therapist.name}`}
                                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                    />
                              ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-teal-800">
                                          <div className="rounded-full border border-teal-200 bg-white/90 px-5 py-2 text-sm font-semibold shadow-sm">
                                                {therapist.credentials}
                                          </div>
                                    </div>
                              )}
                        </div>

                        <div className="space-y-4 p-6">
                              <p className="inline-flex rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-teal-800">
                                    {primarySpecialty}
                              </p>

                              <div>
                                    <h2 className="text-2xl font-bold text-slate-900">{therapist.name}</h2>
                                    <p className="mt-1 text-sm font-semibold text-teal-700">{therapist.credentials}</p>
                                    <p className="mt-1 text-sm text-slate-600">{therapist.title}</p>
                              </div>

                              <p className="text-sm leading-relaxed text-slate-700">{therapist.short_bio}</p>

                              <span className="inline-flex items-center text-sm font-semibold text-teal-700 underline-offset-4 transition group-hover:text-teal-800 group-hover:underline">
                                    View full profile
                                    <span aria-hidden="true" className="ml-1">→</span>
                              </span>
                        </div>
                  </Link>
            </article>
      );
}
