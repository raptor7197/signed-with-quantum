import { ThemedView } from "@/components/themed-view";
import { useLocalSearchParams } from "expo-router";
import * as Sharing from "expo-sharing";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, View, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as FileSystem from "expo-file-system/legacy";
import Button from "../components/Button";

export default function MediaScreen() {
  const { media, type } = useLocalSearchParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<null | boolean>(
    null
  );

  const handleShare = async () => {
    const fileUri = Array.isArray(media) ? media[0] : media;
    if (!fileUri) return;
    await Sharing.shareAsync(fileUri);
  };

  const verifyImage = async (fileUri: string) => {
    try {
      setLoading(true);
      const localUri = `${FileSystem.cacheDirectory}${Date.now()}.jpg`;
      await FileSystem.copyAsync({ from: fileUri, to: localUri });
      const formData = new FormData();
      formData.append("file", {
        uri: localUri,
        name: "photo.jpg",
        type: "image/jpeg",
      } as any);
      const res = await fetch("<DOMAIN>/verify", {
        method: "POST",
        body: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      const rawText = await res.text();
      let result;
      try {
        result = JSON.parse(rawText);
      } catch (error) {
        Alert.alert("Server Error.");
        setVerificationResult(false);
        return;
      }
      setVerificationResult(result.valid);
      await FileSystem.deleteAsync(localUri);
    } catch (error) {
      setVerificationResult(false);
    } finally {
      setLoading(false);
    }
  };

  const renderVerificationIcon = () => {
    if (loading) {
      return <ActivityIndicator size="small" color="#fff" />;
    }
    if (verificationResult === true) {
      return <MaterialIcons name="verified" size={28} color="limegreen" />;
    }
    if (verificationResult === false) {
      return <MaterialIcons name="error" size={28} color="red" />;
    }
    return <View style={{ width: 28, height: 28 }} />;
  };

  const fileUri = Array.isArray(media) ? media[0] : media;

  return (
    <ThemedView style={styles.container}>
      <View style={styles.topLeftButton}>
        <View style={styles.iconWrapper}>
          <Button onPress={handleShare} iconName="share-social" iconSize={28} />
        </View>
      </View>
      <View style={styles.topRightIcon}>
        <View style={styles.iconWrapper}>{renderVerificationIcon()}</View>
      </View>
      {type === "photo" && fileUri && (
        <Image
          source={{ uri: fileUri }}
          style={styles.image}
          contentFit="contain"
          onLoad={() => verifyImage(fileUri)}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    backgroundColor: "black",
  },
  topLeftButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 999,
  },
  topRightIcon: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 999,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
});
