import { NextRequest, NextResponse } from 'next/server';
import { getAuthErrorStatus, getRequestErrorStatus } from '@/lib/cms/api-errors';
import { requireAdminUser } from '@/lib/cms/admin-auth';
import { publishPage } from '@/lib/cms/repository';

export const runtime = 'nodejs';

interface RouteContext {
      params: Promise<{
            id: string;
      }>;
}

export async function POST(request: NextRequest, context: RouteContext) {
      try {
            const { uid } = await requireAdminUser(request);
            const { id } = await context.params;
            const page = await publishPage({ pageId: id, uid });

            return NextResponse.json({ page });
      } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to publish page.';
            const authStatus = getAuthErrorStatus(message);

            if (authStatus !== 500) {
                  return NextResponse.json({ error: message }, { status: authStatus });
            }

            const status = getRequestErrorStatus(message);
            return NextResponse.json({ error: message }, { status });
      }
}
