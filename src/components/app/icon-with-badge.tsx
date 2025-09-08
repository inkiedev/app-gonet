import Text from '@/components/ui/custom-text';
import { useTheme } from '@/contexts/theme-context';
import { BaseComponentProps } from '@/types/common';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Badge from './badge';

interface IconWithBadgeProps extends BaseComponentProps {
  SvgComponent: React.ComponentType<any>;
  size?: number;
  color?: string;
  badgeCount?: number | string;
  onPress?: () => void;
  label?: string;
}

export const IconWithBadge: React.FC<IconWithBadgeProps> = ({
                                                              SvgComponent,
                                                              size = 55,
                                                              color,
                                                              badgeCount,
                                                              onPress,
                                                              label,
                                                              style,
                                                              testID,
                                                            }) => {
  const showBadge = badgeCount !== undefined && badgeCount !== 0;
  const { isDark, theme: currentTheme } = useTheme();
  const dynamicStyles = createDynamicStyles(currentTheme);
  
  const iconColor = color || currentTheme.colors.text.primary;

  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[dynamicStyles.container, style]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      testID={testID}
    >
      <View style={styles.iconContainer}>
        <SvgComponent width={size} height={size} fill={isDark ? 'white' : iconColor} color={isDark ? 'rgba(219, 219, 219, 1)' : iconColor} />
        {showBadge && (
          <Badge style={dynamicStyles.badge}>
            <Text style={dynamicStyles.badgeText}>
              {typeof badgeCount === 'number'
                ? badgeCount > 99 ? '99+' : badgeCount.toString()
                : badgeCount}
            </Text>
          </Badge>
        )}
      </View>
      {label && <Text style={dynamicStyles.label}>{label}</Text>}
    </Container>
  );
};

const createDynamicStyles = (theme: any) => StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
  },
  label: {
    marginTop: theme.spacing.xs,
    fontSize: theme.fontSize.xs,
    color: theme.colors.primaryDark,
    textAlign: 'center',
  },
  badgeText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.text.inverse,
    fontWeight: theme.fontWeight.bold,
  }
});

const styles = StyleSheet.create({
  iconContainer: {
    position: 'relative',
    width: 70,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
