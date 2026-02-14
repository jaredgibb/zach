'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAdmin } from '@/lib/hooks/useAdmin';
import { useServices } from '@/lib/hooks/useDatabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ServiceForm from '@/components/admin/ServiceForm';
import ServiceList from '@/components/admin/ServiceList';
import { Modal } from '@/components/Modal';

export default function ServicesAdminPage() {
      const { user, isAdmin, loading: authLoading, error } = useAdmin();
      const { services, loading, error: servicesError, fetchServices } = useServices();
      const [showForm, setShowForm] = useState(false);
      const [editingId, setEditingId] = useState<string | null>(null);
      const router = useRouter();
      const nextOrderIndex = services.length;
      const selectedService = editingId
            ? services.find((service) => service.id === editingId) ?? null
            : null;

      const refreshServices = useCallback(
            () => fetchServices({ activeOnly: false }),
            [fetchServices]
      );

      const closeForm = () => {
            setShowForm(false);
            setEditingId(null);
      };

      const openAddForm = () => {
            setEditingId(null);
            setShowForm(true);
      };

      const openEditForm = (id: string) => {
            setEditingId(id);
            setShowForm(true);
      };

      useEffect(() => {
            if (!authLoading && !user) {
                  router.push('/admin/login');
            }
      }, [user, authLoading, router]);

      useEffect(() => {
            if (user && isAdmin) {
                  refreshServices();
            }
      }, [user, isAdmin, refreshServices]);

      if (authLoading || loading) {
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
                              <div className="flex justify-between items-center mb-4">
                                    <div>
                                          <Link href="/admin/dashboard" className="text-primary-600 hover:underline text-sm mb-2 inline-block">
                                                ← Back to Dashboard
                                          </Link>
                                          <h1 className="text-3xl font-bold text-gray-900">Manage Services</h1>
                                    </div>
                                    <button
                                          onClick={() => (showForm ? closeForm() : openAddForm())}
                                          className="btn-primary"
                                    >
                                          {showForm ? 'Close Form' : '+ Add Service'}
                                    </button>
                              </div>
                        </div>
                  </div>

                  {/* Main Content */}
                  <div className="container-custom py-8">
                        {servicesError && (
                              <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                                    {servicesError}
                              </div>
                        )}

                        <div className="bg-white rounded-lg shadow-md">
                              <ServiceList
                                    services={services}
                                    onEdit={openEditForm}
                                    onRefresh={refreshServices}
                              />
                        </div>
                  </div>

                  <Modal
                        isOpen={showForm}
                        onClose={closeForm}
                        title={editingId ? 'Edit Service' : 'Add New Service'}
                  >
                        <ServiceForm
                              key={editingId ?? 'new-service'}
                              serviceId={editingId}
                              initialService={selectedService}
                              nextOrderIndex={nextOrderIndex}
                              onSuccess={() => {
                                    closeForm();
                                    refreshServices();
                              }}
                        />
                  </Modal>
            </div>
      );
}
