import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp, TextStyle } from 'react-native';
import { IconProps } from '@expo/vector-icons/build/createIconSet';

interface IconWithBadgeProps {
  IconComponent: React.ComponentType<IconProps<any>>;
  name: string;
  size: number;
  color: string;
  badgeCount?: number | string;
  style?: StyleProp<ViewStyle>;
  badgeStyles?: StyleProp<ViewStyle>;
}

const IconWithBadge: React.FC<IconWithBadgeProps> = ({
  IconComponent,
  name,
  size,
  color,
  badgeCount = 0,
  style,
  badgeStyles,
}) => {
  const showBadge = badgeCount !== undefined && badgeCount !== 0;
  return (
    <View style={[styles.container, style]}>
      <IconComponent name={name} size={size} color={color} />
      {showBadge && (
        <View style={[styles.badgeContainer, badgeStyles]}>
          <Text style={styles.badgeText}>
            {typeof badgeCount === 'number'
              ? badgeCount > 99 ? '99+' : badgeCount
              : badgeCount}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 70,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeContainer: {
    position: 'absolute',
    bottom: 0,
    right: -5,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#00ff9b',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: 'black',
    fontSize: 14,
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
});

export default IconWithBadge;