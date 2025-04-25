import { CardsSkeleton, LatestSongsSkeleton } from "@/app/components/Skeletons"
import CardWrapper from "@/app/components/dashboard/Cards"
import LatestSongs from "@/app/components/dashboard/LatestSongs"
import { Suspense } from "react"

export default async function Page() {
    return (
        <main>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                <Suspense fallback={<CardsSkeleton />}>
                    <CardWrapper />
                </Suspense>
            </div>

            <div className="mt-6">
                <Suspense fallback={<LatestSongsSkeleton />}>
                    <LatestSongs />
                </Suspense>
            </div>
        </main>
    )
}
