import ExposureControls from "@/components/ExposureControl";
import { ThemedText } from "@/components/themed-text";
import ZoomControls from "@/components/ZoomControls";
import { FontAwesome5 } from "@expo/vector-icons";
import { Redirect, useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  TouchableHighlight,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from "react-native-vision-camera";
import Button from "../components/Button";

export default function HomeScreen() {
  const { hasPermission } = useCameraPermission();
  const [cameraPosition, setCameraPosition] = useState<"front" | "back">(
    "back"
  );
  const device = useCameraDevice(cameraPosition);
  const [showZoomControls, setShowZoomControls] = useState(false);
  const [takingPhoto, setTakingPhoto] = useState(false);
  const [showExposureControls, setShowExposureControls] = useState(false);
  const [zoom, setZoom] = useState(device?.neutralZoom);
  const [exposure, setExposure] = useState(0);
  const [flash, setFlash] = useState<"off" | "on">("off");
  const [torch, setTorch] = useState<"off" | "on">("off");
  const camera = useRef<Camera>(null);
  const router = useRouter();

  const takePicture = async () => {
    if (takingPhoto) return;
    setTakingPhoto(true);
    try {
      if (camera.current == null) throw new Error("Camera ref is null!");
      const photo = await camera.current.takePhoto({
        flash: flash,
        enableShutterSound: false,
      });
      router.push({
        pathname: "/PreviewScreen",
        params: { media: photo.path, type: "photo" },
      });
    } catch (error) {
      console.log(error);
    } finally {
      setTakingPhoto(false);
    }
  };

  if (!hasPermission) return <Redirect href="/PermissionsScreen" />;
  if (!device) return <></>;

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 2, borderRadius: 10, overflow: "hidden" }}>
          <Camera
            ref={camera}
            style={{ flex: 1 }}
            device={device}
            isActive
            zoom={zoom}
            resizeMode="cover"
            exposure={exposure}
            torch={torch}
            photo
          />
        </View>
        {showZoomControls ? (
          <ZoomControls
            setZoom={setZoom}
            setShowZoomControls={setShowZoomControls}
            zoom={zoom ?? 1}
          />
        ) : showExposureControls ? (
          <ExposureControls
            setExposure={setExposure}
            setShowExposureControls={setShowExposureControls}
            exposure={exposure}
          />
        ) : (
          <View style={{ flex: 1 }}>
            <View style={{ flex: 0.7 }}>
              <ThemedText>Zoom: x{zoom}</ThemedText>
              <ThemedText>Exposure: {exposure}</ThemedText>
              <ThemedText>
                Width: {device.formats[0].photoWidth} Height:{" "}
                {device.formats[0].photoHeight}
              </ThemedText>
            </View>
            <View
              style={{
                flex: 0.7,
                flexDirection: "row",
                justifyContent: "space-evenly",
              }}
            >
              <Button
                iconName={torch === "on" ? "flashlight" : "flashlight-outline"}
                onPress={() => setTorch((t) => (t === "off" ? "on" : "off"))}
                containerStyle={{ alignSelf: "center" }}
              />
              <Button
                iconName={flash === "on" ? "flashlight" : "flashlight-outline"}
                onPress={() => setFlash((t) => (t === "off" ? "on" : "off"))}
                containerStyle={{ alignSelf: "center" }}
              />
              <Button
                iconName="camera-reverse-outline"
                onPress={() =>
                  setCameraPosition((p) => (p === "back" ? "front" : "back"))
                }
                containerStyle={{ alignSelf: "center" }}
              />
              <Button
                iconName="image-outline"
                onPress={() => router.push("/LibraryScreen")}
                containerStyle={{ alignSelf: "center" }}
              />
              <Button
                iconName="settings-outline"
                onPress={() => router.push("/_sitemap")}
                containerStyle={{ alignSelf: "center" }}
              />
            </View>
            <View
              style={{
                flex: 1.1,
                flexDirection: "row",
                justifyContent: "space-evenly",
                alignItems: "center",
              }}
            >
              <Button
                iconSize={40}
                title="+/-"
                onPress={() => setShowZoomControls((s) => !s)}
                containerStyle={{ alignSelf: "center" }}
              />
              <TouchableHighlight
                onPress={takePicture}
                disabled={takingPhoto}
                style={{ opacity: takingPhoto ? 0.5 : 1 }}
              >
                <FontAwesome5 name="dot-circle" size={55} color="#fff" />
              </TouchableHighlight>
              <Button
                iconSize={40}
                title="1x"
                onPress={() => setShowExposureControls((s) => !s)}
                containerStyle={{ alignSelf: "center" }}
              />
            </View>
          </View>
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS == "android" ? StatusBar.currentHeight : 0,
  },
});
