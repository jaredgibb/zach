import { NextRequest } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';

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

async function isAdminUser(uid: string): Promise<boolean> {
      const adminSnapshot = await adminDb.collection('admins').doc(uid).get();
      if (!adminSnapshot.exists) {
            return false;
      }

      const data = adminSnapshot.data() as { role?: string; active?: boolean } | undefined;
      return data?.role === 'admin' && data?.active !== false;
}

export async function requireAdminUser(request: NextRequest): Promise<{ uid: string }> {
      const token = getBearerToken(request);
      if (!token) {
            throw new Error('Missing authorization token.');
      }

      const decodedToken = await adminAuth.verifyIdToken(token);
      const hasAdminAccess = await isAdminUser(decodedToken.uid);

      if (!hasAdminAccess) {
            throw new Error('You do not have admin access.');
      }

      return { uid: decodedToken.uid };
}
