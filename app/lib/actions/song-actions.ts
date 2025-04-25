"use server"

import { db } from "@/app/lib/db"
import type { FormValues } from "@/app/lib/types"

export async function updateSong(id: string, data: FormValues) {
    try {
        return await db.nuts.update({
            where: { id: Number(id) },
            data: {
                title: data.title || undefined,
                artists:
                    typeof data.artists === "string"
                        ? data.artists
                              .split(",")
                              .map((a) => a.trim())
                              .filter(Boolean)
                        : data.artists || undefined,
                album: data.album || undefined,
                tags:
                    typeof data.tags === "string"
                        ? data.tags
                              .split(",")
                              .map((t) => t.trim())
                              .filter(Boolean)
                        : data.tags || undefined,
                instrumentalness: data.instrumentalness ?? undefined,
                year: data.year ?? undefined,
                hours_off: data.hours_off ?? undefined,
                level: data.level ?? undefined,
                roboticness: data.roboticness ?? undefined,
                key: data.key || undefined,
                bpm: data.bpm ?? undefined,
                spotify_id: data.spotify_id || undefined,
                danceability: data.danceability ?? undefined,
                energy: data.energy ?? undefined,
            },
        })
    } catch (error) {
        console.error("Update Error:", error)
        throw new Error("Failed to update song")
    }
}
