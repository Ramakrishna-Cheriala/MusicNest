import { View, Text, Modal, TextInput, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { getAllPlaylits } from "@/Database/db";

interface CreatePlaylistProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  onCreate: (playlistName: string) => void;
}

const CreatePlaylist: React.FC<CreatePlaylistProps> = ({
  modalVisible,
  setModalVisible,
  onCreate,
}) => {
  const [newPlaylistName, setNewPlaylistName] = useState<string>("");
  const [existingPlaylists, setExistingPlaylists] = useState<
    { id: number; playlistName: string }[]
  >([]);
  const [isExisting, setIsExisting] = useState(false);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const data = await getAllPlaylits();
        // @ts-ignore
        setExistingPlaylists(data);
      } catch (error) {
        console.error("Error checking for playlists:", error);
      }
    };
    fetchPlaylists();
  }, []);

  const handleCreatePlaylist = async () => {
    console.log("in handle create playlist");
    // let state = false
    if (newPlaylistName.trim() === "") {
      alert("Please enter a valid playlist name.");
      return;
    }

    const index = existingPlaylists.findIndex((playlist) => {
      playlist.playlistName = newPlaylistName.replace(/\s+/g, "_");
    });

    if (index > 0) {
      alert("Playlist name already exists.");
      console.log("Playlist name already exists.");
    } else {
      try {
        const safePlaylistName = newPlaylistName.replace(/\s+/g, "_");
        onCreate(safePlaylistName);
        setNewPlaylistName(""); // Clear the input after creating the playlist
        setModalVisible(false);
      } catch (error) {
        console.error("Error creating playlist:", error);
      }
    }
  };

  return (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setModalVisible(false)}
    >
      <View className="flex-1 justify-center items-center bg-transparent bg-opacity-50">
        <View className="w-4/5 bg-white p-6 rounded-lg">
          <Text className="text-lg font-bold mb-4">Create New Playlist</Text>
          <TextInput
            className="border border-gray-300 p-2 rounded-lg mb-4"
            placeholder="Enter playlist name"
            value={newPlaylistName}
            onChangeText={setNewPlaylistName}
          />
          <View className="flex-row justify-between">
            <TouchableOpacity
              className="bg-red-500 p-3 rounded-lg flex-1 mr-2"
              onPress={() => setModalVisible(false)}
            >
              <Text className="text-white text-center">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-blue-500 p-3 rounded-lg flex-1 ml-2"
              onPress={handleCreatePlaylist}
            >
              <Text className="text-white text-center">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CreatePlaylist;
