export type Song = {
    id: number
    spotify_id: string | null
    sam_id: number | null
    artists: string[]
    title: string | null
    album: string | null
    tags: string[]
    instrumentalness: number | null
    bpm: number | null
    key: string | null
    level: number | null
    date_added: Date
    date_liked: Date | null
    year: number | null
    hours_off: number | null
    count_played: number
    date_played: Date | null
    roboticness: number
    danceability: number | null
    energy: number | null
    valence: number | null
    loudness: number | null
    image_urls: string[] | null
    explicit: boolean
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
    id: Song["id"]
    artists: Song["artists"]
    title: Song["title"]
    level?: Song["level"]
    key?: Song["key"]
    bpm?: Song["bpm"]
    spotify_id?: Song["spotify_id"]
    sam_id?: Song["sam_id"]
    roboticness?: Song["roboticness"]
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

export interface LatestSong {
    id: number
    title: string
    artists: string[]
    date_added: Date
    spotify_id: string | null
    sam_id: number | null
    level: number | null
    roboticness: number | null // TODO: Remove the need for null [TREE-145]
}
