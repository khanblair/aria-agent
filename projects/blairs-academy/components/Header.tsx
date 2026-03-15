import React from 'react';
import Link from 'next/link';
import DarkModeToggle from './DarkModeToggle';

const Header = () => (
  <header className="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 shadow">
    {/* Logo with descriptive alt text */}
    <Link href="/" aria-label="Home">
      <img src="/logo.svg" alt="Blair’s Academy logo" className="h-8 w-auto" />
    </Link>

    <nav aria-label="Main navigation">
      <ul className="flex space-x-4">
        <li>
          <Link href="/about" className="text-gray-700 dark:text-gray-200 hover:underline">
            About
          </Link>
        </li>
        <li>
          <Link href="/contact" className="text-gray-700 dark:text-gray-200 hover:underline">
            Contact
          </Link>
        </li>
      </ul>
    </nav>

    <DarkModeToggle />
  </header>
);

export default Header;