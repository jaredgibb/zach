'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import YooptaEditor, { createYooptaEditor, type YooptaContentValue } from '@yoopta/editor';
import { useServices, type Service } from '@/lib/hooks/useDatabase';
import {
      createTherapistBioContentFromPlainText,
      getTherapistBioPlainText,
      normalizeTherapistBioContent,
      therapistBioMarks,
      therapistBioPlugins,
      therapistBioTools,
} from '@/lib/yooptaTherapistBio';
import { uploadAdminImage } from '@/lib/uploadAdminImage';

interface ServiceFormProps {
      serviceId?: string | null;
      initialService?: Service | null;
      nextOrderIndex?: number;
      onSuccess: () => void;
}

function getDefaultFormData(orderIndex: number): Partial<Service> {
      return {
            title: '',
            slug: '',
            short_description: '',
            full_description: '',
            full_description_rich: null,
            image_url: null,
            features: [],
            is_active: true,
            order_index: orderIndex,
      };
}

export default function ServiceForm({
      serviceId,
      initialService,
      nextOrderIndex = 0,
      onSuccess,
}: ServiceFormProps) {
      const { updateService, addService } = useServices();
      const fullDescriptionEditor = useMemo(() => createYooptaEditor(), []);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState('');
      const [showImagePreview, setShowImagePreview] = useState(true);
      const [isUploadingImage, setIsUploadingImage] = useState(false);
      const [uploadProgress, setUploadProgress] = useState(0);
      const [isImageDragOver, setIsImageDragOver] = useState(false);
      const [formData, setFormData] = useState<Partial<Service>>(() => getDefaultFormData(nextOrderIndex));
      const [featuresInput, setFeaturesInput] = useState('');
      const [fullDescriptionContent, setFullDescriptionContent] = useState<YooptaContentValue | undefined>(undefined);
      const imageInputRef = useRef<HTMLInputElement | null>(null);

      useEffect(() => {
            if (serviceId) {
                  if (!initialService) {
                        setFormData(getDefaultFormData(nextOrderIndex));
                        setFeaturesInput('');
                        setFullDescriptionContent(undefined);
                        return;
                  }

                  setFormData({
                        ...initialService,
                        image_url: initialService.image_url ?? null,
                  });
                  setFeaturesInput((initialService.features ?? []).join('\n'));

                  const richDescription = normalizeTherapistBioContent(initialService.full_description_rich);
                  const fallbackRichDescription = richDescription
                        ? null
                        : createTherapistBioContentFromPlainText(
                              fullDescriptionEditor,
                              initialService.full_description ?? '',
                        );
                  setFullDescriptionContent(richDescription ?? fallbackRichDescription ?? undefined);
                  return;
            }

            setFormData(getDefaultFormData(nextOrderIndex));
            setFeaturesInput('');
            setFullDescriptionContent(undefined);
      }, [serviceId, initialService, nextOrderIndex, fullDescriptionEditor]);

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

            setError('');
            setIsUploadingImage(true);
            setUploadProgress(0);

            try {
                  setUploadProgress(15);
                  const imageUrl = await uploadAdminImage({
                        file,
                        folder: 'services',
                        recordId: serviceId ?? null,
                  });
                  setUploadProgress(100);

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
                  const richDescription = normalizeTherapistBioContent(fullDescriptionContent);
                  const fallbackDescription = (formData.full_description || '').trim();
                  const normalizedFullDescription = richDescription
                        ? getTherapistBioPlainText(fullDescriptionEditor, richDescription)
                        : fullDescriptionContent === undefined
                              ? fallbackDescription
                              : '';

                  if (!normalizedFullDescription) {
                        setError('Full description is required.');
                        return;
                  }

                  const parsedOrderIndex = Number(formData.order_index);
                  const features = featuresInput
                        .split('\n')
                        .map((feature) => feature.trim())
                        .filter((feature) => feature.length > 0);

                  const payload: Omit<Service, 'id' | 'created_at' | 'updated_at'> = {
                        title: (formData.title || '').trim(),
                        slug: (formData.slug || '').trim(),
                        short_description: (formData.short_description || '').trim(),
                        full_description: normalizedFullDescription,
                        full_description_rich: richDescription,
                        image_url: typeof formData.image_url === 'string'
                              ? formData.image_url.trim() || null
                              : formData.image_url ?? null,
                        features,
                        order_index: Number.isFinite(parsedOrderIndex) ? parsedOrderIndex : nextOrderIndex,
                        is_active: formData.is_active ?? true,
                  };

                  if (serviceId) {
                        await updateService(serviceId, payload);
                  } else {
                        await addService(payload);
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

      const handleFeaturesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setFeaturesInput(e.target.value);
      };

      return (
            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                  {error && (
                        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                              {error}
                        </div>
                  )}

                  <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                              Service Title <span className="text-red-500">*</span>
                        </label>
                        <input
                              type="text"
                              name="title"
                              value={formData.title || ''}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                  </div>

                  <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                              URL Slug <span className="text-red-500">*</span>
                        </label>
                        <input
                              type="text"
                              name="slug"
                              placeholder="e.g., individual-therapy"
                              value={formData.slug || ''}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                  </div>

                  <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                              Short Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                              name="short_description"
                              rows={2}
                              value={formData.short_description || ''}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                  </div>

                  <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                              Full Description <span className="text-red-500">*</span>
                        </label>
                        <div className="rounded-lg border border-gray-300 px-3 py-2 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent">
                              <YooptaEditor
                                    editor={fullDescriptionEditor}
                                    plugins={therapistBioPlugins}
                                    marks={therapistBioMarks}
                                    tools={therapistBioTools}
                                    value={fullDescriptionContent}
                                    onChange={(value) => setFullDescriptionContent(value)}
                                    autoFocus={false}
                                    readOnly={false}
                                    selectionBoxRoot={false}
                                    placeholder="Write the full service description..."
                                    style={{
                                          width: '100%',
                                          minHeight: 220,
                                          paddingBottom: 24,
                                    }}
                              />
                        </div>
                        <p className="mt-2 text-xs text-gray-500">
                              Use headings, lists, and formatting to control how this appears in the service modal.
                        </p>
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
                              placeholder="https://example.com/service-image.jpg"
                              value={typeof formData.image_url === 'string' ? formData.image_url : ''}
                              onChange={handleChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                        <p className="mt-2 text-xs text-gray-500">
                              Paste a publicly accessible image URL to display this service on the site.
                        </p>

                        {typeof formData.image_url === 'string' && formData.image_url && showImagePreview && (
                              <div className="mt-3 h-48 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                                    <img
                                          src={formData.image_url}
                                          alt={`${formData.title || 'Service'} preview`}
                                          className="h-full w-full object-cover"
                                          onError={() => setShowImagePreview(false)}
                                    />
                              </div>
                        )}
                  </div>

                  <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                              Features (one per line)
                        </label>
                        <textarea
                              placeholder={'e.g. Confidential one-on-one sessions\nPersonalized treatment plans'}
                              rows={4}
                              value={featuresInput}
                              onChange={handleFeaturesChange}
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
                        {loading ? 'Saving...' : serviceId ? 'Update Service' : 'Add Service'}
                  </button>
            </form>
      );
}
