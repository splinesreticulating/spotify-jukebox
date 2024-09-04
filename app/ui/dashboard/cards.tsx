import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  InboxIcon,
} from "@heroicons/react/24/outline";
import { openSans } from "@/app/ui/fonts";
import { fetchCardData } from "@/app/lib/data";

const iconMap = {
  collected: BanknotesIcon,
  artists: UserGroupIcon,
  pending: ClockIcon,
  songs: InboxIcon,
};

export default async function CardWrapper() {
  const { numberOfSongs, numberOfArtists } = await fetchCardData();

  return (
    <>
      <Card
        title="Total Songs"
        value={numberOfSongs.toLocaleString()}
        type="songs"
      />
      <Card
        title="Total Artists"
        value={numberOfArtists.toLocaleString()}
        type="artists"
      />
    </>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: "songs" | "artists";
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${openSans.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}
