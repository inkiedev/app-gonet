import { Header } from "@/components/layout/header";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  const router = useRouter();
  const initialRegion = {
    latitude: -2.170998,    
    longitude: -78.922359,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header leftAction={{
        icon: "arrow-back",
        onPress: () => router.back()
      }} title="Agencias" />
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={false}
        showsMyLocationButton={false}
        // provider={PROVIDER_GOOGLE} // descomenta si quieres Google en Android y lo configuraste
      >
        <Marker
          coordinate={{ latitude: initialRegion.latitude, longitude: initialRegion.longitude }}
          title="Aquí"
          description="Marcador de ejemplo"
        />
      </MapView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1},
});
