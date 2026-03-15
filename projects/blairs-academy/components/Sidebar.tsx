import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/learn', label: 'Learn' },
    { href: '/search', label: 'Search' },
    { href: '/profile', label: 'Profile' },
  ];

  return (
    <aside
      className="w-64 h-full bg-gray-50 dark:bg-gray-900 p-4"
      role="navigation"
      aria-label="Sidebar navigation"
    >
      <ul className="space-y-2">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`block px-3 py-2 rounded ${
                pathname === item.href
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800'
              }`}
              aria-current={pathname === item.href ? 'page' : undefined}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;