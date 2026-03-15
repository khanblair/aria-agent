import Link from 'next/link';
import { Language } from '@/data/languages';

export default function LanguageCard({ language }: { language: Language }) {
  return (
    <Link
      href={`/${language.id}`}
      className="group block border border-gray-200 dark:border-darkBorder rounded-lg p-6 text-center hover:shadow-lg transition-shadow"
    >
      <div className="flex flex-col items-center">
        <span
          className="text-4xl mb-4"
          style={{ color: language.color }}
          aria-hidden="true"
        >
          {language.icon}
        </span>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-darkText group-hover:text-accent">
          {language.displayName}
        </h2>
      </div>
    </Link>
  );
}