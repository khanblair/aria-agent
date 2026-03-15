import './globals.css';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { ConvexProviderWithAuth } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useTheme } from '@/hooks/useTheme';

export const metadata = {
  title: "Blair's Academy",
  description: 'Unified API docs for multiple languages',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Simple theme hook (adds 'dark' class to <html> when needed)
  useTheme();

  return (
    <html lang="en" className="h-full">
      <head />
      <body className="flex flex-col h-full bg-white dark:bg-darkBg text-black dark:text-darkText">
        <ConvexProviderWithAuth
          // The Convex URL is injected via VERCEL env var at runtime
          // (e.g. NEXT_PUBLIC_CONVEX_URL)
          // In dev you can set it in .env.local
          // The client is automatically created by the generated `api` import
          // No extra config needed here.
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          client={api}
        >
          <Header />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-6">{children}</main>
          </div>
        </ConvexProviderWithAuth>
      </body>
    </html>
  );
}