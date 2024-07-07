'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export function LevelFilters({ levels }: { levels: string }) {
    const router = useRouter()
    const currentSearchParams = useSearchParams()
    const [selectedLevels, setSelectedLevels] = useState<string[]>(levels.split(',').filter(Boolean))

    useEffect(() => {
        const levelsQuery = selectedLevels.join(',')
        const newSearchParams = new URLSearchParams(Object.fromEntries(currentSearchParams.entries()))
        newSearchParams.set('levels', levelsQuery)
        router.replace(`?${newSearchParams.toString()}`)
    }, [selectedLevels])

    const handleCheckboxChange = (level: string) => {
        setSelectedLevels((prevLevels) =>
            prevLevels.includes(level)
                ? prevLevels.filter((l) => l !== level)
                : [...prevLevels, level]
        )
    }

    return (
        <div className='mb-4'>
            <label>
                <input
                    type='checkbox'
                    name='levels'
                    value='1000'
                    onChange={() => handleCheckboxChange('1000')}
                    checked={selectedLevels.includes('1000')}
                />
                1
            </label>
            <label>
                <input
                    type='checkbox'
                    name='levels'
                    value='2000'
                    onChange={() => handleCheckboxChange('2000')}
                    checked={selectedLevels.includes('2000')}
                />
                2
            </label>
            <label>
                <input
                    type='checkbox'
                    name='levels'
                    value='3000'
                    onChange={() => handleCheckboxChange('3000')}
                    checked={selectedLevels.includes('3000')}
                />
                3
            </label>
            <label>
                <input
                    type='checkbox'
                    name='levels'
                    value='4000'
                    onChange={() => handleCheckboxChange('4000')}
                    checked={selectedLevels.includes('4000')}
                />
                4
            </label>
            <label>
                <input
                    type='checkbox'
                    name='levels'
                    value='5000'
                    onChange={() => handleCheckboxChange('5000')}
                    checked={selectedLevels.includes('5000')}
                />
                5
            </label>
        </div>
    )
}
