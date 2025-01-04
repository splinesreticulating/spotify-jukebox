'use client'

import { useEffect, useState, useTransition } from 'react'
import Link from 'next/link'
import PlayButton from '@/app/ui/songs/PlayButton'
import TableRowSkeleton from '@/app/ui/skeletons'
import type { Song, SongsTableProps } from '@/app/lib/types'

export default function Table({
  query,
  currentPage,
  levels,
  instrumental,
  keyRef,
  bpmRef,
  eighties,
  nineties,
  thisYear,
}: SongsTableProps) {
  const [songs, setSongs] = useState<Song[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    startTransition(() => {
      async function fetchData() {
        try {
          const searchParams = new URLSearchParams({
            query: query || '',
            page: currentPage.toString(),
            levels: levels || '',
            instrumental: instrumental?.toString() || '',
            keyRef: keyRef || '',
            bpmRef: bpmRef || '',
            eighties: eighties?.toString() || '',
            nineties: nineties?.toString() || '',
            thisYear: thisYear?.toString() || '',
          })

          const response = await fetch(`/api/songs?${searchParams.toString()}`)
          if (!response.ok) {
            throw new Error('Failed to fetch songs')
          }
          const data = await response.json()
          setSongs(data)
          setError(null)
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An error occurred')
          setSongs([])
        }
      }
      fetchData()
    })
  }, [query, currentPage, levels, instrumental, keyRef, bpmRef, eighties, nineties, thisYear])

  if (isPending) {
    return <TableRowSkeleton />
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>
  }

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {songs.length === 0 ? (
            <p className="p-4 text-gray-500">No songs found</p>
          ) : (
            <>
              {/* Mobile View */}
              <div className="md:hidden">
                {songs.map((song) => (
                  <div key={song.id} className="mb-2 w-full rounded-md bg-white p-4">
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <div className="mb-2 flex items-center">
                          <PlayButton songId={song.id} />
                          <Link href={`/dashboard/songs/${song.id}/edit`} className="ml-2">
                            {song.title}
                          </Link>
                        </div>
                        <p className="text-sm text-gray-500">{song.artists.join(', ')}</p>
                      </div>
                    </div>
                    <div className="flex w-full items-center justify-between pt-4">
                      <div>
                        <p className="text-sm">Level: {song.level}</p>
                        <p className="text-sm">Key: {song.key}</p>
                      </div>
                      <div>
                        <p className="text-sm">BPM: {song.bpm}</p>
                        <p className="text-sm">Year: {song.year}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View */}
              <div className="hidden md:block">
                <table className="min-w-full text-gray-900">
                  <thead className="rounded-lg text-left text-sm font-normal">
                    <tr>
                      <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                        Title
                      </th>
                      <th scope="col" className="px-3 py-5 font-medium">
                        Artists
                      </th>
                      <th scope="col" className="px-3 py-5 font-medium">
                        Level
                      </th>
                      <th scope="col" className="px-3 py-5 font-medium">
                        Key
                      </th>
                      <th scope="col" className="px-3 py-5 font-medium">
                        BPM
                      </th>
                      <th scope="col" className="px-3 py-5 font-medium">
                        Year
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {songs.map((song) => (
                      <tr
                        key={song.id}
                        className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                      >
                        <td className="whitespace-nowrap py-3 pl-6 pr-3">
                          <div className="flex items-center gap-3">
                            <PlayButton songId={song.id} />
                            <Link href={`/dashboard/songs/${song.id}/edit`}>{song.title}</Link>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-3">{song.artists.join(', ')}</td>
                        <td className="whitespace-nowrap px-3 py-3">{song.level}</td>
                        <td className="whitespace-nowrap px-3 py-3">{song.key}</td>
                        <td className="whitespace-nowrap px-3 py-3">{song.bpm}</td>
                        <td className="whitespace-nowrap px-3 py-3">{song.year}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
