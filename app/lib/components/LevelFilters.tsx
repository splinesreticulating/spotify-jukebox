'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTheme } from '@/app/lib/ThemeContext'
import clsx from 'clsx'

const allLevels = ['1', '2', '3', '4', '5']

export function LevelFilters({ levels }: { levels: string }) {
  const router = useRouter()
  const currentSearchParams = useSearchParams()
  const initialLevels = levels ? levels.split(',').filter(Boolean) : allLevels
  const [selectedLevels, setSelectedLevels] = useState<string[]>(initialLevels)
  const { theme } = useTheme()

  const getThemeClasses = (isSelected: boolean) => {
    const themeMap = {
      ocean: {
        selected: 'bg-ocean-primary text-white',
        unselected: 'bg-white text-ocean-primary border-ocean-primary',
      },
      forest: {
        selected: 'bg-forest-primary text-white',
        unselected: 'bg-white text-forest-primary border-forest-primary',
      },
      sunset: {
        selected: 'bg-sunset-primary text-white',
        unselected: 'bg-white text-sunset-primary border-sunset-primary',
      },
      purple: {
        selected: 'bg-purple-primary text-white',
        unselected: 'bg-white text-purple-primary border-purple-primary',
      },
      midnight: {
        selected: 'bg-midnight-primary text-white',
        unselected: 'bg-white text-midnight-primary border-midnight-primary',
      },
      christmas: {
        selected: 'bg-christmas-primary text-white',
        unselected: 'bg-white text-christmas-primary border-christmas-primary',
      },
    }
    return isSelected ? themeMap[theme].selected : themeMap[theme].unselected
  }

  useEffect(() => {
    if (!currentSearchParams) return

    const levelsQuery = selectedLevels.join(',')
    const newSearchParams = new URLSearchParams(Object.fromEntries(currentSearchParams.entries()))
    newSearchParams.set('levels', levelsQuery)
    router.replace(`?${newSearchParams.toString()}`)
  }, [selectedLevels])

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
            className={clsx('hw-1 cursor-pointer rounded border px-2', getThemeClasses(selectedLevels.includes(level)))}
          >
            {level[0]}
          </span>
        </label>
      ))}
    </div>
  )
}
