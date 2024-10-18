"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { fetchNowPlaying } from "@/app/lib/data";
import { befriend, defriend } from "@/app/lib/actions";
import { NowPlayingData } from "@/app/lib/definitions";
import { SongLink } from "@/app/lib/components/SongLink";
import { Heart } from "@/app/lib/components/Heart";
import { NowPlayingSkeleton } from "@/app/ui/skeletons";

export default function Page() {
  const [nowPlayingData, setNowPlayingData] = useState<NowPlayingData | null>(
    null,
  );
  const [isHeartFilled, setIsHeartFilled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNowPlayingData = async () => {
    try {
      setIsLoading(true);
      const { currentSong, lastSong, nextSong, friends } =
        await fetchNowPlaying();

      setNowPlayingData({
        lastSong,
        currentSong,
        nextSong,
        friends,
      });
      setIsHeartFilled(friends);
    } catch (err) {
      console.error("error getting now playing info", err);
    } finally {
      setIsLoading(false);
    }
  };

  const setFriendship = async () => {
    if (!nowPlayingData) throw new Error();

    nowPlayingData.friends
      ? await defriend(nowPlayingData)
      : await befriend(nowPlayingData);

    setNowPlayingData({ ...nowPlayingData, friends: !nowPlayingData.friends });
    setIsHeartFilled((prevState) => !prevState);
  };

  useEffect(() => {
    fetchNowPlayingData();

    const interval = setInterval(() => {
      fetchNowPlayingData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="flex flex-col items-center justify-center p-4 sm:p-6">
      {isLoading ? (
        <NowPlayingSkeleton />
      ) : (
        nowPlayingData && (
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
                last:
                <SongLink song={nowPlayingData.lastSong} />
              </li>
              <li>
                <Heart
                  onHeartClick={setFriendship}
                  isHeartFilled={isHeartFilled}
                />
              </li>
              <li>
                now:
                <strong>
                  <SongLink song={nowPlayingData.currentSong} />
                </strong>
              </li>
              <li>
                next:{" "}
                {nowPlayingData.nextSong.songID ? (
                  <SongLink song={nowPlayingData.nextSong} />
                ) : (
                  "selecting..."
                )}
              </li>
            </ul>
          </section>
        )
      )}
    </main>
  );
}
