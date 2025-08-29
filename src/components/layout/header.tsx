import { theme } from '@/styles/theme';
import { BaseComponentProps } from '@/types/common';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
  return (
    <View style={[styles.container, styles[variant], style]} testID={testID}>
      <View style={styles.header}>
        <View style={styles.leftSection}>
          {leftAction && (
            <TouchableOpacity
              onPress={leftAction.onPress}
              style={styles.actionButton}
              activeOpacity={0.7}
            >
              {leftAction.icon}
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.centerSection}>
          {centerContent || (
            title && <Text style={styles.title}>{title}</Text>
          )}
        </View>

        <View style={styles.rightSection}>
          {rightAction && (
            <TouchableOpacity
              onPress={rightAction.onPress}
              style={styles.actionButton}
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

const styles = StyleSheet.create({
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
