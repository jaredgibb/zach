'use client';

import { useMemo, useState } from 'react';
import { Modal } from '@/components/Modal';
import type { Therapist } from '@/lib/hooks/useDatabase';
import YooptaEditor, { createYooptaEditor } from '@yoopta/editor';
import {
      normalizeTherapistBioContent,
      therapistBioMarks,
      therapistBioPlugins,
} from '@/lib/yooptaTherapistBio';

interface TherapistCardProps {
      therapist: Therapist;
}

export function TherapistCard({ therapist }: TherapistCardProps) {
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [imageFailed, setImageFailed] = useState(false);
      const fullBioViewer = useMemo(() => createYooptaEditor(), []);
      const hasImage = Boolean(therapist.image_url) && !imageFailed;
      const richFullBio = normalizeTherapistBioContent(therapist.full_bio_rich);
      const fallbackParagraphs = therapist.full_bio
            .split('\n\n')
            .map((paragraph) => paragraph.trim())
            .filter((paragraph) => paragraph.length > 0);

      return (
            <>
                  <div
                        onClick={() => setIsModalOpen(true)}
                        className="card cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                        <div className="relative h-64 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                              {hasImage ? (
                                    <img
                                          src={therapist.image_url ?? ''}
                                          alt={`Photo of ${therapist.name}`}
                                          className="h-full w-full object-cover"
                                          onError={() => setImageFailed(true)}
                                    />
                              ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                          <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                          </svg>
                                    </div>
                              )}
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900">{therapist.name}</h2>
                        <p className="text-primary-600 font-medium mb-2">{therapist.credentials}</p>
                        <p className="text-gray-600 mb-3">{therapist.title}</p>
                        <p className="text-gray-700 leading-relaxed mb-4">{therapist.short_bio}</p>

                        {therapist.specialties && therapist.specialties.length > 0 && (
                              <div className="mb-4">
                                    <p className="text-sm font-semibold text-gray-900 mb-2">Specialties:</p>
                                    <div className="flex flex-wrap gap-2">
                                          {therapist.specialties.map((specialty) => (
                                                <span
                                                      key={specialty}
                                                      className="inline-block bg-primary-100 text-primary-800 text-xs font-medium px-3 py-1 rounded-full"
                                                >
                                                      {specialty}
                                                </span>
                                          ))}
                                    </div>
                              </div>
                        )}

                        <button
                              onClick={(e) => {
                                    e.stopPropagation();
                                    setIsModalOpen(true);
                              }}
                              className="text-primary-600 font-medium hover:underline"
                        >
                              View full profile →
                        </button>
                  </div>

                  <Modal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        title={therapist.name}
                  >
                        <div className="space-y-6">
                              <div className="relative h-80 bg-gray-200 rounded-lg overflow-hidden">
                                    {hasImage ? (
                                          <img
                                                src={therapist.image_url ?? ''}
                                                alt={`Photo of ${therapist.name}`}
                                                className="h-full w-full object-cover"
                                                onError={() => setImageFailed(true)}
                                          />
                                    ) : (
                                          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                                <svg className="w-40 h-40" fill="currentColor" viewBox="0 0 24 24">
                                                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                                </svg>
                                          </div>
                                    )}
                              </div>

                              <div>
                                    <p className="text-primary-600 font-medium mb-2">{therapist.credentials}</p>
                                    <p className="text-xl text-gray-600 mb-6">{therapist.title}</p>
                              </div>

                              {therapist.short_bio && (
                                    <div>
                                          <h3 className="text-xl font-bold text-gray-900 mb-3">Summary</h3>
                                          <p className="text-gray-700 leading-relaxed">{therapist.short_bio}</p>
                                    </div>
                              )}

                              <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">About {therapist.name.split(' ')[0]}</h3>
                                    {richFullBio ? (
                                          <YooptaEditor
                                                editor={fullBioViewer}
                                                plugins={therapistBioPlugins}
                                                marks={therapistBioMarks}
                                                value={richFullBio}
                                                readOnly
                                                autoFocus={false}
                                                style={{
                                                      width: '100%',
                                                      paddingBottom: 0,
                                                }}
                                          />
                                    ) : (
                                          fallbackParagraphs.map((paragraph, index) => (
                                                <p key={index} className="text-gray-700 leading-relaxed mb-4">
                                                      {paragraph}
                                                </p>
                                          ))
                                    )}
                              </div>

                              {therapist.fun_fact && (
                                    <div className="bg-primary-50 border-l-4 border-primary-600 p-4">
                                          <p className="text-sm font-semibold text-primary-900 mb-1">Fun Fact:</p>
                                          <p className="text-primary-800">{therapist.fun_fact}</p>
                                    </div>
                              )}

                              {therapist.specialties && therapist.specialties.length > 0 && (
                                    <div>
                                          <h4 className="font-semibold text-gray-900 mb-3">Specialties:</h4>
                                          <div className="flex flex-wrap gap-2">
                                                {therapist.specialties.map((specialty) => (
                                                      <span
                                                            key={specialty}
                                                            className="inline-block bg-primary-100 text-primary-800 text-sm font-medium px-4 py-2 rounded-full"
                                                      >
                                                            {specialty}
                                                      </span>
                                                ))}
                                          </div>
                                    </div>
                              )}

                              <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="w-full btn-secondary mt-6"
                              >
                                    Close
                              </button>
                        </div>
                  </Modal>
            </>
      );
}
