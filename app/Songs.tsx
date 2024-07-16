import { songMetaData, TrackData } from "@/lib/types";
// import { useMusicPlayer } from "./MusicProvider";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import TrackOptions from "@/components/TrackOptions";
import { colors } from "@/constants/tokens";

const Song = ({
  data,
  onclick,
}: {
  data: songMetaData | TrackData;
  onclick: Function;
}) => {
  // console.log(`rendering songs ${data.title} - ${data.album}`);
  // console.log("------------------------");
  const [selectedTrack, setSelectedTrack] = useState<
    songMetaData | TrackData
  >();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const handlePress = (data: songMetaData | TrackData) => {
    //   setCurrentTrack(data);
    onclick(data);
  };

  const showOptions = () => {
    setSelectedTrack(data);
    setIsModalVisible(true);
  };

  const hideOptions = () => {
    setIsModalVisible(false);
    setSelectedTrack(undefined);
  };

  return (
    <View className={`bg-${colors.background} shadow-md`}>
      <TouchableOpacity
        onPress={() => handlePress(data)}
        className="p-3 flex-row items-center"
      >
        <View className="flex items-center mr-3">
          {data?.pictureData ? (
            <Image
              className="w-14 h-14 rounded-lg"
              source={{ uri: data?.pictureData }}
              alt="Album Art"
            />
          ) : (
            <Image
              className="w-14 h-14 rounded-lg bg-white"
              source={require("@/assets/images/itunes.png")}
              alt="Album Art"
            />
          )}
        </View>
        <View className="flex-1 mr-3">
          <Text
            className="text-white text-lg font-semibold"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {data?.title || data.filename.split(".")[0] || "Unknown Title"}
          </Text>
          <Text
            className="text-gray-400 text-sm"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {data?.artist || "Unknown Artist"}
          </Text>
          {/* <Text
            className="text-gray-500 text-sm"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {data?.album || "Unknown Album"}
          </Text> */}
        </View>
        <TouchableOpacity
          onPress={showOptions}
          className="flex items-center justify-center h-14 w-10"
        >
          <MaterialCommunityIcons
            name="dots-vertical"
            size={24}
            color="white"
          />
        </TouchableOpacity>
      </TouchableOpacity>
      <TrackOptions
        isVisible={isModalVisible}
        onClose={hideOptions}
        track={selectedTrack}
      />
    </View>
  );
};

export default Song;
