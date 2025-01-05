'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Song } from '@/app/lib/types'
import { songSchema } from '@/app/lib/schemas'
import type { FormValues } from '@/app/lib/types'
import {
  InputField,
  TimeOffDropdown,
  RadioButtonGroup,
  NumericalDropDown,
  DateAdded,
  LastPlayed,
} from '@/app/lib/components'
import { toast } from 'sonner'
import { toastStyles } from '@/app/lib/constants/toast-styles'
import { useTheme } from '@/app/lib/ThemeContext'
import clsx from 'clsx'
import type { LevelOption, RoboticnessOption } from '@/app/lib/types'
import { ArrowsUpDownIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

const FIRST_YEAR = 1800

const levelOptions: LevelOption[] = [
  { id: '1', value: 1, label: 'Sleep' },
  { id: '2', value: 2, label: 'Morning' },
  { id: '3', value: 3, label: 'Afternoon' },
  { id: '4', value: 4, label: 'Bar' },
  { id: '5', value: 5, label: 'Club' },
]

const roboticnessOptions: RoboticnessOption[] = [
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
      reset(data, { keepValues: true, keepDirty: false })
      toast.success('Updated', toastStyles.success)
    } catch {
      toast.error('Update failed', toastStyles.error)
    }
  }

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isDirty },
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
      instrumentalness: initialSong.instrumentalness,
    },
  })

  const values = watch()
  const { theme } = useTheme()

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-3xl space-y-8 p-6">
      <div className="rounded-xl bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm ring-1 ring-gray-200">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          {initialSong.image_urls && initialSong.image_urls.length > 0 && (
            <Image
              src={initialSong.image_urls[0]}
              alt={`${initialSong.title} album art`}
              className="h-20 w-20 rounded-lg object-cover shadow-md sm:h-24 sm:w-24"
              width={96}
              height={96}
            />
          )}
          <div className="min-w-0 flex-1">
            <div className="space-y-1">
              <div className="truncate text-lg font-semibold text-gray-900 sm:text-xl md:text-2xl">
                {initialSong.title || ''}
              </div>
              <div className="text-base text-gray-600 sm:text-lg">{initialSong.artists?.join(', ')}</div>
            </div>
            <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm text-gray-500">
              <DateAdded song={initialSong} />
              {initialSong.date_liked && (
                <span className="flex items-center">
                  <span className="mx-1.5 h-1 w-1 rounded-full bg-gray-300" />
                  <span>
                    Liked:{' '}
                    {new Date(initialSong.date_liked).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </span>
              )}
              <span className="flex items-center">
                <span className="mx-1.5 h-1 w-1 rounded-full bg-gray-300" />
                <LastPlayed song={initialSong} />
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8 rounded-xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <InputField label="Title" {...register('title')} />
            <InputField
              label="Spotify ID"
              placeholder="Paste Spotify URL or ID"
              {...register('spotify_id', {
                onChange: (e) => {
                  const value = e.target.value
                  // Check if it's a Spotify URL
                  if (value.includes('spotify.com/track/')) {
                    // Extract the ID after 'track/'
                    const match = value.match(/track\/([a-zA-Z0-9]{22})/)
                    if (match && match[1]) {
                      e.target.value = match[1]
                    }
                  }
                },
              })}
            />

            <InputField label="Artists" placeholder="Separate artists with commas" {...register('artists')} />
            <InputField label="Album" {...register('album')} />

            <InputField label="Key" {...register('key')} />

            <div className="flex items-end gap-2">
              <div className="flex-1">
                <InputField label="BPM" type="number" {...register('bpm', { valueAsNumber: true })} />
              </div>
              <button
                type="button"
                onClick={() => {
                  const currentBpm = watch('bpm')
                  if (currentBpm) {
                    setValue('bpm', currentBpm * 2 > 200 ? currentBpm / 2 : currentBpm * 2, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                }}
                className={clsx(
                  'mb-[2px] rounded-md px-3 py-2 text-sm font-medium',
                  'border bg-white hover:bg-gray-50',
                  `text-${theme}-primary border-${theme}-primary`,
                )}
              >
                <ArrowsUpDownIcon className="h-5 w-5" />
              </button>
            </div>

            <InputField
              label="Instrumentalness"
              type="number"
              min="0"
              max="100"
              {...register('instrumentalness', { valueAsNumber: true })}
            />

            <NumericalDropDown
              label="Year"
              lowerValue={FIRST_YEAR}
              upperValue={new Date().getFullYear()}
              {...register('year', { valueAsNumber: true })}
            />

            <InputField label="Tags" placeholder="Separate tags with commas" {...register('tags')} />

            <TimeOffDropdown label="Time Off" {...register('hours_off', { valueAsNumber: true })} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="rounded-lg bg-gray-50 p-4 shadow-inner">
              <div className="flex flex-wrap gap-3">
                <RadioButtonGroup
                  name="level"
                  options={levelOptions}
                  value={values.level ?? undefined}
                  onChange={(value) =>
                    setValue('level', value, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                />
              </div>
            </div>

            <div className="rounded-lg bg-gray-50 p-4 shadow-inner">
              <div className="flex flex-wrap gap-3">
                <RadioButtonGroup
                  name="roboticness"
                  options={roboticnessOptions}
                  value={values.roboticness ?? undefined}
                  onChange={(value) =>
                    setValue('roboticness', value, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 bg-white py-4 shadow-lg">
        <div className="flex justify-end gap-4 px-8">
          <button
            type="button"
            onClick={() => reset()}
            disabled={!isDirty}
            className={clsx(
              'rounded-md px-4 py-2 text-sm font-medium',
              'border bg-white hover:bg-gray-50',
              `text-${theme}-primary border-${theme}-primary`,
              'disabled:opacity-50',
            )}
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={!isDirty || mutation.isPending}
            className={clsx(
              'rounded-md px-4 py-2 text-sm font-medium',
              `bg-${theme}-primary hover:bg-${theme}-hover`,
              'text-white',
              'disabled:opacity-50',
            )}
          >
            {mutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </form>
  )
}
