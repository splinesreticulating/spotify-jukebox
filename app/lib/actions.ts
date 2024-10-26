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
  artist: z.string(),
  title: z.string(),
  album: z.string(),
  grouping: z.string().optional(),
  bpm: z.number().optional(),
  instrumentalness: z.number().optional(),
  info: z.string().optional(),
  genre: z.string(),
  date_added: z.date().optional(),
  albumyear: z.string(),
  hours_off: z.number().optional(),
})

// const CreateSong = FormSchema.omit({ id: true, date_added: true })
const UpdateSong = FormSchema.omit({ date_added: true, id: true })

// This is temporary
export type State = {
  errors?: {
    artist?: string[]
    title?: string[]
    // do we really need these? Or should we add more?
  }
  message?: string | null
}

export async function updateSong(id: string, prevState: State, formData: FormData) {
  const fields = {
    title: formData.get('title')?.toString(),
    artist: formData.get('artist')?.toString(),
    grouping: formData.get('grouping')?.toString(),
    album: formData.get('album')?.toString(),
    instrumentalness: Number(formData.get('instrumentalness')?.toString()),
    albumyear: formData.get('year')?.toString(),
    hours_off: Number(formData.get('hoursOff')?.toString()),
    genre: formData.get('level')?.toString(),
    roboticness: Number(formData.get('roboticness')),
  }

  const { artist, title, album, grouping, instrumentalness, albumyear, hours_off, genre, roboticness } = fields

  try {
    await db.songlist.update({
      where: { id: Number(id) },
      data: {
        artist,
        title,
        album,
        grouping,
        instrumentalness,
        albumyear,
        hours_off,
        genre,
        roboticness,
      },
    })
  } catch (error) {
    return { message: 'Database Error: Failed to Update Song.' }
  }

  revalidatePath('/dashboard/songs')
  redirect('/dashboard/nowPlaying')
}

export async function befriend(nowPlayingData: NowPlayingData) {
  const { lastSong, currentSong } = nowPlayingData

  try {
    await db.tblbranches.create({
      data: {
        root: lastSong.songID,
        branch: currentSong.songID,
        level: currentSong.level,
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
    await db.tblbranches.delete({
      where: {
        root_branch: {
          root: lastSong.songID,
          branch: currentSong.songID,
        },
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
