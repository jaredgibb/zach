'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { cmsAdminRequest } from '@/lib/cms/admin-client';
import type { CmsPageListItem } from '@/lib/cms/types';
import { useAdmin } from '@/lib/hooks/useAdmin';

interface ListResponse {
      pages: CmsPageListItem[];
}

interface CreateResponse {
      page: {
            id: string;
      } | null;
}

export default function AdminPagesListPage() {
      const router = useRouter();
      const { user, isAdmin, loading: authLoading, error: adminError } = useAdmin();
      const [pages, setPages] = useState<CmsPageListItem[]>([]);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState('');
      const [creating, setCreating] = useState(false);
      const [titleInput, setTitleInput] = useState('');
      const [slugInput, setSlugInput] = useState('');

      useEffect(() => {
            if (!authLoading && !user) {
                  router.push('/admin/login');
            }
      }, [authLoading, router, user]);

      const loadPages = useCallback(async () => {
            setLoading(true);
            setError('');

            try {
                  const payload = await cmsAdminRequest<ListResponse>('/api/admin/pages');
                  setPages(payload.pages ?? []);
            } catch (requestError) {
                  setError(requestError instanceof Error ? requestError.message : 'Failed to load pages.');
            } finally {
                  setLoading(false);
            }
      }, []);

      useEffect(() => {
            if (user && isAdmin) {
                  void loadPages();
            }
      }, [isAdmin, loadPages, user]);

      const sortedPages = useMemo(
            () => [...pages].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
            [pages]
      );

      const handleCreate = async (event: React.FormEvent) => {
            event.preventDefault();
            setError('');

            if (!titleInput.trim()) {
                  setError('Title is required.');
                  return;
            }

            setCreating(true);

            try {
                  const payload = await cmsAdminRequest<CreateResponse>('/api/admin/pages', {
                        method: 'POST',
                        body: JSON.stringify({
                              title: titleInput.trim(),
                              slug: slugInput.trim(),
                        }),
                  });

                  if (!payload.page?.id) {
                        throw new Error('Page was created but no id was returned.');
                  }

                  setTitleInput('');
                  setSlugInput('');
                  router.push(`/admin/pages/${payload.page.id}`);
            } catch (requestError) {
                  setError(requestError instanceof Error ? requestError.message : 'Failed to create page.');
            } finally {
                  setCreating(false);
            }
      };

      const handleAction = async (path: string, method: 'POST' | 'DELETE' = 'POST') => {
            setError('');
            try {
                  await cmsAdminRequest(path, { method });
                  await loadPages();
            } catch (requestError) {
                  setError(requestError instanceof Error ? requestError.message : 'Request failed.');
            }
      };

      if (authLoading || loading) {
            return (
                  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                        <div className="text-center">
                              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto" />
                              <p className="mt-4 text-gray-600">Loading...</p>
                        </div>
                  </div>
            );
      }

      if (!user) {
            return null;
      }

      if (!isAdmin) {
            return (
                  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                        <div className="max-w-md rounded-lg bg-white p-8 text-center shadow">
                              <h1 className="mb-3 text-2xl font-bold text-gray-900">Access denied</h1>
                              <p className="mb-4 text-gray-600">You are signed in but do not have admin access.</p>
                              {adminError && <p className="text-sm text-red-600">{adminError}</p>}
                        </div>
                  </div>
            );
      }

      return (
            <div className="min-h-screen bg-gray-50">
                  <div className="bg-white shadow">
                        <div className="container-custom py-6">
                              <Link href="/admin/dashboard" className="text-primary-600 hover:underline text-sm mb-2 inline-block">
                                    ← Back to Dashboard
                              </Link>
                              <h1 className="text-3xl font-bold text-gray-900">Page Builder</h1>
                              <p className="mt-2 text-gray-600">Create, edit, and publish SEO-ready pages.</p>
                        </div>
                  </div>

                  <div className="container-custom py-8 space-y-8">
                        {error && (
                              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800">
                                    {error}
                              </div>
                        )}

                        <section className="rounded-lg bg-white p-6 shadow-md">
                              <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Page</h2>
                              <form onSubmit={handleCreate} className="grid gap-4 md:grid-cols-3 md:items-end">
                                    <div className="md:col-span-2">
                                          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                          <input
                                                type="text"
                                                value={titleInput}
                                                onChange={(event) => setTitleInput(event.target.value)}
                                                className="w-full rounded-lg border border-gray-300 px-4 py-2"
                                                placeholder="Example: Insurance FAQ"
                                                required
                                          />
                                    </div>
                                    <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-1">Slug (optional)</label>
                                          <input
                                                type="text"
                                                value={slugInput}
                                                onChange={(event) => setSlugInput(event.target.value)}
                                                className="w-full rounded-lg border border-gray-300 px-4 py-2"
                                                placeholder="insurance-faq"
                                          />
                                    </div>
                                    <div className="md:col-span-3">
                                          <button
                                                type="submit"
                                                disabled={creating}
                                                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                          >
                                                {creating ? 'Creating...' : 'Create Draft'}
                                          </button>
                                    </div>
                              </form>
                        </section>

                        <section className="rounded-lg bg-white p-6 shadow-md">
                              <h2 className="text-xl font-bold text-gray-900 mb-4">Pages</h2>

                              {sortedPages.length === 0 ? (
                                    <p className="text-gray-600">No pages yet.</p>
                              ) : (
                                    <div className="overflow-x-auto">
                                          <table className="w-full min-w-[960px] text-left">
                                                <thead>
                                                      <tr className="border-b border-gray-200 text-sm text-gray-600">
                                                            <th className="py-3 pr-4 font-medium">Title</th>
                                                            <th className="py-3 pr-4 font-medium">Path</th>
                                                            <th className="py-3 pr-4 font-medium">Type</th>
                                                            <th className="py-3 pr-4 font-medium">Status</th>
                                                            <th className="py-3 pr-4 font-medium">Updated</th>
                                                            <th className="py-3 font-medium">Actions</th>
                                                      </tr>
                                                </thead>
                                                <tbody>
                                                      {sortedPages.map((page) => (
                                                            <tr key={page.id} className="border-b border-gray-100 text-sm">
                                                                  <td className="py-3 pr-4">
                                                                        <p className="font-semibold text-gray-900">{page.title || '(Untitled)'}</p>
                                                                        <p className="text-xs text-gray-500">Slug: {page.slug}</p>
                                                                  </td>
                                                                  <td className="py-3 pr-4 text-primary-700">{page.path}</td>
                                                                  <td className="py-3 pr-4 capitalize">{page.kind}</td>
                                                                  <td className="py-3 pr-4">
                                                                        <span
                                                                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                                                    page.status === 'published'
                                                                                          ? 'bg-green-100 text-green-800'
                                                                                          : page.status === 'draft'
                                                                                                ? 'bg-amber-100 text-amber-800'
                                                                                                : 'bg-gray-100 text-gray-700'
                                                                              }`}
                                                                        >
                                                                              {page.status}
                                                                        </span>
                                                                  </td>
                                                                  <td className="py-3 pr-4 text-gray-600">{page.updatedAt ? new Date(page.updatedAt).toLocaleString() : '—'}</td>
                                                                  <td className="py-3">
                                                                        <div className="flex flex-wrap items-center gap-3 text-xs font-medium">
                                                                              <Link href={`/admin/pages/${page.id}`} className="text-primary-600 hover:underline">
                                                                                    Edit
                                                                              </Link>
                                                                              <Link href={`/admin/pages/${page.id}/preview`} className="text-primary-600 hover:underline">
                                                                                    Preview
                                                                              </Link>
                                                                              {page.status !== 'published' ? (
                                                                                    <button
                                                                                          type="button"
                                                                                          onClick={() => void handleAction(`/api/admin/pages/${page.id}/publish`)}
                                                                                          className="text-green-700 hover:underline"
                                                                                    >
                                                                                          Publish
                                                                                    </button>
                                                                              ) : (
                                                                                    <button
                                                                                          type="button"
                                                                                          onClick={() => void handleAction(`/api/admin/pages/${page.id}/unpublish`)}
                                                                                          className="text-amber-700 hover:underline"
                                                                                    >
                                                                                          Unpublish
                                                                                    </button>
                                                                              )}
                                                                              {page.status !== 'published' && (
                                                                                    <button
                                                                                          type="button"
                                                                                          onClick={() => {
                                                                                                if (confirm('Delete this page?')) {
                                                                                                      void handleAction(`/api/admin/pages/${page.id}`, 'DELETE');
                                                                                                }
                                                                                          }}
                                                                                          className="text-red-600 hover:underline"
                                                                                    >
                                                                                          Delete
                                                                                    </button>
                                                                              )}
                                                                        </div>
                                                                  </td>
                                                            </tr>
                                                      ))}
                                                </tbody>
                                          </table>
                                    </div>
                              )}
                        </section>
                  </div>
            </div>
      );
}
