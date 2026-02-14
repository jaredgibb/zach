'use client';

import { type DragEvent, useEffect, useState } from 'react';
import { useTherapists, type Therapist } from '@/lib/hooks/useDatabase';

interface TherapistListProps {
      therapists: Therapist[];
      onEdit: (id: string) => void;
      onRefresh: () => Promise<unknown> | void;
}

function reorderTherapists(list: Therapist[], sourceId: string, targetId: string): Therapist[] {
      const sourceIndex = list.findIndex((therapist) => therapist.id === sourceId);
      const targetIndex = list.findIndex((therapist) => therapist.id === targetId);

      if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) {
            return list;
      }

      const reordered = [...list];
      const [moved] = reordered.splice(sourceIndex, 1);
      reordered.splice(targetIndex, 0, moved);

      return reordered;
}

export default function TherapistList({ therapists, onEdit, onRefresh }: TherapistListProps) {
      const { deleteTherapist, updateTherapist } = useTherapists();
      const [orderedTherapists, setOrderedTherapists] = useState<Therapist[]>(therapists);
      const [loading, setLoading] = useState<string | null>(null);
      const [error, setError] = useState('');
      const [draggedId, setDraggedId] = useState<string | null>(null);
      const [dragTargetId, setDragTargetId] = useState<string | null>(null);
      const [savingOrder, setSavingOrder] = useState(false);
      const [brokenImageIds, setBrokenImageIds] = useState<Record<string, true>>({});

      useEffect(() => {
            setOrderedTherapists(therapists);
      }, [therapists]);

      const handleDelete = async (id: string, name: string) => {
            if (!confirm(`Are you sure you want to delete ${name}?`)) {
                  return;
            }

            setLoading(id);
            setError('');

            try {
                  await deleteTherapist(id);
                  await Promise.resolve(onRefresh());
            } catch (err) {
                  setError(err instanceof Error ? err.message : 'Failed to delete therapist');
            } finally {
                  setLoading(null);
            }
      };

      const persistOrder = async (nextOrder: Therapist[], previousOrder: Therapist[]) => {
            const previousOrderById = new Map(previousOrder.map((therapist) => [therapist.id, therapist.order_index]));
            const updates = nextOrder
                  .map((therapist, index) => ({ therapistId: therapist.id, orderIndex: index }))
                  .filter(({ therapistId, orderIndex }) => previousOrderById.get(therapistId) !== orderIndex);

            if (updates.length === 0) {
                  return;
            }

            setSavingOrder(true);
            setError('');

            try {
                  await Promise.all(
                        updates.map(({ therapistId, orderIndex }) =>
                              updateTherapist(therapistId, { order_index: orderIndex })
                        )
                  );
                  await Promise.resolve(onRefresh());
            } catch (err) {
                  setOrderedTherapists(previousOrder);
                  setError(err instanceof Error ? err.message : 'Failed to save therapist order');
            } finally {
                  setSavingOrder(false);
            }
      };

      const handleDragStart = (event: DragEvent<HTMLButtonElement>, therapistId: string) => {
            if (savingOrder) {
                  event.preventDefault();
                  return;
            }

            setDraggedId(therapistId);
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('text/plain', therapistId);
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

            const previousOrder = orderedTherapists;
            const reordered = reorderTherapists(previousOrder, sourceId, targetId);

            if (reordered === previousOrder) {
                  return;
            }

            const normalized = reordered.map((therapist, index) => ({
                  ...therapist,
                  order_index: index,
            }));

            setOrderedTherapists(normalized);
            await persistOrder(normalized, previousOrder);
      };

      const handleDragEnd = () => {
            setDraggedId(null);
            setDragTargetId(null);
      };

      if (therapists.length === 0) {
            return (
                  <div className="p-8 text-center">
                        <p className="text-gray-600 mb-4">No therapists yet. Add one to get started!</p>
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
                                    Drag a therapist by the handle to reorder how profiles appear on the site.
                              </p>
                              {savingOrder && (
                                    <p className="text-sm font-medium text-primary-700">Saving order...</p>
                              )}
                        </div>
                  </div>

                  <div className="p-8">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                              {orderedTherapists.map((therapist, index) => {
                                    const isDropTarget = dragTargetId === therapist.id && draggedId !== therapist.id;
                                    const hasImage =
                                          typeof therapist.image_url === 'string' &&
                                          therapist.image_url.length > 0 &&
                                          !brokenImageIds[therapist.id];

                                    return (
                                          <div
                                                key={therapist.id}
                                                onDragEnter={() => {
                                                      if (draggedId && draggedId !== therapist.id) {
                                                            setDragTargetId(therapist.id);
                                                      }
                                                }}
                                                onDragOver={(event) => {
                                                      event.preventDefault();
                                                      event.dataTransfer.dropEffect = 'move';
                                                }}
                                                onDragLeave={() => {
                                                      setDragTargetId((current) =>
                                                            current === therapist.id ? null : current
                                                      );
                                                }}
                                                onDrop={(event) => void handleDrop(event, therapist.id)}
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
                                                                  onDragStart={(event) => handleDragStart(event, therapist.id)}
                                                                  onDragEnd={handleDragEnd}
                                                                  disabled={savingOrder}
                                                                  title="Drag to reorder therapist"
                                                                  aria-label={`Drag to reorder ${therapist.name}`}
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
                                                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${therapist.is_active
                                                                  ? 'bg-green-100 text-green-800'
                                                                  : 'bg-gray-100 text-gray-700'
                                                            }`}
                                                      >
                                                            {therapist.is_active ? 'Active' : 'Inactive'}
                                                      </span>
                                                </div>

                                                <div className="mb-4 h-44 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                                                      {hasImage ? (
                                                            <img
                                                                  src={therapist.image_url ?? ''}
                                                                  alt={`Photo of ${therapist.name}`}
                                                                  className="h-full w-full object-cover"
                                                                  onError={() =>
                                                                        setBrokenImageIds((current) => ({
                                                                              ...current,
                                                                              [therapist.id]: true,
                                                                        }))
                                                                  }
                                                            />
                                                      ) : (
                                                            <div className="flex h-full w-full items-center justify-center text-gray-400">
                                                                  <svg className="h-16 w-16" fill="currentColor" viewBox="0 0 24 24">
                                                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                                                  </svg>
                                                            </div>
                                                      )}
                                                </div>

                                                <div>
                                                      <p className="text-lg font-semibold text-gray-900">{therapist.name}</p>
                                                      <p className="text-sm font-medium text-primary-700">{therapist.credentials}</p>
                                                      <p className="mt-1 text-sm text-gray-700">{therapist.title}</p>
                                                </div>

                                                <div className="mt-5 flex items-center gap-4 text-sm">
                                                      <button
                                                            onClick={() => onEdit(therapist.id)}
                                                            disabled={savingOrder}
                                                            className="font-medium text-primary-600 hover:underline disabled:opacity-50"
                                                      >
                                                            Edit
                                                      </button>
                                                      <button
                                                            onClick={() => handleDelete(therapist.id, therapist.name)}
                                                            disabled={loading === therapist.id || savingOrder}
                                                            className="font-medium text-red-600 hover:underline disabled:opacity-50"
                                                      >
                                                            {loading === therapist.id ? 'Deleting...' : 'Delete'}
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
