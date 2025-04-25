import type { Song } from "./songs"

export type ArtistSongView = Pick<
    Song,
    | "id"
    | "title"
    | "artists"
    | "album"
    | "spotify_id"
    | "sam_id"
    | "date_added"
    | "tags"
    | "image_urls"
    | "roboticness"
>
