import './globals.css';
import { Inter } from 'next/font/google';
import DarkModeToggle from '@/components/DarkModeToggle';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Blair’s Academy – Programming Language API Docs',
  description:
    'A unified, language‑agnostic platform that aggregates API documentation into a clean, copy‑paste‑ready format.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        {/* Open Graph / SEO */}
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:image" content="/og-image.png" />
      </head>
      <body className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <Link href="/" className="flex items-center space-x-2">
            <img
              src="/logo.svg"
              alt="Blair’s Academy logo"
              className="h-8 w-8"
            />
            <h1 className="text-xl font-semibold">Blair’s Academy</h1>
          </Link>
          <DarkModeToggle />
        </header>
        <main className="flex-1">{children}</main>
        <footer className="p-4 text-center text-sm border-t border-gray-200 dark:border-gray-700">
          © {new Date().getFullYear()} Blair’s Academy. All rights reserved.
        </footer>
      </body>
    </html>
  );
}