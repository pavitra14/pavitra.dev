import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { z } from 'zod';
import { auth } from '@/auth';
import { getS3Object, putS3Object, listS3Objects } from '@/utils/s3';

const ContentTypeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric and hyphens'),
  schema: z
    .string()
    .transform((val, ctx) => {
      try {
        if (!val) return null;
        return JSON.parse(val);
      } catch (e) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Invalid JSON schema',
        });
        return z.NEVER;
      }
    })
    .optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const objects = await listS3Objects('settings/content-types/');
    const contentTypes = [];

    for (const obj of objects) {
      const content = await getS3Object(obj.Key!);
      if (content) {
        contentTypes.push(JSON.parse(content));
      }
    }

    // Sort by createdAt descending
    contentTypes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return NextResponse.json(contentTypes);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  const role = (session?.user as any)?.role;

  if (!session?.user || (role !== 'SUPER_ADMIN' && role !== 'EDITOR')) {
    return NextResponse.json({ error: 'Unauthorized. Requires Super Admin or Editor.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const validatedData = ContentTypeSchema.parse(body);

    const key = `settings/content-types/${validatedData.slug}.json`;

    // Check if it already exists
    try {
      const existing = await getS3Object(key);
      if (existing) {
        return NextResponse.json({ error: 'A content type with this slug already exists.' }, { status: 409 });
      }
    } catch (e) {
      // It's expected to fail if it doesn't exist
    }

    const newContentType = {
      id: crypto.randomUUID(),
      name: validatedData.name,
      slug: validatedData.slug,
      schema: validatedData.schema || {},
      createdAt: new Date().toISOString(),
    };

    await putS3Object(key, JSON.stringify(newContentType), 'application/json');
    revalidateTag('content-types'); // Instantly invalidate frontend cache
    return NextResponse.json(newContentType, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
