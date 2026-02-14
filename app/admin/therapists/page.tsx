'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAdmin } from '@/lib/hooks/useAdmin';
import { useTherapists } from '@/lib/hooks/useDatabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import TherapistForm from '@/components/admin/TherapistForm';
import TherapistList from '@/components/admin/TherapistList';
import { Modal } from '@/components/Modal';

export default function TherapistsAdminPage() {
      const { user, isAdmin, loading: authLoading, error } = useAdmin();
      const { therapists, loading, error: therapistsError, fetchTherapists } = useTherapists();
      const [showForm, setShowForm] = useState(false);
      const [editingId, setEditingId] = useState<string | null>(null);
      const router = useRouter();
      const nextOrderIndex = therapists.length;
      const selectedTherapist = editingId
            ? therapists.find((therapist) => therapist.id === editingId) ?? null
            : null;

      const refreshTherapists = useCallback(
            () => fetchTherapists({ activeOnly: false }),
            [fetchTherapists]
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
                  refreshTherapists();
            }
      }, [user, isAdmin, refreshTherapists]);

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
                                          const { auth } = await import('@/lib/supabase/client');
                                          await auth.signOut();
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
                                          <h1 className="text-3xl font-bold text-gray-900">Manage Therapists</h1>
                                    </div>
                                    <button
                                          onClick={() => (showForm ? closeForm() : openAddForm())}
                                          className="btn-primary"
                                    >
                                          {showForm ? 'Close Form' : '+ Add Therapist'}
                                    </button>
                              </div>
                        </div>
                  </div>

                  {/* Main Content */}
                  <div className="container-custom py-8">
                        {therapistsError && (
                              <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                                    {therapistsError}
                              </div>
                        )}

                        <div className="bg-white rounded-lg shadow-md">
                              <TherapistList
                                    therapists={therapists}
                                    onEdit={openEditForm}
                                    onRefresh={refreshTherapists}
                              />
                        </div>
                  </div>

                  <Modal
                        isOpen={showForm}
                        onClose={closeForm}
                        title={editingId ? 'Edit Therapist' : 'Add New Therapist'}
                  >
                        <TherapistForm
                              key={editingId ?? 'new-therapist'}
                              therapistId={editingId}
                              initialTherapist={selectedTherapist}
                              nextOrderIndex={nextOrderIndex}
                              onSuccess={() => {
                                    closeForm();
                                    refreshTherapists();
                              }}
                        />
                  </Modal>
            </div>
      );
}
