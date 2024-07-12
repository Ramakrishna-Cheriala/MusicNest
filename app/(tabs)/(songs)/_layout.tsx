import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { colors } from "@/constants/tokens";
// import { StackScreenWithSearchBar } from "@/constants/layout";
// import { SafeAreaView } from "react-native-safe-area-context";

const SongScreenLayout = () => {
  return (
    // <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
    <View className={`flex-1 bg-[#161616] `}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerTransparent: false,
            headerTitle: "Music",
            headerTitleStyle: {
              fontSize: 40,
              fontWeight: "bold",
            },
          }}
        />
      </Stack>
    </View>
    // </SafeAreaView>
  );
};

export default SongScreenLayout;
