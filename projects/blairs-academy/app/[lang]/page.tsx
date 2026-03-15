import Link from 'next/link';
import { PythonAPIList } from '@/lib/fetchers/python';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function LanguagePage({ params }: { params: { lang: string } }) {
  const { lang } = params;

  // Only render Python docs for now – other languages will follow the same pattern
  if (lang !== 'python') {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Language not supported yet</h1>
      </div>
    );
  }

  return (
    <section className="p-8">
      <h1 className="text-3xl font-bold mb-6">Python API Reference</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PythonAPIList.map((api) => (
          <Link
            key={api.title}
            href={`/python/${api.title.toLowerCase()}`}
            className="block"
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{api.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                  {api.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}