"use client"

import { useTheme } from "@/app/lib/ThemeContext"

export default function ThemeSelector() {
    const { theme, setTheme } = useTheme()

    return (
        <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as any)}
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
