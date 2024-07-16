import * as MediaLibrary from "expo-media-library";

export type songMetaData = {
  id?: number;
  songId: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  uri: string;
  pictureData: string;
  filename: string;
  isLiked: boolean;
};

export type dbData = {
  songId: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  uri: string;
  // pictureData: string;
  filename: string;
  isLiked: boolean;
};

export type TrackData = MediaLibrary.Asset | songMetaData;
