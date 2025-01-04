'use client'

import { useTransition } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useDebouncedCallback } from 'use-debounce'

type SearchFiltersProps = {
  initialValues: Record<string, string>
  nowPlayingKey?: string
  nowPlayingBPM?: number
}

export default function SearchFilters({ initialValues, nowPlayingKey, nowPlayingBPM }: SearchFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const handleFilterChange = (name: string, value: string | boolean) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(name, value.toString())
      } else {
        params.delete(name)
      }
      router.replace(`${pathname}?${params.toString()}`)
    })
  }

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative flex flex-1 flex-shrink-0">
        <input
          className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
          placeholder="Search title, artist, key, year, genre..."
          defaultValue={initialValues.query}
          onChange={(e) => handleFilterChange('query', e.target.value)}
        />
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
      </div>

      {/* Filters Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {/* Level Filters */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Levels</h3>
          <div className="flex gap-2">
            {['1', '2', '3', '4', '5'].map((level) => (
              <label key={level} className="flex items-center">
                <input
                  type="checkbox"
                  name="levels"
                  value={level}
                  checked={initialValues.levels?.includes(level) ?? false}
                  onChange={(e) => {
                    const currentLevels = initialValues.levels?.split(',').filter(Boolean) || []
                    const newLevels = e.target.checked
                      ? [...currentLevels, level]
                      : currentLevels.filter((l) => l !== level)
                    handleFilterChange('levels', newLevels.join(','))
                  }}
                  className="mr-1"
                />
                <span>{level}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Era Filters */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Era</h3>
          <div className="space-y-1">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={initialValues.eighties === 'true'}
                onChange={(e) => handleFilterChange('eighties', e.target.checked)}
                className="mr-2"
              />
              <span>80s</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={initialValues.nineties === 'true'}
                onChange={(e) => handleFilterChange('nineties', e.target.checked)}
                className="mr-2"
              />
              <span>90s</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={initialValues.thisYear === 'true'}
                onChange={(e) => handleFilterChange('thisYear', e.target.checked)}
                className="mr-2"
              />
              <span>{new Date().getFullYear()}</span>
            </label>
          </div>
        </div>

        {/* Music Filters */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Music</h3>
          <div className="space-y-1">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={!!initialValues.keyRef && initialValues.keyRef === nowPlayingKey}
                onChange={(e) => handleFilterChange('keyRef', e.target.checked ? nowPlayingKey || '' : '')}
                className="mr-2"
                disabled={!nowPlayingKey || isPending}
              />
              <span>Same Key</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={initialValues.bpmRef === String(nowPlayingBPM)}
                onChange={(e) => handleFilterChange('bpmRef', e.target.checked ? String(nowPlayingBPM) : '')}
                className="mr-2"
                disabled={!nowPlayingBPM || isPending}
              />
              <span>Similar BPM</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={initialValues.instrumental === 'true'}
                onChange={(e) => handleFilterChange('instrumental', e.target.checked)}
                className="mr-2"
                disabled={isPending}
              />
              <span>Instrumental</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
