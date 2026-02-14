import { NextRequest, NextResponse } from 'next/server';
import { getAuthErrorStatus, getRequestErrorStatus } from '@/lib/cms/api-errors';
import { requireAdminUser } from '@/lib/cms/admin-auth';
import { createCustomPage } from '@/lib/cms/repository';
import { listCmsPages } from '@/lib/cms/server';
import { createCmsPageInputSchema, resolveCreateSlug } from '@/lib/cms/validators';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
      try {
            await requireAdminUser(request);
            const statusFilter = request.nextUrl.searchParams.get('status');
            const kindFilter = request.nextUrl.searchParams.get('kind');
            const pages = await listCmsPages();

            const filtered = pages.filter((page) => {
                  if (statusFilter && page.status !== statusFilter) {
                        return false;
                  }

                  if (kindFilter && page.kind !== kindFilter) {
                        return false;
                  }

                  return true;
            });

            return NextResponse.json({ pages: filtered });
      } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to list pages.';
            const status = getAuthErrorStatus(message);
            return NextResponse.json({ error: message }, { status });
      }
}

export async function POST(request: NextRequest) {
      try {
            const { uid } = await requireAdminUser(request);
            const payload = createCmsPageInputSchema.parse(await request.json());
            const slug = resolveCreateSlug(payload.title, payload.slug);
            const page = await createCustomPage({
                  uid,
                  title: payload.title,
                  slug,
            });

            return NextResponse.json({ page }, { status: 201 });
      } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to create page.';
            const authStatus = getAuthErrorStatus(message);

            if (authStatus !== 500) {
                  return NextResponse.json({ error: message }, { status: authStatus });
            }

            const status = getRequestErrorStatus(message);
            return NextResponse.json({ error: message }, { status });
      }
}
