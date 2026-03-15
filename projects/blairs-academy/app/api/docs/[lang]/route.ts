import fetchers from '../../../../lib/fetchers';
import { convex } from '../../../../lib/convex';
import { api } from '../../../../convex/_generated/api';

export async function GET(request: Request, { params }: { params: { lang: string } }) {
  const { lang } = params;
  const fetcher = fetchers[lang as keyof typeof fetchers];

  if (!fetcher) {
    return new Response(JSON.stringify({ error: 'Language not supported' }), { status: 404 });
  }

  try {
    // 1. Check Convex cache first - avoid duplicate fetches
    const cached = await convex.query(api.docs.getByLanguage, { language: lang });

    if (cached && cached.length > 0) {
      // Check if data is stale (older than 24h)
      const lastFetched = new Date(cached[0].fetchedAt).getTime();
      const now = new Date().getTime();
      const isStale = now - lastFetched > 24 * 60 * 60 * 1000;

      if (!isStale) {
        console.log(`[API] Serving ${lang} docs from Convex cache`);
        return new Response(JSON.stringify(cached), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // 2. Fetch fresh data from fetcher (which may use AI or official docs)
    console.log(`[API] Fetching fresh ${lang} docs...`);
    const freshDocs = await fetcher.fetchDocs();

    // 3. Store in Convex to avoid future duplicate fetches
    console.log(`[API] Caching ${freshDocs.length} ${lang} APIs in Convex...`);
    for (const doc of freshDocs) {
      await convex.mutation(api.docs.upsert, {
        language: lang,
        category: doc.category,
        endpoint: doc.title,
        title: doc.title,
        content: doc.description,
        example: doc.example,
        status: "learned",
        priority: 1,
        fetchedAt: new Date().toISOString(),
      });
    }

    return new Response(JSON.stringify(freshDocs), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[API Error]:', err);
    return new Response(JSON.stringify({ error: 'Failed to process documentation request' }), { status: 500 });
  }
}