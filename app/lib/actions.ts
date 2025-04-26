"use server"

import type { NowPlayingData } from "@/app/lib/types"
import { signIn } from "@/auth"
import type { Prisma } from "@prisma/client"
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
            // AuthError from next-auth does not have a 'type' property, use 'code' instead
            type AuthErrorWithCode = AuthError & { code?: string }
            switch ((error as AuthErrorWithCode).code) {
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
        return await db.$transaction(async (tx: Prisma.TransactionClient) => {
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
                },
            },
        },
    })

    // Check if next song is in the compatible list
    type CompatibilitySongItem = {
        branch_id: number
        branch_level: number | null
        nuts_compatibility_tree_branch_idTonuts: {
            id: number
            title: string | null
            artists: string[]
            spotify_id: string | null
        }
    }
    const isNextSongCompatible = allCompatibleSongs.some(
        (song: CompatibilitySongItem) => song.branch_id === nextSongId,
    )

    // Filter out the next song from the list of alternatives
    const compatibleSongs = allCompatibleSongs
        .filter((song: CompatibilitySongItem) => song.branch_id !== nextSongId)
        .map((item: CompatibilitySongItem) => ({
            id: item.nuts_compatibility_tree_branch_idTonuts.id,
            title: item.nuts_compatibility_tree_branch_idTonuts.title ?? "",
            artists: item.nuts_compatibility_tree_branch_idTonuts.artists,
            level: item.branch_level || undefined,
            spotify_id:
                item.nuts_compatibility_tree_branch_idTonuts.spotify_id ||
                undefined,
        }))

    return {
        compatibleSongs,
        isNextSongCompatible,
    }
}
