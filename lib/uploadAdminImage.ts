import { getClientAuth } from '@/lib/supabase/client';

type UploadFolder = 'services' | 'therapists';

interface UploadAdminImageOptions {
      file: File;
      folder: UploadFolder;
      recordId?: string | null;
}

interface UploadAdminImageResponse {
      imageUrl?: string;
      error?: string;
}

export async function uploadAdminImage({
      file,
      folder,
      recordId,
}: UploadAdminImageOptions): Promise<string> {
      const auth = getClientAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
            throw new Error('You must be signed in to upload images.');
      }

      const idToken = await currentUser.getIdToken();
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      if (recordId) {
            formData.append('recordId', recordId);
      }

      const response = await fetch('/api/admin/upload-image', {
            method: 'POST',
            headers: {
                  Authorization: `Bearer ${idToken}`,
            },
            body: formData,
      });

      let payload: UploadAdminImageResponse | null = null;
      try {
            payload = (await response.json()) as UploadAdminImageResponse;
      } catch {
            payload = null;
      }

      if (!response.ok || !payload?.imageUrl) {
            throw new Error(payload?.error || 'Failed to upload image.');
      }

      return payload.imageUrl;
}
