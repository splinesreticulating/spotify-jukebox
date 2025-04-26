"use client"

import { useTheme } from "@/app/lib/ThemeContext"
import type { Theme } from "@/app/lib/ThemeContext"

export default function ThemeSelector() {
    const { theme, setTheme } = useTheme()

    return (
        <select
            value={theme}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setTheme(e.target.value as Theme)
            }
            className="rounded-md border border-gray-300 px-2 py-1 text-sm"
        >
            <option value="ocean">Ocean</option>
            <option value="forest">Forest</option>
            <option value="sunset">Sunset</option>
            <option value="purple">Purple Rain</option>
            <option value="midnight">Midnight</option>
            <option value="christmas">Christmas</option>
        </select>
    )
}
