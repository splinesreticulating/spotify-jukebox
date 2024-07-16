'use server'

import { ITEMS_PER_PAGE, db } from './db'
import {
  NowPlayingData,
  NowPlayingSong,
  Song,
} from './definitions'
import { unstable_noStore as noStore } from 'next/cache'

const songSelectFields = {
  id: true,
  title: true,
  artist: true,
  genre: true,
  info: true,
  bpm: true,
  date_added: true,
  albumyear: true,
  hours_off: true,
  grouping: true,
  album: true,
  instrumentalness: true,
  count_played: true,
  date_played: true,
}

const fetchSongsBaseQuery = (query: string, levelsArray: string[]) => ({
  where: {
    AND: [
      {
        OR: [
          { artist: { contains: query } },
          { title: { contains: query } },
          { albumyear: { contains: query }},
        ],
      },
      levelsArray.length > 0
        ? { genre: { in: levelsArray } }
        : {},
    ],
  },
  orderBy: {
    date_added: 'desc' as const,
  },
})

export async function fetchLatestSongs() {
  noStore()

  try {
    const songs = await db.songlist.findMany({
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
    const songCountPromise = db.songlist.count({ where: { songtype: 'S' }})
    const artistCountPromise = db.songlist.findMany({ distinct: ['artist'], select: { artist: true } })

    const data = await Promise.all([
      songCountPromise,
      artistCountPromise,
    ])

    return {
      numberOfSongs: data[0],
      numberOfArtists: data[1].length,
    }
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch card data.')
  }
}

export async function fetchFilteredSongs(query: string, currentPage: number, levels: string, instrumentalness: number): Promise<Song[]> {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE
  const levelsArray = levels ? levels.split(',').map(level => level) : []

  try {
    const songs = await db.songlist.findMany({
      where: {
        AND: [
          {
            OR: [
              { artist: { contains: query } },
              { title: { contains: query } },
              { albumyear: { contains: query }},
            ],
          },
          levelsArray.length > 0 ? { genre: { in: levelsArray } } : {},
          instrumentalness >= 90 ? { instrumentalness: { gte: 90 } } : {},
        ],
      },
      orderBy: {
        date_added: 'desc',
      },
      take: ITEMS_PER_PAGE,
      skip: offset,
      select: {
        id: true,
        artist: true,
        title: true,
        bpm: true,
        date_added: true,
        albumyear: true,
        genre: true,
        grouping: true,
        album: true,
        instrumentalness: true,
        info: true,
        hours_off: true,
        count_played: true,
        date_played: true,
      },
    })
    return songs
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch filtered songs')
  }
}

export async function fetchSongsPages(query: string, levels: string, instrumentalness: number): Promise<number> {
  const levelsArray = levels ? levels.split(',').map(level => level) : []

  try {
    const count = await db.songlist.count({
      where: {
        AND: [
          {
            OR: [
              { artist: { contains: query } },
              { title: { contains: query } },
              { albumyear: { contains: query }},
            ],
          },
          levelsArray.length > 0 ? { genre: { in: levelsArray } } : {},
          instrumentalness >= 90 ? { instrumentalness: { gte: 90 } } : {},
        ],
      },
    })

    return Math.ceil(count / ITEMS_PER_PAGE)
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch total number of songs.')
  }
}

export async function fetchSongById(id: number): Promise<Song | null> {
  noStore()
  try {
    const song = await db.songlist.findUnique({
      where: { id },
      select: songSelectFields
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
    const artists = await db.songlist.findMany({
      where: { artist: { contains: query } },
      select: { artist: true }
    })

    const uniqueArtists = [...new Set(artists.map(artist => artist.artist))].map((name, index) => ({
      name,
      id: index + 1
    }))

    return uniqueArtists
  } catch (err) {
    console.error('Database Error:', err)
    throw new Error('Failed to fetch artist table.')
  }
}

export const fetchNowPlaying = async (): Promise<NowPlayingData> => {
  const nowPlaying = await db.historylist.findMany({
    select: { title: true, artist: true, songID: true },
    orderBy: { date_played: 'desc' as const },
    take: 2
  })

  const currentSong: NowPlayingSong = nowPlaying[0]
  const lastSong:NowPlayingSong = nowPlaying[1]

  const [friends, currentSongData] = await Promise.all([
    db.tblbranches.findFirst({ where: { branch: currentSong.songID, root: lastSong.songID } }),
    fetchSongById(currentSong.songID)
  ])

  currentSong.level = Number(currentSongData!.genre)

  return { currentSong, lastSong, friends: !!friends }
}

export const calculateUniqueness = async (songId: number) => {
  const song = await fetchSongById(songId)

  if (!song) throw new Error('Song not found')

  const { bpm, info, genre } = song

  const lowerBpm = bpm * 0.96
  const upperBpm = bpm * 1.09

  const similarSongCount = await db.songlist.count({
    where: {
      bpm: { gte: lowerBpm, lte: upperBpm },
      info,
      genre
    }
  })

  return similarSongCount
}
