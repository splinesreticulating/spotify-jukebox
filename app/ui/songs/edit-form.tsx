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
} from "@/app/lib/components";

const radioOptions = [
  { id: "sleep", value: "sleep", label: "Sleep", genre: "1000" },
  { id: "morning", value: "morning", label: "Morning", genre: "2000" },
  { id: "afternoon", value: "afternoon", label: "Afternoon", genre: "3000" },
  { id: "bar", value: "bar", label: "Bar", genre: "4000" },
  { id: "club", value: "club", label: "Club", genre: "5000" },
];

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
    id: "albumyear",
    name: "albumyear",
    label: "Year",
    type: "number",
    step: "1",
    valueKey: "albumyear",
    placeholder: "Enter song year",
  },
  {
    id: "grouping",
    name: "grouping",
    label: "Tags",
    type: "text",
    valueKey: "grouping",
  },
  {
    id: "instrumentalness",
    name: "instrumentalness",
    label: "Instrumentalness",
    type: "number",
    step: "1",
    valueKey: "instrumentalness",
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
        <summary className="cursor-pointer text-sm font-medium">
          Additional Details
        </summary>
        <p className="text-sm mt-2">
          <LastPlayed song={song} />
        </p>
        <p className="text-sm">
          <DateAdded song={song} />
        </p>
      </details>

      <div className="bg-gray-50 p-2 md:p-4 rounded-md">
        {/* Render Input Fields */}
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
                song[field.valueKey as keyof Song] instanceof Date
                  ? (song[field.valueKey as keyof Song] as Date).toISOString()
                  : (song[field.valueKey as keyof Song] as
                      | string
                      | number
                      | undefined) || ""
              }
              step={field.step}
              placeholder={field.placeholder}
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

        <TimeOffDropdown
          initialValue={song.hours_off}
          onChange={(value: number) => console.log(value)}
          className="w-full mb-4"
        />

        {/* Render Radio Button Group */}
        <RadioButtonGroup
          name="status"
          options={radioOptions.map((option) => ({
            ...option,
            checked: song.genre === option.genre,
          }))}
          className="w-full flex flex-wrap gap-2 mb-4"
        />
      </div>

      {/* Render Form Actions */}
      <FormActions songId={song.id} className="mt-4" />
    </form>
  );
}
