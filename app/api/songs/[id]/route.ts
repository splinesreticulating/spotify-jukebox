import { db } from '@/app/lib/db'
import { songSchema } from '@/app/lib/schemas'
import { NextResponse } from 'next/server'

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()

    // Log incoming data for debugging
    console.log('Incoming update data:', {
      id: params.id,
      data,
    })

    const inputData = {
      ...data,
      artists: Array.isArray(data.artists) ? data.artists.join(', ') : data.artists,
      tags: Array.isArray(data.tags) ? data.tags.join(', ') : data.tags,
    }

    // Log transformed data
    console.log('Transformed data:', inputData)

    try {
      const transformed = songSchema.parse(inputData)
      console.log('Validated data:', transformed)
    } catch (validationError) {
      console.error('Validation error:', validationError)
      return NextResponse.json({ error: 'Invalid song data', details: validationError }, { status: 400 })
    }

    const prismaData = Object.fromEntries(Object.entries(inputData).map(([key, value]) => [key, value ?? undefined]))

    const updated = await db.nuts.update({
      where: { id: Number(params.id) },
      data: prismaData,
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Server update error:', error)
    return NextResponse.json(
      {
        error: 'Failed to update song',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()

    // Convert arrays to strings
    const formattedData = {
      ...data,
      artists: Array.isArray(data.artists) ? data.artists.join(', ') : data.artists,
      tags: Array.isArray(data.tags) ? data.tags.join(', ') : data.tags,
    }

    const validated = songSchema.parse(formattedData)
    const prismaData = Object.fromEntries(Object.entries(validated).map(([key, value]) => [key, value ?? undefined]))

    const updated = await db.nuts.update({
      where: { id: Number(params.id) },
      data: prismaData,
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Update Error Details:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
