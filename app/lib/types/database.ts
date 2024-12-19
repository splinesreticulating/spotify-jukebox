import { Prisma } from '@prisma/client'

export type LatestSongPayload = Prisma.nutsGetPayload<{
  select: {
    id: true
    title: true
    artists: true
    date_added: true
  }
}>

export type ArtistPayload = Prisma.nutsGetPayload<{
  select: { artists: true }
}>
