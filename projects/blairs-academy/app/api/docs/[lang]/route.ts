import { NextResponse } from 'next/server';
import { fetchDocsForLanguage } from '@/lib/fetchers';
import { ConvexHttpClient } from 'convex/browser';

const convex = new ConvexHttpClient(
  process.env.NEXT_PUBLIC_CONVEX_URL ?? 'http://localhost:3000' // fallback for local dev
);

export async function GET(request: Request, { params }: { params: { lang: string } }) {
  const { lang } = params;

  // Validate language param early
  if (!['python', 'javascript', 'go', 'rust', 'typescript'].includes(lang)) {
    return NextResponse.json(
      { error: 'Unsupported language' },
      { status: 400 }
    );
  }

  // Try to serve from cache first
  const cached = await convex.query('docs.getCached', { language: lang });
  if (cached?.length) {
    return NextResponse.json(cached);
  }

  // If not cached, fetch from official source
  const docs = await fetchDocsForLanguage(lang);
  // Store in Convex for future requests
  await Promise.all(
    docs.map((doc) =>
      convex.mutation('docs.upsert', {
        language: lang,
        category: doc.category,
        endpoint: doc.endpoint,
        title: doc.title,
        content: doc.content,
        example: doc.example,
        status: 'learning',
        priority: doc.priority,
        fetchedAt: new Date().toISOString(),
      })
    )
  );

  return NextResponse.json(docs);
}