import { NextResponse } from "next/server"

const LASTFM_API_KEY = process.env.LASTFM_API_KEY

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const artistName = searchParams.get("name")

    if (!artistName) {
        return NextResponse.json(
            { error: "Artist name is required" },
            { status: 400 },
        )
    }

    try {
        const response = await fetch(
            `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(
                artistName,
            )}&api_key=${LASTFM_API_KEY}&format=json`,
        )

        if (!response.ok) {
            throw new Error("Failed to fetch from Last.fm")
        }

        const data = await response.json()
        return NextResponse.json(data.artist)
    } catch (error) {
        console.error("API error:", error)
        return NextResponse.json(
            { error: "Failed to fetch artist info" },
            { status: 500 },
        )
    }
}
