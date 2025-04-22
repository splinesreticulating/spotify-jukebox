'use client'

import { Suspense, useState, useEffect } from 'react'
import {
  fetchWeeklyAverageYear,
  fetchAvailableSongsByLevel,
  fetchAvailableSongsByPeriod,
  fetchAvailableSongsByTag,
  fetchAvailableSongsByArtist,
} from '@/app/lib/data'
import { Card } from '@/app/components/dashboard/Cards'
import { BarChart } from '@/app/components/stats/BarChart'
import { PeriodChart } from '@/app/components/stats/PeriodChart'
import { TagChart } from '@/app/components/stats/TagChart'
import { ArtistChart } from '@/app/components/stats/ArtistChart'
import { CardsSkeleton } from '@/app/components/Skeletons'

const timeOptions = [
  { value: 1 / 24, label: 'Last Hour' },
  { value: 1, label: 'Today' },
  { value: 7, label: 'This Week' },
  { value: 30, label: 'This Month' },
  { value: 90, label: 'Last 3 Months' },
  { value: 365, label: 'This Year' },
]

export default function StatsPage() {
  const [selectedDays, setSelectedDays] = useState(7)
  const [averageYear, setAverageYear] = useState<number | null>(null)
  const [availableSongs, setAvailableSongs] = useState<Array<{ level: number; count: number }>>([])
  const [availableSongsByPeriod, setAvailableSongsByPeriod] = useState<Array<{ period: string; count: number }>>([])
  const [availableSongsByTag, setAvailableSongsByTag] = useState<Array<{ tag: string; count: number }>>([])
  const [availableSongsByArtist, setAvailableSongsByArtist] = useState<Array<{ artist: string; count: number }>>([])
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(true)
  const [showOnlyAvailablePeriod, setShowOnlyAvailablePeriod] = useState(true)
  const [showOnlyAvailableTags, setShowOnlyAvailableTags] = useState(true)
  const [showOnlyAvailableArtists, setShowOnlyAvailableArtists] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      const [yearData, songsData, periodData, tagData, artistData] = await Promise.all([
        fetchWeeklyAverageYear(selectedDays),
        fetchAvailableSongsByLevel(showOnlyAvailable),
        fetchAvailableSongsByPeriod(showOnlyAvailablePeriod),
        fetchAvailableSongsByTag(showOnlyAvailableTags),
        fetchAvailableSongsByArtist(showOnlyAvailableArtists),
      ])
      setAverageYear(yearData)
      setAvailableSongs(songsData)
      setAvailableSongsByPeriod(periodData)
      setAvailableSongsByTag(tagData)
      setAvailableSongsByArtist(artistData)
    }
    loadData()
  }, [selectedDays, showOnlyAvailable, showOnlyAvailablePeriod, showOnlyAvailableTags, showOnlyAvailableArtists])

  const timeDropdown = (
    <select
      value={selectedDays}
      onChange={(e) => setSelectedDays(Number(e.target.value))}
      className="rounded-md border border-gray-200 px-2 py-1 text-sm"
    >
      {timeOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )

  return (
    <main>
      <div className="grid gap-6 sm:grid-cols-2">
        <Suspense fallback={<CardsSkeleton />}>
          <Card
            title="Average Vintage in Rotation"
            value={averageYear?.toString() || 'N/A'}
            type="songs"
            dropdown={timeDropdown}
          />
        </Suspense>
        <div className="rounded-xl bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium">Nuts by Level</h2>
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={showOnlyAvailable}
                onChange={(e) => setShowOnlyAvailable(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span>Available</span>
            </label>
          </div>
          <div className="mt-4 h-48">
            <BarChart data={availableSongs} />
          </div>
        </div>
      </div>
      <div className="mt-6">
        <div className="rounded-xl bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium">Nuts by Period</h2>
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={showOnlyAvailablePeriod}
                onChange={(e) => setShowOnlyAvailablePeriod(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span>Available</span>
            </label>
          </div>
          <div className="mt-4 h-48">
            <PeriodChart data={availableSongsByPeriod} />
          </div>
        </div>
      </div>
      <div className="mt-6">
        <div className="rounded-xl bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium">Top Artists</h2>
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={showOnlyAvailableArtists}
                onChange={(e) => setShowOnlyAvailableArtists(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span>Available</span>
            </label>
          </div>
          <div className="mt-4 h-48">
            <ArtistChart data={availableSongsByArtist} />
          </div>
        </div>
      </div>
      <div className="mt-6">
        <div className="rounded-xl bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium">Top Flavours</h2>
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={showOnlyAvailableTags}
                onChange={(e) => setShowOnlyAvailableTags(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span>Available</span>
            </label>
          </div>
          <div className="mt-4 h-48">
            <TagChart data={availableSongsByTag} />
          </div>
        </div>
      </div>
    </main>
  )
}
