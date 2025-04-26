import {
    fetchAvailableSongsByLevel,
    fetchWeeklyAverageYear,
} from "@/app/lib/data"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const [averageYear, availableSongs] = await Promise.all([
            fetchWeeklyAverageYear(),
            fetchAvailableSongsByLevel(),
        ])

        return NextResponse.json({
            averageYear,
            availableSongs,
        })
    } catch (error) {
        console.error("Failed to fetch stats:", error)
        return NextResponse.json(
            { error: "Failed to fetch stats" },
            { status: 500 },
        )
    }
}
