'use client'

import { Song } from '@/app/lib/definitions'
import { updateSong } from '@/app/lib/actions'
import {
  DateAdded,
  LastPlayed,
  InputField,
  TimeOffDropdown,
  FormActions,
  RadioButtonGroup,
  NumericalDropDown,
} from '@/app/lib/components'
import { useActionState } from 'react'

const levels = ['Sleep', 'Morning', 'Afternoon', 'Bar', 'Club']
const levelOptions = levels.map((level, index) => ({
  id: level,
  value: `${(index + 1) * 1000}`,
  label: level,
}))

const roboticnessOptions = [
  { id: '1', value: '1', label: 'Organic' },
  { id: '2', value: '2', label: 'Mixed' },
  { id: '3', value: '3', label: 'Electronic' },
]

const inputFieldsData = [
  {
    id: 'title',
    name: 'title',
    label: 'Title',
    type: 'text',
    valueKey: 'title',
  },
  {
    id: 'artist',
    name: 'artist',
    label: 'Artist',
    type: 'text',
    valueKey: 'artist',
  },
  {
    id: 'album',
    name: 'album',
    label: 'Album',
    type: 'text',
    valueKey: 'album',
  },
  {
    id: 'grouping',
    name: 'grouping',
    label: 'Tags',
    type: 'text',
    valueKey: 'grouping',
  },
]

interface ActionState {
  message: string
}

export default function EditSongForm({ song }: { song: Song }) {
  const initialState: ActionState = { message: '' }
  const updateSongWithId = updateSong.bind(null, `${song.id}`)
  const [state, dispatch] = useActionState<ActionState, FormData>(updateSongWithId, initialState)

  return (
    <form action={dispatch} className="p-4">
      <div className="mb-4 text-lg md:text-2xl">
        {song.artist} - {song.title}
      </div>

      <details className="mb-4 rounded-md bg-gray-100 p-2">
        <summary className="cursor-pointer text-sm font-medium"></summary>
        <p className="mt-2 text-sm">
          <LastPlayed song={song} />
        </p>
        <p className="text-sm">
          <DateAdded song={song} />
        </p>
      </details>

      <div className="rounded-md bg-gray-50 p-2 md:p-4">
        {state.message && <p className="mb-4 text-green-500">{state.message}</p>}
        {inputFieldsData.map((field) => (
          <div key={field.id} className="mb-4">
            <InputField
              id={field.id}
              name={field.name}
              label={field.label}
              type={field.type}
              defaultValue={(song[field.valueKey as keyof Song] as string | number | undefined) || ''}
              className="w-full"
            />
          </div>
        ))}

        <div className="mb-4">
          <label htmlFor="year" className="mb-2 block text-sm font-medium text-gray-700">
            Year
          </label>
          <div>
            <NumericalDropDown
              className="rounded-md border-gray-300"
              name="year"
              defaultValue={Number(song.albumyear || '1700')}
              lowerValue={1700}
              upperValue={2024}
              nullOptionLabel="Select a year"
            ></NumericalDropDown>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="instrumentalness" className="mb-2 block text-sm font-medium text-gray-700">
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
          options={levelOptions.map((level) => ({
            ...level,
            checked: song.genre === level.value,
          }))}
          className="mb-4 flex flex-wrap gap-2"
        />

        <RadioButtonGroup
          name="roboticness"
          options={roboticnessOptions.map((roboticness) => ({
            ...roboticness,
            checked: song.roboticness === Number(roboticness.value),
          }))}
          className="mb-4 flex flex-wrap gap-2"
        />
      </div>

      <FormActions songId={song.id} className="mt-4" />
    </form>
  )
}
