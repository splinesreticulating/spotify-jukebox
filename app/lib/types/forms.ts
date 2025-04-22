import { z } from 'zod'
import { songSchema } from '@/app/lib/schemas'

export type FormValues = z.infer<typeof songSchema>
export type SongData = z.infer<typeof songSchema>
