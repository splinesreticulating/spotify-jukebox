'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useDebouncedCallback } from 'use-debounce';
import { useSearchParams } from 'next/navigation';

interface SearchProps {
  placeholder: string;
  defaultValue?: string;
  onSearch?: (term: string) => void;
}

export default function Search({ placeholder, defaultValue = '', onSearch }: SearchProps) {
  const searchParams = useSearchParams();
  const handleSearch = useDebouncedCallback((term) => {
    if (onSearch) {
      onSearch(term);
    } else {
      console.log(`Searching... ${term}`);
      const params = new URLSearchParams(searchParams);

      params.set('page', '1');

      if (term) {
        params.set('query', term);
      } else {
        params.delete('query');
      }
    }
  }, 300);

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={defaultValue}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
