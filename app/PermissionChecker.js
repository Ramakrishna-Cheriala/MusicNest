// PermissionsChecker.js
import React, { useEffect, useState } from "react";
import { View, Text, Button, ActivityIndicator } from "react-native";
import * as MediaLibrary from "expo-media-library";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PERMISSION_KEY = "mediaLibraryPermission";

const PermissionsChecker = ({ children }) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Check if the permission has been stored previously
  const checkStoredPermission = async () => {
    try {
      const storedStatus = await AsyncStorage.getItem(PERMISSION_KEY);
      return storedStatus === "granted";
    } catch (error) {
      console.error("Error reading stored permission status: ", error);
      return false;
    }
  };

  // Request media library permission and store the result
  const requestAndStorePermissions = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === "granted") {
        await AsyncStorage.setItem(PERMISSION_KEY, "granted");
        setHasPermission(true);
      } else {
        await AsyncStorage.setItem(PERMISSION_KEY, "denied");
        setHasPermission(false);
      }
    } catch (error) {
      console.error("Permission request error: ", error);
      setHasPermission(false);
    }
    setIsChecking(false);
  };

  // Check and request permissions if needed
  const checkAndRequestPermissions = async () => {
    setIsChecking(true);
    const hasStoredPermission = await checkStoredPermission();
    if (hasStoredPermission) {
      setHasPermission(true);
      setIsChecking(false);
    } else {
      await requestAndStorePermissions();
    }
  };

  // Run permission check when component mounts
  useEffect(() => {
    checkAndRequestPermissions();
  }, []);

  if (isChecking) {
    // Show a loading indicator while checking permissions
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Checking permissions...</Text>
      </View>
    );
  }

  if (!hasPermission) {
    // Ask for permission if not granted
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
        }}
      >
        <Text style={{ fontSize: 18, marginBottom: 24 }}>
          This app requires access to your media files.
        </Text>
        <Button title="Grant Permission" onPress={checkAndRequestPermissions} />
      </View>
    );
  }

  // If permissions are granted, render the children (i.e., the rest of the app)
  return children;
};

export default PermissionsChecker;
