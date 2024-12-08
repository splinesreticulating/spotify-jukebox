import { z } from 'zod'
import { songInputSchema, songSchema } from '@/app/lib/schemas'

export type FormValues = z.infer<typeof songInputSchema>
export type SongData = z.infer<typeof songSchema>
