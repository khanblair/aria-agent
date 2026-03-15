import LanguageSelector from '@/components/LanguageSelector';
import SearchBar from '@/components/SearchBar';

export default function Home() {
  return (
    <section className="max-w-4xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Programming language API docs, simplified
      </h2>

      <p className="text-lg text-center mb-8">
        Find clean, copy‑paste‑ready documentation for the most popular
        programming languages—all in one place. No more hunting through scattered
        sites or wrestling with inconsistent formatting.
      </p>

      <SearchBar placeholder="Search for a function, class, or module…" />

      <section className="mt-12">
        <h3 className="text-2xl font-semibold mb-4 text-center">
          Choose a language to explore
        </h3>
        <LanguageSelector />
      </section>

      <section className="mt-16 text-center">
        <h3 className="text-xl font-medium mb-2">Getting Started</h3>
        <p className="max-w-xl mx-auto">
          Select a language, browse the curated list of APIs, and copy the
          ready‑to‑use examples directly into your editor. Use the search bar to
          jump to any function instantly.
        </p>
      </section>
    </section>
  );
}