import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';
import { BaseComponentProps } from '@/types/common';

interface SpeedCircleProps extends BaseComponentProps {
  speed: number;
  unit?: string;
  size?: number;
}

export const SpeedCircle: React.FC<SpeedCircleProps> = ({
                                                          speed,
                                                          unit = 'Mbps',
                                                          size = 170,
                                                          style,
                                                          testID,
                                                        }) => {
  const circleStyle = [
    styles.circle,
    {
      width: size,
      height: size,
      borderRadius: size / 2,
    },
    style,
  ];

  return (
    <View style={styles.container} testID={testID}>
      <View style={circleStyle}>
        <Text style={styles.speedNumber}>{speed}</Text>
        <Text style={styles.speedUnit}>{unit}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    ...theme.shadows.lg,
  },
  circle: {
    borderWidth: 10,
    borderColor: theme.colors.primary,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  speedNumber: {
    fontSize: theme.fontSize.huge * 2,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primaryDark,
  },
  speedUnit: {
    fontSize: theme.fontSize.xl,
    color: theme.colors.primaryDark,
    fontWeight: theme.fontWeight.normal,
  },
});
