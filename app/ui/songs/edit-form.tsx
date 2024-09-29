"use client";

import { Song } from "@/app/lib/definitions";
import { updateSong } from "@/app/lib/actions";
import { useFormState } from "react-dom";
import {
  DateAdded,
  LastPlayed,
  InputField,
  TimeOffDropdown,
  FormActions,
  RadioButtonGroup,
  NumericalDropDown,
} from "@/app/lib/components";

const labels = ["Sleep", "Morning", "Afternoon", "Bar", "Club"];
const radioOptions = labels.map((label, index) => ({
  id: label,
  value: `${(index + 1) * 1000}`,
  label,
}));

const inputFieldsData = [
  {
    id: "title",
    name: "title",
    label: "Title",
    type: "text",
    valueKey: "title",
  },
  {
    id: "artist",
    name: "artist",
    label: "Artist",
    type: "text",
    valueKey: "artist",
  },
  {
    id: "album",
    name: "album",
    label: "Album",
    type: "text",
    valueKey: "album",
  },
  {
    id: "grouping",
    name: "grouping",
    label: "Tags",
    type: "text",
    valueKey: "grouping",
  },
];

export default function EditSongForm({ song }: { song: Song }) {
  const initialState = { message: null, errors: {} };
  const updateSongWithId = updateSong.bind(null, `${song.id}`);
  const [state, dispatch] = useFormState(updateSongWithId, initialState);

  return (
    <form action={dispatch} className="p-4">
      <div className="text-lg md:text-2xl mb-4">
        {song.artist} - {song.title}
      </div>

      <details className="bg-gray-100 p-2 mb-4 rounded-md">
        <summary className="cursor-pointer text-sm font-medium"></summary>
        <p className="text-sm mt-2">
          <LastPlayed song={song} />
        </p>
        <p className="text-sm">
          <DateAdded song={song} />
        </p>
      </details>

      <div className="bg-gray-50 p-2 md:p-4 rounded-md">
        {state.message && (
          <p className="text-green-500 mb-4">{state.message}</p>
        )}
        {inputFieldsData.map((field) => (
          <div key={field.id} className="mb-4">
            <InputField
              id={field.id}
              name={field.name}
              label={field.label}
              type={field.type}
              defaultValue={
                (song[field.valueKey as keyof Song] as
                  | string
                  | number
                  | undefined) || ""
              }
              className="w-full"
            />

            {state.errors?.[field.name as keyof typeof state.errors]?.map(
              (error, index) => (
                <p key={index} className="text-red-500 text-sm">
                  {error}
                </p>
              ),
            )}
          </div>
        ))}

        <div className="mb-4">
          <label
            htmlFor="year"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Year
          </label>
          <div>
            <NumericalDropDown
              className="rounded-md border-gray-300"
              name="year"
              defaultValue={Number(song.albumyear || "1700")}
              lowerValue={1700}
              upperValue={2024}
              nullOptionLabel="Select a year"
            ></NumericalDropDown>
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="instrumentalness"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Instrumentalness
          </label>
          <div>
            <NumericalDropDown
              className="rounded-md border-gray-300"
              name="instrumentalness"
              defaultValue={song.instrumentalness}
              lowerValue={0}
              upperValue={100}
              nullOptionLabel="(not set)"
            ></NumericalDropDown>
          </div>
        </div>

        <TimeOffDropdown initialValue={song.hours_off || 48} />

        <RadioButtonGroup
          name="level"
          options={radioOptions.map((option) => ({
            ...option,
            checked: song.genre === option.value,
          }))}
          className="w-full flex flex-wrap gap-2 mb-4"
        />
      </div>

      <FormActions songId={song.id} className="mt-4" />
    </form>
  );
}
