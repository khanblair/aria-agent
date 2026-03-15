import { NextResponse } from 'next/server';
import { v } from 'convex/values';
import { internal } from '@/convex/_generated/api';
import { fetchFromOfficialDocs, isStale } from '@/lib/fetchers';

export async function GET(
  request: Request,
  { params }: { params: { lang: string } }
) {
  const { lang } = params;

  // 1️⃣ Check Convex cache
  const cached = await internal.docs.getByLanguage({ language: lang });

  if (cached && !isStale(cached.fetchedAt)) {
    return NextResponse.json({ source: 'cache', data: cached });
  }

  // 2️⃣ Fetch fresh data from the official source
  const fresh = await fetchFromOfficialDocs(lang);

  // 3️⃣ Upsert into Convex (creates or updates)
  await internal.docs.upsert({
    language: lang,
    endpoint: fresh.endpoint,
    title: fresh.title,
    content: fresh.content,
    example: fresh.example,
    fetchedAt: new Date().toISOString(),
  });

  return NextResponse.json({ source: 'fresh', data: fresh });
}