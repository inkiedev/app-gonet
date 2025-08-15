import { Header } from "@/components/layout/header";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import MapView, { PROVIDER_DEFAULT, UrlTile } from "react-native-maps";
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

      <MapView
        provider={PROVIDER_DEFAULT} // Usa el renderizador por defecto
        initialRegion={initialRegion}
        style={styles.map}
      >
        {/* Tile de OpenStreetMap */}
        <UrlTile
          urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
          flipY={false}
        />
      </MapView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});
