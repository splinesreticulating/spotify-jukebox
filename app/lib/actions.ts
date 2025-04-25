"use server"

import type { NowPlayingData } from "@/app/lib/types"
import { signIn } from "@/auth"
import { AuthError } from "next-auth"
import { redirect } from "next/navigation"
import { db } from "./db"

export async function befriend(nowPlayingData: NowPlayingData) {
    const { lastSong, currentSong } = nowPlayingData

    try {
        await db.compatibility_tree.create({
            data: {
                root_id: lastSong.id,
                branch_id: currentSong.id,
                branch_level: currentSong.level,
            },
        })
    } catch (error) {
        console.error(error)
        return { message: "Database Error: Failed to create friendship", error }
    }
}

export async function defriend(nowPlayingData: NowPlayingData) {
    const { lastSong, currentSong } = nowPlayingData

    try {
        await db.compatibility_tree.deleteMany({
            where: {
                AND: [{ root_id: lastSong.id }, { branch_id: currentSong.id }],
            },
        })
    } catch (error) {
        console.error(error)
        return { message: "Database Error: Failed to remove friendship", error }
    }
}

export async function authenticate(
    _prevState: { errorMessage: string } | undefined,
    formData: FormData,
) {
    try {
        await signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            redirect: false,
        })
        redirect("/dashboard")
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { errorMessage: "Invalid credentials" }
                default:
                    return { errorMessage: "Something went wrong" }
            }
        }
        throw error
    }
}

export async function addToQueue(songId: number) {
    try {
        // Start a transaction to ensure atomicity
        return await db.$transaction(async (tx) => {
            // Delete existing queue items
            await tx.queue.deleteMany({})

            // Add the new song
            await tx.queue.create({
                data: {
                    nut_id: songId,
                },
            })

            return { success: true }
        })
    } catch (error) {
        console.error("Failed to add song to queue:", error)
        return { success: false }
    }
}

export const fetchCompatibleSongs = async (
    songId: number,
    nextSongId: number,
) => {
    // First get all compatible songs including the next song
    const allCompatibleSongs = await db.compatibility_tree.findMany({
        where: {
            root_id: songId,
        },
        select: {
            branch_id: true,
            branch_level: true,
            nuts_compatibility_tree_branch_idTonuts: {
                select: {
                    id: true,
                    title: true,
                    artists: true,
                    spotify_id: true,
                    sam_id: true,
                },
            },
        },
    })

    // Check if next song is in the compatible list
    const isNextSongCompatible = allCompatibleSongs.some(
        (song) => song.branch_id === nextSongId,
    )

    // Filter out the next song from the list of alternatives
    const compatibleSongs = allCompatibleSongs
        .filter((song) => song.branch_id !== nextSongId)
        .map((item) => ({
            id: item.nuts_compatibility_tree_branch_idTonuts.id,
            title: item.nuts_compatibility_tree_branch_idTonuts.title,
            artists: item.nuts_compatibility_tree_branch_idTonuts.artists,
            level: item.branch_level || undefined,
            spotify_id:
                item.nuts_compatibility_tree_branch_idTonuts.spotify_id ||
                undefined,
            sam_id:
                item.nuts_compatibility_tree_branch_idTonuts.sam_id ||
                undefined,
        }))

    return {
        compatibleSongs,
        isNextSongCompatible,
    }
}
