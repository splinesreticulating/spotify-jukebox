'use client'

import { useTransition } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

type SearchFiltersProps = {
  initialValues: Record<string, string>
  nowPlayingKey?: string
  nowPlayingBPM?: number
}

export default function SearchFilters({ initialValues, nowPlayingKey, nowPlayingBPM }: SearchFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [_isPending, startTransition] = useTransition()

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
          placeholder="Search..."
          defaultValue={initialValues.query}
          onChange={(e) => handleFilterChange('query', e.target.value)}
        />
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
      </div>
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {/* Level Buttons */}
        {['1', '2', '3', '4', '5'].map((level) => (
          <button
            key={level}
            onClick={() => {
              const currentLevels = initialValues.levels?.split(',').filter(Boolean) || []
              const newLevels = currentLevels.includes(level)
                ? currentLevels.filter((l) => l !== level)
                : [...currentLevels, level]
              handleFilterChange('levels', newLevels.join(','))
            }}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors
              ${
                initialValues.levels?.includes(level)
                  ? 'border-2 border-blue-700 bg-blue-100 text-blue-700'
                  : 'border-2 border-transparent bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
              ${level === '5' ? 'mr-4' : ''}`}
          >
            {level}
          </button>
        ))}

        {/* Era Buttons */}
        {[
          { id: 'eighties', label: '80s' },
          { id: 'nineties', label: '90s' },
          { id: 'thisYear', label: new Date().getFullYear().toString() },
        ].map(({ id, label }, index, array) => (
          <button
            key={id}
            onClick={() => {
              if (initialValues[id] === 'true') {
                handleFilterChange(id, '')
              } else {
                handleFilterChange(id, true)
              }
            }}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors
              ${
                initialValues[id] === 'true'
                  ? 'border-2 border-purple-700 bg-purple-100 text-purple-700'
                  : 'border-2 border-transparent bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
              ${index === array.length - 1 ? 'mr-4' : ''}`}
          >
            {label}
          </button>
        ))}

        {/* Music Buttons */}
        <button
          onClick={() => handleFilterChange('instrumental', initialValues.instrumental !== 'true')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors
            ${
              initialValues.instrumental === 'true'
                ? 'border-2 border-green-700 bg-green-100 text-green-700'
                : 'border-2 border-transparent bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
        >
          Instrumental
        </button>
        <button
          onClick={() => handleFilterChange('bpmRef', initialValues.bpmRef ? '' : String(nowPlayingBPM))}
          disabled={!nowPlayingBPM}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors
            ${
              initialValues.bpmRef === String(nowPlayingBPM)
                ? 'border-2 border-green-700 bg-green-100 text-green-700'
                : 'border-2 border-transparent bg-gray-100 text-gray-700 hover:bg-gray-200'
            } disabled:cursor-not-allowed disabled:opacity-50`}
        >
          Similar BPM
        </button>
        <button
          onClick={() => handleFilterChange('keyRef', initialValues.keyRef ? '' : nowPlayingKey || '')}
          disabled={!nowPlayingKey}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors
            ${
              initialValues.keyRef === nowPlayingKey
                ? 'border-2 border-green-700 bg-green-100 text-green-700'
                : 'border-2 border-transparent bg-gray-100 text-gray-700 hover:bg-gray-200'
            } disabled:cursor-not-allowed disabled:opacity-50`}
        >
          Same Key
        </button>
      </div>
    </div>
  )
}
