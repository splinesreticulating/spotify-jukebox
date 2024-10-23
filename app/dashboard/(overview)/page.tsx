import CardWrapper from '@/app/ui/dashboard/cards'
import LatestSongs from '@/app/ui/dashboard/latest-songs'
import { openSans } from '@/app/ui/fonts'
import { Suspense } from 'react'
import { LatestSongsSkeleton, CardsSkeleton } from '@/app/ui/skeletons'

export default async function Page() {
  return (
    <main>
      <h1 className={`${openSans.className} mb-4 text-xl md:text-2xl`}>Dashboard</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<LatestSongsSkeleton />}>
          <LatestSongs />
        </Suspense>
      </div>
    </main>
  )
}
