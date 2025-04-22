'use client'

import { useTransition, useCallback } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import clsx from 'clsx'

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)

    // Reset to first page when search changes
    params.set('page', '1')

    if (term) {
      params.set('query', term)
    } else {
      params.delete('query')
    }

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`)
    })
  }, 300)

  const clearSearch = useCallback(() => {
    const params = new URLSearchParams(searchParams)
    params.delete('query')
    params.set('page', '1')

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`)
    })
  }, [searchParams, pathname, router])

  return (
    <div className="relative flex w-full flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>

      <input
        id="search"
        className={clsx(
          'peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2',
          'placeholder:text-gray-500',
          'focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200',
          isPending && 'animate-pulse',
        )}
        placeholder={placeholder}
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get('query')?.toString()}
        type="search"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
      />

      <MagnifyingGlassIcon
        className={clsx(
          'absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2',
          'text-gray-500 peer-focus:text-gray-900',
          isPending && 'animate-spin',
        )}
      />

      {searchParams.get('query') && (
        <button
          onClick={clearSearch}
          className={clsx('absolute right-3 top-1/2 -translate-y-1/2', 'text-gray-500 hover:text-gray-700')}
          aria-label="Clear search"
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  )
}
