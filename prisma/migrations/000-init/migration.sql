-- CreateTable
CREATE TABLE "compatibility_tree" (
    "id" SERIAL NOT NULL,
    "root_id" INTEGER NOT NULL,
    "branch_id" INTEGER NOT NULL,
    "branch_level" INTEGER,

    CONSTRAINT "compatibility_tree_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "history" (
    "id" SERIAL NOT NULL,
    "nut_id" INTEGER NOT NULL,
    "played_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nuts" (
    "id" SERIAL NOT NULL,
    "spotify_id" CHAR(22),
    "sam_id" INTEGER,
    "youtube_id" VARCHAR(11),
    "title" VARCHAR(150),
    "artists" TEXT[],
    "album" VARCHAR(150),
    "bpm" INTEGER,
    "level" INTEGER,
    "key" VARCHAR(3),
    "date_added" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "date_liked" TIMESTAMP(6),
    "date_played" TIMESTAMP(6),
    "date_artist_played" TIMESTAMP(6),
    "date_album_played" TIMESTAMP(6),
    "date_title_played" TIMESTAMP(6),
    "image_urls" TEXT[],
    "file_path" TEXT,
    "hours_off" INTEGER DEFAULT 24,
    "year" INTEGER,
    "tags" TEXT[],
    "instrumentalness" INTEGER,
    "duration" INTEGER,
    "explicit" BOOLEAN NOT NULL,
    "danceability" INTEGER,
    "energy" INTEGER,
    "liveness" INTEGER,
    "loudness" INTEGER,
    "speechiness" INTEGER,
    "valence" INTEGER,
    "time_signature" INTEGER,
    "roboticness" INTEGER DEFAULT 2,
    "count_played" INTEGER DEFAULT 0,

    CONSTRAINT "nuts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settings" (
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "users" (
    "id" VARCHAR(100) NOT NULL,
    "email" VARCHAR(256) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "name" VARCHAR(100),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "queue" (
    "id" SERIAL NOT NULL,
    "nut_id" INTEGER NOT NULL,
    "added_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "queue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "show_schedule" (
    "id" SERIAL NOT NULL,
    "show_name" TEXT NOT NULL,
    "rules" JSONB NOT NULL,
    "level_lock" INTEGER,
    "genre_lock" TEXT NOT NULL DEFAULT '.*',
    "roboticness_lock" INTEGER NOT NULL DEFAULT 0,
    "year_min" INTEGER NOT NULL DEFAULT 1800,
    "year_max" INTEGER NOT NULL DEFAULT 5000,

    CONSTRAINT "show_schedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_compatibility_tree_branch_id" ON "compatibility_tree"("branch_id");

-- CreateIndex
CREATE INDEX "idx_compatibility_tree_root_id" ON "compatibility_tree"("root_id");

-- CreateIndex
CREATE UNIQUE INDEX "compatibility_tree_root_id_branch_id_key" ON "compatibility_tree"("root_id", "branch_id");

-- CreateIndex
CREATE INDEX "idx_history_nut_id" ON "history"("nut_id");

-- CreateIndex
CREATE INDEX "idx_played_at" ON "history"("played_at");

-- CreateIndex
CREATE UNIQUE INDEX "nuts_spotify_id_key" ON "nuts"("spotify_id");

-- CreateIndex
CREATE UNIQUE INDEX "nuts_sam_id_key" ON "nuts"("sam_id");

-- CreateIndex
CREATE INDEX "idx_date_played" ON "nuts"("date_played");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "idx_queue_added_at" ON "queue"("added_at");

-- CreateIndex
CREATE INDEX "idx_queue_nut_id" ON "queue"("nut_id");

-- AddForeignKey
ALTER TABLE "compatibility_tree" ADD CONSTRAINT "compatibility_tree_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "nuts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "compatibility_tree" ADD CONSTRAINT "compatibility_tree_root_id_fkey" FOREIGN KEY ("root_id") REFERENCES "nuts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "queue" ADD CONSTRAINT "queue_nut_id_fkey" FOREIGN KEY ("nut_id") REFERENCES "nuts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

