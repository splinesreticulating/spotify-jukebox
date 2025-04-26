import type { NowPlayingSong } from "@/app/lib/types/songs"
import clsx from "clsx"
import { Kalam, Space_Mono } from "next/font/google"
import Link from "next/link"
import React from "react"
import { getLevelColor } from "../lib/utils"

const spaceMono = Space_Mono({ weight: ["400", "700"], subsets: ["latin"] })
const kalam = Kalam({ weight: ["400", "700"], subsets: ["latin"] })

export const SongLink: React.FC<{
    song: NowPlayingSong
    className?: string
    showArtist?: boolean
}> = ({ song, className = "", showArtist = true }) => {
    const levelColor = getLevelColor(song.level)

    const getFontClass = (roboticness?: number) => {
        const isBold = className.includes("font-bold")
        switch (roboticness) {
            case 1:
                return isBold ? `${kalam.className} font-bold` : kalam.className
            case 3:
                return isBold
                    ? `${spaceMono.className} font-bold tracking-tighter`
                    : `${spaceMono.className} tracking-tighter`
            default:
                return ""
        }
    }

    const fontClass = getFontClass(song.roboticness ?? 2)

    return (
        <span
            className={clsx(
                "break-words text-sm lowercase sm:text-base",
                className,
                fontClass,
            )}
        >
            <Link
                href={`/dashboard/songs/${song.id}/edit`}
                className={`hover:underline ${levelColor}`}
            >
                {song.title || ""}
            </Link>
            {showArtist && song.artists?.length > 0 && (
                <span className={levelColor}>
                    {" by "}
                    {song.artists.map((artist, index) => (
                        <React.Fragment key={artist}>
                            {index > 0 && ", "}
                            <Link
                                href={`/dashboard/artists/${encodeURIComponent(artist)}`}
                                className="hover:underline"
                            >
                                {artist}
                            </Link>
                        </React.Fragment>
                    ))}
                </span>
            )}
        </span>
    )
}
