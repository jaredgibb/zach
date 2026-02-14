'use client';

import { useState } from 'react';
import { Modal } from '@/components/Modal';
import type { Service } from '@/lib/hooks/useDatabase';

interface ServiceCardProps {
      service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [imageFailed, setImageFailed] = useState(false);
      const hasImage = Boolean(service.image_url) && !imageFailed;

      return (
            <>
                  <div
                        onClick={() => setIsModalOpen(true)}
                        className="card cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                        <div className="relative h-48 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                              {hasImage ? (
                                    <img
                                          src={service.image_url ?? ''}
                                          alt={service.title}
                                          className="h-full w-full object-cover"
                                          onError={() => setImageFailed(true)}
                                    />
                              ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                          <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                      strokeWidth={2}
                                                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                                                />
                                          </svg>
                                    </div>
                              )}
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">{service.short_description}</p>

                        {service.features && service.features.length > 0 && (
                              <div className="mb-4">
                                    <ul className="space-y-2">
                                          {service.features.slice(0, 2).map((feature, idx) => (
                                                <li key={idx} className="flex items-start text-sm text-gray-700">
                                                      <span className="text-primary-600 mr-2">✓</span>
                                                      {feature}
                                                </li>
                                          ))}
                                          {service.features.length > 2 && (
                                                <li className="text-sm text-primary-600 font-medium">
                                                      + {service.features.length - 2} more features
                                                </li>
                                          )}
                                    </ul>
                              </div>
                        )}

                        <button
                              onClick={(e) => {
                                    e.stopPropagation();
                                    setIsModalOpen(true);
                              }}
                              className="text-primary-600 font-medium hover:underline"
                        >
                              Learn more →
                        </button>
                  </div>

                  <Modal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        title={service.title}
                  >
                        <div className="space-y-6">
                              <div className="relative h-64 bg-gray-200 rounded-lg overflow-hidden">
                                    {hasImage ? (
                                          <img
                                                src={service.image_url ?? ''}
                                                alt={service.title}
                                                className="h-full w-full object-cover"
                                                onError={() => setImageFailed(true)}
                                          />
                                    ) : (
                                          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                                <svg className="w-32 h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                      <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                                                      />
                                                </svg>
                                          </div>
                                    )}
                              </div>

                              <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h2>
                                    <p className="text-gray-700 leading-relaxed mb-6">{service.full_description}</p>
                              </div>

                              {service.features && service.features.length > 0 && (
                                    <div>
                                          <h3 className="font-bold text-gray-900 mb-4">What's Included:</h3>
                                          <ul className="space-y-3">
                                                {service.features.map((feature, idx) => (
                                                      <li key={idx} className="flex items-start">
                                                            <span className="text-primary-600 mr-3 mt-1">✓</span>
                                                            <span className="text-gray-700">{feature}</span>
                                                      </li>
                                                ))}
                                          </ul>
                                    </div>
                              )}

                              <div className="flex gap-3 pt-6 border-t">
                                    <button
                                          onClick={() => setIsModalOpen(false)}
                                          className="flex-1 btn-secondary"
                                    >
                                          Close
                                    </button>
                                    <a
                                          href="/contact"
                                          className="flex-1 btn-primary text-center"
                                    >
                                          Schedule Now
                                    </a>
                              </div>
                        </div>
                  </Modal>
            </>
      );
}
