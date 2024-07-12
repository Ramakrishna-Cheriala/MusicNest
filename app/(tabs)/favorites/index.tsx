import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from "react-native";
import React, { memo, useCallback, useEffect, useState } from "react";
import Song from "@/app/Songs";
import { getAllLikedSongData } from "@/Database/db";
import { songMetaData } from "@/lib/types";

const FavoritesScreen = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [likedData, setLikedData] = useState<songMetaData[] | undefined>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    fetchLikedData();
  }, [refreshing]);

  const fetchLikedData = async () => {
    try {
      const data = await getAllLikedSongData();
      setLikedData(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true); // Start refreshing indicator
    fetchLikedData();
  }, []);

  return (
    <View className="w-full h-full m-0 mb-16">
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#00ff00"
          className="flex justify-center items-center"
        />
      ) : (
        <>
          <FlatList
            data={likedData}
            // renderItem={renderSongItem}
            keyExtractor={(item) => item.songId}
            renderItem={({ item }) => (
              <MemoizedSong
                data={item}
                onclick={() => {
                  console.log(
                    "------------------------------------------------"
                  );
                  console.log(`clicked on ${item.filename}`);
                  console.log(
                    "------------------------------------------------"
                  );
                }}
              />
            )}
            ListEmptyComponent={() => {
              return (
                <View className="flex items-center justify-center bg-slate-500">
                  <Text className="text-white text-3xl text-center">
                    No Liked Songs
                  </Text>
                </View>
              );
            }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        </>
      )}
    </View>
  );
};

export default FavoritesScreen;

const MemoizedSong = memo(
  Song,
  (prevProps, nextProps) => prevProps.data === nextProps.data
);
