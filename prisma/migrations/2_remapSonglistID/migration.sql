yarn run v1.22.22
$ /Users/you/Code/jukebox/node_modules/.bin/prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script
-- CreateTable
CREATE TABLE `historylist` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `songID` INTEGER NOT NULL DEFAULT 0,
    `filename` VARCHAR(255) NOT NULL DEFAULT '',
    `date_played` DATETIME(0) NOT NULL DEFAULT '0000-00-00 00:00:00',
    `duration` INTEGER NOT NULL DEFAULT 0,
    `artist` VARCHAR(255) NOT NULL DEFAULT '',
    `title` VARCHAR(255) NOT NULL DEFAULT '',
    `album` VARCHAR(255) NOT NULL DEFAULT '',
    `albumyear` VARCHAR(4) NOT NULL DEFAULT '',
    `website` VARCHAR(255) NOT NULL DEFAULT '',
    `buycd` VARCHAR(255) NOT NULL DEFAULT '',
    `picture` VARCHAR(255) NOT NULL DEFAULT '',
    `listeners` MEDIUMINT NOT NULL DEFAULT 0,
    `label` VARCHAR(100) NOT NULL DEFAULT '',
    `pline` VARCHAR(50) NOT NULL DEFAULT '',
    `trackno` INTEGER NOT NULL DEFAULT 0,
    `composer` VARCHAR(100) NOT NULL DEFAULT '',
    `ISRC` VARCHAR(50) NOT NULL DEFAULT '',
    `catalog` VARCHAR(50) NOT NULL DEFAULT '',
    `UPC` VARCHAR(50) NOT NULL DEFAULT '',
    `feeagency` VARCHAR(20) NOT NULL DEFAULT '',
    `songtype` CHAR(1) NOT NULL DEFAULT '',
    `requestID` INTEGER NOT NULL DEFAULT 0,
    `overlay` ENUM('yes', 'no') NOT NULL DEFAULT 'no',
    `songrights` VARCHAR(191) NOT NULL DEFAULT 'broadcast',

    INDEX `date_played`(`date_played`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `keywords` (
    `ID` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `keyword` VARCHAR(25) NOT NULL DEFAULT '',

    UNIQUE INDEX `keyword`(`keyword`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `queuelist` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `songID` INTEGER NOT NULL DEFAULT 0,
    `sortID` DOUBLE NOT NULL DEFAULT 0,
    `requests` INTEGER NOT NULL DEFAULT 0,
    `requestID` INTEGER NOT NULL DEFAULT 0,
    `auxdata` VARCHAR(200) NOT NULL DEFAULT '',

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `songlist` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `artist` VARCHAR(255) NOT NULL DEFAULT '',
    `title` VARCHAR(255) NOT NULL DEFAULT '',
    `hours_off` SMALLINT NULL DEFAULT 48,
    `roboticness` TINYINT NULL DEFAULT 2,
    `info` TEXT NULL,
    `bpm` MEDIUMINT NOT NULL DEFAULT 0,
    `albumyear` VARCHAR(4) NOT NULL DEFAULT '1700',
    `start_bpm` TINYINT UNSIGNED NULL,
    `end_bpm` TINYINT UNSIGNED NULL,
    `genre` VARCHAR(20) NOT NULL DEFAULT '',
    `grouping` VARCHAR(256) NULL DEFAULT '',
    `count_played` MEDIUMINT NOT NULL DEFAULT 0,
    `filename` VARCHAR(255) NOT NULL DEFAULT '',
    `songtype` CHAR(1) NOT NULL DEFAULT 'S',
    `album` VARCHAR(255) NOT NULL DEFAULT '',
    `happiness` INTEGER NULL DEFAULT 0,
    `danceability` INTEGER NULL,
    `energy` INTEGER NULL,
    `accousticness` INTEGER NULL,
    `instrumentalness` INTEGER NULL,
    `liveness` INTEGER NULL,
    `speechiness` INTEGER NULL,
    `dj` VARCHAR(25) NULL,
    `weight` DOUBLE NOT NULL DEFAULT 50,
    `balance` DOUBLE NOT NULL DEFAULT 0,
    `flags` VARCHAR(10) NOT NULL DEFAULT 'NNNNNNNNNN',
    `status` TINYINT NOT NULL DEFAULT 0,
    `date_added` DATETIME(0) NULL,
    `date_played` DATETIME(0) NULL DEFAULT '2002-01-01 00:00:01',
    `date_artist_played` DATETIME(0) NULL DEFAULT '2002-01-01 00:00:01',
    `date_album_played` DATETIME(0) NULL DEFAULT '2002-01-01 00:00:01',
    `date_title_played` DATETIME(0) NULL DEFAULT '2002-01-01 00:00:01',
    `duration` INTEGER NOT NULL DEFAULT 0,
    `label` VARCHAR(255) NOT NULL DEFAULT '',
    `diskID` INTEGER NOT NULL DEFAULT 0,
    `pline` VARCHAR(50) NOT NULL DEFAULT '',
    `trackno` INTEGER NOT NULL DEFAULT 0,
    `composer` VARCHAR(100) NOT NULL DEFAULT '',
    `ISRC` VARCHAR(50) NOT NULL DEFAULT '',
    `catalog` VARCHAR(50) NOT NULL DEFAULT '',
    `UPC` VARCHAR(50) NOT NULL DEFAULT '',
    `feeagency` VARCHAR(20) NOT NULL DEFAULT '',
    `website` VARCHAR(255) NOT NULL DEFAULT '',
    `buycd` VARCHAR(255) NOT NULL DEFAULT '',
    `lyrics` TEXT NULL,
    `picture` VARCHAR(255) NOT NULL DEFAULT '',
    `count_requested` MEDIUMINT NOT NULL DEFAULT 0,
    `last_requested` DATETIME(0) NOT NULL DEFAULT '2002-01-01 00:00:01',
    `count_performances` INTEGER NOT NULL DEFAULT 0,
    `xfade` VARCHAR(50) NOT NULL DEFAULT '',
    `mood` VARCHAR(50) NOT NULL DEFAULT '',
    `rating` MEDIUMINT NOT NULL DEFAULT 0,
    `overlay` ENUM('yes', 'no') NOT NULL DEFAULT 'no',
    `playlimit_count` INTEGER NOT NULL DEFAULT 0,
    `playlimit_action` ENUM('none', 'remove', 'erase') NOT NULL DEFAULT 'none',
    `songrights` VARCHAR(191) NOT NULL DEFAULT 'broadcast',
    `adz_listID` INTEGER NOT NULL DEFAULT 0,
    `killer` BOOLEAN NULL,
    `xmas_only` BOOLEAN NULL DEFAULT false,

    UNIQUE INDEX `filename`(`filename`),
    INDEX `date_album_played`(`date_album_played`),
    INDEX `date_artist_played`(`date_artist_played`),
    INDEX `date_played`(`date_played`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tblbranches` (
    `root` MEDIUMINT UNSIGNED NOT NULL DEFAULT 0,
    `branch` MEDIUMINT UNSIGNED NOT NULL DEFAULT 0,
    `level` SMALLINT UNSIGNED NOT NULL DEFAULT 3000,

    PRIMARY KEY (`root`, `branch`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tblsettings` (
    `name` VARCHAR(25) NOT NULL DEFAULT '',
    `value` VARCHAR(50) NOT NULL DEFAULT '',
    `description` VARCHAR(140) NULL,

    PRIMARY KEY (`name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(100) NOT NULL,
    `email` VARCHAR(256) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `name` VARCHAR(100) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

Done in 0.80s.
