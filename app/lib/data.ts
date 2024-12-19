'use server'

import { ITEMS_PER_PAGE, db } from './db'
import { NowPlayingData, NowPlayingSong, Song } from '@/app/lib/types'
import { unstable_noStore as noStore } from 'next/cache'
import type { SongSelectFields } from '@/app/lib/types'
import type { LatestSong } from '@/app/ui/dashboard/latest-songs'
import { ArtistPayload, LatestSongPayload } from './types/database'

const songSelectFields: SongSelectFields = {
  id: true,
  spotify_id: true,
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

const MAX_BPM_MULTIPLIER = 1.09
const MIN_BPM_MULTIPLIER = 0.96

const fetchSongsBaseQuery = ({
  query,
  levelsArray,
  instrumentalness,
  keyRef,
  bpmRef,
  eighties,
  nineties,
  thisYear,
}: {
  query: string
  levelsArray: string[]
  instrumentalness?: number
  keyRef?: string
  bpmRef?: string
  eighties?: boolean
  nineties?: boolean
  thisYear?: boolean
}) => {
  const conditions = []

  if (query) {
    conditions.push({
      OR: [
        { artists: { has: query } },
        { title: { contains: query, mode: 'insensitive' as const } },
        { tags: { has: query } },
      ],
    })
  }

  if (levelsArray.length > 0) {
    conditions.push({ level: { in: levelsArray.map(Number) } })
  }

  if (instrumentalness && instrumentalness >= 90) {
    conditions.push({ instrumentalness: { gte: 90 } })
  }

  if (keyRef) {
    conditions.push({ key: keyRef })
  }

  if (bpmRef) {
    conditions.push({
      bpm: {
        gte: Number(bpmRef) * MIN_BPM_MULTIPLIER,
        lte: Number(bpmRef) * MAX_BPM_MULTIPLIER,
      },
    })
  }

  if (eighties || nineties || thisYear) {
    const yearConditions = []
    if (eighties) yearConditions.push({ year: { gte: 1980, lt: 1990 } })
    if (nineties) yearConditions.push({ year: { gte: 1990, lt: 2000 } })
    if (thisYear) yearConditions.push({ year: { equals: new Date().getFullYear() } })
    conditions.push({ OR: yearConditions })
  }

  return {
    where: conditions.length > 0 ? { AND: conditions } : {},
    orderBy: {
      date_added: 'desc' as const,
    },
  }
}

const compatibleKeys = (keyRef: string) => {
  // Here's where we figure out all the compatible
  // keys. We've got some code for this somewhere
  // ...else
  return [keyRef]
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
      },
      orderBy: {
        date_added: 'desc',
      },
      take: 5,
    })

    return songs.map((song) => ({
      id: song.id,
      artists: Array.isArray(song.artists) ? song.artists : [],
      title: song.title ?? '',
      date_added: song.date_added ?? new Date(),
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

    const data = await Promise.all([songCountPromise, artistsPromise])

    // Get unique artists by flattening and deduplicating the arrays
    const allArtists = data[1].flatMap((song: ArtistPayload) => song.artists)
    const uniqueArtists = new Set(allArtists)

    return {
      numberOfSongs: data[0],
      numberOfArtists: uniqueArtists.size,
    }
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch card data.')
  }
}

export async function fetchFilteredSongs(
  query: string,
  currentPage: number,
  levels: string,
  instrumentalness: number,
  keyRef?: string,
  bpmRef?: string,
  eighties?: boolean,
  nineties?: boolean,
  thisYear?: boolean,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE
  const levelsArray = levels ? levels.split(',').map((level) => level) : []

  try {
    const songs = await db.nuts.findMany({
      ...fetchSongsBaseQuery({
        query,
        levelsArray,
        instrumentalness,
        keyRef,
        bpmRef,
        eighties,
        nineties,
        thisYear,
      }),
      take: ITEMS_PER_PAGE,
      skip: offset,
    })

    return songs
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch songs.')
  }
}

export async function fetchSongsPages(
  query: string,
  levels: string,
  instrumentalness: string | undefined,
  keyRef?: string,
  bpmRef?: string,
  eighties?: string,
  nineties?: string,
  thisYear?: string,
): Promise<number> {
  const levelsArray = levels ? levels.split(',').map((level) => level) : []

  try {
    const count = await db.nuts.count({
      ...fetchSongsBaseQuery({
        query,
        levelsArray,
        instrumentalness: instrumentalness ? Number(instrumentalness) : undefined,
        keyRef,
        bpmRef,
        eighties: eighties === 'true',
        nineties: nineties === 'true',
        thisYear: thisYear === 'true',
      }),
    })

    return Math.ceil(count / ITEMS_PER_PAGE)
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch total number of songs.')
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
    console.error('Database Error:', error)
    throw new Error('Failed to fetch song.')
  }
}

export const fetchNowPlaying = async (): Promise<NowPlayingData> => {
  // Get the two most recent history entries
  const recentHistory = await db.history.findMany({
    select: {
      nut_id: true,
      played_at: true,
    },
    orderBy: { played_at: 'desc' },
    take: 2,
  })

  if (recentHistory.length === 0) {
    throw new Error('No history found')
  }

  // Get the song details for both current and last songs
  const [currentSongData, lastSongData] = await Promise.all([
    fetchSongById(recentHistory[0].nut_id),
    recentHistory[1] ? fetchSongById(recentHistory[1].nut_id) : null,
  ])

  if (!currentSongData) {
    throw new Error('Current song not found')
  }

  const currentSong: NowPlayingSong = {
    songID: currentSongData.id,
    artists: currentSongData.artists,
    title: currentSongData.title,
    level: Number(currentSongData.level),
  }

  const lastSong: NowPlayingSong = lastSongData
    ? {
        songID: lastSongData.id,
        artists: lastSongData.artists,
        title: lastSongData.title,
      }
    : {
        songID: 0,
        artists: [],
        title: '',
      }

  // Check if there's a friendship between the songs
  const friends = lastSongData
    ? await db.compatibility_tree.findFirst({
        where: {
          branch_id: currentSong.songID,
          root_id: lastSong.songID,
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
        },
      },
    },
    orderBy: {
      added_at: 'desc',
    },
  })

  const nextSong: NowPlayingSong = nextQueueItem?.nut
    ? {
        songID: Number(nextQueueItem.nut.id),
        artists: Array.isArray(nextQueueItem.nut.artists) ? nextQueueItem.nut.artists : [],
        title: String(nextQueueItem.nut.title),
        level: nextQueueItem.nut.level ? Number(nextQueueItem.nut.level) : undefined,
      }
    : {
        songID: 0,
        artists: [],
        title: null,
      }

  return {
    currentSong,
    lastSong,
    nextSong,
    friends: !!friends,
  }
}

export const measurePoolDepth = async (songId: number) => {
  const song = await fetchSongById(songId)

  if (!song) throw new Error('Song not found')

  const { bpm, key, level } = song

  if (!bpm) throw new Error('BPM not found')

  const lowerBpm = bpm * MIN_BPM_MULTIPLIER
  const upperBpm = bpm * MAX_BPM_MULTIPLIER

  const similarSongCount = await db.nuts.count({
    where: {
      bpm: { gte: lowerBpm, lte: upperBpm },
      key,
      level,
    },
  })

  return similarSongCount
}

export async function fetchNowPlayingSongID(): Promise<number | null> {
  try {
    const nowPlayingData = await fetchNowPlaying()
    return nowPlayingData.currentSong.songID
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch now playing song ID')
  }
}

export async function getLastPlayedDatesFromHistory(
  nutId: number,
): Promise<{ lastPlayed: Date | null; beforeThat: Date | null }> {
  noStore()

  try {
    const historyEntries = await db.history.findMany({
      where: { nut_id: nutId },
      orderBy: { played_at: 'desc' },
      take: 2,
    })

    const lastPlayed = historyEntries[0]?.played_at || null
    const beforeThat = historyEntries[1]?.played_at || null

    return { lastPlayed, beforeThat }
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch history dates')
  }
}

export async function fetchSettings() {
  noStore()
  try {
    const settings = await db.settings.findMany({
      orderBy: {
        name: 'asc',
      },
    })
    return settings
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch settings data')
  }
}
