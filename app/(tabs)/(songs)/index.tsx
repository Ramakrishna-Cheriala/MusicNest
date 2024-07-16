import React, { memo, useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import MusicInfo from "@/lib/MusicInfo";
import { MaterialCommunityIcons } from "@expo/vector-icons";
// import * as FileSystem from "expo-file-system";
import { songMetaData, TrackData } from "@/lib/types";
import {
  createSongsTable,
  getAllSongData,
  getSongDataById,
  insertSong,
} from "@/Database/db";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import { colors } from "@/constants/tokens";
import TrackOptions from "@/components/TrackOptions";
import {
  addTrack,
  playTrack,
  initializePlayer,
} from "@/TrackPlayerServices.js";
import TrackPlayer, {
  Event,
  useTrackPlayerEvents,
} from "react-native-track-player";
import Search from "@/components/Search";
import { addTracksToQueue } from "@/lib/utils";
import Buttons from "@/components/Buttons";

const SongScreen: React.FC = () => {
  const [songs, setSongs] = useState<MediaLibrary.Asset[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dbData, setDbData] = useState<songMetaData[] | undefined>([]);
  const [isTrackActive, setIsTrackActive] = useState<boolean>(false);
  const [filteredTracks, setFilteredTracks] = useState<TrackData[] | undefined>(
    []
  );

  useEffect(() => {
    const initialSteps = async () => {
      await createSongsTable();
    };
    initialSteps();
  }, []);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        let allSongs: MediaLibrary.Asset[] = [];
        let hasNextPage = true;
        let nextPage: MediaLibrary.AssetRef = "0";

        while (hasNextPage) {
          const pageInfo = await getAssetsPage(nextPage);
          allSongs = [...allSongs, ...pageInfo.assets];
          // hasNextPage = pageInfo.hasNextPage;
          hasNextPage = false;
          nextPage = pageInfo.endCursor;
        }

        setSongs(allSongs);
      } catch (error) {
        console.error("Error fetching songs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSongs();
  }, []);

  const getAssetsPage = async (page: MediaLibrary.AssetRef) => {
    const { assets, endCursor, hasNextPage } =
      await MediaLibrary.getAssetsAsync({
        mediaType: "audio",
        first: 20,
        after: page,
      });

    return { assets, endCursor, hasNextPage };
  };

  // const renderSongItem = ({ item }: { item: MediaLibrary.Asset }) => {
  //   return <Song data={item} />;
  // };

  return (
    <View className={`m-0 ${isTrackActive ? "mb-[350px]" : "mb-72"}`}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#00ff00" />
      ) : (
        <View>
          <Search
            mainData={songs}
            searchTitleOnly={true}
            onResults={setFilteredTracks}
            placeholder="Search songs..."
          />
          <Buttons mainData={songs} idType="id" />
          <FlatList
            data={filteredTracks}
            // renderItem={renderSongItem}
            keyExtractor={(item) => item.filename}
            renderItem={({ item }) => (
              <MemoizedSong
                data={item}
                onclick={async (data: songMetaData) => {
                  console.log(
                    "------------------------------------------------"
                  );
                  setIsTrackActive(true);
                  console.log(`clicked on ${data.filename}`);
                  const songIndex = songs.findIndex(
                    (song) => song.id === item.id
                  );
                  console.log(songIndex);
                  // await playTrack();
                  await addTracksToQueue(songs, songIndex, "id");
                  console.log(
                    "------------------------------------------------"
                  );
                }}
              />
            )}
          />
        </View>
      )}
    </View>
  );
};

export default SongScreen;

const Song = memo(
  ({ data, onclick }: { data: TrackData; onclick: Function }) => {
    const [metadata, setMetadata] = useState<songMetaData | undefined>();
    const [selectedTrack, setSelectedTrack] = useState<
      songMetaData | undefined
    >();
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

    const handlePress = (data: songMetaData | undefined) => {
      //   setCurrentTrack(data);
      onclick(data);
    };

    // console.log(--------------------${data.filename}--------------------);
    useEffect(() => {
      const fetchMetadata = async () => {
        const songId = `${data.filename
          .replace(/\s+/g, "_")
          .replace(".mp3", "")}${data.id}`;
        const songData: songMetaData | undefined | null = await getSongDataById(
          songId
        );

        if (songData) {
          setMetadata(songData);
          console.log(`${songData.title} already in database`);
        } else {
          try {
            const fetchedMetadata = await MusicInfo.getMusicInfoAsync(
              data.uri,
              {
                title: true,
                artist: true,
                album: true,
                genre: true,
                picture: true,
              }
            );

            let resizedPictureData = "";
            // @ts-ignore
            if (fetchedMetadata?.picture?.pictureData) {
              const result = await manipulateAsync(
                // @ts-ignore
                fetchedMetadata.picture.pictureData,
                [{ resize: { width: 100, height: 100 } }], // Adjust the size as needed
                { compress: 0.7, format: SaveFormat.JPEG }
              );
              resizedPictureData = result.uri;
            }
            const metadata = {
              songId: songId,
              //@ts-ignore
              title: fetchedMetadata?.title || "",
              //@ts-ignore
              artist: fetchedMetadata?.artist || "",
              //@ts-ignore
              album: fetchedMetadata?.album || "",
              //@ts-ignore
              duration: fetchedMetadata?.duration || "",
              uri: data.uri,
              //@ts-ignore
              pictureData: resizedPictureData || "",
              filename: data.filename || "",
              isLiked: false,
            };
            setMetadata(metadata);
            await insertSong(metadata);
          } catch (error) {
            console.error("Error fetching metadata:", error);
          }
        }
      };

      fetchMetadata();
    }, [data]);

    const showOptions = (data: songMetaData | undefined) => {
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
          onPress={() => handlePress(metadata)}
          className="p-3 flex-row items-center"
        >
          <View className="flex items-center mr-3">
            {metadata?.pictureData ? (
              <Image
                className="w-14 h-14 rounded-lg"
                source={{ uri: metadata.pictureData }}
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
              {metadata?.title ||
                data.filename.split(".")[0] ||
                "Unknown Title"}
            </Text>
            <Text
              className="text-gray-400 text-sm"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {metadata?.artist || "Unknown Artist"}
            </Text>
            {/* <Text
              className="text-gray-500 text-sm"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {metadata?.album || "Unknown Album"}
            </Text> */}
          </View>
          <TouchableOpacity
            onPress={() => showOptions(metadata)}
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
  }
);

const MemoizedSong = memo(
  Song,
  (prevProps, nextProps) => prevProps.data === nextProps.data
);
