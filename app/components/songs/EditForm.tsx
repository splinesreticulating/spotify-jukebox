'use client'

import { useOptimistic, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Song } from '@/app/lib/types'
import { songSchema } from '@/app/lib/schemas'
import type { FormValues } from '@/app/lib/types'
import { InputField, RadioButtonGroup, DateAdded, LastPlayed } from '@/app/components'
import { toast } from 'sonner'
import { useHotkeys } from 'react-hotkeys-hook'
import { motion } from 'framer-motion'
import type { LevelOption, RoboticnessOption } from '@/app/lib/types'
import Image from 'next/image'
import { ArrowsUpDownIcon } from '@heroicons/react/24/outline'
import { updateSong } from '@/app/lib/actions/song-actions'
import { TimeOffDropdown } from '@/app/components'
import { NumericalDropDown } from '@/app/components'

const FIRST_YEAR = 1800
const currentYear = new Date().getFullYear()

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
  const [isPending, startTransition] = useTransition()
  const [_, setOptimisticSong] = useOptimistic(initialSong)

  const {
    register,
    handleSubmit,
    formState: { isDirty, errors },
    reset,
    watch,
    setValue,
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
      level: initialSong.level ?? 3,
      roboticness: initialSong.roboticness ?? 2,
      danceability: initialSong.danceability,
      energy: initialSong.energy,
      instrumentalness: initialSong.instrumentalness,
      explicit: initialSong.explicit ?? false,
    },
  })

  const onSubmit = async (data: FormValues) => {
    startTransition(async () => {
      const optimisticData = {
        ...initialSong,
        ...data,
        artists:
          typeof data.artists === 'string'
            ? data.artists
                .split(',')
                .map((a) => a.trim())
                .filter(Boolean)
            : initialSong.artists,
        tags:
          typeof data.tags === 'string'
            ? data.tags
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean)
            : initialSong.tags,
        roboticness: data.roboticness ?? 2,
        level: data.level ?? 3,
        danceability: data.danceability ?? 0,
        energy: data.energy ?? 0,
      }
      setOptimisticSong(optimisticData)

      try {
        await updateSong(String(initialSong.id), data)
        // Set the form's default values to the new data
        reset(data)
        // Explicitly reset the form state
        reset(undefined, {
          keepValues: true,
          keepDirty: false,
          keepIsSubmitted: false,
          keepTouched: false,
          keepIsValid: false,
          keepSubmitCount: false,
        })
        toast.success('Updated', { duration: 2000 })
      } catch (error) {
        toast.error('Update failed', { duration: 3000 })
      }
    })
  }

  useHotkeys('mod+s', (e) => {
    e.preventDefault()
    if (isDirty && !isPending) {
      handleSubmit(onSubmit)()
    }
  })

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8"
    >
      {/* Song Info Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        {initialSong.image_urls?.[0] && (
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
            <div className="text-base text-gray-600 sm:text-lg">
              by{' '}
              {initialSong.artists?.map((artist, i) => (
                <span key={artist}>
                  {i > 0 && ', '}
                  <a
                    href={`/dashboard/artists/${encodeURIComponent(artist)}`}
                    className="hover:text-blue-600 hover:underline"
                  >
                    {artist}
                  </a>
                </span>
              ))}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm text-gray-500">
            <DateAdded song={initialSong} />
            {initialSong.date_liked && (
              <span className="flex items-center gap-3">
                {'·'}
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
            <span className="flex items-center gap-3">
              {'·'}
              <LastPlayed song={initialSong} />
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Title and Artists */}
          <div>
            <InputField label="Title" {...register('title')} error={errors.title?.message} className="w-full" />
          </div>
          <div>
            <InputField
              label="Artists"
              placeholder="Separate artists with commas"
              {...register('artists')}
              error={errors.artists?.message}
              className="w-full"
            />
          </div>

          {/* Album and Spotify ID */}
          <div>
            <InputField label="Album" {...register('album')} error={errors.album?.message} className="w-full" />
          </div>
          <div>
            <InputField
              label="Spotify ID"
              placeholder="Paste Spotify URL or ID"
              {...register('spotify_id')}
              error={errors.spotify_id?.message}
              className="w-full"
            />
          </div>

          {/* Musical Properties */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <InputField label="BPM" type="number" {...register('bpm', { valueAsNumber: true })} />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const currentBpm = watch('bpm')
                    if (currentBpm) {
                      setValue('bpm', Math.round(currentBpm * 2 > 200 ? currentBpm / 2 : currentBpm * 2), {
                        shouldValidate: true,
                        shouldDirty: true,
                      })
                    }
                  }}
                  className="mb-[2px] rounded-md border border-blue-500 bg-white px-3 py-2 text-sm font-medium text-blue-500 hover:bg-gray-50"
                >
                  <ArrowsUpDownIcon className="h-5 w-5" />
                </button>
              </div>
              {errors.bpm?.message && <p className="mt-1 text-sm text-red-600">{errors.bpm.message}</p>}
            </div>
            <div>
              <InputField label="Key" {...register('key')} error={errors.key?.message} className="w-full" />
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <NumericalDropDown
                label="Year"
                lowerValue={FIRST_YEAR}
                upperValue={currentYear}
                {...register('year', { valueAsNumber: true })}
              />
            </div>
            <div>
              <TimeOffDropdown
                label="Time Off"
                value={watch('hours_off')}
                {...register('hours_off', { valueAsNumber: true })}
              />
            </div>
          </div>

          {/* Tags */}
          <div className="md:col-span-2">
            <InputField
              label="Tags"
              placeholder="Separate tags with commas"
              {...register('tags')}
              error={errors.tags?.message}
              className="w-full"
            />
          </div>
        </div>

        <div className="mt-6 border-t pt-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-lg bg-gray-50 p-4 shadow-inner">
              <div className="flex flex-wrap gap-3">
                <RadioButtonGroup
                  label="Context"
                  name="level"
                  options={levelOptions}
                  value={watch('level') ?? 3}
                  onChange={(e) =>
                    setValue('level', Number(e.target.value), {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                />
              </div>
            </div>
            <div className="rounded-lg bg-gray-50 p-4 shadow-inner">
              <div className="flex flex-col gap-3">
                <RadioButtonGroup
                  label="Sound Character"
                  name="roboticness"
                  options={roboticnessOptions}
                  value={watch('roboticness') ?? 2}
                  onChange={(e) =>
                    setValue('roboticness', Number(e.target.value), {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                />
                <div className="mt-2 border-t border-gray-200 pt-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="explicit"
                      {...register('explicit')}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="explicit" className="ml-2 text-sm text-gray-700">
                      Explicit
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Instrumentalness</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  {...register('instrumentalness', { valueAsNumber: true })}
                  className="w-full"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Danceability</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  {...register('danceability', { valueAsNumber: true })}
                  className="w-full"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Energy</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  {...register('energy', { valueAsNumber: true })}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 
                   disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {isPending ? 'Updating...' : 'Update'}
        </button>
      </div>
    </motion.form>
  )
}
