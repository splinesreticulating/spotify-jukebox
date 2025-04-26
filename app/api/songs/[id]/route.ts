import { db } from "@/app/lib/db"
import { songSchema } from "@/app/lib/schemas"
import { NextResponse } from "next/server"

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const id = (await params).id
        const data = await request.json()
        const formattedData = {
            ...data,
            artists: Array.isArray(data.artists)
                ? data.artists.join(", ")
                : data.artists,
            tags: Array.isArray(data.tags) ? data.tags.join(", ") : data.tags,
        }

        const validated = songSchema.parse(formattedData)
        const prismaData = Object.fromEntries(
            Object.entries(validated).map(([key, value]) => [
                key,
                value ?? undefined,
            ]),
        )

        const updated = await db.nuts.update({
            where: { id: Number(id) },
            data: prismaData,
        })

        return NextResponse.json(updated)
    } catch (error) {
        console.error("Failed to update song:", error)
        return NextResponse.json(
            {
                error: "Failed to update song",
                details:
                    error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 },
        )
    }
}
