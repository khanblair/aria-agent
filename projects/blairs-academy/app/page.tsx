import LanguageSelector from "../components/LanguageSelector";

export default function Home() {
  return (
    <section className="container mx-auto py-8">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Choose a language to explore
      </h2>
      <LanguageSelector />
    </section>
  );
}