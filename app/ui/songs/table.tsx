import { fetchFilteredSongs } from '@/app/lib/data'
import Link from 'next/link'
import PlayButton from './PlayButton'

export default async function Table({
  query,
  currentPage,
  levels,
  instrumental,
  keyRef,
  bpmRef,
  eighties,
  nineties,
}: {
  query: string
  currentPage: number
  levels: string
  instrumental: number
  keyRef?: string
  bpmRef?: string
  eighties?: boolean
  nineties?: boolean
}) {
  const songs = await fetchFilteredSongs(query, currentPage, levels, instrumental, keyRef, bpmRef, eighties, nineties)

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* MOBILE */}
          <div className="md:hidden">
            {songs?.map((song) => (
              <div key={song.id} className="mb-2 w-full rounded-md bg-white p-1 text-xs">
                <div className="flex items-center justify-between pb-1">
                  <div className="flex items-center">
                    <PlayButton songId={song.id} />
                    <Link href={`/dashboard/songs/${song.id}/edit`}>
                      {song.artists?.join(', ') || ''} - {song.title || ''}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP */}
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Artist
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Title
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Level
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  BPM
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Key
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Year
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Added
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {songs?.map((song) => (
                <tr
                  key={song.id}
                  className="
                    w-full border-b py-3 text-sm last-of-type:border-none
                    [&:first-child>td:first-child]:rounded-tl-lg
                    [&:first-child>td:last-child]:rounded-tr-lg
                    [&:last-child>td:first-child]:rounded-bl-lg
                    [&:last-child>td:last-child]:rounded-br-lg
                  "
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">{song.artists?.join(', ') || ''}</td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <PlayButton songId={song.id} />
                    <Link href={`/dashboard/songs/${song.id}/edit`}>
                      <strong>{song.title || ''}</strong>
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <p>{song.level ? song.level : ''}</p>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">{song.bpm || ''}</td>
                  <td className="whitespace-nowrap px-3 py-3">{song.key || ''}</td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {song.year && Number(song.year) > 1700 ? song.year : ''}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">{song.date_added?.toDateString() || ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
