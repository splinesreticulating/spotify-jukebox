"use client"

import { SongLink } from "@/app/components"
import TableRowSkeleton from "@/app/components/Skeletons"
import PlayButton from "@/app/components/songs/PlayButton"
import type { Song, SongsTableProps } from "@/app/lib/types"
import { isPlayable } from "@/app/lib/utils"
import Link from "next/link"
import { useEffect, useState, useTransition } from "react"
import React from "react"

export default function Table({
    query,
    currentPage,
    levels,
    instrumental,
    keyMatch,
    keyCompatible,
    bpmRef,
    eighties,
    nineties,
    lastYear,
    thisYear,
    playable,
}: SongsTableProps) {
    const [songs, setSongs] = useState<Song[]>([])
    const [error, setError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()
    const [expandedSong, setExpandedSong] = useState<number | null>(null)

    useEffect(() => {
        startTransition(() => {
            async function fetchData() {
                try {
                    const searchParams = new URLSearchParams({
                        query: query || "",
                        page: currentPage.toString(),
                        levels: levels || "",
                        instrumental: instrumental?.toString() || "",
                        keyMatch: keyMatch || "",
                        keyCompatible: keyCompatible || "",
                        bpmRef: bpmRef || "",
                        eighties: eighties?.toString() || "",
                        nineties: nineties?.toString() || "",
                        lastYear: lastYear?.toString() || "",
                        thisYear: thisYear?.toString() || "",
                        playable: playable?.toString() || "",
                    })

                    const response = await fetch(
                        `/api/songs?${searchParams.toString()}`,
                    )
                    if (!response.ok) {
                        throw new Error("Failed to fetch songs")
                    }
                    const data = await response.json()
                    setSongs(data)
                    setError(null)
                } catch (err) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "An error occurred",
                    )
                    setSongs([])
                }
            }
            fetchData()
        })
    }, [
        query,
        currentPage,
        levels,
        instrumental,
        keyMatch,
        keyCompatible,
        bpmRef,
        eighties,
        nineties,
        lastYear,
        thisYear,
        playable,
    ])

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
                            <div className="overflow-x-hidden md:hidden">
                                <div className="flex flex-col divide-y divide-gray-200">
                                    {songs.map((song) => (
                                        <div
                                            key={song.id}
                                            className="w-full py-3"
                                        >
                                            {/* Main Row - Always Visible */}
                                            <div className="mb-2 flex w-full items-center gap-3">
                                                {isPlayable(song) && (
                                                    <PlayButton
                                                        songId={song.id}
                                                    />
                                                )}
                                                <div className="min-w-0 flex-1 overflow-hidden">
                                                    <SongLink
                                                        song={{
                                                            ...song,
                                                            roboticness:
                                                                song.roboticness ??
                                                                2,
                                                        }}
                                                        showArtist={false}
                                                        className="block max-w-[200px] truncate font-medium sm:max-w-[300px]"
                                                    />
                                                    <p className="max-w-[200px] truncate text-sm text-gray-500 sm:max-w-[300px]">
                                                        {song.artists.join(
                                                            ", ",
                                                        )}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() =>
                                                        setExpandedSong(
                                                            expandedSong ===
                                                                song.id
                                                                ? null
                                                                : song.id,
                                                        )
                                                    }
                                                    className="ml-auto shrink-0 p-2 text-gray-400 hover:text-gray-600"
                                                    aria-label="Toggle details"
                                                >
                                                    <svg
                                                        className={`h-5 w-5 transition-transform ${expandedSong === song.id ? "rotate-180" : ""}`}
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M19 9l-7 7-7-7"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>

                                            {/* Details - Expandable */}
                                            {expandedSong === song.id && (
                                                <div className="space-y-1 pl-10 text-sm">
                                                    <div className="flex justify-between py-1">
                                                        <span className="text-gray-500">
                                                            Level
                                                        </span>
                                                        <span className="text-gray-900">
                                                            {song.level}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between py-1">
                                                        <span className="text-gray-500">
                                                            Key
                                                        </span>
                                                        <span className="text-gray-900">
                                                            {song.key}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between py-1">
                                                        <span className="text-gray-500">
                                                            BPM
                                                        </span>
                                                        <span className="text-gray-900">
                                                            {song.bpm}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between py-1">
                                                        <span className="text-gray-500">
                                                            Year
                                                        </span>
                                                        <span className="text-gray-900">
                                                            {song.year}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Desktop View */}
                            <div className="hidden md:block">
                                <table className="min-w-full text-gray-900">
                                    <thead className="rounded-lg text-left text-sm font-normal">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-4 py-5 font-medium sm:pl-6"
                                            >
                                                Title
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-5 font-medium"
                                            >
                                                Artists
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-5 font-medium"
                                            >
                                                Level
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-5 font-medium"
                                            >
                                                Key
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-5 font-medium"
                                            >
                                                BPM
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-5 font-medium"
                                            >
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
                                                <td className="flex items-center gap-2 whitespace-nowrap py-4 pl-3 pr-4">
                                                    {isPlayable(song) && (
                                                        <PlayButton
                                                            songId={song.id}
                                                        />
                                                    )}
                                                    <SongLink
                                                        song={{
                                                            ...song,
                                                            roboticness:
                                                                song.roboticness ??
                                                                2,
                                                        }}
                                                        showArtist={false}
                                                    />
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-3">
                                                    {song.artists.map(
                                                        (artist, index) => (
                                                            <React.Fragment
                                                                key={artist}
                                                            >
                                                                {index > 0 &&
                                                                    ", "}
                                                                <Link
                                                                    href={`/dashboard/artists/${encodeURIComponent(artist)}`}
                                                                    className="hover:text-red-600 hover:underline"
                                                                >
                                                                    {artist}
                                                                </Link>
                                                            </React.Fragment>
                                                        ),
                                                    )}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-3">
                                                    {song.level}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-3">
                                                    {song.key}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-3">
                                                    {song.bpm}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-3">
                                                    {song.year}
                                                </td>
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
