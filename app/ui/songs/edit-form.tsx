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

const FIRST_YEAR = 1800

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
    <form action={dispatch} className="mx-auto max-w-3xl space-y-8 p-6">
      <div className="rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
        <div className="flex items-center gap-6">
          {song.image_urls && song.image_urls.length > 0 && (
            <img
              src={song.image_urls[0]}
              alt={`${song.title} album art`}
              className="h-24 w-24 rounded-lg object-cover shadow-sm"
            />
          )}
          <div>
            <div className="text-3xl font-bold text-gray-800">
              {song.artists?.join(', ')} - {song.title || ''}
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <DateAdded song={song} />
              {' · '}
              <LastPlayed song={song} />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8 rounded-xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
        {state.message && (
          <div className="rounded-lg bg-green-50 px-4 py-3 text-green-700 shadow-inner">{state.message}</div>
        )}

        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {inputFieldsData.slice(0, 5).map((field) => (
              <div key={field.id} className="md:col-span-2">
                <InputField
                  {...field}
                  defaultValue={
                    field.defaultValueTransform
                      ? field.defaultValueTransform(song[field.valueKey])
                      : (song[field.valueKey] as string | number | null)?.toString() || ''
                  }
                  className={`${
                    field.type === 'number' || field.id === 'key' ? 'w-24' : 'w-full'
                  } rounded-lg border-gray-300 transition-colors focus:border-indigo-500 focus:ring-indigo-500`}
                />
              </div>
            ))}

            <div className="grid grid-cols-4 gap-6 md:col-span-2">
              <InputField
                {...inputFieldsData[5]}
                defaultValue={(song[inputFieldsData[5].valueKey] as string | number | null)?.toString() || ''}
                className="w-24 rounded-lg border-gray-300 transition-colors focus:border-indigo-500 focus:ring-indigo-500"
              />
              <InputField
                {...inputFieldsData[6]}
                defaultValue={(song[inputFieldsData[6].valueKey] as string | number | null)?.toString() || ''}
                className="w-24 rounded-lg border-gray-300 transition-colors focus:border-indigo-500 focus:ring-indigo-500"
              />
              <div>
                <label htmlFor="year" className="mb-2 block text-sm font-medium text-gray-700">
                  Year
                </label>
                <NumericalDropDown
                  className="w-32 rounded-lg border-gray-300 transition-all hover:border-gray-400 focus:border-indigo-500 focus:ring-indigo-500"
                  name="year"
                  defaultValue={song.year}
                  lowerValue={FIRST_YEAR}
                  upperValue={new Date().getFullYear()}
                  nullOptionLabel="(not set)"
                />
              </div>
              <TimeOffDropdown initialValue={song.hours_off || 24} className="w-48" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900">Audio Characteristics</h3>
          <div className="grid grid-cols-1 gap-6 rounded-lg bg-gray-50 p-6 md:grid-cols-2">
            <div>
              <label htmlFor="danceability" className="mb-2 block text-sm font-medium text-gray-700">
                Danceability
              </label>
              <NumericalDropDown
                className="w-32 rounded-lg border-gray-300 transition-all hover:border-gray-400 focus:border-indigo-500 focus:ring-indigo-500"
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
                className="w-32 rounded-lg border-gray-300 transition-all hover:border-gray-400 focus:border-indigo-500 focus:ring-indigo-500"
                name="energy"
                defaultValue={song.energy}
                lowerValue={0}
                upperValue={100}
                nullOptionLabel="(not set)"
              />
            </div>
            <div>
              <label htmlFor="valence" className="mb-2 block text-sm font-medium text-gray-700">
                Valence
              </label>
              <NumericalDropDown
                className="w-32 rounded-lg border-gray-300 transition-all hover:border-gray-400 focus:border-indigo-500 focus:ring-indigo-500"
                name="valence"
                defaultValue={song.valence}
                lowerValue={0}
                upperValue={100}
                nullOptionLabel="(not set)"
              />
            </div>
            <div>
              <label htmlFor="loudness" className="mb-2 block text-sm font-medium text-gray-700">
                Loudness
              </label>
              <NumericalDropDown
                className="w-32 rounded-lg border-gray-300 transition-all hover:border-gray-400 focus:border-indigo-500 focus:ring-indigo-500"
                name="loudness"
                defaultValue={song.loudness}
                lowerValue={0}
                upperValue={100}
                nullOptionLabel="(not set)"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900">Classification</h3>
          <div className="space-y-4">
            <div className="rounded-lg bg-gray-50 p-4 shadow-inner">
              <RadioButtonGroup
                name="level"
                options={levelOptions.map((level) => ({
                  ...level,
                  checked: song.level === Number(level.value),
                }))}
                className="flex flex-wrap gap-3"
              />
            </div>

            <div className="rounded-lg bg-gray-50 p-4 shadow-inner">
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
      </div>

      <FormActions className="sticky bottom-0 bg-white py-4 shadow-lg" />
    </form>
  )
}
