import { dbData, songMetaData } from "@/lib/types";
import * as SQLite from "expo-sqlite";

const dbPromise = SQLite.openDatabaseAsync("music_app.db");

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
    console.log("Table 'songsData' created successfully");
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
    return data;
  } catch (error) {
    console.log("Error fetching all songs data!!! ", error);
  }
};
