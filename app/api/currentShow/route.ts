import { db } from "@/app/lib/db"
import type { ShowRule } from "@/app/lib/types/show"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        // Use a library like date-fns-tz or create a consistent LA time
        // Get current time in UTC
        const nowUTC = new Date()

        // Calculate LA time by applying the offset for Pacific Time
        // Pacific Time is UTC-7 during DST and UTC-8 during standard time
        // You may want to use a proper timezone library for production
        const laOffset = -7 * 60 * 60 * 1000 // -7 hours in milliseconds (adjust for DST)
        const nowLA = new Date(nowUTC.getTime() + laOffset)

        // Format the time in 24-hour format HH:MM
        const currentTime = `${nowLA.getUTCHours().toString().padStart(2, "0")}:${nowLA.getUTCMinutes().toString().padStart(2, "0")}`

        // Get day of week in LA (0 = Sunday, 6 = Saturday)
        const currentDayNumber = nowLA.getUTCDay()

        // Get all show schedules
        const shows = await db.show_schedule.findMany()

        // Type guard to check if value is ShowRule[]
        function isShowRuleArray(val: unknown): val is ShowRule[] {
            return (
                Array.isArray(val) &&
                val.every(
                    (item) =>
                        typeof item === "object" &&
                        item !== null &&
                        typeof (item as import("@/app/lib/types/show").ShowRule)
                            .start_time === "string" &&
                        typeof (item as import("@/app/lib/types/show").ShowRule)
                            .end_time === "string",
                )
            )
        }

        // Find the current show
        const currentShow =
            shows.find(
                (show) =>
                    isShowRuleArray(show.rules) &&
                    show.rules.some(
                        (rule) =>
                            rule.days?.includes(currentDayNumber) &&
                            rule.start_time <= currentTime &&
                            rule.end_time > currentTime,
                    ),
            )?.show_name ?? "Variety Mix"

        return NextResponse.json({ showName: currentShow })
    } catch (error) {
        console.error("Error fetching current show:", error)
        return NextResponse.json({ showName: "Variety Mix" })
    }
}
