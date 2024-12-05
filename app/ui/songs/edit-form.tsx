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
  value: `${index + 1}`,
  label: level,
}))

const roboticnessOptions = [
  { id: '1', value: '1', label: 'Organic' },
  { id: '2', value: '2', label: 'Mixed' },
  { id: '3', value: '3', label: 'Electronic' },
]

type InputFieldData = {
  id: string
  name: string
  label: string
  type: string
  valueKey: keyof Song
  placeholder?: string
  defaultValueTransform?: (value: any) => string
  className?: string
}

const inputFieldsData: InputFieldData[] = [
  {
    id: 'title',
    name: 'title',
    label: 'Title',
    type: 'text',
    valueKey: 'title',
  },
  {
    id: 'spotify_id',
    name: 'spotify_id',
    label: 'Spotify ID',
    type: 'text',
    valueKey: 'spotify_id',
  },
  {
    id: 'artists',
    name: 'artists',
    label: 'Artists',
    type: 'text',
    valueKey: 'artists',
    placeholder: 'Separate multiple artists with commas',
    defaultValueTransform: (value: string[] | null) => value?.join(', ') || '',
  },
  {
    id: 'album',
    name: 'album',
    label: 'Album',
    type: 'text',
    valueKey: 'album',
  },
  {
    id: 'tags',
    name: 'tags',
    label: 'Tags',
    type: 'text',
    valueKey: 'tags',
    placeholder: 'Separate multiple tags with commas',
    defaultValueTransform: (value: string[] | null) => value?.join(', ') || '',
  },
  {
    id: 'key',
    name: 'key',
    label: 'Key',
    type: 'text',
    valueKey: 'key',
    className: 'w-24',
  },
  {
    id: 'bpm',
    name: 'bpm',
    label: 'BPM',
    type: 'number',
    valueKey: 'bpm',
    className: 'w-24',
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
    <form action={dispatch} className="mx-auto max-w-3xl space-y-6 p-6">
      <div className="border-b border-gray-200 pb-4 text-2xl font-semibold text-gray-800 md:text-3xl">
        {song.artists?.join(', ') || ''} - {song.title || ''}
      </div>

      <details className="group rounded-lg bg-white shadow-sm transition-shadow duration-200 hover:shadow-md">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-gray-700 hover:text-gray-900">
          Song Details
          <span className="float-right transform transition-transform duration-200 group-open:rotate-180">▼</span>
        </summary>
        <div className="space-y-2 rounded-b-lg bg-gray-50 px-4 py-3">
          <LastPlayed song={song} />
          <DateAdded song={song} />
        </div>
      </details>

      <div className="space-y-6 rounded-xl bg-white p-6 shadow-sm">
        {state.message && <div className="rounded-lg bg-green-50 px-4 py-3 text-green-700">{state.message}</div>}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {inputFieldsData.map((field) => (
            <div
              key={field.id}
              className={field.type === 'number' || field.id === 'key' ? 'md:col-span-1' : 'md:col-span-2'}
            >
              <InputField
                id={field.id}
                name={field.name}
                label={field.label}
                type={field.type}
                defaultValue={
                  field.defaultValueTransform
                    ? field.defaultValueTransform(song[field.valueKey])
                    : (song[field.valueKey] as string | number | null)?.toString() || ''
                }
                className={field.type === 'number' || field.id === 'key' ? 'w-24' : 'w-full'}
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="year" className="mb-2 block text-sm font-medium text-gray-700">
              Year
            </label>
            <NumericalDropDown
              className="w-32 rounded-lg border-gray-300"
              name="year"
              defaultValue={song.year}
              lowerValue={1700}
              upperValue={2024}
              nullOptionLabel="Select a year"
            />
          </div>

          <div>
            <label htmlFor="instrumentalness" className="mb-2 block text-sm font-medium text-gray-700">
              Instrumentalness
            </label>
            <NumericalDropDown
              className="w-32 rounded-lg border-gray-300"
              name="instrumentalness"
              defaultValue={song.instrumentalness}
              lowerValue={0}
              upperValue={100}
              nullOptionLabel="(not set)"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="danceability" className="mb-2 block text-sm font-medium text-gray-700">
              Danceability
            </label>
            <NumericalDropDown
              className="w-32 rounded-lg border-gray-300"
              name="danceability"
              defaultValue={song.danceability}
              lowerValue={0}
              upperValue={100}
              nullOptionLabel="(not set)"
            />
          </div>

          <div>
            <label htmlFor="energy" className="mb-2 block text-sm font-medium text-gray-700">
              Energy
            </label>
            <NumericalDropDown
              className="w-32 rounded-lg border-gray-300"
              name="energy"
              defaultValue={song.energy}
              lowerValue={0}
              upperValue={100}
              nullOptionLabel="(not set)"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="valence" className="mb-2 block text-sm font-medium text-gray-700">
              Valence
            </label>
            <NumericalDropDown
              className="w-32 rounded-lg border-gray-300"
              name="valence"
              defaultValue={song.valence}
              lowerValue={0}
              upperValue={100}
              nullOptionLabel="(not set)"
            />
          </div>
        </div>

        <TimeOffDropdown initialValue={song.hours_off || 48} />

        <div className="space-y-6">
          <div className="rounded-lg bg-gray-50 p-4">
            <RadioButtonGroup
              name="level"
              options={levelOptions.map((level) => ({
                ...level,
                checked: song.level === Number(level.value),
              }))}
              className="flex flex-wrap gap-3"
            />
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <RadioButtonGroup
              name="roboticness"
              options={roboticnessOptions.map((roboticness) => ({
                ...roboticness,
                checked: song.roboticness === Number(roboticness.value),
              }))}
              className="flex flex-wrap gap-3"
            />
          </div>
        </div>
      </div>

      <FormActions className="pt-4" />
    </form>
  )
}
