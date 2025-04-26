"use client"

import { ArrowPathIcon, PlayIcon } from "@heroicons/react/24/solid"
import { useState } from "react"
import { toast } from "sonner"

interface PlayButtonProps {
    songId: number
    className?: string
}

export default function PlayButton({ songId }: PlayButtonProps) {
    const [isLoading, setIsLoading] = useState(false)

    const handlePlay = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(`/api/play/${songId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            })

            if (!response.ok) {
                throw new Error("Failed to queue song")
            }

            toast.success("Song added to queue")
        } catch (error) {
            console.error("Error queueing song:", error)
            toast.error("Failed to queue song")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <button
            type="button"
            onClick={handlePlay}
            disabled={isLoading}
            className="group flex h-8 w-8 items-center justify-center rounded-full 
                 bg-gray-50 transition-colors hover:bg-gray-100"
            aria-label="Play song"
        >
            {isLoading ? (
                <ArrowPathIcon className="h-4 w-4 animate-spin text-gray-600" />
            ) : (
                <PlayIcon className="h-4 w-4 text-gray-600 transition-colors group-hover:text-red-600" />
            )}
        </button>
    )
}
