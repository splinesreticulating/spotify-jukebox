"use client"

import { SongLink } from "@/app/components/SongLink"
import PlayButton from "@/app/components/songs/PlayButton"
import type { ArtistSongView } from "@/app/lib/types/artists"
import { format } from "date-fns"
import { useState } from "react"

type SortField = "title" | "date_added" | "album"
type SortDirection = "asc" | "desc"

export default function SongTable({
    songs: initialSongs,
}: { songs: ArtistSongView[] }) {
    const [songs, setSongs] = useState(initialSongs)
    const [sortField, setSortField] = useState<SortField>("date_added")
    const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

    const handleSort = (field: SortField) => {
        const newDirection =
            field === sortField && sortDirection === "desc" ? "asc" : "desc"
        setSortDirection(newDirection)
        setSortField(field)

        const sortedSongs = [...songs].sort((a, b) => {
            if (field === "title") {
                return (
                    (a.title || "").localeCompare(b.title || "") *
                    (newDirection === "asc" ? 1 : -1)
                )
            }
            if (field === "date_added") {
                return (
                    (a.date_added.getTime() - b.date_added.getTime()) *
                    (newDirection === "asc" ? 1 : -1)
                )
            }
            if (field === "album") {
                return (
                    (a.album || "").localeCompare(b.album || "") *
                    (newDirection === "asc" ? 1 : -1)
                )
            }
            return 0
        })

        setSongs(sortedSongs)
    }

    const SortArrow = ({ direction }: { direction: SortDirection }) => {
        return <span className="ml-1">{direction === "asc" ? "↑" : "↓"}</span>
    }

    return (
        <div className="overflow-x-auto rounded-lg bg-white">
            <table className="min-w-full table-fixed divide-y divide-gray-200">
                <thead>
                    <tr className="bg-gray-50">
                        <th
                            scope="col"
                            className="w-2/3 cursor-pointer px-2 py-3 text-left text-sm font-semibold text-gray-900 hover:text-gray-700 sm:w-2/5 sm:px-3"
                            onClick={() => handleSort("title")}
                        >
                            Title{" "}
                            {sortField === "title" && (
                                <SortArrow direction={sortDirection} />
                            )}
                        </th>
                        <th
                            scope="col"
                            className="hidden w-1/6 cursor-pointer px-3 py-3 text-left text-sm font-semibold text-gray-900 hover:text-gray-700 sm:table-cell"
                            onClick={() => handleSort("album")}
                        >
                            Album{" "}
                            {sortField === "album" && (
                                <SortArrow direction={sortDirection} />
                            )}
                        </th>
                        <th
                            scope="col"
                            className="w-1/3 cursor-pointer px-2 py-3 text-left text-sm font-semibold text-gray-900 hover:text-gray-700 sm:w-1/4 sm:px-3"
                            onClick={() => handleSort("date_added")}
                        >
                            Added{" "}
                            {sortField === "date_added" && (
                                <SortArrow direction={sortDirection} />
                            )}
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    {songs.map((song) => (
                        <tr key={song.id} className="hover:bg-gray-50">
                            <td className="w-2/3 px-2 py-3 sm:w-2/5 sm:px-3">
                                <div className="flex items-center gap-2">
                                    <PlayButton songId={song.id} />
                                    <div className="max-w-[calc(60vw-3rem)] overflow-hidden sm:max-w-[calc(40vw-6rem)]">
                                        <SongLink
                                            song={song}
                                            showArtist={false}
                                            className="block truncate"
                                        />
                                    </div>
                                </div>
                            </td>
                            <td className="hidden w-1/6 whitespace-nowrap px-3 py-3 text-sm text-gray-600 sm:table-cell">
                                {song.album || "-"}
                            </td>
                            <td className="w-1/3 whitespace-nowrap px-2 py-3 text-sm text-gray-600 sm:w-1/4 sm:px-3">
                                {format(
                                    new Date(song.date_added),
                                    "MMM d, yyyy",
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
