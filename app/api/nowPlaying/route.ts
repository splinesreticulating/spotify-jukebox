import { fetchNowPlaying } from "@/app/lib/data"
import { NextResponse } from "next/server"

const NOW_PLAYING_REFRESH_INTERVAL_MS = 10_000

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

                // Handle case where data is null or undefined
                if (!data) {
                    // Send a 'nothing playing' event
                    if (!isStreamClosed) {
                        controller.enqueue(
                            encoder.encode(
                                `data: ${JSON.stringify({ currentSong: null, lastSong: null, nextSong: null, friends: false })}\n\n`,
                            ),
                        )
                    }
                } else {
                    if (!isStreamClosed) {
                        controller.enqueue(
                            encoder.encode(`data: ${JSON.stringify(data)}\n\n`),
                        )
                    }
                }
            } catch (error) {
                // Properly format error object for logging
                const errorObj = {
                    message:
                        error instanceof Error
                            ? error.message
                            : "Unknown error occurred",
                    timestamp: new Date().toISOString(),
                    details:
                        error instanceof Error
                            ? {
                                  name: error.name,
                                  stack: error.stack,
                              }
                            : null,
                }

                console.error("Error in Now Playing stream:", errorObj)

                if (!isStreamClosed) {
                    // Send a properly formatted error event to the client
                    controller.enqueue(
                        encoder.encode(
                            `event: error\ndata: ${JSON.stringify({
                                message: errorObj.message,
                                timestamp: errorObj.timestamp,
                            })}\n\n`,
                        ),
                    )
                }
            }

            if (!isStreamClosed) {
                await new Promise((resolve) =>
                    setTimeout(resolve, NOW_PLAYING_REFRESH_INTERVAL_MS),
                )
            }
        }

        if (!isStreamClosed) {
            isStreamClosed = true
            controller.close()
        }
    }

    return new NextResponse(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
        },
    })
}
