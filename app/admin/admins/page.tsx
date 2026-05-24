'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { cmsAdminRequest } from '@/lib/cms/admin-client';
import { useAdmin } from '@/lib/hooks/useAdmin';

interface AdminListItem {
      uid: string | null;
      email: string;
      role: 'superadmin' | 'admin';
      active: boolean;
      canRemove: boolean;
      createdAt: string | null;
      updatedAt: string | null;
}

interface AdminListResponse {
      admins: AdminListItem[];
}

export default function AdminUsersPage() {
      const router = useRouter();
      const { user, isAdmin, isSuperAdmin, loading: authLoading, error: adminError } = useAdmin();
      const [admins, setAdmins] = useState<AdminListItem[]>([]);
      const [emailInput, setEmailInput] = useState('');
      const [loading, setLoading] = useState(false);
      const [saving, setSaving] = useState(false);
      const [removingUid, setRemovingUid] = useState<string | null>(null);
      const [error, setError] = useState('');
      const [notice, setNotice] = useState('');

      useEffect(() => {
            if (!authLoading && !user) {
                  router.push('/admin/login');
            }
      }, [authLoading, router, user]);

      const loadAdmins = useCallback(async () => {
            setLoading(true);
            setError('');

            try {
                  const payload = await cmsAdminRequest<AdminListResponse>('/api/admin/admins');
                  setAdmins(payload.admins ?? []);
            } catch (requestError) {
                  setError(requestError instanceof Error ? requestError.message : 'Failed to load admins.');
            } finally {
                  setLoading(false);
            }
      }, []);

      useEffect(() => {
            if (user && isSuperAdmin) {
                  void loadAdmins();
            }
      }, [isSuperAdmin, loadAdmins, user]);

      const sortedAdmins = useMemo(
            () => [...admins].sort((first, second) => {
                  if (first.role !== second.role) {
                        return first.role === 'superadmin' ? -1 : 1;
                  }

                  return first.email.localeCompare(second.email);
            }),
            [admins]
      );

      const handleAddAdmin = async (event: React.FormEvent) => {
            event.preventDefault();
            setError('');
            setNotice('');

            const email = emailInput.trim().toLowerCase();
            if (!email) {
                  setError('Email is required.');
                  return;
            }

            setSaving(true);

            try {
                  await cmsAdminRequest('/api/admin/admins', {
                        method: 'POST',
                        body: JSON.stringify({ email }),
                  });
                  setEmailInput('');
                  setNotice(`${email} has admin access.`);
                  await loadAdmins();
            } catch (requestError) {
                  setError(requestError instanceof Error ? requestError.message : 'Failed to add admin.');
            } finally {
                  setSaving(false);
            }
      };

      const handleRemoveAdmin = async (admin: AdminListItem) => {
            if (!admin.uid || !admin.canRemove) {
                  return;
            }

            if (!confirm(`Remove admin access for ${admin.email}?`)) {
                  return;
            }

            setRemovingUid(admin.uid);
            setError('');
            setNotice('');

            try {
                  await cmsAdminRequest(`/api/admin/admins/${admin.uid}`, { method: 'DELETE' });
                  setNotice(`${admin.email} no longer has admin access.`);
                  await loadAdmins();
            } catch (requestError) {
                  setError(requestError instanceof Error ? requestError.message : 'Failed to remove admin.');
            } finally {
                  setRemovingUid(null);
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

      if (!isAdmin || !isSuperAdmin) {
            return (
                  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                        <div className="max-w-md rounded-lg bg-white p-8 text-center shadow">
                              <h1 className="mb-3 text-2xl font-bold text-gray-900">Access denied</h1>
                              <p className="mb-4 text-gray-600">Only superadmins can manage admin access.</p>
                              {adminError && <p className="text-sm text-red-600">{adminError}</p>}
                              <Link href="/admin/dashboard" className="mt-6 inline-block text-primary-600 hover:underline">
                                    Back to Dashboard
                              </Link>
                        </div>
                  </div>
            );
      }

      return (
            <div className="min-h-screen bg-gray-50">
                  <div className="bg-white shadow">
                        <div className="container-custom py-6">
                              <Link href="/admin/dashboard" className="text-primary-600 hover:underline text-sm mb-2 inline-block">
                                    Back to Dashboard
                              </Link>
                              <h1 className="text-3xl font-bold text-gray-900">Admin Users</h1>
                        </div>
                  </div>

                  <div className="container-custom py-8 space-y-8">
                        {error && (
                              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800">
                                    {error}
                              </div>
                        )}

                        {notice && (
                              <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-800">
                                    {notice}
                              </div>
                        )}

                        <section className="rounded-lg bg-white p-6 shadow-md">
                              <h2 className="text-xl font-bold text-gray-900 mb-4">Add Admin</h2>
                              <form onSubmit={handleAddAdmin} className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
                                    <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="admin-email">
                                                Email address
                                          </label>
                                          <input
                                                id="admin-email"
                                                type="email"
                                                value={emailInput}
                                                onChange={(event) => setEmailInput(event.target.value)}
                                                className="w-full rounded-lg border border-gray-300 px-4 py-2"
                                                placeholder="admin@example.com"
                                                required
                                          />
                                    </div>
                                    <button
                                          type="submit"
                                          disabled={saving}
                                          className="btn-primary h-[42px] px-5 py-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                          {saving ? 'Adding...' : 'Add Admin'}
                                    </button>
                              </form>
                        </section>

                        <section className="rounded-lg bg-white p-6 shadow-md">
                              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                    <h2 className="text-xl font-bold text-gray-900">Current Admins</h2>
                                    <button
                                          type="button"
                                          onClick={() => void loadAdmins()}
                                          disabled={loading}
                                          className="text-sm font-medium text-primary-600 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                          Refresh
                                    </button>
                              </div>

                              {sortedAdmins.length === 0 ? (
                                    <p className="text-gray-600">No admin users found.</p>
                              ) : (
                                    <div className="overflow-x-auto">
                                          <table className="w-full min-w-[720px] text-left">
                                                <thead>
                                                      <tr className="border-b border-gray-200 text-sm text-gray-600">
                                                            <th className="py-3 pr-4 font-medium">Email</th>
                                                            <th className="py-3 pr-4 font-medium">Role</th>
                                                            <th className="py-3 pr-4 font-medium">Status</th>
                                                            <th className="py-3 pr-4 font-medium">Updated</th>
                                                            <th className="py-3 font-medium">Actions</th>
                                                      </tr>
                                                </thead>
                                                <tbody>
                                                      {sortedAdmins.map((admin) => (
                                                            <tr key={admin.uid ?? admin.email} className="border-b border-gray-100 text-sm">
                                                                  <td className="py-3 pr-4 font-semibold text-gray-900">{admin.email}</td>
                                                                  <td className="py-3 pr-4">
                                                                        <span
                                                                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                                                    admin.role === 'superadmin'
                                                                                          ? 'bg-primary-100 text-primary-800'
                                                                                          : 'bg-gray-100 text-gray-700'
                                                                              }`}
                                                                        >
                                                                              {admin.role === 'superadmin' ? 'Superadmin' : 'Admin'}
                                                                        </span>
                                                                  </td>
                                                                  <td className="py-3 pr-4">
                                                                        <span className="inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-800">
                                                                              {admin.canRemove ? 'Active' : 'Locked'}
                                                                        </span>
                                                                  </td>
                                                                  <td className="py-3 pr-4 text-gray-600">
                                                                        {admin.updatedAt ? new Date(admin.updatedAt).toLocaleString() : '-'}
                                                                  </td>
                                                                  <td className="py-3">
                                                                        <button
                                                                              type="button"
                                                                              onClick={() => void handleRemoveAdmin(admin)}
                                                                              disabled={!admin.uid || !admin.canRemove || removingUid === admin.uid}
                                                                              className="text-sm font-medium text-red-600 hover:underline disabled:cursor-not-allowed disabled:text-gray-400 disabled:no-underline"
                                                                        >
                                                                              {removingUid === admin.uid ? 'Removing...' : 'Remove'}
                                                                        </button>
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
