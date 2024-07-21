import Pagination from '@/app/ui/songs/pagination'
import Search from '@/app/ui/search'
import Table from '@/app/ui/songs/table'
import { openSans } from '@/app/ui/fonts'
import { SongsTableSkeleton } from '@/app/ui/skeletons'
import { Suspense } from 'react'
import { fetchNowPlayingSongID, fetchSongById, fetchSongsPages } from '@/app/lib/data'
import { Metadata } from 'next'
import { LevelFilters } from '@/app/lib/components/LevelFilters'
import InstrumentalFilter from '@/app/ui/components/InstrumentalFilter'
import MaybeFilter from '@/app/ui/components/maybeFilter'

export const metadata: Metadata = {
  title: 'Songs',
}

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string
    page?: string
    levels?: string
    instrumental?: string
    keyRef?: string
  }
}) {
  const query = searchParams?.query || ''
  const currentPage = Number(searchParams?.page) || 1
  const levels = searchParams?.levels || ''
  const instrumental = Number(searchParams?.instrumental) || 0

  const nowPlayingSongId = await fetchNowPlayingSongID()
  const nowPlayingSong = await fetchSongById(nowPlayingSongId!)
  const keyRef = nowPlayingSong?.info ?? undefined
  const totalPages = await fetchSongsPages(query, levels, instrumental, keyRef)

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${openSans.className} text-2xl`}>Songs</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search..." />
      </div>
      <div className="flex items-center justify-between gap-2">
        <LevelFilters levels={levels} />
        <InstrumentalFilter initialValue={instrumental} />
        <MaybeFilter initialValue={keyRef} />
      </div>
      <Suspense key={query + currentPage + levels + instrumental + keyRef} fallback={<SongsTableSkeleton />}>
        <Table query={query} currentPage={currentPage} levels={levels} instrumental={instrumental} keyRef={keyRef}/>
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  )
}
