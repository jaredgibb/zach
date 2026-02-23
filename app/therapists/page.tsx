'use client';

import { useEffect, useState } from 'react';
import { TherapistCard } from '@/components/TherapistCard';
import { useTherapists } from '@/lib/hooks/useDatabase';
import type { Therapist } from '@/lib/hooks/useDatabase';

const PLACEHOLDER_THERAPISTS: Therapist[] = [
      {
            id: 'placeholder-alex-carter',
            name: 'Alex Carter',
            credentials: 'MA, LPC',
            title: '',
            short_bio: '',
            full_bio: '',
            full_bio_rich: null,
            fun_fact: null,
            specialties: [],
            image_url: null,
            slug: 'alex-carter',
            order_index: 0,
            is_active: true,
            created_at: '',
            updated_at: '',
      },
      {
            id: 'placeholder-jordan-lee',
            name: 'Jordan Lee',
            credentials: 'MSW, LMSW',
            title: '',
            short_bio: '',
            full_bio: '',
            full_bio_rich: null,
            fun_fact: null,
            specialties: [],
            image_url: null,
            slug: 'jordan-lee',
            order_index: 1,
            is_active: true,
            created_at: '',
            updated_at: '',
      },
      {
            id: 'placeholder-taylor-morgan',
            name: 'Taylor Morgan',
            credentials: 'PhD, LP',
            title: '',
            short_bio: '',
            full_bio: '',
            full_bio_rich: null,
            fun_fact: null,
            specialties: [],
            image_url: null,
            slug: 'taylor-morgan',
            order_index: 2,
            is_active: true,
            created_at: '',
            updated_at: '',
      },
];

function looksLikeTestValue(value: string): boolean {
      const normalized = value.trim().toLowerCase();
      return (
            normalized === '' ||
            normalized === 'asdf' ||
            normalized.includes('asdf') ||
            normalized === 'test' ||
            normalized === 'demo' ||
            normalized === 'temp'
      );
}

function isUsableTherapistForPublicDisplay(therapist: Therapist): boolean {
      const name = therapist.name.trim();
      if (name.length < 5 || looksLikeTestValue(name)) {
            return false;
      }

      return true;
}

export default function TherapistsPage() {
      const { fetchTherapists } = useTherapists();
      const [therapists, setTherapists] = useState<Therapist[]>([]);
      const [isLoading, setIsLoading] = useState(true);
      const [error, setError] = useState<string | null>(null);

      useEffect(() => {
            async function loadTherapists() {
                  try {
                        const data = await fetchTherapists();
                        setTherapists(data);
                  } catch (err) {
                        setError('Failed to load therapists');
                        console.error(err);
                  } finally {
                        setIsLoading(false);
                  }
            }
            loadTherapists();
      }, [fetchTherapists]);

      if (isLoading) {
            return (
                  <div className="py-16">
                        <div className="container-custom text-center">
                              <p className="text-gray-600">Loading therapists...</p>
                        </div>
                  </div>
            );
      }

      if (error) {
            return (
                  <div className="py-16">
                        <div className="container-custom text-center">
                              <p className="text-red-600">{error}</p>
                        </div>
                  </div>
            );
      }

      const sanitizedTherapists = therapists
            .filter(isUsableTherapistForPublicDisplay)
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name));
      const visibleTherapists = sanitizedTherapists.length > 0
            ? [
                  ...sanitizedTherapists,
                  ...PLACEHOLDER_THERAPISTS.filter(
                        (placeholder) =>
                              !sanitizedTherapists.some(
                                    (therapist) => therapist.name.toLowerCase() === placeholder.name.toLowerCase()
                              )
                  ),
            ]
            : PLACEHOLDER_THERAPISTS;

      return (
            <div className="py-16">
                  <div className="container-custom">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 text-center">
                              Our Therapists
                        </h1>
                        <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
                              Meet our team of experienced, licensed mental health professionals dedicated to supporting you on your journey.
                        </p>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                              {visibleTherapists.map((therapist) => (
                                    <TherapistCard key={therapist.id} therapist={therapist} />
                              ))}
                        </div>
                  </div>
            </div>
      );
}
