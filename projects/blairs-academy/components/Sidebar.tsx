import React from "react";
import Link from "next/link";

interface SidebarProps {
  languages: { id: string; name: string }[];
}

export default function Sidebar({ languages }: SidebarProps) {
  return (
    <nav
      className="w-64 h-full bg-gray-50 dark:bg-gray-800 p-4 overflow-y-auto"
      role="navigation"
      aria-label="Language navigation"
    >
      <ul className="space-y-2">
        {languages.map((lang) => (
          <li key={lang.id}>
            <Link href={`/${lang.id}`}>
              <a className="block px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                {lang.name}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}