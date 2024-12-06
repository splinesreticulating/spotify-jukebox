export type User = {
  id: string
  name: string
  email: string
  password: string
}

// Figure out how to get prisma to auto-generate the Song type, or how to reference it if it already exists
export type Song = {
  id: number
  spotify_id: string
  artists: string[]
  title: string | null
  album: string | null
  tags: string[]
  instrumentalness: number | null
  bpm: number | null
  key: string | null
  level: number | null
  date_added: Date | null
  year: number | null
  hours_off: number | null
  count_played: number | null
  date_played: Date | null
  roboticness: number | null
  danceability: number | null
  energy: number | null
  valence: number | null
  loudness: number | null
  image_urls: string[] | null
}

// export type LatestSong = Pick<Song, 'title' | 'id' | 'artist'>

// export type SongsTable = {
//   id: string
//   artist_id: string
//   name: string
//   email: string
//   image_url: string
//   date: string
//   amount: number
//   status: 'pending' | 'paid'
// }

// export type ArtistsTableType = {
//   id: string
//   name: string
//   email: string
//   image_url: string
//   total_songs: number
//   total_pending: number
//   total_paid: number
// }

export type FormattedArtistsTable = {
  id: number
  name: string
}

// export type ArtistField = {
//   id: string
//   name: string
// }

// export type SongForm = Pick<
//   Song,
//   'id' | 'title' | 'artist' | 'bpm' | 'genre' | 'info' | 'hours_off' | 'albumyear' | 'date_added' | 'grouping'
// >

export type NowPlayingSong = {
  songID: Song['id']
  artists: Song['artists']
  title: Song['title']
  level?: number
}

export type NowPlayingData = {
  currentSong: NowPlayingSong
  lastSong: NowPlayingSong
  nextSong: NowPlayingSong
  friends: boolean
}
