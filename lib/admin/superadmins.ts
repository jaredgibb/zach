export const SUPERADMIN_EMAILS = [
      'zach@diversifiedpsychservices.com',
      'jared.gibb@gmail.com',
] as const;

export function normalizeAdminEmail(email: string): string {
      return email.trim().toLowerCase();
}

export function isSuperAdminEmail(email?: string | null): boolean {
      if (!email) {
            return false;
      }

      const normalized = normalizeAdminEmail(email);
      return SUPERADMIN_EMAILS.includes(normalized as (typeof SUPERADMIN_EMAILS)[number]);
}
