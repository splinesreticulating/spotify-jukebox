'use server'

import { ITEMS_PER_PAGE, db } from './db'
import {
  NowPlayingData,
  NowPlayingSong,
  Song,
} from './definitions'
import { unstable_noStore as noStore } from 'next/cache'

export async function fetchLatestSongs() {
  noStore()

  try {
    const songs = await db.songlist.findMany({
      select: {
        id: true,
        title: true,
        artist: true,
        genre: true,
        info: true,
        bpm: true,
        date_added: true,
        albumyear: true,
        hours_off: true,
      },
      orderBy: {
        date_added: 'desc',
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
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const songCountPromise = db.songlist.count({ where: { songtype: 'S' }})
    const artistCountPromise = db.songlist.findMany({ distinct: ['artist'], select: { artist: true } })

    const data = await Promise.all([
      songCountPromise,
      artistCountPromise,
    ])

    const numberOfSongs = Number(data[0] ?? '0')
    const numberOfArtists = Number(data[1].length ?? '0')

    return {
      numberOfArtists,
      numberOfSongs,
    }
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch card data.')
  }
}

export async function fetchFilteredSongs(
  query: string,
  currentPage: number,
  levels: string
): Promise<Song[]> {
  noStore()
  const offset = (currentPage - 1) * ITEMS_PER_PAGE

  try {
    const levelsArray = levels ? levels.split(',').map(level => level) : []

    const songs = await db.songlist.findMany({
      where: {
        AND: [
          {
            OR: [
              { artist: { contains: query } },
              { title: { contains: query } },
            ],
          },
          levelsArray.length > 0
            ? { genre: { in: levelsArray } }
            : {},
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

export async function fetchSongsPages(query: string, levels: string): Promise<number> {
  noStore()

  try {
    const levelsArray = levels ? levels.split(',').map(level => level) : []

    const count = await db.songlist.count({
      where: {
        AND: [
          {
            OR: [
              { artist: { contains: query } },
              { title: { contains: query } },
            ],
          },
          levelsArray.length > 0
            ? { genre: { in: levelsArray } }
            : {},
        ],
      },
    })

    const totalPages = Math.ceil(Number(count) / ITEMS_PER_PAGE)
    return totalPages
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch total number of songs.')
  }
}

export async function fetchSongById(id: number): Promise<Song | null> {
  noStore()
  try {
    const song = await db.songlist.findUnique({
      where: { id: id },
      select: {
        id: true,
        artist: true,
        title: true,
        album: true,
        grouping: true,
        instrumentalness: true,
        bpm: true,
        info: true,
        genre: true,
        date_added: true,
        albumyear: true,
        hours_off: true,
        count_played: true,
        date_played: true,
      }
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

    let idCounter = 1
    const uniqueArtistsWithID = []
    const artistNamesSet = new Set()

    for (const artist of artists) {
      const name = artist.artist

      if (!artistNamesSet.has(name)) {
        artistNamesSet.add(name)
        uniqueArtistsWithID.push({ ...artist, name, id: idCounter++ })
      }
    }

    return uniqueArtistsWithID
  } catch (err) {
    console.error('Database Error:', err)
    throw new Error('Failed to fetch artist table.')
  }
}

export const fetchNowPlaying = async (): Promise<NowPlayingData> => {
  const nowPlaying = await db.historylist.findMany({
    select: { title: true, artist: true, songID: true },
    orderBy: { date_played: 'desc' },
    take: 2
  })

  const currentSong: NowPlayingSong = nowPlaying[0]
  const lastSong: NowPlayingSong = nowPlaying[1]

  // Run queries in parallel
  const [friends, currentSongData] = await Promise.all([
    db.tblbranches.findFirst({ where: { branch: currentSong.songID, root: lastSong.songID } }),
    fetchSongById(currentSong.songID)
  ])

  currentSong.level = Number(currentSongData!.genre)

  return { currentSong, lastSong, friends: !!friends }
}


export const calculateUniqueness = async (songId: number) => {
  const song = await fetchSongById(songId)

  if (!song) throw new Error

  const { bpm, info, genre } = song

  // Calculate a BPM range
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
