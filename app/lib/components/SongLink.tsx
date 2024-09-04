import React from 'react';
import Link from 'next/link';
import { NowPlayingSong } from '../definitions';

export const SongLink: React.FC<{ song: NowPlayingSong }> = ({ song }) => {
  return (
    <tr className="w-full">
      <td className="break-words text-sm sm:text-base">
        <Link
          href={`/dashboard/songs/${song.songID}/edit`}
          className="hover:underline"
        >
          {` ${song.artist} - ${song.title}`.toLowerCase()}
        </Link>
      </td>
    </tr>
  );
};
