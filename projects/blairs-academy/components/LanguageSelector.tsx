import Link from 'next/link';
import { languages } from '@/lib/constants';

export default function LanguageSelector() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {languages.map((lang) => (
        <Link
          key={lang.id}
          href={`/${lang.id}`}
          className="flex flex-col items-center p-4 border rounded hover:shadow-lg transition-shadow bg-gray-50 dark:bg-gray-800"
        >
          <img
            src={lang.icon}
            alt={`${lang.displayName} logo`}
            className="h-12 w-12 mb-2"
          />
          <span className="font-medium">{lang.displayName}</span>
        </Link>
      ))}
    </div>
  );
}