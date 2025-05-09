"use client"

import { Heart } from "@/app/components/Heart"
import { NowPlayingSkeleton } from "@/app/components/Skeletons"
import { SongLink } from "@/app/components/SongLink"
import PlayButton from "@/app/components/songs/PlayButton"
import { useFont } from "@/app/lib/FontContext"
import { useTheme } from "@/app/lib/ThemeContext"
import { befriend, defriend } from "@/app/lib/actions"
import { fetchCompatibleSongs } from "@/app/lib/actions"
import { getThemeClasses } from "@/app/lib/theme-utils"
import type { NowPlayingData, NowPlayingSong } from "@/app/lib/types/songs"
import { getLevelColor } from "@/app/lib/utils"
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline"
import clsx from "clsx"
import Image from "next/image"
import React, { useState, useEffect } from "react"

export default function NowPlayingPage() {
    const [nowPlayingData, setNowPlayingData] = useState<NowPlayingData | null>(
        null,
    )
    const [isLoading, setIsLoading] = useState(true)
    const [isExpanded, setIsExpanded] = useState(false)
    const [compatibleSongs, setCompatibleSongs] = useState<NowPlayingSong[]>([])
    const [isNextSongCompatible, setIsNextSongCompatible] = useState(false)
    const [currentShow, setCurrentShow] = useState<string | null>(null)
    const { theme } = useTheme()
    const { currentFont, nextFont } = useFont()

    useEffect(() => {
        let eventSource: EventSource | null = null

        const setupEventSource = () => {
            eventSource = new EventSource("/api/nowPlaying")

            eventSource.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data)
                    setNowPlayingData(data)
                    setIsLoading(false)
                } catch (error) {
                    console.error("Error parsing SSE data:", error)
                    setIsLoading(false)
                }
            }

            eventSource.onerror = (event) => {
                console.error("EventSource failed:", event)
                setIsLoading(false)

                // Close the connection on error
                eventSource?.close()

                // Attempt to reconnect after a delay
                setTimeout(() => {
                    if (document.visibilityState === "visible") {
                        setupEventSource()
                    }
                }, 5000)
            }

            // Listen for error events from the server
            eventSource.addEventListener("error", (event: MessageEvent) => {
                try {
                    const errorData = JSON.parse(event.data)
                    console.error("Server error:", errorData)
                    // Optionally show error to user via toast or other UI mechanism
                } catch (error) {
                    console.error("Error parsing error event:", error)
                }
            })
        }

        setupEventSource()

        // Handle visibility change
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                if (eventSource) {
                    eventSource.close()
                }
                setupEventSource()
            }
        }

        document.addEventListener("visibilitychange", handleVisibilityChange)

        return () => {
            eventSource?.close()
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange,
            )
        }
    }, [])

    useEffect(() => {
        const checkCompatibility = async () => {
            if (nowPlayingData?.currentSong && nowPlayingData?.nextSong?.id) {
                const {
                    compatibleSongs: songs,
                    isNextSongCompatible: nextCompatible,
                } = await fetchCompatibleSongs(
                    nowPlayingData.currentSong.id,
                    nowPlayingData.nextSong.id,
                )
                setIsNextSongCompatible(nextCompatible)
                setCompatibleSongs(songs)
            }
        }

        checkCompatibility()
    }, [nowPlayingData])

    useEffect(() => {
        const fetchCurrentShow = async () => {
            try {
                const response = await fetch("/api/currentShow")
                if (!response.ok)
                    throw new Error("Failed to fetch current show")
                const data = await response.json()
                setCurrentShow(data.showName)
            } catch (error) {
                console.error("Error fetching current show:", error)
            }
        }

        fetchCurrentShow()
        const interval = setInterval(fetchCurrentShow, 60000) // Update every minute

        return () => clearInterval(interval)
    }, [])

    const toggleFriendship = async () => {
        if (!nowPlayingData) return

        const action = nowPlayingData.friends ? defriend : befriend
        await action(nowPlayingData)

        setNowPlayingData((prev) => prev && { ...prev, friends: !prev.friends })
    }

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded)
    }

    if (isLoading) return <NowPlayingSkeleton />
    if (!nowPlayingData) return null

    const { lastSong, currentSong, nextSong, friends } = nowPlayingData

    return (
        <main className="flex flex-col items-center justify-center p-4 sm:p-6">
            <section className="w-full max-w-md text-center">
                {currentShow && (
                    <button
                        className={clsx(
                            "mb-4 cursor-pointer rounded-lg px-4 py-2 shadow-sm",
                            getThemeClasses<"background">(theme, "background"),
                        )}
                        onClick={nextFont}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                nextFont()
                            }
                        }}
                        type="button"
                    >
                        <h2
                            className={clsx(
                                "text-lg font-medium italic text-gray-600",
                                currentFont.className,
                            )}
                        >
                            {currentShow}
                        </h2>
                    </button>
                )}
                <Image
                    src="/squirrelGuitarButton.png"
                    width={92}
                    height={95}
                    alt="Squirrel button"
                    className="mx-auto my-2"
                />
                <ul className="flex w-full flex-col items-center space-y-4">
                    <li>
                        {lastSong ? (
                            <>
                                <span className={getLevelColor(lastSong.level)}>
                                    last:
                                </span>{" "}
                                <SongLink song={lastSong} />
                            </>
                        ) : (
                            <span className="text-gray-400">last: (none)</span>
                        )}
                    </li>
                    <li>
                        <Heart
                            onHeartClick={toggleFriendship}
                            isHeartFilled={friends}
                        />
                    </li>
                    <li>
                        <div className="flex items-center justify-center gap-2">
                            {currentSong ? (
                                <span
                                    className={getLevelColor(
                                        currentSong.level ?? 3,
                                    )}
                                >
                                    <strong>now:</strong>{" "}
                                    <SongLink
                                        song={currentSong}
                                        className="font-bold"
                                    />
                                </span>
                            ) : (
                                <span className="text-gray-400">
                                    now: (none)
                                </span>
                            )}
                        </div>
                        {isExpanded && compatibleSongs.length > 0 && (
                            <div className="mt-4 space-y-2 text-sm text-gray-600">
                                <p className="font-medium">or...</p>
                                <ul className="space-y-1 text-center">
                                    {compatibleSongs.map((song) => (
                                        <li
                                            key={song.id}
                                            className="flex items-center justify-center gap-1"
                                        >
                                            <PlayButton songId={song.id} />
                                            <SongLink song={song} />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </li>
                    <li>
                        {nextSong ? (
                            <span className="flex items-center gap-2">
                                {compatibleSongs.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={toggleExpanded}
                                        className="rounded-full p-1 hover:bg-gray-100"
                                        aria-label={
                                            isExpanded
                                                ? "Hide compatible songs"
                                                : "Show compatible songs"
                                        }
                                    >
                                        {isExpanded ? (
                                            <ChevronDownIcon className="h-5 w-5" />
                                        ) : (
                                            <ChevronRightIcon className="h-5 w-5" />
                                        )}
                                    </button>
                                )}
                                <span
                                    className={getLevelColor(
                                        nextSong.level ?? 3,
                                    )}
                                >
                                    next: <SongLink song={nextSong} />
                                </span>
                                {isNextSongCompatible && (
                                    <sup className="ml-1 text-red-500">❤️</sup>
                                )}
                            </span>
                        ) : (
                            <span className="text-gray-400">next: (none)</span>
                        )}
                    </li>
                </ul>
            </section>
        </main>
    )
}
