import { dbData, songMetaData } from "@/lib/types";
import * as SQLite from "expo-sqlite";

const dbPromise = SQLite.openDatabaseAsync("music_app.db");

// Main data
export const createSongsTable = async () => {
  try {
    const db = await dbPromise;
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS songsData (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          songId TEXT NOT NULL,
          title TEXT NOT NULL,
          artist TEXT,
          album TEXT,
          duration INTEGER,
          pictureData TEXT,
          uri TEXT NOT NULL,
          filename TEXT,
          isLiked INTEGER DEFAULT 0
        );
      `);
    await db.execAsync(`CREATE TABLE IF NOT EXISTS playlist (
        id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
        playlistName TEXT NOT NULL UNIQUE
      );`);
    await db.runAsync(
      `CREATE TABLE IF NOT EXISTS playlistData (playlistId INTEGER, songId TEXT);`
    );
    console.log("Tables created successfully");
  } catch (error) {
    console.error("Error creating table 'songsData':", error);
  }
};

export const getAllSongData = async () => {
  const db = await dbPromise;
  try {
    const data: songMetaData[] = await db.getAllAsync(
      "SELECT * FROM songsData"
    );
    console.log(`Song data length: ${data.length}`);
    return data;
  } catch (error) {
    console.log("Error fetching all songs data!!! ", error);
  }
};

export const insertSong = async (song: songMetaData) => {
  const db = await dbPromise;

  try {
    await db.runAsync(
      "INSERT INTO songsData (songId, title, artist, album, duration,pictureData, uri, filename, isLiked) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        song.songId,
        song.title,
        song.artist,
        song.album,
        song.duration,
        song.pictureData,
        song.uri,
        song.filename,
        song.isLiked,
      ]
    );
    console.log(`${song.title} inserted successfully`);
  } catch (error) {
    console.error(`Error inserting ${song.title}: ${error}`);
  }
};

export const getSongDataById = async (songId: string) => {
  const db = await dbPromise;
  try {
    const result = await db.getFirstAsync(
      "SELECT * FROM songsData WHERE songId = ?",
      [songId]
    );

    if (result) {
      return result as songMetaData;
    } else {
      return null;
    }
  } catch (error) {
    console.log("Error fetching song data!!! ", error);
  }
};

// Liked track data
export const toggleLikedTrack = async (trackId: string) => {
  const db = await dbPromise;
  try {
    await db.runAsync(
      "UPDATE songsData SET isLiked = CASE WHEN isLiked = 1 THEN 0 ELSE 1 END WHERE songId = ?",
      [trackId]
    );
    console.log(`Track ${trackId} liked/disliked successfully`);
  } catch (error) {
    console.log(`Error liking or disliking ${trackId}: ${error}`);
  }
};

export const getAllLikedSongData = async () => {
  const db = await dbPromise;
  console.log("Fetching liked songs data...");
  try {
    const data: songMetaData[] = await db.getAllAsync(
      "SELECT * FROM songsData WHERE isLiked = 1"
    );
    console.log(`liked Songs data length: ${data.length}`);
    // console.log(data);
    return data as songMetaData[];
  } catch (error) {
    console.log("Error fetching all songs data!!! ", error);
  }
};

// Plalists data

export const insertIntoPlaylist = async (playlistName: string) => {
  const db = await dbPromise;
  try {
    await db.runAsync(`INSERT INTO playlist (playlistName) VALUES (?)`, [
      playlistName,
    ]);

    console.log(`${playlistName} inserted successfully`);
  } catch (error) {
    console.log(`Error inserting ${playlistName}: ${error}`);
  }
};

export const getAllPlaylits = async () => {
  const db = await dbPromise;
  try {
    const data: string[] = await db.getAllAsync("SELECT * FROM playlist");
    console.log(`Playlist data length: ${data.length}`);
    return data as string[];
  } catch (error) {
    console.log("Error fetching all playlists!!! ", error);
  }
};

export const insertIntoPlaylistTable = async (
  playlist_id: number,
  trackId: string
) => {
  const db = await dbPromise;

  try {
    await db.runAsync(
      "INSERT INTO playlistData (playlistId, songId) VALUES (?, ?)",
      [playlist_id, trackId]
    );
    console.log(
      `Track ${trackId} inserted into playlist ${playlist_id} successfully`
    );
  } catch (error) {
    console.log(
      `Error inserting ${trackId} into playlist ${playlist_id}: ${error}`
    );
  }
};

export const getAllTracksFromPlaylist = async (playlist_id: number) => {
  const db = await dbPromise;
  try {
    const data: songMetaData[] = await db.getAllAsync(
      "SELECT * FROM songsData JOIN playlistData ON songsData.songId = playlistData.songId WHERE playlistData.playlistId = ?",
      [playlist_id]
    );
    console.log(`Playlist ${playlist_id} data length: ${data.length}`);
    return data;
  } catch (error) {
    console.log("Error fetching all tracks from playlist!!! ", error);
  }
};

export const deletePlaylist = async (playlistId: number) => {
  const db = await dbPromise;
  try {
    await db.runAsync("DELETE FROM playlist WHERE id = ?", [playlistId]);
    console.log("Playlist deleted successfully from playlist table");
    await db.runAsync("DELETE FROM playlistData WHERE playlistId = ?", [
      playlistId,
    ]);
    console.log("Tracks deleted successfully from playlistData table");
  } catch (error) {
    console.log(`Error deleting playlist ${playlistId}: ${error}`);
  }
};

export const deleteTrackFromPlaylist = async (
  platlistId: number,
  trackId: string | undefined
) => {
  const db = await dbPromise;
  try {
    if (!trackId) return;
    await db.runAsync(
      "DELETE FROM playlistData WHERE playlistId = ? AND songId = ?",
      [platlistId, trackId]
    );
    console.log(
      `Track ${trackId} deleted successfully from playlist ${platlistId}`
    );
  } catch (error) {
    console.log(
      `Error deleting track ${trackId} from playlist ${platlistId}: ${error}`
    );
  }
};
