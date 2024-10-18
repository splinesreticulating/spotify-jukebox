"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { fetchNowPlaying } from "@/app/lib/data";
import { befriend, defriend } from "@/app/lib/actions";
import { NowPlayingData } from "@/app/lib/definitions";
import { SongLink } from "@/app/lib/components/SongLink";
import { Heart } from "@/app/lib/components/Heart";
import { NowPlayingSkeleton } from "@/app/ui/skeletons";

export default function NowPlayingPage() {
  const [nowPlayingData, setNowPlayingData] = useState<NowPlayingData | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  const fetchNowPlayingData = async () => {
    try {
      setIsLoading(true);
      const data = await fetchNowPlaying();
      setNowPlayingData(data);
    } catch (err) {
      console.error("Error fetching now playing info:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFriendship = async () => {
    if (!nowPlayingData) return;

    const action = nowPlayingData.friends ? defriend : befriend;
    await action(nowPlayingData);

    setNowPlayingData((prev) => ({ ...prev!, friends: !prev!.friends }));
  };

  useEffect(() => {
    fetchNowPlayingData();
    const interval = setInterval(fetchNowPlayingData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) return <NowPlayingSkeleton />;
  if (!nowPlayingData) return null;

  const { lastSong, currentSong, nextSong, friends } = nowPlayingData;

  return (
    <main className="flex flex-col items-center justify-center p-4 sm:p-6">
      <section className="w-full max-w-md text-center">
        <Image
          src="/squirrelGuitarButton.png"
          width={92}
          height={95}
          alt="Squirrel button"
          className="mx-auto my-2"
        />
        <ul className="w-full flex flex-col items-center space-y-4">
          <li>
            last: <SongLink song={lastSong} />
          </li>
          <li>
            <Heart onHeartClick={toggleFriendship} isHeartFilled={friends} />
          </li>
          <li>
            now:{" "}
            <strong>
              <SongLink song={currentSong} />
            </strong>
          </li>
          <li>
            next:{" "}
            {nextSong.songID ? <SongLink song={nextSong} /> : "selecting..."}
          </li>
        </ul>
      </section>
    </main>
  );
}
