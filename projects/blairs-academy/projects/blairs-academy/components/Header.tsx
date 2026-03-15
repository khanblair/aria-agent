import Link from 'next/link';
import DarkModeToggle from '@/components/DarkModeToggle';

export default function Header() {
  return (
    <header className="bg-white dark:bg-darkSurface border-b border-gray-200 dark:border-darkBorder p-4 flex items-center justify-between">
      <Link href="/" className="text-xl font-bold text-gray-900 dark:text-darkText">
        Blair&apos;s Academy
      </Link>
      <div className="flex items-center gap-4">
        <DarkModeToggle />
      </div>
    </header>
  );
}