import { NextRequest } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { isSuperAdminEmail } from '@/lib/admin/superadmins';

export interface AdminAuthUser {
      uid: string;
      email: string | null;
      isSuperAdmin: boolean;
}

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

async function isAdminUser(uid: string, email?: string | null): Promise<boolean> {
      if (isSuperAdminEmail(email)) {
            return true;
      }

      const adminSnapshot = await adminDb.collection('admins').doc(uid).get();
      if (!adminSnapshot.exists) {
            return false;
      }

      const data = adminSnapshot.data() as { role?: string; active?: boolean } | undefined;
      return data?.role === 'admin' && data?.active !== false;
}

export async function requireAdminUser(request: NextRequest): Promise<AdminAuthUser> {
      const token = getBearerToken(request);
      if (!token) {
            throw new Error('Missing authorization token.');
      }

      const decodedToken = await adminAuth.verifyIdToken(token);
      const email = typeof decodedToken.email === 'string' ? decodedToken.email : null;
      const superAdmin = isSuperAdminEmail(email);
      const hasAdminAccess = await isAdminUser(decodedToken.uid, email);

      if (!hasAdminAccess) {
            throw new Error('You do not have admin access.');
      }

      return {
            uid: decodedToken.uid,
            email,
            isSuperAdmin: superAdmin,
      };
}

export async function requireSuperAdminUser(request: NextRequest): Promise<AdminAuthUser> {
      const user = await requireAdminUser(request);

      if (!user.isSuperAdmin) {
            throw new Error('You do not have superadmin access.');
      }

      return user;
}
