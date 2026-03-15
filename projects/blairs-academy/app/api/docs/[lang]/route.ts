import fetchers from '@/lib/fetchers';

export async function GET(request: Request, { params }: { params: { lang: string } }) {
  const { lang } = params;
  const fetcher = fetchers[lang as keyof typeof fetchers];

  if (!fetcher) {
    return new Response(JSON.stringify({ error: 'Fetcher not found' }), { status: 404 });
  }

  try {
    const docs = await fetcher.fetchDocs();
    return new Response(JSON.stringify(docs), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Failed to fetch docs' }), { status: 500 });
  }
}