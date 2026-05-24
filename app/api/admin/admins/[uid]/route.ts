import { NextRequest, NextResponse } from 'next/server';
import { isSuperAdminEmail, normalizeAdminEmail } from '@/lib/admin/superadmins';
import { getAuthErrorStatus, getRequestErrorStatus } from '@/lib/cms/api-errors';
import { requireSuperAdminUser } from '@/lib/cms/admin-auth';
import { adminAuth, adminDb } from '@/lib/firebase/admin';

export const runtime = 'nodejs';

interface RouteContext {
      params: Promise<{
            uid: string;
      }>;
}

interface AdminRecord {
      email?: string;
}

function isUserNotFound(error: unknown): boolean {
      return (
            typeof error === 'object' &&
            error !== null &&
            'code' in error &&
            (error as { code?: unknown }).code === 'auth/user-not-found'
      );
}

async function getUserEmail(uid: string): Promise<string | null> {
      try {
            const user = await adminAuth.getUser(uid);
            return user.email ? normalizeAdminEmail(user.email) : null;
      } catch (error) {
            if (isUserNotFound(error)) {
                  return null;
            }

            throw error;
      }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
      try {
            const actor = await requireSuperAdminUser(request);
            const { uid } = await context.params;
            const adminRef = adminDb.collection('admins').doc(uid);
            const adminSnapshot = await adminRef.get();
            const record = adminSnapshot.exists ? (adminSnapshot.data() as AdminRecord) : null;
            const email = (await getUserEmail(uid)) ?? (record?.email ? normalizeAdminEmail(record.email) : null);

            if (email && isSuperAdminEmail(email)) {
                  return NextResponse.json({ error: 'Superadmin users cannot be removed.' }, { status: 400 });
            }

            if (!adminSnapshot.exists) {
                  return NextResponse.json({ error: 'Admin user not found.' }, { status: 404 });
            }

            const now = new Date().toISOString();
            await adminRef.set(
                  {
                        role: 'admin',
                        active: false,
                        updated_at: now,
                        updated_by: actor.uid,
                        removed_at: now,
                        removed_by: actor.uid,
                  },
                  { merge: true }
            );

            return NextResponse.json({ ok: true });
      } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to remove admin.';
            const authStatus = getAuthErrorStatus(message);

            if (authStatus !== 500) {
                  return NextResponse.json({ error: message }, { status: authStatus });
            }

            const status = getRequestErrorStatus(message);
            return NextResponse.json({ error: message }, { status });
      }
}
