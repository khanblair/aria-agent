import LanguageSelector from '@/components/LanguageSelector';

export default function Home() {
  return (
    <section className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Choose a language to explore its API
      </h1>
      <LanguageSelector />
    </section>
  );
}