import Link from 'next/link';
import { languages } from '@/data/languages';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white dark:bg-darkSurface border-r border-gray-200 dark:border-darkBorder overflow-y-auto">
      <nav className="p-4">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
          Languages
        </h3>
        <ul className="space-y-1">
          {languages.map((lang) => (
            <li key={lang.id}>
              <Link
                href={`/${lang.id}`}
                className={`block px-3 py-2 rounded-md text-sm ${
                  pathname.startsWith(`/${lang.id}`)
                    ? 'bg-gray-200 dark:bg-darkBg font-medium'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-darkSurface'
                }`}
              >
                {lang.displayName}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}