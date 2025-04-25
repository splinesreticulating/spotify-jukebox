"use server"

import type { NowPlayingData, NowPlayingSong, Song } from "@/app/lib/types"
import type { LatestSong, SongSelectFields } from "@/app/lib/types"
import type { SongQueryParams } from "@/app/lib/types/api"
// Helper for joining SQL fragments
function arrayJoin(arr: string[], sep: string) {
  return arr.join(sep);
}

import { unstable_noStore as noStore } from "next/cache"
import { unstable_cache } from "next/cache"
import { ITEMS_PER_PAGE, db } from "./db"
import type { ArtistSongView } from "./types/artists"
import type { ArtistPayload, LatestSongPayload } from "./types/database"
import { cleanLastFMText } from "./utils"
import { getCompatibleKeys } from "./utils"

const songSelectFields: SongSelectFields = {
    id: true,
    spotify_id: true,
    sam_id: true,
    title: true,
    artists: true,
    tags: true,
    key: true,
    level: true,
    bpm: true,
    date_added: true,
    date_liked: true,
    year: true,
    hours_off: true,
    album: true,
    instrumentalness: true,
    count_played: true,
    date_played: true,
    roboticness: true,
    danceability: true,
    energy: true,
    valence: true,
    loudness: true,
    image_urls: true,
}

const buildWhereClause = ({
    query,
    levelsArray,
    instrumental,
    keyMatch,
    bpmRef,
    eighties,
    nineties,
    lastYear,
    thisYear,
    keyCompatible,
}: SongQueryParams) => {
    const conditions = []

    if (query) {
        const searchTerm = `%${query}%`
        conditions.push(`(
      title ILIKE ${searchTerm} OR 
      EXISTS (SELECT 1 FROM unnest(artists) a WHERE a ILIKE ${searchTerm}) OR
      EXISTS (SELECT 1 FROM unnest(tags) t WHERE t ILIKE ${searchTerm})
    )`)
    }

    if (levelsArray.length > 0)
        conditions.push(`level = ANY(ARRAY[${levelsArray.map(Number).join(",")}])`)
    if (instrumental === "1")
        conditions.push(`instrumentalness >= 90`)
    if (keyMatch) conditions.push(`key = ${keyMatch}`)
    if (keyCompatible)
        conditions.push(
            `key = ANY(${getCompatibleKeys(keyCompatible)}::text[])`,
        )
    if (bpmRef)
        conditions.push(
            `bpm BETWEEN ${Number(bpmRef) - 5} AND ${Number(bpmRef) + 5}`,
        )

    const eraConditions = []

    if (eighties) eraConditions.push(`(year >= 1980 AND year < 1990)`)
    if (nineties) eraConditions.push(`(year >= 1990 AND year < 2000)`)
    if (lastYear)
        eraConditions.push(`year = ${new Date().getFullYear() - 1}`)
    if (thisYear)
        eraConditions.push(`year = ${new Date().getFullYear()}`)

    if (eraConditions.length > 0) {
        conditions.push(`(${arrayJoin(eraConditions, " OR ")})`)
    }

    const whereClause =
        conditions.length > 0
            ? `WHERE ${arrayJoin(conditions, " AND ")}`
            : ""

    return whereClause
}

const fetchSongsBaseQuery = async (
    params: SongQueryParams & { currentPage?: number },
) => {
    const offset = ((params.currentPage || 1) - 1) * ITEMS_PER_PAGE
    const whereClause = buildWhereClause(params)
    const currentTime = new Date()

    const sqlQuery = `
        SELECT * FROM nuts
        ${whereClause}
        ORDER BY 
          CASE 
            WHEN date_played IS NULL THEN 1
            ELSE EXTRACT(EPOCH FROM (date_played + (hours_off || ' hours')::interval - '${currentTime.toISOString()}'))::integer
          END ASC,
          date_added DESC
        LIMIT ${ITEMS_PER_PAGE}
        OFFSET ${offset}
    `;
    return await db.$queryRawUnsafe(sqlQuery);
}

export async function fetchLatestSongs(): Promise<LatestSong[]> {
    noStore()

    try {
        const songs: LatestSongPayload[] = await db.nuts.findMany({
            select: {
                id: true,
                title: true,
                artists: true,
                date_added: true,
                spotify_id: true,
                sam_id: true,
                level: true,
                roboticness: true,
            },
            orderBy: {
                date_added: "desc",
            },
            take: 5,
        })

        return songs.map((song) => ({
            id: song.id,
            artists: Array.isArray(song.artists) ? song.artists : [],
            title: song.title ?? "",
            date_added: song.date_added ?? new Date(),
            spotify_id: song.spotify_id,
            sam_id: song.sam_id,
            level: song.level,
            roboticness: song.roboticness,
        }))
    } catch (err) {
        console.error(err)
        return []
    }
}

export async function fetchCardData() {
    noStore()
    try {
        const songCountPromise = db.nuts.count()
        const artistsPromise = db.nuts.findMany({
            select: { artists: true },
        })
        const compatibilityCountPromise = db.compatibility_tree.count()
        const unprocessedCountPromise = db.nuts.count({
            where: {
                OR: [{ bpm: null }, { key: null }],
            },
        })
        const incomingCountPromise = db.nuts.count({
            where: {
                AND: [{ spotify_id: { not: null } }, { sam_id: null }],
            },
        })

        const data = await Promise.all([
            songCountPromise,
            artistsPromise,
            compatibilityCountPromise,
            unprocessedCountPromise,
            incomingCountPromise,
        ])

        // Get unique primary artists (first artist in each array)
        const primaryArtists = data[1]
            .map((song: ArtistPayload) => song.artists[0])
            .filter(Boolean)
        const uniqueArtists = new Set(primaryArtists)

        return {
            numberOfSongs: data[0],
            numberOfArtists: uniqueArtists.size,
            numberOfCompatibilities: data[2],
            numberOfUnprocessed: data[3],
            numberOfIncoming: data[4],
        }
    } catch (error) {
        console.error("Database Error:", error)
        throw new Error("Failed to fetch card data.")
    }
}

export const fetchFilteredSongs = unstable_cache(
    async (
        query: string,
        currentPage: number,
        levels: string,
        instrumental: string,
        keyMatch?: string,
        bpmRef?: string,
        eighties?: boolean,
        nineties?: boolean,
        lastYear?: boolean,
        thisYear?: boolean,
        keyCompatible?: string,
    ) => {
        const levelsArray = levels ? levels.split(",") : []
        try {
            const result = await fetchSongsBaseQuery({
                query,
                levelsArray,
                instrumental,
                keyMatch,
                bpmRef,
                eighties,
                nineties,
                lastYear,
                thisYear,
                keyCompatible,
                currentPage,
            })
            return result
        } catch (error) {
            console.error("Database Error:", error)
            throw new Error("Failed to fetch songs.")
        }
    },
    ["filtered-songs"],
    {
        revalidate: 60, // Cache for 1 minute
        tags: ["songs"],
    },
)

export async function fetchSongsPages(
    query: string,
    levels: string,
    instrumental: string,
    keyMatch: string,
    keyCompatible: string,
    bpmRef: string,
    eighties: string,
    nineties: string,
    lastYear: string,
    thisYear: string,
): Promise<number> {
    const levelsArray = levels ? levels.split(",") : []
    try {
        const whereClause = buildWhereClause({
            query,
            levelsArray,
            instrumental,
            keyMatch,
            keyCompatible,
            bpmRef,
            eighties: eighties === "true",
            nineties: nineties === "true",
            lastYear: lastYear === "true",
            thisYear: thisYear === "true",
        })

        const sqlQuery = `
            SELECT COUNT(*)::integer as count
            FROM nuts
            ${whereClause}
        `;
        const result = await db.$queryRawUnsafe(sqlQuery) as { count: number }[];
        return Math.ceil(Number(result[0].count) / ITEMS_PER_PAGE)
    } catch (error) {
        console.error("Database Error:", error)
        throw new Error("Failed to fetch total number of songs")
    }
}

export async function fetchSongById(id: number) {
    try {
        const song = (await db.nuts.findUnique({
            where: { id },
            select: songSelectFields,
        })) as Song | null

        return song
    } catch (error) {
        console.error("Database Error:", error)
        throw new Error("Failed to fetch song.")
    }
}

export const fetchNowPlaying = async (): Promise<NowPlayingData | null> => {
    // Get the two most recent history entries
    const recentHistory = await db.history.findMany({
        select: {
            nut_id: true,
            played_at: true,
        },
        orderBy: { played_at: "desc" },
        take: 2,
    })

    if (recentHistory.length === 0) {
        return null
    }

    // Get the song details for both current and last songs
    const [currentSongData, lastSongData] = await Promise.all([
        fetchSongById(recentHistory[0].nut_id),
        recentHistory[1] ? fetchSongById(recentHistory[1].nut_id) : null,
    ])

    if (!currentSongData) {
        return null
    }

    const currentSong: NowPlayingSong = {
        id: currentSongData.id,
        artists: currentSongData.artists,
        title: currentSongData.title,
        level: Number(currentSongData.level),
        key: currentSongData.key,
        bpm: currentSongData.bpm,
        roboticness: currentSongData.roboticness,
    }

    const lastSong: NowPlayingSong = lastSongData
        ? {
              id: lastSongData.id,
              artists: lastSongData.artists,
              title: lastSongData.title,
              level: Number(lastSongData.level),
              spotify_id: lastSongData.spotify_id,
              sam_id: lastSongData.sam_id,
              roboticness: lastSongData.roboticness,
          }
        : {
              id: 0,
              artists: [],
              title: "",
              level: undefined,
              spotify_id: null,
              sam_id: null,
              roboticness: 2,
          }

    // Check if there's a friendship between the songs
    const friends = lastSongData
        ? await db.compatibility_tree.findFirst({
              where: {
                  branch_id: currentSong.id,
                  root_id: lastSong.id,
              },
          })
        : null

    const nextQueueItem = await db.queue.findFirst({
        select: {
            nut: {
                select: {
                    id: true,
                    title: true,
                    artists: true,
                    level: true,
                    roboticness: true,
                },
            },
        },
        orderBy: {
            added_at: "desc",
        },
    })

    const nextSong: NowPlayingSong = nextQueueItem?.nut
        ? {
              id: Number(nextQueueItem.nut.id),
              artists: Array.isArray(nextQueueItem.nut.artists)
                  ? nextQueueItem.nut.artists
                  : [],
              title: String(nextQueueItem.nut.title),
              level: nextQueueItem.nut.level
                  ? Number(nextQueueItem.nut.level)
                  : 3,
              roboticness: nextQueueItem.nut.roboticness ?? 2,
          }
        : {
              id: 0,
              artists: [],
              title: null,
              roboticness: 2,
          }

    return {
        currentSong,
        lastSong,
        nextSong,
        friends: !!friends,
    }
}

export async function getLastPlayedDatesFromHistory(
    nutId: number,
): Promise<{ lastPlayed: Date | null; beforeThat: Date | null }> {
    noStore()

    try {
        const historyEntries = await db.history.findMany({
            where: { nut_id: nutId },
            orderBy: { played_at: "desc" },
            take: 2,
        })

        const lastPlayed = historyEntries[0]?.played_at || null
        const beforeThat = historyEntries[1]?.played_at || null

        return { lastPlayed, beforeThat }
    } catch (error) {
        console.error("Database Error:", error)
        throw new Error("Failed to fetch history dates")
    }
}

export async function fetchSettings() {
    noStore()
    try {
        const settings = await db.settings.findMany({
            orderBy: {
                name: "asc",
            },
        })
        return settings
    } catch (error) {
        console.error("Database Error:", error)
        throw new Error("Failed to fetch settings data")
    }
}

export async function fetchWeeklyAverageYear(days = 7) {
    noStore()
    try {
        const startDate = new Date()
        const hoursToSubtract = days < 1 ? days * 24 : days * 24
        startDate.setHours(startDate.getHours() - hoursToSubtract)

        const result = await db.$queryRaw<[{ avg_year: number }]>`
      SELECT AVG(n.year) as avg_year
      FROM history h
      JOIN nuts n ON h.nut_id = n.id
      WHERE h.played_at >= ${startDate}
      AND n.year IS NOT NULL
      AND n.year >= 1900
    `

        return Math.round(Number(result[0].avg_year)) || null
    } catch (error) {
        console.error("Database Error:", error)
        throw new Error("Failed to fetch average year")
    }
}

export async function fetchAvailableSongsByLevel(onlyAvailable = true) {
    noStore()
    try {
        const currentTime = new Date()
        const result = await db.$queryRaw<
            Array<{ level: number; count: number }>
        >`
      SELECT 
        level,
        COUNT(*) as count
      FROM nuts
      WHERE
        ${
            onlyAvailable
                ? `(date_played IS NULL OR date_played + (hours_off || ' hours')::interval < ${currentTime})`
                : `1=1`
        }
      GROUP BY level
      ORDER BY level
    `

        return result.map((row: { level: number; count: number }) => ({
            level: Number(row.level),
            count: Number(row.count),
        }))
    } catch (error) {
        console.error("Database Error:", error)
        throw new Error("Failed to fetch songs by level")
    }
}

export async function fetchAvailableSongsByPeriod(onlyAvailable = true) {
    noStore()
    try {
        const currentDate = new Date()
        const daysInYear = 365.25
        const result = await db.$queryRaw<
            Array<{ period: string; count: number }>
        >`
      WITH periods AS (
        SELECT
          CASE
            WHEN date_part('days', ${currentDate}::timestamp - (year || '-01-01')::timestamp) / ${daysInYear} <= 3 THEN 'Last 3 years'
            WHEN date_part('days', ${currentDate}::timestamp - (year || '-01-01')::timestamp) / ${daysInYear} <= 5 THEN '3-5 years'
            WHEN date_part('days', ${currentDate}::timestamp - (year || '-01-01')::timestamp) / ${daysInYear} <= 10 THEN '5-10 years'
            WHEN date_part('days', ${currentDate}::timestamp - (year || '-01-01')::timestamp) / ${daysInYear} <= 15 THEN '10-15 years'
            WHEN date_part('days', ${currentDate}::timestamp - (year || '-01-01')::timestamp) / ${daysInYear} <= 20 THEN '15-20 years'
            WHEN date_part('days', ${currentDate}::timestamp - (year || '-01-01')::timestamp) / ${daysInYear} <= 30 THEN '20-30 years'
            WHEN date_part('days', ${currentDate}::timestamp - (year || '-01-01')::timestamp) / ${daysInYear} <= 40 THEN '30-40 years'
            ELSE '40+ years'
          END as period
        FROM nuts
        WHERE
          ${
              onlyAvailable
                  ? `(date_played IS NULL OR date_played + (hours_off || ' hours')::interval < ${currentDate})`
                  : `1=1`
          }
      )
      SELECT 
        period,
        COUNT(*) as count
      FROM periods
      GROUP BY period
      ORDER BY 
        CASE period
          WHEN 'Last 3 years' THEN 1
          WHEN '3-5 years' THEN 2
          WHEN '5-10 years' THEN 3
          WHEN '10-15 years' THEN 4
          WHEN '15-20 years' THEN 5
          WHEN '20-30 years' THEN 6
          WHEN '30-40 years' THEN 7
          ELSE 8
        END
    `

        return result.map((row: { period: string; count: number }) => ({
            period: row.period,
            count: Number(row.count),
        }))
    } catch (error) {
        console.error("Database Error:", error)
        throw new Error("Failed to fetch songs by period")
    }
}

export async function fetchSongsByArtist(
    name: string,
): Promise<ArtistSongView[]> {
    const songs = (await db.nuts.findMany({
        where: { artists: { has: name } },
        select: {
            id: true,
            title: true,
            artists: true,
            album: true,
            level: true,
            spotify_id: true,
            sam_id: true,
            date_added: true,
            tags: true,
            image_urls: true,
            roboticness: true,
        },
    })) as unknown as ArtistSongView[]
    return songs
}

export async function fetchArtistInfo(
    artistName: string,
): Promise<{ bio: string; tags: { name: string }[] } | null> {
    noStore()

    try {
        const response = await fetch(
            `http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(
                artistName,
            )}&autocorrect=1&api_key=${process.env.LASTFM_API_KEY}&format=json`,
        )

        if (!response.ok) {
            return null
        }

        const data = await response.json()

        return {
            bio: cleanLastFMText(data.artist?.bio?.summary),
            tags: data.artist?.tags?.tag || [],
        }
    } catch (error) {
        console.error("LastFM API Error:", error)
        return null
    }
}

export async function fetchAvailableSongsByTag(showOnlyAvailable = true) {
    noStore()
    try {
        const result = await db.$queryRaw<
            Array<{ tag: string; count: number }>
        >`
      WITH RECURSIVE unnested_tags AS (
        SELECT id, unnest(tags) as tag
        FROM nuts
        WHERE ${
            showOnlyAvailable
                ? `date_played < NOW() - INTERVAL '1 day' * COALESCE(hours_off, 24) / 24 OR date_played IS NULL`
                : `1=1`
        }
      )
      SELECT tag, COUNT(*) as count
      FROM unnested_tags
      GROUP BY tag
      ORDER BY count DESC
      LIMIT 10
    `
        return result
    } catch (error) {
        console.error("Database Error:", error)
        throw new Error("Failed to fetch tags data")
    }
}

export async function fetchAvailableSongsByArtist(showOnlyAvailable = true) {
    noStore()
    try {
        const currentTime = new Date()
        const result = await db.$queryRaw<
            Array<{ artist: string; count: number }>
        >`
      WITH RECURSIVE unnested_artists AS (
        SELECT id, unnest(artists) as artist
        FROM nuts
        WHERE
          ${
              showOnlyAvailable
                  ? `(date_played IS NULL OR date_played + (hours_off || ' hours')::interval < ${currentTime})`
                  : `1=1`
          }
      )
      SELECT artist, COUNT(*) as count
      FROM unnested_artists
      GROUP BY artist
      ORDER BY count DESC
      LIMIT 10
    `
        return result
    } catch (error) {
        console.error("Database Error:", error)
        throw new Error("Failed to fetch artists data")
    }
}
