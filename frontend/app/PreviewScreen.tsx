import Button from "@/components/Button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import * as FileSystem from "expo-file-system/legacy";
import * as MediaLibrary from "expo-media-library";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Image, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export default function PreviewScreen() {
  const { media, type } = useLocalSearchParams();
  const router = useRouter();
  const [saving, setSaving] = useState<boolean>(false);

  const saveImage = async (uri: string) => {
    try {
      setSaving(true);
      const apiBaseUrl = await AsyncStorage.getItem("API_URL");
      const formData = new FormData();
      formData.append("file", {
        uri: `file://${uri}`,
        type: "image/jpeg",
        name: "photo.jpg",
      } as any);
      const response = await fetch(`${apiBaseUrl}/save`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`Save failed with status ${response.status}.`);
      }
      const arrayBuffer = await response.arrayBuffer();
      const base64 = arrayBufferToBase64(arrayBuffer);
      const fileUri = FileSystem.cacheDirectory + `captioned_${Date.now()}.jpg`;
      await FileSystem.writeAsStringAsync(fileUri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });
      await MediaLibrary.createAssetAsync(fileUri);
      setSaving(false);
      router.replace("/");
      Alert.alert("Saved.");
    } catch (error) {
      setSaving(false);
      Alert.alert("Save failed.");
    }
  };

  return (
    <ThemedView style={styles.container}>
      {type === "photo" && (
        <Image
          source={{ uri: `file://${media}` }}
          style={{ width: "100%", height: "80%", resizeMode: "contain" }}
        />
      )}
      <Button
        title={saving ? "Signing the image... hang tight" : "Save"}
        containerStyle={{ alignSelf: "center" }}
        onPress={async () => {
          if (saving) return;
          await saveImage(media as string);
        }}
        disabled={saving ? true : false}
      />
      <Link href="/" style={styles.link} disabled={saving}>
        <ThemedText type="link">Delete and go back</ThemedText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  link: { marginTop: 15, paddingVertical: 15, alignSelf: "center" },
});
