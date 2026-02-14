'use client';

import { useState } from 'react';
import { useServices, type Service } from '@/lib/hooks/useDatabase';

interface ServiceListProps {
      services: Service[];
      onEdit: (id: string) => void;
      onRefresh: () => void;
}

export default function ServiceList({ services, onEdit, onRefresh }: ServiceListProps) {
      const { deleteService } = useServices();
      const [loading, setLoading] = useState<string | null>(null);
      const [error, setError] = useState('');

      const handleDelete = async (id: string, title: string) => {
            if (!confirm(`Are you sure you want to delete "${title}"?`)) {
                  return;
            }

            setLoading(id);
            setError('');

            try {
                  await deleteService(id);
                  onRefresh();
            } catch (err) {
                  setError(err instanceof Error ? err.message : 'Failed to delete service');
            } finally {
                  setLoading(null);
            }
      };

      if (services.length === 0) {
            return (
                  <div className="p-8 text-center">
                        <p className="text-gray-600 mb-4">No services yet. Add one to get started!</p>
                  </div>
            );
      }

      return (
            <div>
                  {error && (
                        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6 mx-8 mt-8">
                              {error}
                        </div>
                  )}

                  <div className="overflow-x-auto">
                        <table className="w-full">
                              <thead className="bg-gray-50 border-b">
                                    <tr>
                                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Title</th>
                                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Slug</th>
                                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                                    </tr>
                              </thead>
                              <tbody className="divide-y">
                                    {services.map((service) => (
                                          <tr key={service.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                      <p className="font-medium text-gray-900">{service.title}</p>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700">{service.slug}</td>
                                                <td className="px-6 py-4">
                                                      <span
                                                            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${service.is_active
                                                                        ? 'bg-green-100 text-green-800'
                                                                        : 'bg-gray-100 text-gray-800'
                                                                  }`}
                                                      >
                                                            {service.is_active ? 'Active' : 'Inactive'}
                                                      </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm space-x-3">
                                                      <button
                                                            onClick={() => onEdit(service.id)}
                                                            className="text-primary-600 hover:underline font-medium"
                                                      >
                                                            Edit
                                                      </button>
                                                      <button
                                                            onClick={() => handleDelete(service.id, service.title)}
                                                            disabled={loading === service.id}
                                                            className="text-red-600 hover:underline font-medium disabled:opacity-50"
                                                      >
                                                            {loading === service.id ? 'Deleting...' : 'Delete'}
                                                      </button>
                                                </td>
                                          </tr>
                                    ))}
                              </tbody>
                        </table>
                  </div>
            </div>
      );
}
