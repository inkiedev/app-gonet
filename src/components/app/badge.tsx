import { useTheme } from '@/contexts/theme-context';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

export interface BadgeProps {
  style?: ViewStyle;
  count: number | string;
}

const Badge: React.FC<BadgeProps> = ({ style, count }) => {
  if (!count || count === 0) return null;
  
  const { theme: currentTheme } = useTheme();
  const dynamicStyles = createDynamicStyles(currentTheme);

  return (
    <View style={[dynamicStyles.badge, style]}>
      <Text style={dynamicStyles.badgeText}>
        {typeof count === 'number'
          ? count > 99 ? '99+' : count.toString()
          : count}
      </Text>
    </View>
  );
};

const createDynamicStyles = (theme: any) => StyleSheet.create({
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xs,
  },
  badgeText: {
    color: theme.colors.text.inverse,
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
  },
});

export default Badge;

