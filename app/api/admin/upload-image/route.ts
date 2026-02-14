import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb, adminStorage } from '@/lib/firebase/admin';

export const runtime = 'nodejs';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const VALID_FOLDERS = new Set(['services', 'therapists']);

function getBearerToken(request: NextRequest): string | null {
      const authorization = request.headers.get('authorization');
      if (!authorization) {
            return null;
      }

      const [scheme, token] = authorization.split(' ');
      if (scheme?.toLowerCase() !== 'bearer' || !token) {
            return null;
      }

      return token;
}

function sanitizePathSegment(value: string): string {
      const normalized = value
            .trim()
            .replace(/[^a-zA-Z0-9._-]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^[-.]+/, '')
            .slice(0, 80);

      return normalized || 'item';
}

function sanitizeFileName(fileName: string): string {
      const normalized = fileName
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9._-]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^[-.]+/, '')
            .slice(0, 140);

      return normalized || 'image';
}

async function isAdminUser(uid: string): Promise<boolean> {
      const adminSnapshot = await adminDb.collection('admins').doc(uid).get();
      if (!adminSnapshot.exists) {
            return false;
      }

      const data = adminSnapshot.data() as { role?: string; active?: boolean } | undefined;
      return data?.role === 'admin' && data?.active !== false;
}

export async function POST(request: NextRequest) {
      try {
            const token = getBearerToken(request);
            if (!token) {
                  return NextResponse.json({ error: 'Missing authorization token.' }, { status: 401 });
            }

            const decodedToken = await adminAuth.verifyIdToken(token);
            const hasAdminAccess = await isAdminUser(decodedToken.uid);
            if (!hasAdminAccess) {
                  return NextResponse.json({ error: 'You do not have admin access.' }, { status: 403 });
            }

            const formData = await request.formData();
            const file = formData.get('file');
            const folder = String(formData.get('folder') ?? '').trim();
            const recordIdInput = String(formData.get('recordId') ?? 'new').trim();

            if (!(file instanceof File)) {
                  return NextResponse.json({ error: 'Image file is required.' }, { status: 400 });
            }

            if (!VALID_FOLDERS.has(folder)) {
                  return NextResponse.json({ error: 'Invalid upload folder.' }, { status: 400 });
            }

            if (!file.type.startsWith('image/')) {
                  return NextResponse.json({ error: 'Please upload a valid image file.' }, { status: 400 });
            }

            if (file.size > MAX_FILE_SIZE_BYTES) {
                  return NextResponse.json({ error: 'Please upload an image smaller than 10 MB.' }, { status: 400 });
            }

            const safeRecordId = sanitizePathSegment(recordIdInput || 'new');
            const safeFileName = sanitizeFileName(file.name);
            const objectPath = `${folder}/${safeRecordId}/${Date.now()}-${safeFileName}`;
            const downloadToken = randomUUID();
            const fileBuffer = Buffer.from(await file.arrayBuffer());
            const bucket = adminStorage.bucket();
            const storageFile = bucket.file(objectPath);

            await storageFile.save(fileBuffer, {
                  resumable: false,
                  metadata: {
                        contentType: file.type,
                        cacheControl: 'public, max-age=31536000',
                        metadata: {
                              firebaseStorageDownloadTokens: downloadToken,
                        },
                  },
            });

            const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(objectPath)}?alt=media&token=${downloadToken}`;

            return NextResponse.json({
                  imageUrl,
                  storagePath: objectPath,
            });
      } catch (error) {
            const message = error instanceof Error ? error.message : 'Image upload failed.';
            return NextResponse.json({ error: message }, { status: 500 });
      }
}
