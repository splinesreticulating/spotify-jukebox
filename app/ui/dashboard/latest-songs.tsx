import { ArrowPathIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { openSans } from "@/app/ui/fonts";
import { fetchLatestSongs } from "@/app/lib/data";
import Link from "next/link";
import { daysAgo } from "@/app/lib/utils";

export default async function LatestSongs() {
  const latestSongs = await fetchLatestSongs();

  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className={`${openSans.className} mb-4 text-xl md:text-2xl`}>
        Latest Songs
      </h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
        <div className="bg-white px-6">
          {latestSongs.map((song, i) => {
            return (
              <div
                key={song.id}
                className={clsx(
                  "flex flex-row items-center justify-between py-4",
                  {
                    "border-t": i !== 0,
                  },
                )}
              >
                <div className="flex items-center">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold md:text-base">
                      <Link href={`/dashboard/songs/${song.id}/edit`}>
                        {song.title}
                      </Link>
                    </p>
                    <p className="hidden text-sm text-gray-500 sm:block">
                      {song.artist}
                    </p>
                  </div>
                </div>
                <p
                  className={`${openSans.className} truncate text-sm font-medium md:text-base`}
                >
                  {daysAgo(song.date_added!)} days ago
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
