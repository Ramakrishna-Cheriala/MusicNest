import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  PanResponder,
  Image,
  ToastAndroid,
} from "react-native";
import { songMetaData } from "@/lib/types";
import {
  AntDesign,
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import MusicInfo from "@/lib/MusicInfo";
import {
  getAllPlaylits,
  getSongDataById,
  toggleLikedTrack,
} from "@/Database/db";
import Playlists from "./Playlists";

type OptionsModalProps = {
  isVisible: boolean;
  onClose: () => void;
  track: songMetaData | undefined;
};

const TrackOptions: React.FC<OptionsModalProps> = ({
  isVisible,
  onClose,
  track,
}) => {
  const [addToPlaylist, setAddToPlaylist] = useState(false);
  const [pictureData, setPictureData] = useState<string>();
  const [trackData, setTrackData] = useState<songMetaData>();
  const [isLikedToggled, setIsLikedToggled] = useState(false); // New state for tracking like toggle
  const [playlists, setPlaylists] = useState<
    { id: number; playlistName: string }[]
  >([]);

  // PanResponder to detect dragging
  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        if (gestureState.dy > 100) {
          // if drag distance on Y-axis is greater than 100
          onClose();
        }
      },
    })
  ).current;

  const handleLikedTracks = async (id: string) => {
    await toggleLikedTrack(id);
    setIsLikedToggled((prev) => !prev); // Toggle the state to trigger useEffect
    onClose();
  };

  useEffect(() => {
    const getData = async () => {
      if (track) {
        const data = await getSongDataById(track.songId);
        if (data) {
          setTrackData(data);
          console.log("liked status: ", data.isLiked);
        }
      }
    };
    getData();
  }, [track, isLikedToggled]); // Added isLikedToggled to dependencies

  useEffect(() => {
    const getPictureData = async () => {
      const fetchedMetadata = await MusicInfo.getMusicInfoAsync(track?.uri, {
        title: false,
        artist: false,
        album: false,
        genre: false,
        picture: true,
      });
      //@ts-ignore
      if (fetchedMetadata?.picture?.pictureData) {
        //@ts-ignore
        setPictureData(fetchedMetadata.picture.pictureData);
      }
    };
    getPictureData();
  }, [track]);

  if (!track) return null;

  console.log("selected track: ", track.title, " is liked: ", track.isLiked);

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 justify-end bg-transparent">
          <TouchableWithoutFeedback>
            <View className="bg-[#343437] p-6 rounded-t-lg">
              <View className="items-center mb-4" {...panResponder.panHandlers}>
                <View className="bg-gray-600 w-16 h-1.5 rounded-full mb-4" />
              </View>

              {/* Track Details */}
              <View className="flex items-center mb-4">
                {pictureData ? (
                  <Image
                    className="w-40 h-40 rounded-lg"
                    source={{ uri: pictureData }}
                    alt="Album Art"
                  />
                ) : (
                  <Image
                    className="w-40 h-40 rounded-lg"
                    source={require("@/assets/images/itunes.png")}
                    alt="Album Art"
                  />
                )}
              </View>

              <View className="mb-6 flex justify-center items-center">
                <Text className="text-white text-lg font-semibold">
                  {track?.title || "Unknown Title"}
                </Text>
                <Text className="text-gray-400 text-sm mt-1">
                  {track?.artist || "Unknown Artist"}
                </Text>
                <Text className="text-gray-500 text-sm mt-1">
                  {track?.album || "Unknown Album"}
                </Text>
              </View>

              {/* Action Options */}
              <View className="mb-4">
                <TouchableOpacity
                  className="py-2"
                  onPress={() => handleLikedTracks(track.songId)}
                >
                  <View className="flex flex-row items-center pb-3 border-b border-gray-600">
                    {trackData?.isLiked ? (
                      <>
                        <FontAwesome name="heart" size={25} color="red" />
                        <Text className="text-red-500 text-base ml-3">
                          Remove from Favorites
                        </Text>
                      </>
                    ) : (
                      <>
                        <FontAwesome name="heart-o" size={25} color="green" />
                        <Text className="text-green-500 text-base ml-3">
                          Add to Favorites
                        </Text>
                      </>
                    )}
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  className="py-2 mt-3"
                  onPress={() => {
                    setAddToPlaylist(true);
                  }}
                >
                  <View className="flex flex-row items-center pb-3 border-b border-gray-600">
                    <>
                      <MaterialCommunityIcons
                        name="playlist-plus"
                        size={25}
                        color="white"
                      />
                      <Text className="text-white text-base ml-3">
                        Add to Playlist
                      </Text>
                    </>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  className="py-2 mt-3"
                  onPress={() => console.log("handle queue")}
                >
                  <View className="flex flex-row items-center pb-3 border-b border-gray-600">
                    <>
                      <MaterialIcons
                        name="queue-music"
                        size={25}
                        color="white"
                      />
                      <Text className="text-white text-base ml-3">
                        Add to Queue
                      </Text>
                    </>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  className="py-2 mt-3"
                  onPress={() => console.log("Edit")}
                >
                  <View className="flex flex-row items-center pb-3 border-b border-gray-600">
                    <AntDesign name="edit" size={25} color="white" />
                    <Text className="text-white text-base ml-3">Edit</Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Close Button */}
              <TouchableOpacity
                className="py-3 mt-6 bg-red-500 rounded-lg"
                onPress={onClose}
              >
                <Text className="text-white text-center text-base">Close</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
      <Playlists
        isVisible={addToPlaylist}
        onClose={() => setAddToPlaylist(false)}
        trackId={track.songId}
        // playlists={playlists}
      />
    </Modal>
  );
};

export default TrackOptions;
