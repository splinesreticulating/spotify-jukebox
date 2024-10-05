"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { fetchNowPlaying, measurePoolDepth } from "@/app/lib/data";
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
      const { currentSong, lastSong, friends } = await fetchNowPlaying();
      const poolDepth = await measurePoolDepth(currentSong.songID);

      setNowPlayingData({
        lastSong,
        currentSong: { poolDepth, ...currentSong },
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
    <div className="flex flex-col items-center justify-center p-4 sm:p-6">
      {isLoading ? (
        <NowPlayingSkeleton />
      ) : (
        nowPlayingData && (
          <div className="w-full max-w-md text-center">
            <div className="my-2 flex justify-center">
              <Image
                src="/squirrelGuitarButton.png"
                width={92}
                height={95}
                alt="Squirrel button"
              />
            </div>
            <table className="w-full table-auto border-collapse">
              <tbody>
                <tr>
                  <td>
                    <span>
                      last played:
                      <SongLink song={nowPlayingData.lastSong} />
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <Heart
                      onHeartClick={setFriendship}
                      isHeartFilled={isHeartFilled}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    now playing:
                    <strong>
                      <SongLink song={nowPlayingData.currentSong} />
                    </strong>
                  </td>
                </tr>
                <tr>
                  <td>
                    {`pool depth: ${nowPlayingData.currentSong.poolDepth}`}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}
