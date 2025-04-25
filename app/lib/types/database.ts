import type { Prisma } from "@prisma/client"

export type LatestSongPayload = Prisma.nutsGetPayload<{
    select: {
        id: true
        title: true
        artists: true
        date_added: true
        spotify_id: true
        sam_id: true
        level: true
        roboticness: true
    }
}>

export type ArtistPayload = Prisma.nutsGetPayload<{
    select: { artists: true }
}>
