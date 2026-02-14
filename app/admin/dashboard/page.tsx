'use client';

import { useEffect } from 'react';
import { useAdmin } from '@/lib/hooks/useAdmin';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
      const { user, isAdmin, loading, error } = useAdmin();
      const router = useRouter();

      useEffect(() => {
            if (!loading && !user) {
                  router.push('/admin/login');
            }
      }, [user, loading, router]);

      if (loading) {
            return (
                  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                        <div className="text-center">
                              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
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
                        <div className="text-center max-w-md mx-auto bg-white shadow rounded-lg p-8">
                              <h1 className="text-2xl font-bold text-gray-900 mb-3">Access denied</h1>
                              <p className="text-gray-600 mb-6">
                                    You are signed in but do not have admin access.
                              </p>
                              {error && (
                                    <p className="text-sm text-red-600 mb-6">
                                          {error}
                                    </p>
                              )}
                              <button
                                    onClick={async () => {
                                          const { getClientAuth } = await import('@/lib/supabase/client');
                                          await getClientAuth().signOut();
                                          router.push('/admin/login');
                                    }}
                                    className="btn-primary"
                              >
                                    Sign Out
                              </button>
                        </div>
                  </div>
            );
      }

      return (
            <div className="min-h-screen bg-gray-50">
                  {/* Header */}
                  <div className="bg-white shadow">
                        <div className="container-custom py-6">
                              <div className="flex justify-between items-center">
                                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                                    <p className="text-gray-600">{user.email}</p>
                              </div>
                        </div>
                  </div>

                  {/* Main Content */}
                  <div className="container-custom py-8">
                        <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
                              {/* Therapists Card */}
                              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                    <div className="bg-primary-600 text-white p-6">
                                          <h2 className="text-2xl font-bold mb-2">Manage Therapists</h2>
                                          <p className="text-primary-100">Add, edit, or remove therapist profiles</p>
                                    </div>
                                    <div className="p-6">
                                          <p className="text-gray-600 mb-6">
                                                Manage your therapy team, update bios, specialties, and profile images.
                                          </p>
                                          <Link
                                                href="/admin/therapists"
                                                className="inline-block btn-primary"
                                          >
                                                Manage Therapists
                                          </Link>
                                    </div>
                              </div>

                              {/* Services Card */}
                              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                    <div className="bg-primary-600 text-white p-6">
                                          <h2 className="text-2xl font-bold mb-2">Manage Services</h2>
                                          <p className="text-primary-100">Add, edit, or remove service offerings</p>
                                    </div>
                                    <div className="p-6">
                                          <p className="text-gray-600 mb-6">
                                                Manage your service catalog, add descriptions, features, and images.
                                          </p>
                                          <Link
                                                href="/admin/services"
                                                className="inline-block btn-primary"
                                          >
                                                Manage Services
                                          </Link>
                                    </div>
                              </div>

                              {/* Pages Card */}
                              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow md:col-span-2">
                                    <div className="bg-primary-600 text-white p-6">
                                          <h2 className="text-2xl font-bold mb-2">Page Builder</h2>
                                          <p className="text-primary-100">Create, edit, preview, and publish SEO-ready pages</p>
                                    </div>
                                    <div className="p-6">
                                          <p className="text-gray-600 mb-6">
                                                Manage custom pages and legal pages with block-based editing, draft workflow, and SEO controls.
                                          </p>
                                          <Link
                                                href="/admin/pages"
                                                className="inline-block btn-primary"
                                          >
                                                Open Page Builder
                                          </Link>
                                    </div>
                              </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
                              <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Links</h3>
                              <ul className="space-y-3">
                                    <li>
                                          <Link href="/" className="text-primary-600 hover:underline font-medium">
                                                ← Back to Website
                                          </Link>
                                    </li>
                                    <li>
                                          <button
                                                onClick={async () => {
                                                      const { getClientAuth } = await import('@/lib/supabase/client');
                                                      await getClientAuth().signOut();
                                                      router.push('/admin/login');
                                                }}
                                                className="text-red-600 hover:underline font-medium"
                                          >
                                                Sign Out
                                          </button>
                                    </li>
                              </ul>
                        </div>
                  </div>
            </div>
      );
}
