import { addToQueue } from "@/app/lib/actions"
import { NextResponse } from "next/server"
import { auth } from "@/auth"

export async function POST(
    _request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const session = await auth()
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    try {
        const { id } = await params
        const songId = Number(id)
        const result = await addToQueue(songId)

        if (!result.success) {
            throw new Error("Failed to add song to queue")
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Failed to queue song:", error)
        return NextResponse.json(
            { error: "Failed to queue song" },
            { status: 500 },
        )
    }
}
