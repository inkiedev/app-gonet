import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React from 'react';
import { StyleSheet } from 'react-native';


export default function MapaScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Mapa de Agencias - En Construcción</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  mapContainer: {
    flex: 1,
    height: 300,
    marginTop: 20,
  },
  map: {
    flex: 1,
  },
  webMap: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEE',
    marginTop: 20,
  },
});
