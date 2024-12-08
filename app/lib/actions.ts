'use server'

import { signIn } from '@/auth'
import { AuthError } from 'next-auth'
import { db } from './db'
import { NowPlayingData } from '@/app/lib/types'

export async function updateSong(id: string, formData: FormData) {
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

  try {
    return await db.nuts.update({
      where: { id: Number(id) },
      data: {
        artists: fields.artists.length > 0 ? fields.artists : undefined,
        title: fields.title || undefined,
        album: fields.album || undefined,
        tags: fields.tags.length > 0 ? fields.tags : undefined,
        instrumentalness: fields.instrumentalness || undefined,
        year: fields.year ?? undefined,
        hours_off: fields.hours_off ?? undefined,
        level: fields.level || undefined,
        roboticness: fields.roboticness || undefined,
        key: fields.key || undefined,
        bpm: fields.bpm || undefined,
        spotify_id: fields.spotify_id || undefined,
        danceability: fields.danceability || undefined,
        energy: fields.energy || undefined,
        valence: fields.valence || undefined,
        loudness: fields.loudness || undefined,
      },
    })
  } catch (error) {
    console.error('Update Error:', error)
    throw new Error('Failed to update song')
  }
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

export async function authenticate(_prevState: any, formData: FormData) {
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
