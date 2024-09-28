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
        {/* Render Input Fields */}
        {state.message && <p className="text-green-500">{state.message}</p>}
        {inputFieldsData.map((field) => (
          <div key={field.id}>
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
            />
            {state.errors?.[field.name as keyof typeof state.errors]?.map(
              (error, index) => (
                <p key={index} className="text-red-500">
                  {error}
                </p>
              ),
            )}
          </div>
        ))}

        <TimeOffDropdown
          initialValue={song.hours_off}
          onChange={(value: number) => console.log(value)}
        />

        {/* Render Radio Button Group */}
        <RadioButtonGroup
          name="status"
          options={radioOptions.map((option) => ({
            ...option,
            checked: song.genre === option.genre,
          }))}
        />
      </div>

      {/* Render Form Actions */}
      <FormActions songId={song.id} />
    </form>
  );
}
