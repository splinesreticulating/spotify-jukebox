import clsx from 'clsx'
import { openSans } from '@/app/ui/fonts'
import { fetchLatestSongs } from '@/app/lib/data'
import Link from 'next/link'
import { daysAgo } from '@/app/lib/utils'
import { PlayIcon } from '@heroicons/react/16/solid'

export interface LatestSong {
  id: number
  title: string
  artists: string[]
  date_added: Date
}

export default async function LatestSongs() {
  const songs: LatestSong[] = await fetchLatestSongs()

  return (
    <div className="w-full">
      <h2 className={`${openSans.className} mb-4 px-4 text-lg font-bold md:px-0 md:text-xl`}>Latest Songs</h2>
      <div className="space-y-2">
        {songs.map((song) => (
          <div
            key={`song-${song.id}`}
            className="rounded-lg bg-white p-3 shadow-sm transition-shadow duration-200 hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <button
                className="group flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100"
                aria-label={`Play ${song.title}`}
              >
                <PlayIcon
                  className="h-5 w-5 text-gray-600 transition-colors group-hover:text-red-600"
                  aria-hidden="true"
                />
              </button>

              <div className="min-w-0 flex-1">
                <Link
                  href={`/dashboard/songs/${song.id}/edit`}
                  className="block text-sm font-medium transition-colors hover:text-red-600"
                >
                  {song.title.length > 40 ? `${song.title.substring(0, 40)}...` : song.title}
                </Link>
                <p className="mt-0.5 text-xs text-gray-500">
                  {Array.isArray(song.artists)
                    ? song.artists.join(', ').length > 60
                      ? `${song.artists.join(', ').substring(0, 60)}...`
                      : song.artists.join(', ')
                    : ''}
                </p>
              </div>

              <span className="flex-shrink-0 text-xs text-gray-400">{daysAgo(song.date_added!)}d</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
