'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Song } from '@/app/lib/definitions'
import { songSchema, FormValues } from '@/app/lib/schemas'
import {
  InputField,
  TimeOffDropdown,
  RadioButtonGroup,
  NumericalDropDown,
  DateAdded,
  LastPlayed,
} from '@/app/lib/components'
import { toast } from 'sonner'

const FIRST_YEAR = 1800

const levelOptions = [
  { id: '1', value: 1, label: 'Sleep' },
  { id: '2', value: 2, label: 'Morning' },
  { id: '3', value: 3, label: 'Afternoon' },
  { id: '4', value: 4, label: 'Bar' },
  { id: '5', value: 5, label: 'Club' },
]

const roboticnessOptions = [
  { id: '1', value: 1, label: 'Organic' },
  { id: '2', value: 2, label: 'Mixed' },
  { id: '3', value: 3, label: 'Electronic' },
]

export default function EditSongForm({ song: initialSong }: { song: Song }) {
  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const response = await fetch(`/api/songs/${initialSong.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        const errorData = await response.text()
        console.error('Update failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
        })
        throw new Error(`Failed to update song: ${errorData}`)
      }

      return response.json()
    },
  })

  const onSubmit = async (data: FormValues) => {
    try {
      await mutation.mutateAsync(data)
      toast.success('Song updated successfully')
    } catch (error) {
      console.error('Submit error:', error)
      toast.error('Failed to update song')
    }
  }

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(songSchema),
    defaultValues: {
      title: initialSong.title,
      spotify_id: initialSong.spotify_id,
      artists: initialSong.artists?.join(', ') || '',
      album: initialSong.album,
      tags: initialSong.tags?.join(', ') || '',
      key: initialSong.key,
      bpm: initialSong.bpm,
      year: initialSong.year,
      hours_off: initialSong.hours_off,
      level: initialSong.level,
      roboticness: initialSong.roboticness,
      danceability: initialSong.danceability,
      energy: initialSong.energy,
      valence: initialSong.valence,
      loudness: initialSong.loudness,
    },
  })

  const values = watch()

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-3xl space-y-8 p-6">
      <div className="rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
        <div className="flex items-center gap-6">
          {initialSong.image_urls && initialSong.image_urls.length > 0 && (
            <img
              src={initialSong.image_urls[0]}
              alt={`${initialSong.title} album art`}
              className="h-24 w-24 rounded-lg object-cover shadow-sm"
            />
          )}
          <div>
            <div className="text-3xl font-bold text-gray-800">
              {initialSong.artists?.join(', ')} - {initialSong.title || ''}
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <DateAdded song={initialSong} />
              {' · '}
              <LastPlayed song={initialSong} />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8 rounded-xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <InputField label="Title" {...register('title')} />
            <InputField label="Spotify ID" {...register('spotify_id')} />

            <InputField label="Artists" placeholder="Separate artists with commas" {...register('artists')} />

            <InputField label="Album" {...register('album')} />

            <InputField label="Tags" placeholder="Separate tags with commas" {...register('tags')} />

            <InputField label="Key" {...register('key')} />
            <InputField label="BPM" type="number" {...register('bpm', { valueAsNumber: true })} />

            <NumericalDropDown
              label="Year"
              lowerValue={FIRST_YEAR}
              upperValue={new Date().getFullYear()}
              {...register('year', { valueAsNumber: true })}
            />

            <TimeOffDropdown label="Time Off" {...register('hours_off', { valueAsNumber: true })} />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900">Classification</h3>
          <div className="space-y-4">
            <div className="rounded-lg bg-gray-50 p-4 shadow-inner">
              <div className="flex flex-wrap gap-3">
                <RadioButtonGroup
                  name="level"
                  options={levelOptions}
                  value={values.level ?? undefined}
                  onChange={(value) => setValue('level', value, { shouldValidate: true })}
                />
              </div>
            </div>

            <div className="rounded-lg bg-gray-50 p-4 shadow-inner">
              <div className="flex flex-wrap gap-3">
                <RadioButtonGroup
                  name="roboticness"
                  options={roboticnessOptions}
                  value={values.roboticness ?? undefined}
                  onChange={(value) => setValue('roboticness', value, { shouldValidate: true })}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 bg-white py-4 shadow-lg">
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => reset()}
            disabled={!isDirty}
            className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-50"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={!isDirty || mutation.isPending}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {mutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </form>
  )
}
