'use client';

import { type DragEvent, useEffect, useState } from 'react';
import { useServices, type Service } from '@/lib/hooks/useDatabase';

interface ServiceListProps {
      services: Service[];
      onEdit: (id: string) => void;
      onRefresh: () => Promise<unknown> | void;
}

function reorderServices(list: Service[], sourceId: string, targetId: string): Service[] {
      const sourceIndex = list.findIndex((service) => service.id === sourceId);
      const targetIndex = list.findIndex((service) => service.id === targetId);

      if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) {
            return list;
      }

      const reordered = [...list];
      const [moved] = reordered.splice(sourceIndex, 1);
      reordered.splice(targetIndex, 0, moved);

      return reordered;
}

export default function ServiceList({ services, onEdit, onRefresh }: ServiceListProps) {
      const { deleteService, updateService } = useServices();
      const [orderedServices, setOrderedServices] = useState<Service[]>(services);
      const [loading, setLoading] = useState<string | null>(null);
      const [error, setError] = useState('');
      const [draggedId, setDraggedId] = useState<string | null>(null);
      const [dragTargetId, setDragTargetId] = useState<string | null>(null);
      const [savingOrder, setSavingOrder] = useState(false);
      const [brokenImageIds, setBrokenImageIds] = useState<Record<string, true>>({});

      useEffect(() => {
            setOrderedServices(services);
      }, [services]);

      const handleDelete = async (id: string, title: string) => {
            if (!confirm(`Are you sure you want to delete "${title}"?`)) {
                  return;
            }

            setLoading(id);
            setError('');

            try {
                  await deleteService(id);
                  await Promise.resolve(onRefresh());
            } catch (err) {
                  setError(err instanceof Error ? err.message : 'Failed to delete service');
            } finally {
                  setLoading(null);
            }
      };

      const persistOrder = async (nextOrder: Service[], previousOrder: Service[]) => {
            const previousOrderById = new Map(previousOrder.map((service) => [service.id, service.order_index]));
            const updates = nextOrder
                  .map((service, index) => ({ serviceId: service.id, orderIndex: index }))
                  .filter(({ serviceId, orderIndex }) => previousOrderById.get(serviceId) !== orderIndex);

            if (updates.length === 0) {
                  return;
            }

            setSavingOrder(true);
            setError('');

            try {
                  await Promise.all(
                        updates.map(({ serviceId, orderIndex }) =>
                              updateService(serviceId, { order_index: orderIndex })
                        )
                  );
                  await Promise.resolve(onRefresh());
            } catch (err) {
                  setOrderedServices(previousOrder);
                  setError(err instanceof Error ? err.message : 'Failed to save service order');
            } finally {
                  setSavingOrder(false);
            }
      };

      const handleDragStart = (event: DragEvent<HTMLButtonElement>, serviceId: string) => {
            if (savingOrder) {
                  event.preventDefault();
                  return;
            }

            setDraggedId(serviceId);
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('text/plain', serviceId);
      };

      const handleDrop = async (event: DragEvent<HTMLDivElement>, targetId: string) => {
            event.preventDefault();

            if (savingOrder) {
                  return;
            }

            const sourceId = draggedId ?? event.dataTransfer.getData('text/plain');
            setDragTargetId(null);
            setDraggedId(null);

            if (!sourceId || sourceId === targetId) {
                  return;
            }

            const previousOrder = orderedServices;
            const reordered = reorderServices(previousOrder, sourceId, targetId);

            if (reordered === previousOrder) {
                  return;
            }

            const normalized = reordered.map((service, index) => ({
                  ...service,
                  order_index: index,
            }));

            setOrderedServices(normalized);
            await persistOrder(normalized, previousOrder);
      };

      const handleDragEnd = () => {
            setDraggedId(null);
            setDragTargetId(null);
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

                  <div className="px-8 pt-8">
                        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                              <p className="text-sm text-gray-600">
                                    Drag a service by the handle to reorder how items appear on the site.
                              </p>
                              {savingOrder && (
                                    <p className="text-sm font-medium text-primary-700">Saving order...</p>
                              )}
                        </div>
                  </div>

                  <div className="p-8">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                              {orderedServices.map((service, index) => {
                                    const isDropTarget = dragTargetId === service.id && draggedId !== service.id;
                                    const hasImage =
                                          typeof service.image_url === 'string' &&
                                          service.image_url.length > 0 &&
                                          !brokenImageIds[service.id];

                                    return (
                                          <div
                                                key={service.id}
                                                onDragEnter={() => {
                                                      if (draggedId && draggedId !== service.id) {
                                                            setDragTargetId(service.id);
                                                      }
                                                }}
                                                onDragOver={(event) => {
                                                      event.preventDefault();
                                                      event.dataTransfer.dropEffect = 'move';
                                                }}
                                                onDragLeave={() => {
                                                      setDragTargetId((current) =>
                                                            current === service.id ? null : current
                                                      );
                                                }}
                                                onDrop={(event) => void handleDrop(event, service.id)}
                                                className={`rounded-xl border bg-white p-5 shadow-sm transition ${isDropTarget
                                                      ? 'border-primary-500 ring-2 ring-primary-100'
                                                      : 'border-gray-200'
                                                }`}
                                          >
                                                <div className="mb-4 flex items-start justify-between gap-3">
                                                      <div className="flex items-center gap-3">
                                                            <button
                                                                  type="button"
                                                                  draggable
                                                                  onDragStart={(event) => handleDragStart(event, service.id)}
                                                                  onDragEnd={handleDragEnd}
                                                                  disabled={savingOrder}
                                                                  title="Drag to reorder service"
                                                                  aria-label={`Drag to reorder ${service.title}`}
                                                                  className="inline-flex h-9 w-9 cursor-grab items-center justify-center rounded-md border border-gray-300 text-gray-500 transition hover:border-primary-500 hover:text-primary-600 active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-50"
                                                            >
                                                                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6h8M8 12h8M8 18h8" />
                                                                  </svg>
                                                            </button>
                                                            <div>
                                                                  <p className="text-sm font-medium text-gray-500">
                                                                        Position #{index + 1}
                                                                  </p>
                                                            </div>
                                                      </div>
                                                      <span
                                                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${service.is_active
                                                                  ? 'bg-green-100 text-green-800'
                                                                  : 'bg-gray-100 text-gray-700'
                                                            }`}
                                                      >
                                                            {service.is_active ? 'Active' : 'Inactive'}
                                                      </span>
                                                </div>

                                                <div className="mb-4 h-44 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                                                      {hasImage ? (
                                                            <img
                                                                  src={service.image_url ?? ''}
                                                                  alt={service.title}
                                                                  className="h-full w-full object-cover"
                                                                  onError={() =>
                                                                        setBrokenImageIds((current) => ({
                                                                              ...current,
                                                                              [service.id]: true,
                                                                        }))
                                                                  }
                                                            />
                                                      ) : (
                                                            <div className="flex h-full w-full items-center justify-center text-gray-400">
                                                                  <svg className="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5.75 6.75h12.5a1 1 0 011 1v8.5a1 1 0 01-1 1H5.75a1 1 0 01-1-1v-8.5a1 1 0 011-1z" />
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8.25 10.5h7.5M8.25 13.5h5" />
                                                                  </svg>
                                                            </div>
                                                      )}
                                                </div>

                                                <div>
                                                      <p className="text-lg font-semibold text-gray-900">{service.title}</p>
                                                      <p className="text-sm font-medium text-primary-700">/{service.slug}</p>
                                                      <p className="mt-1 text-sm text-gray-700">{service.short_description}</p>
                                                </div>

                                                {service.features.length > 0 && (
                                                      <p className="mt-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                                                            {service.features.length} feature{service.features.length === 1 ? '' : 's'}
                                                      </p>
                                                )}

                                                <div className="mt-5 flex items-center gap-4 text-sm">
                                                      <button
                                                            onClick={() => onEdit(service.id)}
                                                            disabled={savingOrder}
                                                            className="font-medium text-primary-600 hover:underline disabled:opacity-50"
                                                      >
                                                            Edit
                                                      </button>
                                                      <button
                                                            onClick={() => handleDelete(service.id, service.title)}
                                                            disabled={loading === service.id || savingOrder}
                                                            className="font-medium text-red-600 hover:underline disabled:opacity-50"
                                                      >
                                                            {loading === service.id ? 'Deleting...' : 'Delete'}
                                                      </button>
                                                </div>
                                          </div>
                                    );
                              })}
                        </div>
                  </div>
            </div>
      );
}
