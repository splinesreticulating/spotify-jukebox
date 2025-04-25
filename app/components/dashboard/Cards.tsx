import { openSans } from "@/app/fonts"
import { fetchCardData } from "@/app/lib/data"
import type { CardProps } from "@/app/lib/types"
import {
    ClockIcon,
    HeartIcon,
    InboxIcon,
    MusicalNoteIcon,
    UserGroupIcon,
} from "@heroicons/react/24/outline"

const iconMap = {
    songs: MusicalNoteIcon,
    artists: UserGroupIcon,
    moments: HeartIcon,
    incoming: InboxIcon,
    unprocessed: ClockIcon,
}

export default async function CardWrapper() {
    const {
        numberOfSongs,
        numberOfArtists,
        numberOfCompatibilities,
        numberOfUnprocessed,
        numberOfIncoming,
    } = await fetchCardData()

    return (
        <>
            <Card
                title="Total Nuts"
                value={numberOfSongs.toLocaleString()}
                type="songs"
            />
            <Card
                title="Total Artists"
                value={numberOfArtists.toLocaleString()}
                type="artists"
            />
            <Card
                title="Magic Moments"
                value={numberOfCompatibilities.toLocaleString()}
                type="moments"
            />
            <Card
                title="Incoming"
                value={numberOfIncoming.toLocaleString()}
                type="incoming"
            />
            <Card
                title="Unprocessed"
                value={numberOfUnprocessed.toLocaleString()}
                type="unprocessed"
            />
        </>
    )
}

export function Card({
    title,
    value,
    type,
    dropdown,
}: CardProps & {
    dropdown?: React.ReactNode
    value: string | number
}) {
    const Icon = iconMap[type]

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {Icon && <Icon className="h-4 w-4 text-gray-700" />}
                    <h3 className="text-sm font-medium text-gray-600">
                        {title}
                    </h3>
                </div>
                {dropdown}
            </div>
            <p className={`${openSans.className} mt-1 text-xl`}>{value}</p>
        </div>
    )
}
