'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ServiceCard } from '@/components/ServiceCard';
import { useServices } from '@/lib/hooks/useDatabase';
import type { Service } from '@/lib/hooks/useDatabase';

export default function ServicesPage() {
      const { fetchServices } = useServices();
      const [services, setServices] = useState<Service[]>([]);
      const [isLoading, setIsLoading] = useState(true);
      const [error, setError] = useState<string | null>(null);

      useEffect(() => {
            async function loadServices() {
                  try {
                        const data = await fetchServices();
                        setServices(data);
                  } catch (err) {
                        setError('Failed to load services');
                        console.error(err);
                  } finally {
                        setIsLoading(false);
                  }
            }
            loadServices();
      }, [fetchServices]);

      if (isLoading) {
            return (
                  <div className="py-16">
                        <div className="container-custom text-center">
                              <p className="text-gray-600">Loading services...</p>
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
                              Our Services
                        </h1>
                        <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
                              Professional mental health services tailored to your needs
                        </p>

                        {/* Services Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 max-w-6xl mx-auto">
                              {services.map((service) => (
                                    <ServiceCard key={service.id} service={service} />
                              ))}
                        </div>

                        {/* CTA */}
                        <div className="bg-primary-600 text-white rounded-lg p-8 text-center max-w-2xl mx-auto">
                              <h2 className="text-2xl font-bold mb-4">Interested in Our Services?</h2>
                              <p className="text-lg mb-6 text-primary-100">
                                    Contact us to learn more about how we can support you.
                              </p>
                              <Link
                                    href="/contact"
                                    className="inline-block bg-white text-primary-600 hover:bg-gray-100 font-semibold px-8 py-3 rounded-lg transition-colors"
                              >
                                    Get Started
                              </Link>
                        </div>
                  </div>
            </div>
      );
}
