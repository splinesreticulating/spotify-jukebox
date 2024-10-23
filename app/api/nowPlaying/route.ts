import { NextResponse } from 'next/server'
import { fetchNowPlaying } from '@/app/lib/data'

const REFRESH_INTERVAL_MS = 10_000

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
})

export async function GET() {
  let controller: ReadableStreamDefaultController
  let isStreamClosed = false

  const stream = new ReadableStream({
    start(c) {
      controller = c
      sendData()
    },
    cancel() {
      isStreamClosed = true
    },
  })

  async function sendData() {
    const encoder = new TextEncoder()

    while (!isStreamClosed) {
      try {
        const data = await fetchNowPlaying()
        if (!isStreamClosed) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
        }
      } catch (error) {
        const timestamp = new Date().toISOString()
        console.error(`[${timestamp}] Error fetching now playing data:`, error)
        if (!isStreamClosed) {
          controller.enqueue(
            encoder.encode(`event: error\ndata: ${JSON.stringify({ message: 'Error fetching data' })}\n\n`),
          )
        }
      }

      if (!isStreamClosed) {
        await new Promise((resolve) => setTimeout(resolve, REFRESH_INTERVAL_MS))
      }
    }

    if (!isStreamClosed) {
      isStreamClosed = true
      controller.close()
    }
  }

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
