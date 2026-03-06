import type { Service, Therapist } from '@/lib/hooks/useDatabase';

export const PUBLIC_THERAPIST_SHORT_BIO_MIN_LENGTH = 40;
export const PUBLIC_THERAPIST_FULL_BIO_MIN_LENGTH = 120;
export const PUBLIC_SERVICE_SHORT_DESCRIPTION_MIN_LENGTH = 50;
export const PUBLIC_SERVICE_FULL_DESCRIPTION_MIN_LENGTH = 120;
export const PUBLIC_SERVICE_MIN_FEATURE_COUNT = 2;

const TEST_VALUE_PATTERNS = [
      /\basdf\b/i,
      /\btest\b/i,
      /\bdemo\b/i,
      /\btemp\b/i,
      /\bdummy\b/i,
      /\bplaceholder\b/i,
      /\btbd\b/i,
      /\btodo\b/i,
      /\bsample\b/i,
      /\blorem\b/i,
];

function normalizeValue(value: string | null | undefined): string {
      return typeof value === 'string' ? value.trim() : '';
}

function hasRichContent(value: unknown): boolean {
      return Boolean(value && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length > 0);
}

function isMeaningfulValue(value: string): boolean {
      const normalized = normalizeValue(value);
      if (!normalized) {
            return false;
      }

      return !TEST_VALUE_PATTERNS.some((pattern) => pattern.test(normalized));
}

export function looksLikeTestValue(value: string | null | undefined): boolean {
      const normalized = normalizeValue(value);
      if (!normalized) {
            return true;
      }

      return !isMeaningfulValue(normalized);
}

export function getMeaningfulList(values: Array<string | null | undefined>): string[] {
      return values
            .map((value) => normalizeValue(value))
            .filter((value) => isMeaningfulValue(value));
}

export function getPrimaryTherapistSpecialty(therapist: Pick<Therapist, 'specialties'>): string | null {
      return getMeaningfulList(therapist.specialties ?? [])[0] ?? null;
}

export function getPublicTherapistValidationErrors(
      therapist: Pick<Therapist, 'name' | 'slug' | 'credentials' | 'title' | 'short_bio' | 'full_bio' | 'full_bio_rich' | 'specialties'>
): string[] {
      const errors: string[] = [];
      const name = normalizeValue(therapist.name);
      const slug = normalizeValue(therapist.slug);
      const credentials = normalizeValue(therapist.credentials);
      const title = normalizeValue(therapist.title);
      const shortBio = normalizeValue(therapist.short_bio);
      const fullBio = normalizeValue(therapist.full_bio);
      const specialties = getMeaningfulList(therapist.specialties ?? []);
      const hasDetailedBio = fullBio.length >= PUBLIC_THERAPIST_FULL_BIO_MIN_LENGTH || hasRichContent(therapist.full_bio_rich);

      if (name.length < 5 || looksLikeTestValue(name)) {
            errors.push('Active therapist profiles need a real full name.');
      }

      if (slug.length < 2) {
            errors.push('Active therapist profiles need a URL slug.');
      }

      if (credentials.length < 2 || looksLikeTestValue(credentials)) {
            errors.push('Active therapist profiles need credentials.');
      }

      if (title.length < 8 || looksLikeTestValue(title)) {
            errors.push('Active therapist profiles need a professional title.');
      }

      if (shortBio.length < PUBLIC_THERAPIST_SHORT_BIO_MIN_LENGTH || looksLikeTestValue(shortBio)) {
            errors.push(`Active therapist profiles need a short bio of at least ${PUBLIC_THERAPIST_SHORT_BIO_MIN_LENGTH} characters.`);
      }

      if (!hasDetailedBio) {
            errors.push(`Active therapist profiles need a fuller biography of at least ${PUBLIC_THERAPIST_FULL_BIO_MIN_LENGTH} characters or rich-text content.`);
      }

      if (specialties.length === 0) {
            errors.push('Active therapist profiles need at least one specialty.');
      }

      return errors;
}

export function isTherapistReadyForPublicDisplay(
      therapist: Pick<Therapist, 'name' | 'slug' | 'credentials' | 'title' | 'short_bio' | 'full_bio' | 'full_bio_rich' | 'specialties' | 'is_active'>
): boolean {
      if (!therapist.is_active) {
            return false;
      }

      return getPublicTherapistValidationErrors(therapist).length === 0;
}

export function getPublicServiceValidationErrors(
      service: Pick<Service, 'title' | 'slug' | 'short_description' | 'full_description' | 'full_description_rich' | 'features'>
): string[] {
      const errors: string[] = [];
      const title = normalizeValue(service.title);
      const slug = normalizeValue(service.slug);
      const shortDescription = normalizeValue(service.short_description);
      const fullDescription = normalizeValue(service.full_description);
      const features = getMeaningfulList(service.features ?? []);
      const hasDetailedDescription =
            fullDescription.length >= PUBLIC_SERVICE_FULL_DESCRIPTION_MIN_LENGTH ||
            hasRichContent(service.full_description_rich) ||
            features.length >= PUBLIC_SERVICE_MIN_FEATURE_COUNT;

      if (title.length < 4 || looksLikeTestValue(title)) {
            errors.push('Active services need a real service title.');
      }

      if (slug.length < 2) {
            errors.push('Active services need a URL slug.');
      }

      if (shortDescription.length < PUBLIC_SERVICE_SHORT_DESCRIPTION_MIN_LENGTH || looksLikeTestValue(shortDescription)) {
            errors.push(`Active services need a short description of at least ${PUBLIC_SERVICE_SHORT_DESCRIPTION_MIN_LENGTH} characters.`);
      }

      if (!hasDetailedDescription) {
            errors.push(`Active services need a fuller description of at least ${PUBLIC_SERVICE_FULL_DESCRIPTION_MIN_LENGTH} characters or at least ${PUBLIC_SERVICE_MIN_FEATURE_COUNT} feature bullets.`);
      }

      return errors;
}

export function isServiceReadyForPublicDisplay(
      service: Pick<Service, 'title' | 'slug' | 'short_description' | 'full_description' | 'full_description_rich' | 'features' | 'is_active'>
): boolean {
      if (!service.is_active) {
            return false;
      }

      return getPublicServiceValidationErrors(service).length === 0;
}
