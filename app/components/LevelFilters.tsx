'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTheme } from '@/app/lib/ThemeContext'
import clsx from 'clsx'
import { getThemeClasses } from '@/app/lib/theme-utils'

const allLevels = ['1', '2', '3', '4', '5']

export function LevelFilters({ levels }: { levels: string }) {
  const router = useRouter()
  const currentSearchParams = useSearchParams()
  const initialLevels = levels ? levels.split(',').filter(Boolean) : allLevels
  const [selectedLevels, setSelectedLevels] = useState<string[]>(initialLevels)
  const { theme } = useTheme()

  useEffect(() => {
    if (!currentSearchParams) return

    const levelsQuery = selectedLevels.join(',')
    const newSearchParams = new URLSearchParams(Object.fromEntries(currentSearchParams.entries()))
    newSearchParams.set('levels', levelsQuery)
    router.replace(`?${newSearchParams.toString()}`)
  }, [currentSearchParams, router, selectedLevels])

  const handleCheckboxChange = (level: string) => {
    setSelectedLevels((prevLevels) =>
      prevLevels.includes(level) ? prevLevels.filter((l) => l !== level) : [...prevLevels, level],
    )
  }

  return (
    <div className="mb-4 flex justify-end gap-1">
      {allLevels.map((level) => (
        <label key={level} className="flex items-center">
          <input
            type="checkbox"
            name="levels"
            value={level}
            onChange={() => handleCheckboxChange(level)}
            checked={selectedLevels.includes(level)}
            className="hidden"
          />
          <span
            className={clsx(
              'hw-1 cursor-pointer rounded border px-2',
              getThemeClasses<'level-filter'>(
                theme,
                'level-filter',
                selectedLevels.includes(level) ? 'selected' : 'unselected',
              ),
            )}
          >
            {level[0]}
          </span>
        </label>
      ))}
    </div>
  )
}
