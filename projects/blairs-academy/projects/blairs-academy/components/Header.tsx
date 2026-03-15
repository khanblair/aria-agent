import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800">
      {/* ✅ Added descriptive alt text */}
      <Link href="/" className="flex items-center space-x-2">
        <Image
          src="/logo.svg"
          alt="Blair's Academy logo"
          width={40}
          height={40}
          priority
        />
        <h1 className="text-xl font-bold">Blair's Academy</h1>
      </Link>
    </header>
  );
}