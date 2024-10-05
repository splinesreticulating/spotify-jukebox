// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Artist = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type Revenue = {
  month: string;
  revenue: number;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestSongRaw = Omit<LatestSong, "amount"> & {
  amount: number;
};

export type Song = {
  id: number;
  artist: string;
  title: string;
  album: string;
  grouping: string | null;
  instrumentalness: number | null;
  bpm: number;
  info: string | null;
  genre: string;
  date_added: Date | null;
  albumyear: string;
  hours_off: number | null;
  count_played: number;
  date_played: Date | null;
  roboticness: number | null;
};

export type LatestSong = Pick<Song, "title" | "id" | "artist">;

export type SongsTable = {
  id: string;
  artist_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: "pending" | "paid";
};

export type ArtistsTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_songs: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedArtistsTable = {
  id: number;
  name: string;
};

export type ArtistField = {
  id: string;
  name: string;
};

export type SongForm = Pick<
  Song,
  | "id"
  | "title"
  | "artist"
  | "bpm"
  | "genre"
  | "info"
  | "hours_off"
  | "albumyear"
  | "date_added"
  | "grouping"
>;

export type NowPlayingSong = {
  songID: Song["id"];
  artist: Song["artist"];
  title: Song["title"];
  level?: number;
};

export type NowPlayingData = {
  currentSong: NowPlayingSong;
  lastSong: NowPlayingSong;
  nextSong: NowPlayingSong;
  friends: boolean;
};
