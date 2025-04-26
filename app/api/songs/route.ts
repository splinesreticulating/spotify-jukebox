import { fetchFilteredSongs } from "@/app/lib/data"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)

    const query = searchParams.get("query") || ""
    const currentPage = Number(searchParams.get("page")) || 1
    const levels = searchParams.get("levels") || ""
    const instrumental = searchParams.get("instrumental") || ""
    const keyMatch = searchParams.get("keyMatch") || ""
    const keyCompatible = searchParams.get("keyCompatible") || ""
    const bpmRef = searchParams.get("bpmRef") || ""
    const eighties = searchParams.get("eighties") === "true"
    const nineties = searchParams.get("nineties") === "true"
    const lastYear = searchParams.get("lastYear") === "true"
    const thisYear = searchParams.get("thisYear") === "true"

    try {
        const songs = await fetchFilteredSongs(
            query,
            currentPage,
            levels,
            instrumental,
            keyMatch,
            bpmRef,
            eighties,
            nineties,
            lastYear,
            thisYear,
            keyCompatible,
        )
        return NextResponse.json(songs)
    } catch (error) {
        console.error("Error:", error)
        return NextResponse.json(
            { error: "Failed to fetch songs" },
            { status: 500 },
        )
    }
}
