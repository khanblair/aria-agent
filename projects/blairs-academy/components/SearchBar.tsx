import { FC, ChangeEvent } from 'react';
import { FiSearch } from 'react-icons/fi';

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Accessible search input with proper ARIA attributes.
 */
const SearchBar: FC<SearchBarProps> = ({
  placeholder = 'Search documentation...',
  value,
  onChange,
}) => {
  return (
    <div className="relative w-full max-w-md">
      <input
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-label="Search documentation"
        aria-describedby="search-help"
        className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <p id="search-help" className="sr-only">
        Type to search API documentation across all supported languages.
      </p>
    </div>
  );
};

export default SearchBar;