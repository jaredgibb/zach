'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useTherapists, type Therapist } from '@/lib/hooks/useDatabase';
import { storage } from '@/lib/supabase/client';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import YooptaEditor, { createYooptaEditor, type YooptaContentValue } from '@yoopta/editor';
import {
      createTherapistBioContentFromPlainText,
      getTherapistBioPlainText,
      normalizeTherapistBioContent,
      therapistBioMarks,
      therapistBioPlugins,
      therapistBioTools,
} from '@/lib/yooptaTherapistBio';

interface TherapistFormProps {
      therapistId?: string | null;
      initialTherapist?: Therapist | null;
      nextOrderIndex?: number;
      onSuccess: () => void;
}

function getDefaultFormData(orderIndex: number): Partial<Therapist> {
      return {
            name: '',
            credentials: '',
            title: '',
            short_bio: '',
            full_bio: '',
            full_bio_rich: null,
            fun_fact: '',
            specialties: [],
            image_url: '',
            is_active: true,
            order_index: orderIndex,
            slug: '',
      };
}

export default function TherapistForm({
      therapistId,
      initialTherapist,
      nextOrderIndex = 0,
      onSuccess
}: TherapistFormProps) {
      const { updateTherapist, addTherapist } = useTherapists();
      const fullBioEditor = useMemo(() => createYooptaEditor(), []);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState('');
      const [showImagePreview, setShowImagePreview] = useState(true);
      const [isUploadingImage, setIsUploadingImage] = useState(false);
      const [uploadProgress, setUploadProgress] = useState(0);
      const [isImageDragOver, setIsImageDragOver] = useState(false);
      const [formData, setFormData] = useState<Partial<Therapist>>(() => getDefaultFormData(nextOrderIndex));
      const [fullBioContent, setFullBioContent] = useState<YooptaContentValue | undefined>(undefined);
      const imageInputRef = useRef<HTMLInputElement | null>(null);

      useEffect(() => {
            if (therapistId) {
                  if (!initialTherapist) {
                        setFormData(getDefaultFormData(nextOrderIndex));
                        setFullBioContent(undefined);
                        return;
                  }

                  setFormData({
                        ...initialTherapist,
                        fun_fact: initialTherapist.fun_fact ?? '',
                        image_url: initialTherapist.image_url ?? '',
                  });

                  const richBio = normalizeTherapistBioContent(initialTherapist.full_bio_rich);
                  const fallbackRichBio = richBio
                        ? null
                        : createTherapistBioContentFromPlainText(
                              fullBioEditor,
                              initialTherapist.full_bio ?? ''
                        );
                  setFullBioContent(richBio ?? fallbackRichBio ?? undefined);
                  return;
            }

            setFormData(getDefaultFormData(nextOrderIndex));
            setFullBioContent(undefined);
      }, [therapistId, initialTherapist, nextOrderIndex, fullBioEditor]);

      useEffect(() => {
            setShowImagePreview(true);
      }, [formData.image_url]);

      const uploadImage = async (file: File) => {
            if (!file.type.startsWith('image/')) {
                  setError('Please upload a valid image file.');
                  return;
            }

            if (file.size > 10 * 1024 * 1024) {
                  setError('Please upload an image smaller than 10 MB.');
                  return;
            }

            const fileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '-').toLowerCase();
            const imagePath = `therapists/${therapistId ?? 'new'}/${Date.now()}-${fileName}`;
            const storageRef = ref(storage, imagePath);

            setError('');
            setIsUploadingImage(true);
            setUploadProgress(0);

            try {
                  const uploadTask = uploadBytesResumable(storageRef, file, {
                        contentType: file.type,
                  });

                  const imageUrl = await new Promise<string>((resolve, reject) => {
                        uploadTask.on(
                              'state_changed',
                              (snapshot) => {
                                    const percent = snapshot.totalBytes
                                          ? Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
                                          : 0;
                                    setUploadProgress(percent);
                              },
                              reject,
                              async () => {
                                    try {
                                          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
                                          resolve(downloadUrl);
                                    } catch (downloadError) {
                                          reject(downloadError);
                                    }
                              }
                        );
                  });

                  setFormData((prev) => ({
                        ...prev,
                        image_url: imageUrl,
                  }));
            } catch (uploadError) {
                  setError(uploadError instanceof Error ? uploadError.message : 'Failed to upload image');
            } finally {
                  setIsUploadingImage(false);
            }
      };

      const handleImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];

            if (file) {
                  void uploadImage(file);
            }

            e.target.value = '';
      };

      const handleImageDrop = (event: React.DragEvent<HTMLDivElement>) => {
            event.preventDefault();
            setIsImageDragOver(false);

            const file = event.dataTransfer.files?.[0];
            if (!file) {
                  return;
            }

            void uploadImage(file);
      };

      const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            setError('');
            setLoading(true);

            try {
                  const richFullBio = normalizeTherapistBioContent(fullBioContent);
                  const fallbackFullBio = (formData.full_bio || '').trim();
                  const normalizedFullBio = richFullBio
                        ? getTherapistBioPlainText(fullBioEditor, richFullBio)
                        : fullBioContent === undefined
                              ? fallbackFullBio
                              : '';

                  if (!normalizedFullBio) {
                        setError('Full biography is required.');
                        return;
                  }

                  const parsedOrderIndex = Number(formData.order_index);
                  const specialties = (formData.specialties || [])
                        .map((specialty) => specialty.trim())
                        .filter((specialty) => specialty.length > 0);

                  const payload: Omit<Therapist, 'id' | 'created_at' | 'updated_at'> = {
                        name: (formData.name || '').trim(),
                        credentials: (formData.credentials || '').trim(),
                        title: (formData.title || '').trim(),
                        short_bio: (formData.short_bio || '').trim(),
                        full_bio: normalizedFullBio,
                        full_bio_rich: richFullBio,
                        fun_fact: (formData.fun_fact || '').trim() || null,
                        specialties,
                        image_url: (formData.image_url || '').trim() || null,
                        slug: (formData.slug || '').trim(),
                        order_index: Number.isFinite(parsedOrderIndex) ? parsedOrderIndex : nextOrderIndex,
                        is_active: formData.is_active ?? true,
                  };

                  if (therapistId) {
                        await updateTherapist(therapistId, payload);
                  } else {
                        await addTherapist(payload);
                  }
                  onSuccess();
            } catch (err) {
                  setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                  setLoading(false);
            }
      };

      const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            const { name, value } = e.target;
            setFormData((prev) => ({ ...prev, [name]: value }));
      };

      const handleSpecialtiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const specialties = e.target.value.split(',').map((s) => s.trim());
            setFormData((prev) => ({ ...prev, specialties }));
      };

      return (
            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                  {error && (
                        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                              {error}
                        </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-6">
                        <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name <span className="text-red-500">*</span>
                              </label>
                              <input
                                    type="text"
                                    name="name"
                                    value={formData.name || ''}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              />
                        </div>

                        <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Credentials <span className="text-red-500">*</span>
                              </label>
                              <input
                                    type="text"
                                    name="credentials"
                                    placeholder="e.g., MA, LPC"
                                    value={formData.credentials || ''}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              />
                        </div>
                  </div>

                  <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                              Title <span className="text-red-500">*</span>
                        </label>
                        <input
                              type="text"
                              name="title"
                              placeholder="e.g., Licensed Professional Counselor"
                              value={formData.title || ''}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                  </div>

                  <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                              Short Bio <span className="text-red-500">*</span>
                        </label>
                        <textarea
                              name="short_bio"
                              rows={2}
                              value={formData.short_bio || ''}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                  </div>

                  <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                              Full Biography <span className="text-red-500">*</span>
                        </label>
                        <div className="rounded-lg border border-gray-300 px-3 py-2 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent">
                              <YooptaEditor
                                    editor={fullBioEditor}
                                    plugins={therapistBioPlugins}
                                    marks={therapistBioMarks}
                                    tools={therapistBioTools}
                                    value={fullBioContent}
                                    onChange={(value) => setFullBioContent(value)}
                                    autoFocus={false}
                                    placeholder="Write the complete therapist biography..."
                                    style={{
                                          width: '100%',
                                          minHeight: 220,
                                          paddingBottom: 24,
                                    }}
                              />
                        </div>
                        <p className="mt-2 text-xs text-gray-500">
                              Use headings, lists, and basic formatting to control how this appears in the therapist profile modal.
                        </p>
                  </div>

                  <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                              Fun Fact
                        </label>
                        <input
                              type="text"
                              name="fun_fact"
                              value={formData.fun_fact || ''}
                              onChange={handleChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                  </div>

                  <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                              Image URL
                        </label>
                        <div
                              onDragEnter={(event) => {
                                    event.preventDefault();
                                    setIsImageDragOver(true);
                              }}
                              onDragOver={(event) => {
                                    event.preventDefault();
                                    setIsImageDragOver(true);
                              }}
                              onDragLeave={(event) => {
                                    event.preventDefault();
                                    setIsImageDragOver(false);
                              }}
                              onDrop={handleImageDrop}
                              className={`rounded-lg border-2 border-dashed p-5 text-center transition mb-3 ${isImageDragOver
                                    ? 'border-primary-500 bg-primary-50'
                                    : 'border-gray-300 bg-gray-50'
                              }`}
                        >
                              <input
                                    ref={imageInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageInputChange}
                                    className="hidden"
                              />

                              <p className="text-sm text-gray-700 mb-3">
                                    Drag and drop an image here, or upload from your computer.
                              </p>
                              <button
                                    type="button"
                                    onClick={() => imageInputRef.current?.click()}
                                    disabled={isUploadingImage}
                                    className="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                    {isUploadingImage ? 'Uploading...' : 'Upload Image'}
                              </button>

                              {isUploadingImage && (
                                    <p className="mt-3 text-xs text-primary-700">
                                          Uploading image... {uploadProgress}%
                                    </p>
                              )}
                        </div>

                        <input
                              type="url"
                              name="image_url"
                              placeholder="https://example.com/therapist-photo.jpg"
                              value={formData.image_url || ''}
                              onChange={handleChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                        <p className="mt-2 text-xs text-gray-500">
                              Paste a publicly accessible image URL to display this therapist&apos;s photo.
                        </p>

                        {formData.image_url && showImagePreview && (
                              <div className="mt-3 h-48 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                                    <img
                                          src={formData.image_url}
                                          alt={`${formData.name || 'Therapist'} preview`}
                                          className="h-full w-full object-cover"
                                          onError={() => setShowImagePreview(false)}
                                    />
                              </div>
                        )}
                  </div>

                  <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                              Specialties (comma-separated)
                        </label>
                        <input
                              type="text"
                              placeholder="e.g., Anxiety, Depression, Trauma"
                              value={(formData.specialties || []).join(', ')}
                              onChange={handleSpecialtiesChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                  </div>

                  <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                              Active Status
                        </label>
                        <select
                              name="is_active"
                              value={formData.is_active ? 'true' : 'false'}
                              onChange={(e) => setFormData((prev) => ({ ...prev, is_active: e.target.value === 'true' }))}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                              <option value="true">Active</option>
                              <option value="false">Inactive</option>
                        </select>
                  </div>

                  <button
                        type="submit"
                        disabled={loading || isUploadingImage}
                        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                        {loading ? 'Saving...' : therapistId ? 'Update Therapist' : 'Add Therapist'}
                  </button>
            </form>
      );
}
