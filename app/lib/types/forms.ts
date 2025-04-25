import type { songSchema } from "@/app/lib/schemas"
import type { z } from "zod"

export type FormValues = z.infer<typeof songSchema>
export type SongData = z.infer<typeof songSchema>
