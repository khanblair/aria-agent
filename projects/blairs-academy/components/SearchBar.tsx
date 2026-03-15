import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/solid';

export default function SearchBar({ onSearch }: { onSearch: (term: string) => void }) {
  const [term, setTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(term.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center w-full max-w-md mx-auto">
      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Search APIs (e.g., Array.map or os.listdir)"
        className="flex-1 rounded-l-md border border-gray-300 p-2 focus:outline-none"
        aria-label="Search documentation"
      />
      <button
        type="submit"
        className="rounded-r-md bg-blue-600 p-2 text-white hover:bg-blue-700"
        aria-label="Submit search"
      >
        <MagnifyingGlassIcon className="h-5 w-5" />
      </button>
    </form>
  );
}