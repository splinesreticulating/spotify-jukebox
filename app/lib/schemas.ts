import { z } from 'zod'

// Input type (what the form sends)
export const songInputSchema = z.object({
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
  valence: z.number().nullable(),
  loudness: z.number().nullable(),
})

// Output type (after transformation)
export const songSchema = songInputSchema.transform((data) => ({
  ...data,
  artists: data.artists
    ? data.artists
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : [],
  tags: data.tags
    ? data.tags
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : [],
}))
