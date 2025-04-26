const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

const settings = [
    {
        name: "BPM_MAX_MULTIPLIER",
        value: "1.09",
        description: "Maximum BPM multiplier (minimum: 1)",
        updated_at: new Date("2025-02-08T22:23:08.826Z"),
    },
    {
        name: "BPM_MIN_MULTIPLIER",
        value: "0.96",
        description: "Minimum BPM multiplier (recommended: 0.96)",
        updated_at: new Date("2025-02-08T22:23:08.826Z"),
    },
    {
        name: "BUFFER_DELAY",
        value: "15000",
        description:
            "Buffer time in milliseconds to wait longer than each song’s duration",
        updated_at: new Date("2025-02-08T22:23:08.826Z"),
    },
    {
        name: "CURRENT_MODE",
        value: "soft",
        description: "Observed when MODE_OVERRIDE = true",
        updated_at: new Date("2025-02-08T22:23:08.826Z"),
    },
    {
        name: "DELAY_ALBUM",
        value: "360",
        description: "Minutes to wait before playing the same album",
        updated_at: new Date("2025-02-08T22:23:08.826Z"),
    },
    {
        name: "DELAY_ARTIST",
        value: "360",
        description: "Minutes to wait before playing the same artist",
        updated_at: new Date("2025-02-08T22:23:08.826Z"),
    },
    {
        name: "DELAY_TITLE",
        value: "60",
        description: "Minutes to wait before playing the same title",
        updated_at: new Date("2025-02-08T22:23:08.826Z"),
    },
    {
        name: "GENRE_LOCK",
        value: ".*",
        description: "Regex for allowed genres (.* = all)",
        updated_at: new Date("2025-04-25T07:00:33.325Z"),
    },
    {
        name: "HAPPINESS_MAX",
        value: "101",
        description: "Maximum happiness (0-100)",
        updated_at: new Date("2025-02-08T22:23:08.826Z"),
    },
    {
        name: "HAPPINESS_MIN",
        value: "-1",
        description: "Minimum happiness (0-100)",
        updated_at: new Date("2025-02-08T22:23:08.826Z"),
    },
    {
        name: "HIPNESS",
        value: "9",
        description: "Likelihood that newer songs will play (1-10)",
        updated_at: new Date("2025-02-08T22:23:08.826Z"),
    },
    {
        name: "LAST_BREAK_TIME",
        value: "2025-04-25T07:40:48.129Z",
        description: "Timestamp of last station break or ID",
        updated_at: new Date("2025-02-25T00:03:25.810Z"),
    },
    {
        name: "LEVEL_LOCK",
        value: "1",
        description: "Only play this level",
        updated_at: new Date("2025-04-25T07:00:33.306Z"),
    },
    {
        name: "MODE_OVERRIDE",
        value: "false",
        description: "Override the flow mode (true/false)",
        updated_at: new Date("2025-02-08T22:23:08.826Z"),
    },
    {
        name: "PLAYLIST_ID",
        value: "",
        description: "Spotify playlist to append songs to",
        updated_at: new Date("2025-02-08T22:23:08.826Z"),
    },
    {
        name: "POSITION",
        value: "6",
        description: "Position in Flow Sequence",
        updated_at: new Date("2025-02-08T22:23:08.826Z"),
    },
    {
        name: "PROMISCUITY",
        value: "0",
        description: "Likelihood that unknown combos will play (0-10)",
        updated_at: new Date("2025-02-27T23:02:13.124Z"),
    },
    {
        name: "RETRY_DELAY",
        value: "60000",
        description: "Default retry time in milliseconds",
        updated_at: new Date("2025-02-08T22:23:08.826Z"),
    },
    {
        name: "ROBOTICNESS_LOCK",
        value: "0",
        description: "Lock that roboticness level (0 = all)",
        updated_at: new Date("2025-04-25T07:00:33.342Z"),
    },
    {
        name: "YEAR_MAX",
        value: "5000",
        description: "Latest year to play tracks from",
        updated_at: new Date("2025-04-25T07:00:33.376Z"),
    },
    {
        name: "YEAR_MIN",
        value: "1800",
        description: "Earliest year to play tracks from",
        updated_at: new Date("2025-04-25T07:00:33.358Z"),
    },
]

async function main() {
    console.log("Seeding settings...")
    for (const setting of settings) {
        console.log(`Upserting setting: ${setting.name}`)
        await prisma.settings.upsert({
            where: { name: setting.name },
            update: setting,
            create: setting,
        })
    }
    console.log("Seeding complete.")
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
