import { useState } from 'react';

export default function SearchBar({ onSearch }: { onSearch: (q: string) => void }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className="flex items-center w-full max-w-md mx-auto"
    >
      <label htmlFor="search-input" className="sr-only">
        Search documentation
      </label>
      <input
        id="search-input"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search APIs…"
        className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <button
        type="submit"
        className="p-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 transition"
        aria-label="Submit search"
      >
        🔍
      </button>
    </form>
  );
}