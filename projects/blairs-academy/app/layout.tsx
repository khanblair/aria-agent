import "./globals.css";
import Header from "../components/Header";
import DarkModeToggle from "../components/DarkModeToggle";

export const metadata = {
  title: "Blair's Academy – Programming Language API Docs",
  description:
    "A unified, language‑agnostic platform that aggregates API documentation into a clean, copy‑paste‑ready format.",
  openGraph: {
    title: "Blair's Academy",
    description:
      "Programming language API docs, simplified – browse, search and copy code examples instantly.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
        <Header />
        <div className="flex-1 flex">
          {/* Sidebar could be injected here if needed */}
          <main className="flex-1 p-4">{children}</main>
        </div>
        <footer className="p-4 text-center text-sm text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} Blair's Academy
        </footer>
        <div className="fixed bottom-4 right-4">
          <DarkModeToggle />
        </div>
      </body>
    </html>
  );
}