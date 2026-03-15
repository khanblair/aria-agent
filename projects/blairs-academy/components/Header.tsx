import Image from 'next/image';
import Link from 'next/link';
import DarkModeToggle from './DarkModeToggle';

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow">
      <Link href="/" className="flex items-center space-x-2">
        {/* Added alt text for the logo */}
        <Image src="/logo.svg" alt="Blair's Academy logo" width={32} height={32} />
        <h1 className="text-xl font-semibold">Blair's Academy</h1>
      </Link>
      <DarkModeToggle />
    </header>
  );
}