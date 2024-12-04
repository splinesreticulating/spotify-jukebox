'use server'

import { ITEMS_PER_PAGE, db } from './db'
import { NowPlayingData, NowPlayingSong, Song } from './definitions'
import { unstable_noStore as noStore } from 'next/cache'

const songSelectFields = {
  id: true,
  title: true,
  artists: true,
  tags: true,
  key: true,
  level: true,
  bpm: true,
  date_added: true,
  year: true,
  hours_off: true,
  album: true,
  instrumentalness: true,
  count_played: true,
  date_played: true,
  roboticness: true,
}

const MAX_BPM_MULTIPLIER = 1.09
const MIN_BPM_MULTIPLIER = 0.96

const fetchSongsBaseQuery = (
  query: string,
  levelsArray: string[],
  instrumentalness: number | undefined,
  keyRef?: string,
  bpmRef?: string,
  eighties?: boolean,
  nineties?: boolean,
) => {
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

  if (eighties || nineties) {
    const yearConditions = []
    if (eighties) yearConditions.push({ year: { gte: 1980, lt: 1990 } })
    if (nineties) yearConditions.push({ year: { gte: 1990, lt: 2000 } })
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

export async function fetchLatestSongs() {
  noStore()

  try {
    const songs = await db.nuts.findMany({
      select: songSelectFields,
      orderBy: {
        date_added: 'desc' as const,
      },
      take: 5,
    })

    return songs
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
    const allArtists = data[1].flatMap((song) => song.artists)
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
): Promise<Song[]> {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE
  const levelsArray = levels ? levels.split(',').map((level) => level) : []

  try {
    const songs = await db.nuts.findMany({
      ...fetchSongsBaseQuery(query, levelsArray, instrumentalness, keyRef, bpmRef, eighties, nineties),
      take: ITEMS_PER_PAGE,
      skip: offset,
      select: songSelectFields,
    })
    return songs
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch filtered songs')
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
): Promise<number> {
  const levelsArray = levels ? levels.split(',').map((level) => level) : []

  try {
    const count = await db.nuts.count({
      ...fetchSongsBaseQuery(
        query,
        levelsArray,
        Number(instrumentalness),
        keyRef,
        bpmRef,
        eighties === 'true',
        nineties === 'true',
      ),
    })

    return Math.ceil(count / ITEMS_PER_PAGE)
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch total number of songs.')
  }
}

export const fetchSongById = async (id: number): Promise<Song | null> => {
  noStore()

  try {
    const song = await db.nuts.findUnique({
      where: { id },
      select: songSelectFields,
    })

    return song
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error(`Failed to fetch song with ID: ${id}`)
  }
}

export async function fetchFilteredArtists(query: string) {
  noStore()

  try {
    const songs = await db.nuts.findMany({
      where: { artists: { has: query } },
      select: { artists: true },
    })

    const allArtists = songs.flatMap((song) => song.artists)
    const uniqueArtists = [...new Set(allArtists)].map((name, index) => ({
      name,
      id: index + 1,
    }))

    return uniqueArtists
  } catch (err) {
    console.error('Database Error:', err)
    throw new Error('Failed to fetch artists list.')
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
        select: songSelectFields,
      },
    },
    orderBy: {
      added_at: 'desc',
    },
  })

  const nextSong: NowPlayingSong = nextQueueItem?.nut
    ? {
        songID: nextQueueItem.nut.id,
        artists: nextQueueItem.nut.artists,
        title: nextQueueItem.nut.title,
        level: nextQueueItem.nut.level || undefined,
      }
    : {
        songID: 0,
        artists: [],
        title: '',
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
