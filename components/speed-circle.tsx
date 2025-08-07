import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

export default function SpeedCircle() {
  return (
    <View style={styles.shadowWrapper}>
      <View style={styles.circle}>
          <Text style={styles.speedNumber}>750</Text>
          <Text style={styles.speedUnit}>Mbps</Text>
      </View>
    </View>
  );
}

const CIRCLE_SIZE = 170;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  shadowWrapper: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: {
        elevation: 12, 
      },
    }),
  },
  circle: {
    marginTop: 10,
    marginBottom: 10,
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: 10,
    borderColor: '#00ff9b',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  speedNumber: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#009a94',
  },
  speedUnit: {
    fontSize: 20,
    color: '#009a94',
    fontWeight: 'thin',
  },
});
