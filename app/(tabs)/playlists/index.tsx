import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ToastAndroid,
} from "react-native";
import React, { useState, useEffect } from "react";
import { colors } from "@/constants/tokens";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import CreatePlaylist from "@/components/CreatePlaylist";
import { useNavigation } from "@react-navigation/native";
import {
  getAllPlaylits,
  insertIntoPlaylist,
  getAllTracksFromPlaylist,
} from "@/Database/db";
import { songMetaData } from "@/lib/types";

const PlayListScreen = () => {
  const navigation = useNavigation();
  const [playlists, setPlaylists] = useState<
    { id: number; playlistName: string }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [playlistModalVisible, setPlaylistModalVisible] =
    useState<boolean>(false);
  const [playlistData, setPlaylistData] = useState<songMetaData[] | undefined>(
    []
  );
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<number | null>(
    null
  );

  // useEffect(() => {
  //   const initial = async () => {
  //     await createPlaylist();
  //   };
  //   initial();
  // }, []);

  useEffect(() => {
    const checkForPlaylists = async () => {
      try {
        const data = await getAllPlaylits();
        //@ts-ignore
        setPlaylists(data);
      } catch (error) {
        console.error("Error checking for playlists:", error);
      } finally {
        setLoading(false);
      }
    };

    checkForPlaylists();
  }, []);

  const addPlaylist = async (newPlaylistName: string) => {
    await insertIntoPlaylist(newPlaylistName);
    setModalVisible(false);
    setPlaylists((prevPlaylists) => [
      ...prevPlaylists,
      { id: prevPlaylists.length + 1, playlistName: newPlaylistName },
    ]);
  };

  const handlePress = (item: { id: number; playlistName: string }) => {
    //@ts-ignore
    navigation.navigate("PlaylistData", { playlist: item });
  };

  const handleDelete = async (playlistId: number) => {
    // Implement delete logic here
  };

  const renderPlaylistItem = ({
    item,
  }: {
    item: { id: number; playlistName: string };
  }) => (
    <TouchableOpacity onPress={() => handlePress(item)}>
      <View className="p-4 bg-gray-800 rounded-lg mb-2 flex flex-row justify-between">
        <Text className="text-white">
          {item.id}. {item.playlistName}
        </Text>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <MaterialCommunityIcons name="delete" size={25} color="white" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View
        className={`flex-1 items-center justify-center bg-${colors.background}`}
      >
        <Text className="text-white">Loading...</Text>
      </View>
    );
  }

  return (
    <View className={`flex-1 bg-${colors.background} p-4 mb-32`}>
      <FlatList
        data={playlists}
        renderItem={renderPlaylistItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 4 }}
        ListHeaderComponent={() => (
          <View className="flex mb-4">
            <TouchableOpacity
              className="flex flex-row items-center bg-blue-500 p-4 rounded-lg"
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="add-circle" size={25} color="white" />
              <Text className="text-white text-xl ml-2">
                Create New Playlist
              </Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={() => (
          <View className="flex items-center justify-center">
            <Text className="text-white mb-4">No playlists found</Text>
          </View>
        )}
      />

      <CreatePlaylist
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        onCreate={addPlaylist}
      />
    </View>
  );
};

export default PlayListScreen;
