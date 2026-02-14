'use client';

import { useEffect, useState } from 'react';
import { TherapistCard } from '@/components/TherapistCard';
import { useTherapists } from '@/lib/hooks/useDatabase';
import type { Therapist } from '@/lib/hooks/useDatabase';

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
                              {therapists.map((therapist) => (
                                    <TherapistCard key={therapist.id} therapist={therapist} />
                              ))}
                        </div>
                  </div>
            </div>
      );
}
