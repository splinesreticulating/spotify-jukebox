// Loading animation
const shimmer = `
  before:absolute
  before:inset-0
  before:-translate-x-full
  before:animate-[shimmer_2s_infinite]
  before:bg-gradient-to-r
  before:from-transparent
  before:via-white/60
  before:to-transparent
`

function CardSkeleton() {
    return (
        <div
            className={`${shimmer} relative overflow-hidden rounded-lg bg-gray-100 p-3`}
        >
            <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-md bg-gray-200" />
                <div className="h-4 w-16 rounded-md bg-gray-200" />
            </div>
            <div className="mt-1">
                <div className="h-6 w-16 rounded-md bg-gray-200" />
            </div>
        </div>
    )
}

export function CardsSkeleton() {
    return (
        <>
            <CardSkeleton />
            <CardSkeleton />
        </>
    )
}

function SongSkeleton() {
    return (
        <div className="flex flex-row items-center justify-between border-b border-gray-100 py-4">
            <div className="flex items-center">
                <div className="min-w-0">
                    <div className="h-5 w-40 rounded-md bg-gray-200" />
                    <div className="mt-2 h-4 w-12 rounded-md bg-gray-200" />
                </div>
            </div>
            <div className="mt-2 h-4 w-28 rounded-md bg-gray-200" />
        </div>
    )
}

export function LatestSongsSkeleton() {
    return (
        <div
            className={`${shimmer} relative flex w-full flex-col overflow-hidden md:col-span-4`}
        >
            <div className="mb-4 h-8 w-36 rounded-md bg-gray-100" />
            <div className="flex grow flex-col justify-between rounded-xl bg-gray-100 p-4">
                <div className="bg-white px-6">
                    <SongSkeleton />
                    <SongSkeleton />
                    <SongSkeleton />
                    <SongSkeleton />
                    <SongSkeleton />
                </div>
            </div>
        </div>
    )
}

export default function DashboardSkeleton() {
    return (
        <>
            <div
                className={`${shimmer} relative mb-4 h-8 w-36 overflow-hidden rounded-md bg-gray-100`}
            />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
                <LatestSongsSkeleton />
            </div>
        </>
    )
}

export function NowPlayingSkeleton() {
    return (
        <main className="flex flex-col items-center justify-center p-4 sm:p-6">
            <div className="w-full max-w-md text-center">
                <div className="my-2 flex justify-center">
                    <div className="h-24 w-24 animate-pulse rounded-full bg-gray-100" />
                </div>
                <ul className="flex w-full flex-col items-center space-y-4">
                    <li className="h-8 w-32 animate-pulse rounded bg-gray-100" />
                    <li className="h-8 w-8 animate-pulse rounded-full bg-red-100" />
                    <li className="h-8 w-32 animate-pulse rounded bg-gray-100" />
                    <li className="h-8 w-32 animate-pulse rounded bg-gray-100" />
                </ul>
            </div>
        </main>
    )
}
