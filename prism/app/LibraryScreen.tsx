import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { Asset, getAlbumAsync, getAssetsAsync } from "expo-media-library";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, View } from "react-native";
import Button from "../components/Button";

export default function LibraryScreen() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const router = useRouter();

  useEffect(() => {
    getAlbums();
  }, []);

  async function getAlbums() {
    const fetchedAlbum = await getAlbumAsync("DCIM");
    if (!fetchedAlbum) return [];
    const albumAssets = await getAssetsAsync({
      album: fetchedAlbum,
      mediaType: "photo",
      sortBy: "default",
      first: 999999,
    });
    setAssets(albumAssets.assets);
  }

  async function pickAndSaveImage() {
    try {
      const { status: pickerStatus } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (pickerStatus !== "granted") {
        Alert.alert("Permission Required", "Gallery access is needed.");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: false,
        quality: 1,
      });
      if (result.canceled) return;
      const pickedUri = result.assets[0].uri;
      const asset = await MediaLibrary.createAssetAsync(pickedUri);
      let album = await getAlbumAsync("DCIM");
      if (album) {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      } else {
        album = await MediaLibrary.createAlbumAsync("DCIM", asset, false);
      }
      await getAlbums();
    } catch (error) {
      Alert.alert("Something went wrong.");
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        {assets.map((photo) => (
          <Pressable
            key={photo.id}
            onPress={() => {
              router.push({
                pathname: "/MediaScreen",
                params: { media: photo.uri, type: "photo" },
              });
            }}
            style={{ width: "25%", height: 100 }}
          >
            <Image
              source={{ uri: photo.uri }}
              style={{ width: "100%", height: "100%" }}
            />
          </Pressable>
        ))}
      </ScrollView>
      <View style={styles.floatingButton}>
        <Button onPress={pickAndSaveImage} iconName="add" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    zIndex: 999,
  },
});
