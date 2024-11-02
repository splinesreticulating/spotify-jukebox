import { Suspense } from 'react'
import { fetchNowPlayingSongID, fetchSongById, fetchSongsPages } from '@/app/lib/data'
import { Metadata } from 'next'
import { SongsTableSkeleton } from '@/app/ui/skeletons'
import SearchFilters from '@/app/ui/songs/SearchFilters'
import SearchResults from '@/app/ui/songs/SearchResults'

export const metadata: Metadata = {
  title: 'Search',
}

async function getData(searchParams: Promise<Record<string, string>>) {
  const { query, levels, instrumentalness, keyRef, bpmRef, eighties, nineties } = await searchParams

  const nowPlayingSongId = await fetchNowPlayingSongID()
  const nowPlayingSong = await fetchSongById(nowPlayingSongId!)
  const totalPages = await fetchSongsPages(query, levels, instrumentalness, keyRef, bpmRef, eighties, nineties)

  return {
    nowPlayingSong,
    totalPages,
  }
}

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const { nowPlayingSong, totalPages } = await getData(searchParams)

  return (
    <div className="w-full">
      <h1 className="text-2xl">Search</h1>
      <SearchFilters
        initialValues={await searchParams}
        nowPlayingKey={nowPlayingSong?.info || ''}
        nowPlayingBPM={nowPlayingSong?.bpm}
      />
      <Suspense fallback={<SongsTableSkeleton />}>
        <SearchResults searchParams={{ ...(await searchParams), totalPages }} />
      </Suspense>
    </div>
  )
}
