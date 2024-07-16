import TrackPlayer, { Capability } from "react-native-track-player";

export const initializePlayer = async () => {
  try {
    console.log("Initializing TrackPlayer...");
    await TrackPlayer.setupPlayer();

    console.log("TrackPlayer initialized successfully");
    await TrackPlayer.updateOptions({
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.SeekTo,
      ],
      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.SeekTo,
      ],
      notificationCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
      ],
    });
  } catch (error) {
    console.log("Error initializing TrackPlayer: ", error);
  }
};

export const addTrack = async (track) => {
  console.log("Adding track...");
  await TrackPlayer.reset();
  await TrackPlayer.add([track]);
};

export const playTrack = async () => {
  await TrackPlayer.play();
};
