import { Suspense } from 'react'
import { fetchNowPlayingSongID, fetchSongById, fetchSongsPages } from '@/app/lib/data'
import { Metadata } from 'next'
import { SongsTableSkeleton } from '@/app/ui/skeletons'
import SearchFilters from '@/app/ui/songs/SearchFilters'
import SearchResults from '@/app/ui/songs/SearchResults'

export const metadata: Metadata = {
  title: 'Search',
}

async function getData(searchParams: Record<string, string>) {
  const query = searchParams.query || ''
  const levels = searchParams.levels || ''
  const instrumental = Number(searchParams.instrumental) || 0
  const keyRef = searchParams.keyRef
  const bpmRef = searchParams.bpmRef
  const eighties = Boolean(searchParams.eighties)
  const nineties = Boolean(searchParams.nineties)

  const nowPlayingSongId = await fetchNowPlayingSongID()
  const nowPlayingSong = await fetchSongById(nowPlayingSongId!)
  const totalPages = await fetchSongsPages(query, levels, instrumental, keyRef, bpmRef, eighties, nineties)

  return {
    nowPlayingSong,
    totalPages,
  }
}

export default async function Page({ searchParams }: { searchParams: Record<string, string> }) {
  const { nowPlayingSong, totalPages } = await getData(searchParams)

  return (
    <div className="w-full">
      <h1 className="text-2xl">Search</h1>
      <SearchFilters
        initialValues={searchParams}
        nowPlayingKey={nowPlayingSong?.info || ''}
        nowPlayingBPM={nowPlayingSong?.bpm}
      />
      <Suspense fallback={<SongsTableSkeleton />}>
        <SearchResults searchParams={{ ...searchParams, totalPages }} />
      </Suspense>
    </div>
  )
}
