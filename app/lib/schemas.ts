import { z } from 'zod'

export const songSchema = z.object({
  title: z.string().nullable(),
  spotify_id: z.string().nullable(),
  artists: z.string(),
  album: z.string().nullable(),
  tags: z.string(),
  key: z.string().nullable(),
  bpm: z.number().nullable(),
  year: z.number().nullable(),
  hours_off: z.number().nullable(),
  level: z.number().nullable(),
  roboticness: z.number().nullable(),
  danceability: z.number().nullable(),
  energy: z.number().nullable(),
  instrumentalness: z.number().min(0).max(100).nullable(),
  explicit: z.boolean().default(false),
})
