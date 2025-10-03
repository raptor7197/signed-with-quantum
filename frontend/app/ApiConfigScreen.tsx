import React, { useState, useEffect } from "react";
import { StyleSheet, TextInput, Text } from "react-native";
import { ThemedView } from "@/components/themed-view";
import Button from "@/components/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function ApiConfigScreen() {
  const [apiUrl, setApiUrl] = useState("");
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("API_URL").then((url) => url && setApiUrl(url));
  }, []);

  const save = async () => {
    try {
      const url = new URL(apiUrl);
      if (!["http:", "https:"].includes(url.protocol)) throw new Error();
    } catch {
      return setMsg("Enter valid URL.");
    }
    try {
      setSaving(true);
      await AsyncStorage.setItem("API_URL", apiUrl);
      router.replace("/");
    } catch {
      setMsg("Save failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="http://192.168.1.24:8000"
        placeholderTextColor="#ffffff30"
        value={apiUrl}
        onChangeText={setApiUrl}
        autoCapitalize="none"
      />
      {msg ? <Text style={styles.msg}>{msg}</Text> : null}
      <Button
        title={saving ? "Saving..." : "Save"}
        containerStyle={{ alignSelf: "center" }}
        onPress={save}
        disabled={saving}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 8,
    padding: 12,
    color: "#fff",
    marginBottom: 10,
  },
  msg: {
    color: "#ffcc00",
    marginBottom: 10,
    textAlign: "center",
    fontSize: 14,
  },
});
