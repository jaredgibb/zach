import 'server-only';

import { adminDb } from '@/lib/firebase/admin';
import { buildSiteUrl } from '@/lib/cms/server';
import { businessInfo } from '@/lib/data';
import {
      getMeaningfulList,
      isServiceReadyForPublicDisplay,
      isTherapistReadyForPublicDisplay,
} from '@/lib/publicContent';
import type { Service, Therapist } from '@/lib/hooks/useDatabase';

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

function toRichContent<T>(value: unknown): T | null {
      let candidate = value;

      if (typeof candidate === 'string') {
            try {
                  candidate = JSON.parse(candidate);
            } catch {
                  return null;
            }
      }

      if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate) || Object.keys(candidate).length === 0) {
            return null;
      }

      return candidate as T;
}

function mapTherapist(snapshot: FirebaseFirestore.QueryDocumentSnapshot | FirebaseFirestore.DocumentSnapshot): Therapist | null {
      const raw = snapshot.data() as Partial<Therapist> | undefined;
      if (!raw) {
            return null;
      }

      return {
            id: snapshot.id,
            name: raw.name ?? '',
            credentials: raw.credentials ?? '',
            title: raw.title ?? '',
            short_bio: raw.short_bio ?? '',
            full_bio: raw.full_bio ?? '',
            full_bio_rich: toRichContent(raw.full_bio_rich),
            fun_fact: typeof raw.fun_fact === 'string' ? raw.fun_fact : null,
            specialties: Array.isArray(raw.specialties)
                  ? raw.specialties.filter((item): item is string => typeof item === 'string')
                  : [],
            image_url: typeof raw.image_url === 'string' ? raw.image_url : null,
            slug: raw.slug ?? '',
            order_index: toOrderIndex(raw.order_index),
            is_active: raw.is_active === true,
            created_at: toIsoString(raw.created_at),
            updated_at: toIsoString(raw.updated_at),
      };
}

function mapService(snapshot: FirebaseFirestore.QueryDocumentSnapshot | FirebaseFirestore.DocumentSnapshot): Service | null {
      const raw = snapshot.data() as Partial<Service> | undefined;
      if (!raw) {
            return null;
      }

      return {
            id: snapshot.id,
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
      };
}

function sortTherapists(a: Therapist, b: Therapist): number {
      const orderDiff = a.order_index - b.order_index;
      if (orderDiff !== 0) {
            return orderDiff;
      }

      return a.name.localeCompare(b.name);
}

function sortServices(a: Service, b: Service): number {
      const orderDiff = a.order_index - b.order_index;
      if (orderDiff !== 0) {
            return orderDiff;
      }

      return a.title.localeCompare(b.title);
}

export async function getPublicTherapists(): Promise<Therapist[]> {
      try {
            const snapshot = await adminDb.collection('therapists').where('is_active', '==', true).get();
            return snapshot.docs
                  .map((docSnapshot) => mapTherapist(docSnapshot))
                  .filter((therapist): therapist is Therapist => therapist !== null)
                  .filter((therapist) => isTherapistReadyForPublicDisplay(therapist))
                  .sort(sortTherapists);
      } catch {
            return [];
      }
}

export async function getPublicServices(): Promise<Service[]> {
      try {
            const snapshot = await adminDb.collection('services').where('is_active', '==', true).get();
            return snapshot.docs
                  .map((docSnapshot) => mapService(docSnapshot))
                  .filter((service): service is Service => service !== null)
                  .filter((service) => isServiceReadyForPublicDisplay(service))
                  .sort(sortServices);
      } catch {
            return [];
      }
}

export async function getPublicContentCollections(): Promise<{ therapists: Therapist[]; services: Service[] }> {
      const [therapists, services] = await Promise.all([getPublicTherapists(), getPublicServices()]);

      return {
            therapists,
            services,
      };
}

export async function getPublicTherapistBySlug(slug: string): Promise<Therapist | null> {
      try {
            const snapshot = await adminDb.collection('therapists').where('slug', '==', slug).limit(1).get();
            if (snapshot.empty) {
                  return null;
            }

            const therapist = mapTherapist(snapshot.docs[0]);
            if (!therapist || !isTherapistReadyForPublicDisplay(therapist)) {
                  return null;
            }

            return therapist;
      } catch {
            return null;
      }
}

export async function getPublicServiceBySlug(slug: string): Promise<Service | null> {
      try {
            const snapshot = await adminDb.collection('services').where('slug', '==', slug).limit(1).get();
            if (snapshot.empty) {
                  return null;
            }

            const service = mapService(snapshot.docs[0]);
            if (!service || !isServiceReadyForPublicDisplay(service)) {
                  return null;
            }

            return service;
      } catch {
            return null;
      }
}

function buildPostalAddress() {
      return {
            '@type': 'PostalAddress',
            streetAddress: businessInfo.address,
            addressLocality: businessInfo.city,
            addressRegion: businessInfo.state,
            postalCode: businessInfo.zip,
            addressCountry: 'US',
      };
}

export function buildPracticeLocalBusinessSchema(description: string) {
      return {
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            '@id': buildSiteUrl('/#local-business'),
            name: businessInfo.name,
            url: buildSiteUrl('/'),
            telephone: businessInfo.phone,
            email: businessInfo.email,
            description,
            areaServed: ['Kalamazoo, MI', 'Michigan'],
            address: buildPostalAddress(),
      };
}

export function buildBreadcrumbSchema(items: Array<{ name: string; path: string }>) {
      return {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: items.map((item, index) => ({
                  '@type': 'ListItem',
                  position: index + 1,
                  name: item.name,
                  item: buildSiteUrl(item.path),
            })),
      };
}

export function buildTherapistPersonSchema(therapist: Therapist) {
      const specialties = getMeaningfulList(therapist.specialties);
      const description = therapist.short_bio || therapist.full_bio;

      return {
            '@context': 'https://schema.org',
            '@type': 'Person',
            '@id': buildSiteUrl(`/therapists/${therapist.slug}#person`),
            name: therapist.name,
            url: buildSiteUrl(`/therapists/${therapist.slug}`),
            description,
            image: therapist.image_url || undefined,
            jobTitle: therapist.title,
            knowsAbout: specialties.length > 0 ? specialties : undefined,
            worksFor: {
                  '@type': 'Organization',
                  name: businessInfo.name,
                  url: buildSiteUrl('/'),
            },
      };
}

export function buildTherapyServiceSchema(service: Service) {
      const description = service.short_description || service.full_description;

      return {
            '@context': 'https://schema.org',
            '@type': 'Service',
            '@id': buildSiteUrl(`/services/${service.slug}#service`),
            name: service.title,
            serviceType: service.title,
            url: buildSiteUrl(`/services/${service.slug}`),
            description,
            areaServed: ['Kalamazoo, MI', 'Michigan'],
            provider: {
                  '@type': 'LocalBusiness',
                  name: businessInfo.name,
                  url: buildSiteUrl('/'),
                  telephone: businessInfo.phone,
                  address: buildPostalAddress(),
            },
      };
}
