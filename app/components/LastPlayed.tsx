"use client"

import type { Song } from "@/app/lib/types/songs"
import { useEffect, useState } from "react"
import { getLastPlayedDatesFromHistory } from "../lib/data"
import { daysAgo } from "../lib/utils"

export const LastPlayed: React.FC<{ song: Song }> = ({ song }) => {
    const [lastPlayedDate, setLastPlayedDate] = useState<Date | null>(null)
    const [beforeThatDate, setBeforeThatDate] = useState<Date | null>(null)

    useEffect(() => {
        const fetchDates = async () => {
            const { lastPlayed, beforeThat } =
                await getLastPlayedDatesFromHistory(song.id)
            setLastPlayedDate(lastPlayed)
            setBeforeThatDate(beforeThat)
        }
        fetchDates()
    }, [song.id])

    const formatDays = (days: number) => {
        if (days === 0) return "today"
        if (days === 1) return "yesterday"
        return `${days} days ago`
    }

    // Handle unplayed songs
    if (!lastPlayedDate && !song.date_played) return <em>unplayed</em>

    // Use song.date_played as fallback
    const effectiveDate =
        lastPlayedDate || (song.date_played ? new Date(song.date_played) : null)
    if (!effectiveDate) return null // TypeScript safety

    const days = Number(daysAgo(effectiveDate))
    const beforeThatDays = beforeThatDate
        ? Number(daysAgo(beforeThatDate))
        : null

    // Show additional context if played today
    if (days === 0 && beforeThatDays !== null) {
        return <em>Played today (before that: {formatDays(beforeThatDays)})</em>
    }

    return <em>Last played {formatDays(days)}</em>
}
