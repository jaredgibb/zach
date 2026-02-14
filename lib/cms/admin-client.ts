'use client';

import { auth } from '@/lib/supabase/client';

export async function cmsAdminRequest<T>(input: string, init: RequestInit = {}): Promise<T> {
      const user = auth.currentUser;
      if (!user) {
            throw new Error('You must be signed in as an admin.');
      }

      const token = await user.getIdToken();
      const headers = new Headers(init.headers);
      headers.set('Authorization', `Bearer ${token}`);

      if (init.body && !(init.body instanceof FormData) && !headers.has('Content-Type')) {
            headers.set('Content-Type', 'application/json');
      }

      const response = await fetch(input, {
            ...init,
            headers,
      });

      let payload: unknown = null;
      try {
            payload = await response.json();
      } catch {
            payload = null;
      }

      if (!response.ok) {
            const message =
                  payload &&
                  typeof payload === 'object' &&
                  'error' in payload &&
                  typeof (payload as { error?: unknown }).error === 'string'
                        ? (payload as { error: string }).error
                        : 'Request failed.';
            throw new Error(message);
      }

      return payload as T;
}
