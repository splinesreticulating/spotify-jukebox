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
      <h2 className={`${openSans.className} mb-6 text-xl md:text-2xl`}>Latest Songs</h2>

      {/* Desktop View */}
      <div className="hidden lg:block">
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="w-12 px-3 py-3"></th>
                <th scope="col" className="px-3 py-3 text-left text-sm font-semibold text-gray-900">
                  Song
                </th>
                <th scope="col" className="px-3 py-3 text-left text-sm font-semibold text-gray-900">
                  Artists
                </th>
                <th scope="col" className="px-3 py-3 text-right text-sm font-semibold text-gray-900">
                  Added
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {songs.map((song) => (
                <tr key={song.id} className="transition-colors hover:bg-gray-50">
                  <td className="whitespace-nowrap px-3 py-4">
                    <button
                      className="group flex h-8 w-8 items-center justify-center rounded-full 
                               bg-gray-50 transition-colors hover:bg-gray-100"
                      aria-label={`Play ${song.title}`}
                    >
                      <PlayIcon
                        className="h-4 w-4 text-gray-600 transition-colors group-hover:text-red-600"
                        aria-hidden="true"
                      />
                    </button>
                  </td>
                  <td className="whitespace-nowrap py-4 pl-3 pr-4">
                    <Link
                      href={`/dashboard/songs/${song.id}/edit`}
                      className="text-sm font-medium text-gray-900 transition-colors hover:text-red-600"
                    >
                      {song.title}
                    </Link>
                  </td>
                  <td className="max-w-[300px] truncate whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {Array.isArray(song.artists) ? song.artists.join(', ') : ''}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-right text-sm text-gray-500">
                    {daysAgo(song.date_added!)}d ago
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile View */}
      <div className="space-y-2 lg:hidden">
        {songs.map((song) => (
          <div
            key={song.id}
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
