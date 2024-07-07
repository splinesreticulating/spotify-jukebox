import { fetchFilteredSongs } from '@/app/lib/data';
import Link from 'next/link';

export default async function SongsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const songs = await fetchFilteredSongs(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          
          <div className="md:hidden">
            {songs?.map((song) => (
              <div
                key={song.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="mb-2 flex items-center">
                    {song.title}
                    <p className="text-sm text-gray-500">{song.artist}</p>
                  </div>
                  {song.bpm}
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <p className="text-xl font-medium">
                    {song.bpm}
                  </p>
                  <p>{song.date_added?.toDateString()}</p>
                </div>
              </div>
            ))}
          </div>

          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Artist
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Title
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  BPM
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Added
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Level
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {songs?.map((song) => (
                <tr
                  key={song.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    {song.artist}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <Link href={`/dashboard/songs/${song.id}/edit`}><strong>{song.title}</strong></Link>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {song.bpm}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {song.date_added && song.date_added.toDateString()}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <p>{Number(song.genre) / 1000}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
