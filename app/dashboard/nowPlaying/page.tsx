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
  const [isLoading, setIsLoading] = useState(true); // New loading state

  const fetchNowPlayingData = async () => {
    try {
      setIsLoading(true); // Start loading
      const { currentSong, lastSong, friends } = await fetchNowPlaying();
      const poolDepth = await measurePoolDepth(currentSong.songID);

      setNowPlayingData({
        lastSong,
        currentSong: { poolDepth, ...currentSong },
        friends,
      });
      setIsHeartFilled(friends); // Set initial heart status based on `friends` property
    } catch (err) {
      console.error("error getting now playing info", err);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  const setFriendship = async () => {
    if (!nowPlayingData) throw new Error();

    nowPlayingData.friends
      ? await defriend(nowPlayingData)
      : await befriend(nowPlayingData);

    // update the friendship and the heart
    setNowPlayingData({ ...nowPlayingData, friends: !nowPlayingData.friends });
    setIsHeartFilled((prevState) => !prevState);
  };

  useEffect(() => {
    fetchNowPlayingData(); // Initial data fetch

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
            <pre className="text-sm sm:text-base">
              <strong>Now Playing:</strong>
            </pre>
            <div className="my-2 flex justify-center">
              <Image
                src="/squirrelGuitarButton.png"
                width={82}
                height={87}
                alt="Squirrel button"
                className="h-auto max-w-full sm:h-24 sm:w-20"
              />
            </div>
            <br />
            <table className="w-full table-auto border-collapse">
              <tbody>
                last: <SongLink song={nowPlayingData.lastSong} />
                <tr>
                  <td colSpan={2} className="py-2">
                    <Heart
                      onHeartClick={setFriendship}
                      isHeartFilled={isHeartFilled}
                    />
                  </td>
                </tr>
                now:{" "}
                <strong>
                  <SongLink song={nowPlayingData.currentSong} />
                </strong>
              </tbody>
            </table>
            <br />
            <pre className="text-sm sm:text-base">{`pool depth: ${nowPlayingData.currentSong.poolDepth}`}</pre>
          </div>
        )
      )}
    </div>
  );
}
