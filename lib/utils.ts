import * as MediaLibrary from "expo-media-library";
import TrackPlayer from "react-native-track-player";
import { songMetaData, TrackData } from "./types";

// type TrackData = MediaLibrary.Asset | songMetaData;

export const addTracksToQueue = async (
  tracks: TrackData[],
  selectedTrackIndex: number,
  idType?: string
) => {
  await TrackPlayer.reset();
  const trackQueue = tracks.map((track) => ({
    //@ts-ignore
    id: idType === "id" ? track.id : track.songId,
    url: track.uri,
    title: track.filename,
  }));

  await TrackPlayer.add(trackQueue);
  await TrackPlayer.skip(selectedTrackIndex);
  await TrackPlayer.play();
};

export const shuffleTracks = (tracks: TrackData[]) => {
  const shuffledArray = [...tracks];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};
