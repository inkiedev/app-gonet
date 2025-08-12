import React from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function App() {
  // Coordenadas de ejemplo — cámbialas por las tuyas
  const initialRegion = {
    latitude: -2.170998,    // ej: Cuenca, Ecuador (cambia)
    longitude: -78.922359,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <View style={styles.container}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});
