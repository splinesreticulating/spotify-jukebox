import { BanknotesIcon, ClockIcon, UserGroupIcon, InboxIcon, HeartIcon } from '@heroicons/react/24/outline'
import { openSans } from '@/app/ui/fonts'
import { fetchCardData } from '@/app/lib/data'
import type { CardProps } from '@/app/lib/types'

const iconMap = {
  collected: BanknotesIcon,
  artists: UserGroupIcon,
  pending: ClockIcon,
  songs: InboxIcon,
  compatibility: HeartIcon,
}

export default async function CardWrapper() {
  const { numberOfSongs, numberOfArtists, numberOfCompatibilities } = await fetchCardData()

  return (
    <>
      <Card title="Total Songs" value={numberOfSongs.toLocaleString()} type="songs" />
      <Card title="Total Artists" value={numberOfArtists.toLocaleString()} type="artists" />
      <Card title="Total Combos" value={numberOfCompatibilities.toLocaleString()} type="compatibility">
        <HeartIcon className="h-12 w-12" />
      </Card>
    </>
  )
}

export function Card({ title, value, type }: CardProps) {
  const Icon = iconMap[type]

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <div className="flex bg-gray-50 p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${openSans.className}
          bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  )
}
