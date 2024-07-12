import { View, Text } from "react-native";
import React from "react";
// import { Stack } from "expo-router";
import { colors } from "@/constants/tokens";
// import { StackScreenWithSearchBar } from "@/constants/layout";
import { createStackNavigator } from "@react-navigation/stack";
import PlayListScreen from "./index";
import PlaylistData from "@/app/(tabs)/playlists/PlaylistData";

const Stack = createStackNavigator();
const PlaylistScreenLayout = () => {
  return (
    <View className={`flex-1 bg-${colors.background}`}>
      {/* <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerTransparent: false,
            headerTitle: "Playlists",
            headerTitleStyle: {
              fontSize: 40,
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen name="PlaylistData" options={{ headerShown: false }} />
      </Stack> */}
      <Stack.Navigator>
        <Stack.Screen
          name="Playlists"
          component={PlayListScreen}
          options={{
            headerTitleStyle: {
              fontSize: 40,
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="PlaylistData"
          component={PlaylistData}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </View>
  );
};

export default PlaylistScreenLayout;
