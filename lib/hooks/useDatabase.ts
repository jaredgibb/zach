import { useState, useCallback } from 'react';
import { db } from '@/lib/supabase/client';
import {
      collection,
      getDocs,
      addDoc,
      updateDoc,
      deleteDoc,
      doc,
} from 'firebase/firestore';
import type { YooptaContentValue } from '@yoopta/editor';

export interface Therapist {
      id: string;
      name: string;
      credentials: string;
      title: string;
      short_bio: string;
      full_bio: string;
      full_bio_rich: YooptaContentValue | null;
      fun_fact: string | null;
      specialties: string[];
      image_url: string | null;
      slug: string;
      order_index: number;
      is_active: boolean;
      created_at: string;
      updated_at: string;
}

export interface Service {
      id: string;
      title: string;
      slug: string;
      short_description: string;
      full_description: string;
      full_description_rich: YooptaContentValue | null;
      image_url: string | null;
      features: string[];
      order_index: number;
      is_active: boolean;
      created_at: string;
      updated_at: string;
}

interface FetchOptions {
      activeOnly?: boolean;
}

const FALLBACK_ORDER_INDEX = Number.MAX_SAFE_INTEGER;

function toIsoString(value: unknown): string {
      if (typeof value === 'string') {
            return value;
      }

      if (value instanceof Date) {
            return value.toISOString();
      }

      if (
            value &&
            typeof value === 'object' &&
            'toDate' in value &&
            typeof (value as { toDate: () => Date }).toDate === 'function'
      ) {
            return (value as { toDate: () => Date }).toDate().toISOString();
      }

      return '';
}

function toOrderIndex(value: unknown): number {
      if (typeof value === 'number' && Number.isFinite(value)) {
            return value;
      }

      if (typeof value === 'string') {
            const parsed = Number(value);
            if (Number.isFinite(parsed)) {
                  return parsed;
            }
      }

      return FALLBACK_ORDER_INDEX;
}

function toRichContent(value: unknown): YooptaContentValue | null {
      let candidate = value;

      if (typeof candidate === 'string') {
            try {
                  candidate = JSON.parse(candidate);
            } catch {
                  return null;
            }
      }

      if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) {
            return null;
      }

      if (Object.keys(candidate).length === 0) {
            return null;
      }

      return candidate as YooptaContentValue;
}

export function useTherapists() {
      const [therapists, setTherapists] = useState<Therapist[]>([]);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState<string | null>(null);

      const fetchTherapists = useCallback(async (options: FetchOptions = {}) => {
            const activeOnly = options.activeOnly ?? true;
            setLoading(true);
            setError(null);
            try {
                  const therapistsRef = collection(db, 'therapists');
                  const snapshot = await getDocs(therapistsRef);
                  const data = snapshot.docs
                        .map((therapistDoc) => {
                              const raw = therapistDoc.data() as Partial<Therapist>;
                              return {
                                    id: therapistDoc.id,
                                    name: raw.name ?? '',
                                    credentials: raw.credentials ?? '',
                                    title: raw.title ?? '',
                                    short_bio: raw.short_bio ?? '',
                                    full_bio: raw.full_bio ?? '',
                                    full_bio_rich: toRichContent(raw.full_bio_rich),
                                    fun_fact: typeof raw.fun_fact === 'string' ? raw.fun_fact : null,
                                    specialties: Array.isArray(raw.specialties)
                                          ? raw.specialties.filter(
                                                  (item): item is string => typeof item === 'string'
                                            )
                                          : [],
                                    image_url: typeof raw.image_url === 'string' ? raw.image_url : null,
                                    slug: raw.slug ?? '',
                                    order_index: toOrderIndex(raw.order_index),
                                    is_active: raw.is_active === true,
                                    created_at: toIsoString(raw.created_at),
                                    updated_at: toIsoString(raw.updated_at),
                              } as Therapist;
                        })
                        .filter((therapist) => (activeOnly ? therapist.is_active : true))
                        .sort((a, b) => {
                              const orderDiff = a.order_index - b.order_index;
                              if (orderDiff !== 0) {
                                    return orderDiff;
                              }
                              return a.name.localeCompare(b.name);
                        });
                  setTherapists(data);
                  return data;
            } catch (err) {
                  const message = err instanceof Error ? err.message : 'Failed to fetch therapists';
                  setError(message);
                  return [];
            } finally {
                  setLoading(false);
            }
      }, []);

      const addTherapist = useCallback(
            async (therapist: Omit<Therapist, 'id' | 'created_at' | 'updated_at'>) => {
                  try {
                        setError(null);
                        const therapistsRef = collection(db, 'therapists');
                        const now = new Date().toISOString();
                        const docRef = await addDoc(therapistsRef, {
                              ...therapist,
                              created_at: now,
                              updated_at: now,
                        });
                        const newTherapist: Therapist = {
                              id: docRef.id,
                              ...therapist,
                              created_at: now,
                              updated_at: now,
                        };
                        setTherapists((prev) => [...prev, newTherapist]);
                        return newTherapist;
                  } catch (err) {
                        const message = err instanceof Error ? err.message : 'Failed to add therapist';
                        setError(message);
                        throw err;
                  }
            },
            []
      );

      const updateTherapist = useCallback(
            async (id: string, updates: Partial<Therapist>) => {
                  try {
                        setError(null);
                        const therapistRef = doc(db, 'therapists', id);
                        const now = new Date().toISOString();
                        await updateDoc(therapistRef, {
                              ...updates,
                              updated_at: now,
                        });
                        const updated = { ...updates, updated_at: now } as Partial<Therapist>;
                        setTherapists((prev) =>
                              prev.map((t) => (t.id === id ? { ...t, ...updated } : t))
                        );
                        return { id, ...updated };
                  } catch (err) {
                        const message = err instanceof Error ? err.message : 'Failed to update therapist';
                        setError(message);
                        throw err;
                  }
            },
            []
      );

      const deleteTherapist = useCallback(
            async (id: string) => {
                  try {
                        setError(null);
                        const therapistRef = doc(db, 'therapists', id);
                        await deleteDoc(therapistRef);
                        setTherapists((prev) => prev.filter((t) => t.id !== id));
                  } catch (err) {
                        const message = err instanceof Error ? err.message : 'Failed to delete therapist';
                        setError(message);
                        throw err;
                  }
            },
            []
      );

      return {
            therapists,
            loading,
            error,
            fetchTherapists,
            addTherapist,
            updateTherapist,
            deleteTherapist,
      };
}

export function useServices() {
      const [services, setServices] = useState<Service[]>([]);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState<string | null>(null);

      const fetchServices = useCallback(async (options: FetchOptions = {}) => {
            const activeOnly = options.activeOnly ?? true;
            setLoading(true);
            setError(null);
            try {
                  const servicesRef = collection(db, 'services');
                  const snapshot = await getDocs(servicesRef);
                  const data = snapshot.docs
                        .map((serviceDoc) => {
                              const raw = serviceDoc.data() as Partial<Service>;
                              return {
                                    id: serviceDoc.id,
                                    title: raw.title ?? '',
                                    slug: raw.slug ?? '',
                                    short_description: raw.short_description ?? '',
                                    full_description: raw.full_description ?? '',
                                    full_description_rich: toRichContent(raw.full_description_rich),
                                    image_url: typeof raw.image_url === 'string' ? raw.image_url : null,
                                    features: Array.isArray(raw.features)
                                          ? raw.features.filter((item): item is string => typeof item === 'string')
                                          : [],
                                    order_index: toOrderIndex(raw.order_index),
                                    is_active: raw.is_active === true,
                                    created_at: toIsoString(raw.created_at),
                                    updated_at: toIsoString(raw.updated_at),
                              } as Service;
                        })
                        .filter((service) => (activeOnly ? service.is_active : true))
                        .sort((a, b) => {
                              const orderDiff = a.order_index - b.order_index;
                              if (orderDiff !== 0) {
                                    return orderDiff;
                              }
                              return a.title.localeCompare(b.title);
                        });
                  setServices(data);
                  return data;
            } catch (err) {
                  const message = err instanceof Error ? err.message : 'Failed to fetch services';
                  setError(message);
                  return [];
            } finally {
                  setLoading(false);
            }
      }, []);

      const addService = useCallback(
            async (service: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => {
                  try {
                        setError(null);
                        const servicesRef = collection(db, 'services');
                        const now = new Date().toISOString();
                        const docRef = await addDoc(servicesRef, {
                              ...service,
                              created_at: now,
                              updated_at: now,
                        });
                        const newService: Service = {
                              id: docRef.id,
                              ...service,
                              created_at: now,
                              updated_at: now,
                        };
                        setServices((prev) => [...prev, newService]);
                        return newService;
                  } catch (err) {
                        const message = err instanceof Error ? err.message : 'Failed to add service';
                        setError(message);
                        throw err;
                  }
            },
            []
      );

      const updateService = useCallback(
            async (id: string, updates: Partial<Service>) => {
                  try {
                        setError(null);
                        const serviceRef = doc(db, 'services', id);
                        const now = new Date().toISOString();
                        await updateDoc(serviceRef, {
                              ...updates,
                              updated_at: now,
                        });
                        const updated = { ...updates, updated_at: now } as Partial<Service>;
                        setServices((prev) =>
                              prev.map((s) => (s.id === id ? { ...s, ...updated } : s))
                        );
                        return { id, ...updated };
                  } catch (err) {
                        const message = err instanceof Error ? err.message : 'Failed to update service';
                        setError(message);
                        throw err;
                  }
            },
            []
      );

      const deleteService = useCallback(
            async (id: string) => {
                  try {
                        setError(null);
                        const serviceRef = doc(db, 'services', id);
                        await deleteDoc(serviceRef);
                        setServices((prev) => prev.filter((s) => s.id !== id));
                  } catch (err) {
                        const message = err instanceof Error ? err.message : 'Failed to delete service';
                        setError(message);
                        throw err;
                  }
            },
            []
      );

      return {
            services,
            loading,
            error,
            fetchServices,
            addService,
            updateService,
            deleteService,
      };
}
