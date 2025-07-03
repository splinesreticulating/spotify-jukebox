import { db } from "@/app/lib/db"
import { auth } from "@/auth"
import { NextResponse } from "next/server"

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ name: string }> },
) {
    const session = await auth()
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    try {
        const { name } = await params
        const { value } = await request.json()
        const updatedSetting = await db.settings.update({
            where: { name },
            data: {
                value,
                updated_at: new Date(),
            },
        })
        return NextResponse.json(updatedSetting)
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to update setting" },
            { status: 500 },
        )
    }
}
