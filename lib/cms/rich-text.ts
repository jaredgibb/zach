export function escapeHtml(value: string): string {
      return value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
}

export function plainTextToHtml(value: string): string {
      const normalized = value.trim();
      if (!normalized) {
            return '';
      }

      return normalized
            .split(/\n{2,}/)
            .map((paragraph) => paragraph.trim())
            .filter((paragraph) => paragraph.length > 0)
            .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, '<br />')}</p>`)
            .join('');
}

export function normalizeYooptaContent(value: unknown): Record<string, unknown> | null {
      if (!value || typeof value !== 'object' || Array.isArray(value)) {
            return null;
      }

      return Object.keys(value).length === 0 ? null : (value as Record<string, unknown>);
}
