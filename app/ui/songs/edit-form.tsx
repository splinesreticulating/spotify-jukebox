"use client";

import { Song } from "@/app/lib/definitions";
import Link from "next/link";
import { Button } from "@/app/ui/button";
import { updateSong } from "@/app/lib/actions";
import { useFormState } from "react-dom";
import { TimeOffDropdown } from "@/app/lib/components/TimeOffDropdown";
import { DateAdded } from "@/app/lib/components/DateAdded";
import { LastPlayed } from "@/app/lib/components/LastPlayed";

export default function EditSongForm({ song }: { song: Song }) {
  const initialState = { message: null, errors: {} };
  const updateSongWithId = updateSong.bind(null, `${song.id}`);
  const [state, dispatch] = useFormState(updateSongWithId, initialState);

  return (
    <form action={dispatch}>
      <div className="text-2xl">
        {song.artist} - {song.title}
      </div>
      <p>
        <LastPlayed song={song}></LastPlayed>
      </p>
      <p>
        <DateAdded song={song}></DateAdded>
      </p>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Song title */}
        <div className="mb-4">
          <label htmlFor="title" className="mb-2 block text-sm font-medium">
            Title
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="title"
                name="title"
                type="string"
                defaultValue={song.title}
              />
            </div>
          </div>
        </div>

        {/* Song artist */}
        <div className="mb-4">
          <label htmlFor="artist" className="mb-2 block text-sm font-medium">
            Artist
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="artist"
                name="artist"
                type="string"
                defaultValue={song.artist}
              />
            </div>
          </div>
        </div>

        {/* Song album */}
        <div className="mb-4">
          <label htmlFor="album" className="mb-2 block text-sm font-medium">
            Album
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="album"
                name="album"
                type="string"
                defaultValue={song.album}
              />
            </div>
          </div>
        </div>

        {/* Song year */}
        <div className="mb-4">
          <label htmlFor="albumYear" className="mb-2 block text-sm font-medium">
            Year
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="albumyear"
                name="albumyear"
                type="number"
                step="1"
                defaultValue={song.albumyear}
                placeholder="Enter song year"
              />
            </div>
          </div>
        </div>

        {/* Time off */}
        <TimeOffDropdown
          initialValue={song.hours_off}
          onChange={(value: number) => console.log(value)}
        />

        {/* tags */}
        <div className="mb-4">
          <label htmlFor="grouping" className="mb-2 block text-sm font-medium">
            Tags
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="grouping"
                name="grouping"
                type="string"
                defaultValue={song.grouping || ""}
              />
            </div>
          </div>
        </div>

        {/* Instrumentalness */}
        <div className="mb-4">
          <label
            htmlFor="instrumentalness"
            className="mb-2 block text-sm font-medium"
          >
            Instrumentalness
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="instrumentalness"
                name="instrumentalness"
                type="number"
                step="1"
                defaultValue={song.instrumentalness || ""}
              />
            </div>
          </div>
        </div>

        {/* Song level */}
        <fieldset>
          <legend className="mb-2 block text-sm font-medium">Level</legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="sleep"
                  name="status"
                  type="radio"
                  value="sleep"
                  defaultChecked={song.genre === "1000"}
                />
                <label
                  htmlFor="sleep"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                >
                  Sleep
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="morning"
                  name="status"
                  type="radio"
                  value="morning"
                  defaultChecked={song.genre === "2000"}
                />
                <label
                  htmlFor="morning"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                >
                  Morning
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="afternoon"
                  name="status"
                  type="radio"
                  value="afternoon"
                  defaultChecked={song.genre === "3000"}
                />
                <label
                  htmlFor="afternoon"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                >
                  Afternoon
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="bar"
                  name="status"
                  type="radio"
                  value="bar"
                  defaultChecked={song.genre === "4000"}
                />
                <label
                  htmlFor="bar"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                >
                  Bar
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="club"
                  name="status"
                  type="radio"
                  value="club"
                  defaultChecked={song.genre === "5000"}
                />
                <label
                  htmlFor="club"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                >
                  Club
                </label>
              </div>
            </div>
          </div>
        </fieldset>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href={`http://192.168.193.76:6969/songs/${song.id}/edit`}
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Legacy
        </Link>

        <Link
          href="/dashboard/songs"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Update</Button>
      </div>
    </form>
  );
}
