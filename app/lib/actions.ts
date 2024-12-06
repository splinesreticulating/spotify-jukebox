'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { signIn } from '@/auth'
import { AuthError } from 'next-auth'
import { db } from './db'
import { NowPlayingData } from './definitions'

const FormSchema = z.object({
  id: z.number(),
  artists: z.array(z.string()),
  title: z.string().nullable(),
  album: z.string().nullable(),
  tags: z.array(z.string()).optional(),
  bpm: z.number().nullable(),
  instrumentalness: z.number().nullable(),
  key: z.string().nullable(),
  level: z.number().nullable(),
  date_added: z.date().nullable(),
  year: z.number().nullable(),
  hours_off: z.number().nullable(),
  roboticness: z.number().nullable(),
})

// const CreateSong = FormSchema.omit({ id: true, date_added: true })
const UpdateSong = FormSchema.omit({ date_added: true, id: true })

// This is temporary
export type State = {
  errors?: {
    artists?: string[]
    title?: string[]
    // do we really need these? Or should we add more?
  }
  message?: string | null
}

export async function updateSong(id: string, prevState: State, formData: FormData) {
  const fields = {
    title: formData.get('title')?.toString() || null,
    artists: formData.get('artists')?.toString()?.split(',').filter(Boolean) || [],
    album: formData.get('album')?.toString() || null,
    tags: formData.get('tags')?.toString()?.split(',').filter(Boolean) || [],
    instrumentalness: formData.get('instrumentalness') ? Number(formData.get('instrumentalness')) : null,
    year: formData.get('year') ? Number(formData.get('year')) : null,
    hours_off: formData.get('hoursOff') ? Number(formData.get('hoursOff')) : null,
    level: formData.get('level') ? Number(formData.get('level')) : null,
    roboticness: formData.get('roboticness') ? Number(formData.get('roboticness')) : null,
    key: formData.get('key')?.toString() || null,
    bpm: formData.get('bpm') ? Number(formData.get('bpm')) : null,
    spotify_id: formData.get('spotify_id')?.toString() || null,
    danceability: formData.get('danceability') ? Number(formData.get('danceability')) : null,
    energy: formData.get('energy') ? Number(formData.get('energy')) : null,
    valence: formData.get('valence') ? Number(formData.get('valence')) : null,
    loudness: formData.get('loudness') ? Number(formData.get('loudness')) : null,
  }

  const {
    artists,
    title,
    album,
    tags,
    instrumentalness,
    year,
    hours_off,
    level,
    roboticness,
    key,
    bpm,
    spotify_id,
    danceability,
    energy,
    valence,
    loudness,
  } = fields

  try {
    await db.nuts.update({
      where: { id: Number(id) },
      data: {
        artists: artists.length > 0 ? artists : undefined,
        title: title || undefined,
        album: album || undefined,
        tags: tags.length > 0 ? tags : undefined,
        instrumentalness: instrumentalness || undefined,
        year: year || undefined,
        hours_off: hours_off || undefined,
        level: level || undefined,
        roboticness: roboticness || undefined,
        key: key || undefined,
        bpm: bpm || undefined,
        spotify_id: spotify_id || undefined,
        danceability: danceability || undefined,
        energy: energy || undefined,
        valence: valence || undefined,
        loudness: loudness || undefined,
      },
    })
  } catch (error) {
    console.error('Update Error:', error)
    return { message: 'Database Error: Failed to Update Song.' }
  }

  revalidatePath('/dashboard/songs')
  redirect('/dashboard/nowPlaying')
}

export async function befriend(nowPlayingData: NowPlayingData) {
  const { lastSong, currentSong } = nowPlayingData

  try {
    await db.compatibility_tree.create({
      data: {
        root_id: lastSong.songID,
        branch_id: currentSong.songID,
        branch_level: currentSong.level,
      },
    })
  } catch (error) {
    console.error(error)
    return { message: 'Database Error: Failed to create friendship', error }
  }
}

export async function defriend(nowPlayingData: NowPlayingData) {
  const { lastSong, currentSong } = nowPlayingData

  try {
    await db.compatibility_tree.deleteMany({
      where: {
        AND: [{ root_id: lastSong.songID }, { branch_id: currentSong.songID }],
      },
    })
  } catch (error) {
    console.error(error)
    return { message: 'Database Error: Failed to remove friendship', error }
  }
}

export async function authenticate(prevState: any, formData: FormData) {
  try {
    await signIn('credentials', formData)
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { errorMessage: 'Invalid credentials' }
        default:
          return { errorMessage: 'Something went wrong' }
      }
    }
    throw error
  }
}

export async function addToQueue(songId: number) {
  try {
    await db.queue.create({
      data: {
        nut_id: songId,
      },
    })
    return { success: true }
  } catch (error) {
    console.error('Failed to add song to queue:', error)
    return { success: false }
  }
}
