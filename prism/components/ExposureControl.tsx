import {
  Platform,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, { BounceIn } from "react-native-reanimated";

const exposureOptionsAndroid = [-10, -5, 0, 5, 10];
const exposureOptionsIOS = [-2, -1, 0, 1, 2];
const exposureOptions =
  Platform.OS === "android" ? exposureOptionsAndroid : exposureOptionsIOS;

export default function ExposureControls({
  exposure,
  setExposure,
  setShowExposureControls,
}: {
  exposure: number;
  setExposure: (exposure: number) => void;
  setShowExposureControls: (show: boolean) => void;
}) {
  const { width, height } = useWindowDimensions();
  const radius = Math.min(width, height - 100) * 0.35;

  const handleExposurePress = (exposureValue: number) => {
    setExposure(exposureValue);
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      {exposureOptions.map((exp, i) => {
        const angle =
          (i / exposureOptions.length / 3) * 2 * Math.PI - Math.PI / 2;
        const x = width - Math.cos(angle) * radius - 90;
        const y = Math.sin(angle) * radius + height / 4;
        return (
          <Animated.View
            key={i}
            entering={BounceIn.delay(i * 100)}
            style={{
              position: "absolute",
              left: x,
              top: y,
            }}
          >
            <TouchableHighlight
              onPress={() => handleExposurePress(exp)}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: exposure === exp ? "#fff" : "#ffffff30",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: exposure === exp ? "#000" : "#fff",
                  fontWeight: "600",
                }}
              >
                {exp > 0 ? `+${exp}` : exp}
              </Text>
            </TouchableHighlight>
          </Animated.View>
        );
      })}
      <TouchableOpacity
        onPress={() => setShowExposureControls(false)}
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: "#ffffff30",
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          right: 30,
          top: height / 4,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "600" }}>X</Text>
      </TouchableOpacity>
    </View>
  );
}
