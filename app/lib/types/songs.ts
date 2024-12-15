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
  date_liked: Date | null
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

export type FormattedArtistsTable = {
  id: number
  name: string
}

export type NowPlayingData = {
  currentSong: NowPlayingSong
  lastSong: NowPlayingSong
  nextSong: NowPlayingSong
  friends: boolean
}

export type NowPlayingSong = {
  songID: Song['id']
  artists: Song['artists']
  title: Song['title']
  level?: number
}

export type LevelOption = {
  id: string
  value: number
  label: string
}

export type RoboticnessOption = {
  id: string
  value: number
  label: string
}
