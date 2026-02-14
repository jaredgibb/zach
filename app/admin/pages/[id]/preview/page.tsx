'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import CmsPageRenderer from '@/components/cms/CmsPageRenderer';
import { cmsAdminRequest } from '@/lib/cms/admin-client';
import type { CmsPage } from '@/lib/cms/types';
import { useAdmin } from '@/lib/hooks/useAdmin';

interface PageResponse {
      page: CmsPage;
}

export default function AdminPagePreviewPage() {
      const router = useRouter();
      const params = useParams<{ id: string }>();
      const pageId = params.id;
      const { user, isAdmin, loading: authLoading } = useAdmin();

      const [page, setPage] = useState<CmsPage | null>(null);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState('');

      useEffect(() => {
            if (!authLoading && !user) {
                  router.push('/admin/login');
            }
      }, [authLoading, router, user]);

      useEffect(() => {
            async function loadPreview() {
                  if (!user || !isAdmin || !pageId) {
                        return;
                  }

                  setLoading(true);
                  setError('');

                  try {
                        const payload = await cmsAdminRequest<PageResponse>(`/api/admin/pages/${pageId}`);
                        setPage(payload.page);
                  } catch (requestError) {
                        setError(requestError instanceof Error ? requestError.message : 'Failed to load preview.');
                  } finally {
                        setLoading(false);
                  }
            }

            void loadPreview();
      }, [isAdmin, pageId, user]);

      if (authLoading || loading) {
            return (
                  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                        <div className="text-center">
                              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto" />
                              <p className="mt-4 text-gray-600">Loading preview...</p>
                        </div>
                  </div>
            );
      }

      if (!user || !isAdmin) {
            return null;
      }

      if (error) {
            return (
                  <div className="container-custom py-8">
                        <Link href={`/admin/pages/${pageId}`} className="text-primary-600 hover:underline">
                              ← Back to editor
                        </Link>
                        <p className="mt-4 text-red-600">{error}</p>
                  </div>
            );
      }

      if (!page) {
            return null;
      }

      return (
            <div className="bg-white">
                  <div className="border-b border-gray-200 bg-gray-50">
                        <div className="container-custom py-4 flex flex-wrap items-center justify-between gap-3">
                              <div>
                                    <p className="text-sm font-medium text-gray-700">Admin Preview</p>
                                    <p className="text-xs text-gray-500">This is the draft version and may not be published.</p>
                              </div>
                              <Link href={`/admin/pages/${page.id}`} className="btn-secondary">
                                    Back to Editor
                              </Link>
                        </div>
                  </div>

                  <CmsPageRenderer page={page} useDraft />
            </div>
      );
}
