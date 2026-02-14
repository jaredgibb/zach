'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import CmsBlockEditor from '@/components/admin/cms/CmsBlockEditor';
import { cmsAdminRequest } from '@/lib/cms/admin-client';
import { createDefaultSnapshot } from '@/lib/cms/defaults';
import type { CmsPage, CmsPageListItem, CmsPageSnapshot } from '@/lib/cms/types';
import { useAdmin } from '@/lib/hooks/useAdmin';

interface PageResponse {
      page: CmsPage;
}

interface PageListResponse {
      pages: CmsPageListItem[];
}

export default function AdminPageEditor() {
      const router = useRouter();
      const params = useParams<{ id: string }>();
      const pageId = params.id;
      const { user, isAdmin, loading: authLoading } = useAdmin();

      const [page, setPage] = useState<CmsPage | null>(null);
      const [title, setTitle] = useState('');
      const [slug, setSlug] = useState('');
      const [draft, setDraft] = useState<CmsPageSnapshot>(() => createDefaultSnapshot());
      const [loading, setLoading] = useState(false);
      const [saving, setSaving] = useState(false);
      const [publishing, setPublishing] = useState(false);
      const [error, setError] = useState('');
      const [success, setSuccess] = useState('');
      const [cmsLinkSuggestions, setCmsLinkSuggestions] = useState<Array<{ label: string; href: string }>>([]);

      useEffect(() => {
            if (!authLoading && !user) {
                  router.push('/admin/login');
            }
      }, [authLoading, router, user]);

      const loadPage = useCallback(async () => {
            if (!pageId) {
                  return;
            }

            setLoading(true);
            setError('');

            try {
                  const [pagePayload, listPayload] = await Promise.all([
                        cmsAdminRequest<PageResponse>(`/api/admin/pages/${pageId}`),
                        cmsAdminRequest<PageListResponse>('/api/admin/pages'),
                  ]);
                  const pageData = pagePayload.page;

                  setPage(pageData);
                  setTitle(pageData.draft.title || '');
                  setSlug(pageData.slug || '');
                  setDraft(pageData.draft);
                  setCmsLinkSuggestions(
                        (listPayload.pages ?? [])
                              .filter((candidate) => candidate.status === 'published' && candidate.path)
                              .map((candidate) => ({
                                    label: candidate.title || candidate.path,
                                    href: candidate.path,
                              }))
                  );
            } catch (requestError) {
                  setError(requestError instanceof Error ? requestError.message : 'Failed to load page.');
            } finally {
                  setLoading(false);
            }
      }, [pageId]);

      useEffect(() => {
            if (user && isAdmin && pageId) {
                  void loadPage();
            }
      }, [isAdmin, loadPage, pageId, user]);

      const statusClassName = useMemo(() => {
            if (!page) {
                  return 'bg-gray-100 text-gray-700';
            }

            if (page.status === 'published') {
                  return 'bg-green-100 text-green-800';
            }

            if (page.status === 'draft') {
                  return 'bg-amber-100 text-amber-800';
            }

            return 'bg-gray-100 text-gray-700';
      }, [page]);

      const clearMessages = () => {
            setError('');
            setSuccess('');
      };

      const handleSaveDraft = async () => {
            if (!pageId || !page) {
                  return;
            }

            clearMessages();
            setSaving(true);

            try {
                  const nextDraft: CmsPageSnapshot = {
                        ...draft,
                        title: title.trim(),
                        nav: {
                              ...draft.nav,
                              headerLabel: draft.nav.headerLabel || title.trim(),
                              footerLabel: draft.nav.footerLabel || title.trim(),
                        },
                  };

                  const payload = await cmsAdminRequest<PageResponse>(`/api/admin/pages/${pageId}`, {
                        method: 'PATCH',
                        body: JSON.stringify({
                              title: title.trim(),
                              slug: slug.trim(),
                              draft: nextDraft,
                        }),
                  });

                  setPage(payload.page);
                  setDraft(payload.page.draft);
                  setTitle(payload.page.draft.title);
                  setSlug(payload.page.slug);
                  setSuccess('Draft saved.');
            } catch (requestError) {
                  setError(requestError instanceof Error ? requestError.message : 'Failed to save draft.');
            } finally {
                  setSaving(false);
            }
      };

      const handlePublish = async () => {
            if (!pageId) {
                  return;
            }

            clearMessages();
            setPublishing(true);

            try {
                  const payload = await cmsAdminRequest<PageResponse>(`/api/admin/pages/${pageId}/publish`, {
                        method: 'POST',
                  });
                  setPage(payload.page);
                  setSuccess('Page published.');
            } catch (requestError) {
                  setError(requestError instanceof Error ? requestError.message : 'Failed to publish page.');
            } finally {
                  setPublishing(false);
            }
      };

      const handleUnpublish = async () => {
            if (!pageId) {
                  return;
            }

            clearMessages();
            setPublishing(true);

            try {
                  const payload = await cmsAdminRequest<PageResponse>(`/api/admin/pages/${pageId}/unpublish`, {
                        method: 'POST',
                  });
                  setPage(payload.page);
                  setSuccess('Page unpublished.');
            } catch (requestError) {
                  setError(requestError instanceof Error ? requestError.message : 'Failed to unpublish page.');
            } finally {
                  setPublishing(false);
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
                              <p className="text-gray-600">You are signed in but do not have admin access.</p>
                        </div>
                  </div>
            );
      }

      if (!page) {
            return (
                  <div className="min-h-screen bg-gray-50">
                        <div className="container-custom py-8">
                              <Link href="/admin/pages" className="text-primary-600 hover:underline">
                                    ← Back to pages
                              </Link>
                              <p className="mt-6 text-red-600">Page not found.</p>
                        </div>
                  </div>
            );
      }

      return (
            <div className="min-h-screen bg-gray-50">
                  <div className="bg-white shadow">
                        <div className="container-custom py-6">
                              <div className="flex flex-wrap items-center justify-between gap-4">
                                    <div>
                                          <Link href="/admin/pages" className="text-primary-600 hover:underline text-sm mb-2 inline-block">
                                                ← Back to Pages
                                          </Link>
                                          <h1 className="text-3xl font-bold text-gray-900">Edit Page</h1>
                                    </div>
                                    <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${statusClassName}`}>
                                          {page.status}
                                    </span>
                              </div>
                        </div>
                  </div>

                  <div className="container-custom py-8 space-y-6">
                        {error && (
                              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800">
                                    {error}
                              </div>
                        )}

                        {success && (
                              <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-800">
                                    {success}
                              </div>
                        )}

                        <section className="rounded-lg bg-white p-6 shadow-md space-y-4">
                              <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                          <input
                                                type="text"
                                                value={title}
                                                onChange={(event) => {
                                                      setTitle(event.target.value);
                                                      setDraft((current) => ({
                                                            ...current,
                                                            title: event.target.value,
                                                      }));
                                                }}
                                                className="w-full rounded-lg border border-gray-300 px-4 py-2"
                                          />
                                    </div>
                                    <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                                          <input
                                                type="text"
                                                value={slug}
                                                onChange={(event) => setSlug(event.target.value)}
                                                disabled={page.kind === 'system' || Boolean(page.published)}
                                                className="w-full rounded-lg border border-gray-300 px-4 py-2 disabled:bg-gray-100"
                                          />
                                          {Boolean(page.published) && page.kind === 'custom' && (
                                                <p className="mt-1 text-xs text-gray-500">
                                                      Published page slugs are locked in phase 1.
                                                </p>
                                          )}
                                    </div>
                              </div>

                              <div className="text-sm text-gray-600">
                                    Path: <span className="font-medium text-primary-700">{page.path}</span>
                              </div>
                        </section>

                        <section className="rounded-lg bg-white p-6 shadow-md space-y-4">
                              <h2 className="text-xl font-bold text-gray-900">SEO</h2>
                              <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-1">Meta title</label>
                                          <input
                                                type="text"
                                                value={draft.seo.metaTitle}
                                                onChange={(event) =>
                                                      setDraft((current) => ({
                                                            ...current,
                                                            seo: { ...current.seo, metaTitle: event.target.value },
                                                      }))
                                                }
                                                className="w-full rounded-lg border border-gray-300 px-4 py-2"
                                          />
                                    </div>
                                    <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-1">Canonical path</label>
                                          <input
                                                type="text"
                                                value={draft.seo.canonicalPath}
                                                onChange={(event) =>
                                                      setDraft((current) => ({
                                                            ...current,
                                                            seo: { ...current.seo, canonicalPath: event.target.value },
                                                      }))
                                                }
                                                placeholder={`/example-page`}
                                                className="w-full rounded-lg border border-gray-300 px-4 py-2"
                                          />
                                    </div>
                              </div>

                              <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Meta description</label>
                                    <textarea
                                          rows={3}
                                          value={draft.seo.metaDescription}
                                          onChange={(event) =>
                                                setDraft((current) => ({
                                                      ...current,
                                                      seo: { ...current.seo, metaDescription: event.target.value },
                                                }))
                                          }
                                          className="w-full rounded-lg border border-gray-300 px-4 py-2"
                                    />
                              </div>

                              <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-1">Open Graph title</label>
                                          <input
                                                type="text"
                                                value={draft.seo.ogTitle}
                                                onChange={(event) =>
                                                      setDraft((current) => ({
                                                            ...current,
                                                            seo: { ...current.seo, ogTitle: event.target.value },
                                                      }))
                                                }
                                                className="w-full rounded-lg border border-gray-300 px-4 py-2"
                                          />
                                    </div>
                                    <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-1">Open Graph image URL</label>
                                          <input
                                                type="text"
                                                value={draft.seo.ogImageUrl}
                                                onChange={(event) =>
                                                      setDraft((current) => ({
                                                            ...current,
                                                            seo: { ...current.seo, ogImageUrl: event.target.value },
                                                      }))
                                                }
                                                className="w-full rounded-lg border border-gray-300 px-4 py-2"
                                          />
                                    </div>
                              </div>

                              <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Open Graph description</label>
                                    <textarea
                                          rows={2}
                                          value={draft.seo.ogDescription}
                                          onChange={(event) =>
                                                setDraft((current) => ({
                                                      ...current,
                                                      seo: { ...current.seo, ogDescription: event.target.value },
                                                }))
                                          }
                                          className="w-full rounded-lg border border-gray-300 px-4 py-2"
                                    />
                              </div>

                              <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Custom schema JSON</label>
                                    <textarea
                                          rows={6}
                                          value={draft.seo.schemaJson}
                                          onChange={(event) =>
                                                setDraft((current) => ({
                                                      ...current,
                                                      seo: { ...current.seo, schemaJson: event.target.value },
                                                }))
                                          }
                                          className="w-full rounded-lg border border-gray-300 px-4 py-2 font-mono text-sm"
                                    />
                              </div>

                              <div className="flex flex-wrap gap-4">
                                    <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                                          <input
                                                type="checkbox"
                                                checked={draft.seo.noIndex}
                                                onChange={(event) =>
                                                      setDraft((current) => ({
                                                            ...current,
                                                            seo: { ...current.seo, noIndex: event.target.checked },
                                                      }))
                                                }
                                          />
                                          noindex
                                    </label>
                                    <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                                          <input
                                                type="checkbox"
                                                checked={draft.seo.noFollow}
                                                onChange={(event) =>
                                                      setDraft((current) => ({
                                                            ...current,
                                                            seo: { ...current.seo, noFollow: event.target.checked },
                                                      }))
                                                }
                                          />
                                          nofollow
                                    </label>
                              </div>
                        </section>

                        <section className="rounded-lg bg-white p-6 shadow-md space-y-4">
                              <h2 className="text-xl font-bold text-gray-900">Navigation</h2>
                              <div className="grid gap-4 md:grid-cols-2">
                                    <div className="rounded-lg border border-gray-200 p-4 space-y-3">
                                          <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                                                <input
                                                      type="checkbox"
                                                      checked={draft.nav.showInHeader}
                                                      onChange={(event) =>
                                                            setDraft((current) => ({
                                                                  ...current,
                                                                  nav: { ...current.nav, showInHeader: event.target.checked },
                                                            }))
                                                      }
                                                />
                                                Show in header
                                          </label>
                                          <input
                                                type="text"
                                                value={draft.nav.headerLabel}
                                                onChange={(event) =>
                                                      setDraft((current) => ({
                                                            ...current,
                                                            nav: { ...current.nav, headerLabel: event.target.value },
                                                      }))
                                                }
                                                placeholder="Header label"
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                          />
                                          <input
                                                type="number"
                                                value={draft.nav.headerOrder}
                                                onChange={(event) =>
                                                      setDraft((current) => ({
                                                            ...current,
                                                            nav: {
                                                                  ...current.nav,
                                                                  headerOrder: Number(event.target.value) || 0,
                                                            },
                                                      }))
                                                }
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                          />
                                    </div>

                                    <div className="rounded-lg border border-gray-200 p-4 space-y-3">
                                          <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                                                <input
                                                      type="checkbox"
                                                      checked={draft.nav.showInFooter}
                                                      onChange={(event) =>
                                                            setDraft((current) => ({
                                                                  ...current,
                                                                  nav: { ...current.nav, showInFooter: event.target.checked },
                                                            }))
                                                      }
                                                />
                                                Show in footer
                                          </label>
                                          <input
                                                type="text"
                                                value={draft.nav.footerLabel}
                                                onChange={(event) =>
                                                      setDraft((current) => ({
                                                            ...current,
                                                            nav: { ...current.nav, footerLabel: event.target.value },
                                                      }))
                                                }
                                                placeholder="Footer label"
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                          />
                                          <input
                                                type="number"
                                                value={draft.nav.footerOrder}
                                                onChange={(event) =>
                                                      setDraft((current) => ({
                                                            ...current,
                                                            nav: {
                                                                  ...current.nav,
                                                                  footerOrder: Number(event.target.value) || 0,
                                                            },
                                                      }))
                                                }
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                          />
                                    </div>
                              </div>
                        </section>

                        <section className="rounded-lg bg-white p-6 shadow-md space-y-4">
                              <h2 className="text-xl font-bold text-gray-900">Blocks</h2>
                              <CmsBlockEditor
                                    blocks={draft.blocks}
                                    cmsLinkSuggestions={cmsLinkSuggestions}
                                    onChange={(nextBlocks) =>
                                          setDraft((current) => ({
                                                ...current,
                                                blocks: nextBlocks,
                                          }))
                                    }
                              />
                        </section>

                        <section className="rounded-lg bg-white p-6 shadow-md">
                              <div className="flex flex-wrap gap-3">
                                    <button
                                          type="button"
                                          onClick={() => void handleSaveDraft()}
                                          disabled={saving || publishing}
                                          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                          {saving ? 'Saving...' : 'Save Draft'}
                                    </button>

                                    {page.status !== 'published' ? (
                                          <button
                                                type="button"
                                                onClick={() => void handlePublish()}
                                                disabled={saving || publishing}
                                                className="rounded-lg bg-green-600 px-6 py-3 font-medium text-white hover:bg-green-700 disabled:opacity-50"
                                          >
                                                {publishing ? 'Publishing...' : 'Publish'}
                                          </button>
                                    ) : (
                                          <button
                                                type="button"
                                                onClick={() => void handleUnpublish()}
                                                disabled={saving || publishing}
                                                className="rounded-lg bg-amber-600 px-6 py-3 font-medium text-white hover:bg-amber-700 disabled:opacity-50"
                                          >
                                                {publishing ? 'Updating...' : 'Unpublish'}
                                          </button>
                                    )}

                                    <Link
                                          href={`/admin/pages/${page.id}/preview`}
                                          className="btn-secondary inline-flex items-center"
                                    >
                                          Preview Draft
                                    </Link>
                              </div>
                        </section>
                  </div>
            </div>
      );
}
