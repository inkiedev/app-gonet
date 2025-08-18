import { Header } from "@/components/layout/header";
import { Map } from "@/components/ui/map";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  const router = useRouter();

  const initialRegion = {
    latitude: -2.9,
    longitude: -79.0,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header
        leftAction={{
          icon: "arrow-back",
          onPress: () => router.back(),
        }}
        title="Agencias"
      />

      <Map
        initialRegion={initialRegion}
        style={styles.map}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});
