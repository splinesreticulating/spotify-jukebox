"use client"

import { inter } from "@/app/fonts"
import { useFont } from "@/app/lib/FontContext"
import { useState } from "react"

export function Logo() {
    const { currentFont, nextFont } = useFont()
    const [showTooltip, setShowTooltip] = useState(false)

    return (
        <button
            type="button"
            className={`${currentFont.className} relative flex h-full w-full cursor-pointer items-center justify-center leading-none text-white`}
            onClick={nextFont}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            {showTooltip && (
                <div
                    className={`${inter.className} absolute top-0 mt-[-2rem] rounded bg-gray-700 px-2 py-1 text-xs`}
                >
                    {currentFont.name} (click to change)
                </div>
            )}
            <p className="text-center text-[40px] sm:text-[35px] md:text-[45px]">
                Spotify Jukebox
            </p>
        </button>
    )
}
