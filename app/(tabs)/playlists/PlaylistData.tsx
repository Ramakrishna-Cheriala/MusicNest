import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import React, { memo, useCallback, useEffect, useState } from "react";
import Song from "@/app/Songs";
import {
  deleteTrackFromPlaylist,
  getAllTracksFromPlaylist,
} from "@/Database/db";
import { songMetaData, TrackData } from "@/lib/types";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Search from "@/components/Search";
import { addTracksToQueue } from "@/lib/utils";
import Buttons from "@/components/Buttons";

const PlaylistData = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [playlistData, setPlaylistData] = useState<songMetaData[] | undefined>(
    []
  );
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [filteredTracks, setFilteredTracks] = useState<TrackData[] | undefined>(
    []
  );

  const { playlist } = route.params as {
    playlist: { id: number; playlistName: string };
  };

  useEffect(() => {
    fetchPlayListData(playlist.id);
  }, [refreshing]);

  const fetchPlayListData = async (playListId: number) => {
    try {
      const data = await getAllTracksFromPlaylist(playListId);
      setPlaylistData(data);
      // console.log(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true); // Start refreshing indicator
    fetchPlayListData(playlist.id);
  }, []);

  const handleDelete = async (songId: string | undefined) => {
    await deleteTrackFromPlaylist(playlist.id, songId);
    const data = playlistData?.filter((item) => item.songId !== songId);
    setPlaylistData(data);
  };

  return (
    <SafeAreaView>
      <View className={`m-0 mb-56`}>
        <View className="flex flex-row mt-10">
          <TouchableOpacity
            className="w-[10%] flex justify-center items-center"
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={25} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-3xl w-[80%]">
            {playlist.playlistName}
          </Text>
        </View>
        <Search
          mainData={playlistData}
          onResults={setFilteredTracks}
          placeholder={`Search ${playlist.playlistName}...`}
        />
        <Buttons
          //@ts-ignore
          mainData={playlistData}
          idType="songId"
        />
        <FlatList
          data={filteredTracks}
          keyExtractor={(item, index) => `${index}`}
          renderItem={({ item }) => (
            <View className="flex flex-row">
              <View className="w-[90%]">
                <MemoizedSong
                  data={item}
                  onclick={async (data: songMetaData) => {
                    console.log(
                      "------------------------------------------------"
                    );
                    console.log(`clicked on ${data.filename}`);
                    const songIndex = playlistData?.findIndex(
                      (song) => song.id === item.id
                    );
                    console.log(songIndex);
                    //@ts-ignore
                    await addTracksToQueue(playlistData, songIndex, "songId");
                    console.log(
                      "------------------------------------------------"
                    );
                  }}
                />
              </View>
              <TouchableOpacity
                className="flex justify-center items-center"
                //@ts-ignore
                onPress={() => handleDelete(item.songId)}
              >
                <Ionicons
                  name="remove-circle-outline"
                  size={25}
                  color="white"
                />
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={() => {
            return (
              <View className="flex items-center justify-center mt-10">
                <Text className="text-white text-3xl text-center">
                  Add Songs to the playlist to view
                </Text>
              </View>
            );
          }}
        />
      </View>
      {/* <PlaylistOptions
        isVisible={isOptionsVisible}
        onClose={() => setIsOptionsVisible(false)}
        playlist={playlist}
      /> */}
    </SafeAreaView>
  );
};

export default PlaylistData;

const MemoizedSong = memo(
  Song,
  (prevProps, nextProps) => prevProps.data === nextProps.data
);
