import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { SUPERADMIN_EMAILS, isSuperAdminEmail, normalizeAdminEmail } from '@/lib/admin/superadmins';
import { getAuthErrorStatus, getRequestErrorStatus } from '@/lib/cms/api-errors';
import { requireSuperAdminUser } from '@/lib/cms/admin-auth';
import { adminAuth, adminDb } from '@/lib/firebase/admin';

export const runtime = 'nodejs';

const addAdminInputSchema = z.object({
      email: z.string().trim().email().transform(normalizeAdminEmail),
});

interface AdminRecord {
      role?: string;
      active?: boolean;
      email?: string;
      created_at?: string;
      updated_at?: string;
}

interface AdminListItem {
      uid: string | null;
      email: string;
      role: 'superadmin' | 'admin';
      active: boolean;
      canRemove: boolean;
      createdAt: string | null;
      updatedAt: string | null;
}

function isUserNotFound(error: unknown): boolean {
      return (
            typeof error === 'object' &&
            error !== null &&
            'code' in error &&
            (error as { code?: unknown }).code === 'auth/user-not-found'
      );
}

async function getUserByEmailOrNull(email: string) {
      try {
            return await adminAuth.getUserByEmail(email);
      } catch (error) {
            if (isUserNotFound(error)) {
                  return null;
            }

            throw error;
      }
}

async function getUserByUidOrNull(uid: string) {
      try {
            return await adminAuth.getUser(uid);
      } catch (error) {
            if (isUserNotFound(error)) {
                  return null;
            }

            throw error;
      }
}

export async function GET(request: NextRequest) {
      try {
            await requireSuperAdminUser(request);

            const [adminSnapshot, superAdminUsers] = await Promise.all([
                  adminDb.collection('admins').get(),
                  Promise.all(SUPERADMIN_EMAILS.map((email) => getUserByEmailOrNull(email))),
            ]);
            const rowsByUid = new Map<string, AdminListItem>();

            await Promise.all(
                  adminSnapshot.docs.map(async (docSnapshot) => {
                        const record = docSnapshot.data() as AdminRecord;
                        const user = await getUserByUidOrNull(docSnapshot.id);
                        const email = normalizeAdminEmail(user?.email ?? record.email ?? '');

                        if (!email || record.active === false) {
                              return;
                        }

                        const superAdmin = isSuperAdminEmail(email);
                        rowsByUid.set(docSnapshot.id, {
                              uid: docSnapshot.id,
                              email,
                              role: superAdmin ? 'superadmin' : 'admin',
                              active: true,
                              canRemove: !superAdmin,
                              createdAt: record.created_at ?? null,
                              updatedAt: record.updated_at ?? null,
                        });
                  })
            );

            SUPERADMIN_EMAILS.forEach((email, index) => {
                  const user = superAdminUsers[index];
                  const uid = user?.uid ?? null;

                  if (uid && rowsByUid.has(uid)) {
                        rowsByUid.set(uid, {
                              ...rowsByUid.get(uid)!,
                              role: 'superadmin',
                              active: true,
                              canRemove: false,
                        });
                        return;
                  }

                  rowsByUid.set(`superadmin:${email}`, {
                        uid,
                        email,
                        role: 'superadmin',
                        active: true,
                        canRemove: false,
                        createdAt: null,
                        updatedAt: null,
                  });
            });

            const admins = [...rowsByUid.values()].sort((first, second) => {
                  if (first.role !== second.role) {
                        return first.role === 'superadmin' ? -1 : 1;
                  }

                  return first.email.localeCompare(second.email);
            });

            return NextResponse.json({ admins });
      } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to list admins.';
            const status = getAuthErrorStatus(message);
            return NextResponse.json({ error: message }, { status });
      }
}

export async function POST(request: NextRequest) {
      try {
            const actor = await requireSuperAdminUser(request);
            const payload = addAdminInputSchema.parse(await request.json());
            const user = await getUserByEmailOrNull(payload.email);

            if (!user) {
                  return NextResponse.json(
                        { error: 'No Firebase Auth user exists for that email. Have the user sign up first, then add them here.' },
                        { status: 400 }
                  );
            }

            const now = new Date().toISOString();
            const adminRef = adminDb.collection('admins').doc(user.uid);
            const currentSnapshot = await adminRef.get();
            const current = currentSnapshot.exists ? (currentSnapshot.data() as AdminRecord) : null;

            await adminRef.set(
                  {
                        role: 'admin',
                        active: true,
                        email: normalizeAdminEmail(user.email ?? payload.email),
                        created_at: current?.created_at ?? now,
                        created_by: current?.created_at ? currentSnapshot.get('created_by') ?? actor.uid : actor.uid,
                        updated_at: now,
                        updated_by: actor.uid,
                  },
                  { merge: true }
            );

            return NextResponse.json(
                  {
                        admin: {
                              uid: user.uid,
                              email: normalizeAdminEmail(user.email ?? payload.email),
                              role: isSuperAdminEmail(user.email) ? 'superadmin' : 'admin',
                              active: true,
                              canRemove: !isSuperAdminEmail(user.email),
                              createdAt: current?.created_at ?? now,
                              updatedAt: now,
                        } satisfies AdminListItem,
                  },
                  { status: 201 }
            );
      } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to add admin.';
            const authStatus = getAuthErrorStatus(message);

            if (authStatus !== 500) {
                  return NextResponse.json({ error: message }, { status: authStatus });
            }

            const status = getRequestErrorStatus(message);
            return NextResponse.json({ error: message }, { status });
      }
}
