import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { getAuthErrorStatus, getRequestErrorStatus } from '@/lib/cms/api-errors';
import { requireAdminUser } from '@/lib/cms/admin-auth';
import { deletePage, updatePageDraft } from '@/lib/cms/repository';
import { getCmsPageById } from '@/lib/cms/server';
import { updateCmsPageInputSchema } from '@/lib/cms/validators';

export const runtime = 'nodejs';

interface RouteContext {
      params: Promise<{
            id: string;
      }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
      try {
            await requireAdminUser(request);
            const { id } = await context.params;
            const page = await getCmsPageById(id);

            if (!page) {
                  return NextResponse.json({ error: 'Page not found.' }, { status: 404 });
            }

            return NextResponse.json({ page });
      } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to load page.';
            const status = getAuthErrorStatus(message);
            return NextResponse.json({ error: message }, { status });
      }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
      try {
            const { uid } = await requireAdminUser(request);
            const { id } = await context.params;
            const payload = updateCmsPageInputSchema.parse(await request.json());
            const page = await updatePageDraft({
                  pageId: id,
                  uid,
                  title: payload.title,
                  slug: payload.slug,
                  draft: payload.draft,
            });

            return NextResponse.json({ page });
      } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to update page.';
            const authStatus = getAuthErrorStatus(message);

            if (authStatus !== 500) {
                  return NextResponse.json({ error: message }, { status: authStatus });
            }

            if (error instanceof ZodError) {
                  return NextResponse.json({ error: error.issues[0]?.message || 'Invalid page payload.' }, { status: 400 });
            }

            const status = getRequestErrorStatus(message);
            return NextResponse.json({ error: message }, { status });
      }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
      try {
            await requireAdminUser(request);
            const { id } = await context.params;
            await deletePage({ pageId: id });

            return NextResponse.json({ ok: true });
      } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to delete page.';
            const authStatus = getAuthErrorStatus(message);

            if (authStatus !== 500) {
                  return NextResponse.json({ error: message }, { status: authStatus });
            }

            const status = getRequestErrorStatus(message);
            return NextResponse.json({ error: message }, { status });
      }
}
