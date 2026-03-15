import LanguageCard from '@/components/LanguageCard';
import { languages } from '@/data/languages';

export default function Home() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {languages.map((lang) => (
        <LanguageCard key={lang.id} language={lang} />
      ))}
    </section>
  );
}