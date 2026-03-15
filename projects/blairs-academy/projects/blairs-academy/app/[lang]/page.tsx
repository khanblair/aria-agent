import { notFound } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import CodeBlock from '@/components/CodeBlock';
import SearchBar from '@/components/SearchBar';
import { useState } from 'react';

export default function LanguageDocs({ params }: { params: { lang: string } }) {
  const { lang } = params;
  const docs = useQuery(api.docs.getAllByLanguage, { language: lang });

  if (!docs) {
    // Docs are loading – you could show a spinner
    return <p className="p-6">Loading…</p>;
  }

  if (docs.length === 0) {
    notFound();
  }

  const [search, setSearch] = useState('');

  const filtered = docs.filter((d) =>
    d.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <SearchBar value={search} onChange={setSearch} placeholder={`Search ${lang} APIs…`} />
      {filtered.map((doc) => (
        <section key={doc._id} className="border-b pb-6">
          <h2 className="text-2xl font-semibold mb-2">{doc.title}</h2>
          <p className="mb-4 whitespace-pre-wrap">{doc.content}</p>
          {doc.example && (
            <CodeBlock language={lang} code={doc.example} />
          )}
        </section>
      ))}
    </div>
  );
}