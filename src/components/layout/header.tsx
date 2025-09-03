import Text from '@/components/ui/custom-text';
import { useTheme } from '@/contexts/theme-context';
import { BaseComponentProps } from '@/types/common';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';


interface HeaderProps extends BaseComponentProps {
  title?: string;
  leftAction?: {
    icon: React.ReactNode;
    onPress: () => void;
  };
  rightAction?: {
    icon: React.ReactNode;
    onPress: () => void;
    testID? : string;
  };
  centerContent?: React.ReactNode;
  variant?: 'default' | 'transparent';
}

export const Header: React.FC<HeaderProps> = ({
                                                title,
                                                leftAction,
                                                rightAction,
                                                centerContent,
                                                variant = 'default',
                                                style,
                                                testID,
                                              }) => {
  const { theme } = useTheme();
  const dynamicStyles = createDynamicStyles(theme);
  
  return (
    <View style={[dynamicStyles.container, dynamicStyles[variant], style]} testID={testID}>
      <View style={dynamicStyles.header}>
        <View style={dynamicStyles.leftSection}>
          {leftAction && (
            <TouchableOpacity
              onPress={leftAction.onPress}
              style={dynamicStyles.actionButton}
              activeOpacity={0.7}
            >
              {leftAction.icon}
            </TouchableOpacity>
          )}
        </View>

        <View style={dynamicStyles.centerSection}>
          {centerContent || (
            title && <Text style={dynamicStyles.title}>{title}</Text>
          )}
        </View>

        <View style={dynamicStyles.rightSection}>
          {rightAction && (
            <TouchableOpacity
              onPress={rightAction.onPress}
              style={dynamicStyles.actionButton}
              activeOpacity={0.7}
            >
              {rightAction.icon}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const createDynamicStyles = (theme: any) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
  },
  transparent: {
    backgroundColor: 'transparent',
  },
  default: {
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    minHeight: 56,
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 2,
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  actionButton: {
    padding: theme.spacing.xs,
  },
  title: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
});
