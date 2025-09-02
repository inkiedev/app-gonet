import { useTheme } from '@/contexts/theme-context';
import { BaseComponentProps, Size, Variant } from '@/types/common';
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

interface ButtonProps extends BaseComponentProps {
  title: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
                                                title,
                                                onPress,
                                                variant = 'primary',
                                                size = 'md',
                                                disabled = false,
                                                loading = false,
                                                fullWidth = false,
                                                icon,
                                                style,
                                                testID,
                                              }) => {
  const { theme } = useTheme();
  const dynamicStyles = createDynamicStyles(theme);

  const buttonStyle: ViewStyle[] = [dynamicStyles.base, dynamicStyles[variant], dynamicStyles[size]];

  if (fullWidth) {
    buttonStyle.push(dynamicStyles.fullWidth);
  }

  if (disabled || loading) {
    buttonStyle.push(dynamicStyles.disabled);
  }

  if (style) {
    buttonStyle.push(style);
  }

  const textStyle: TextStyle[] = [
    dynamicStyles.text,
    dynamicStyles[`${variant}Text`],
    dynamicStyles[`${size}Text`],
  ];
  
  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' ? theme.colors.primary : theme.colors.text.inverse}
        />
      ) : (
        <>
          {icon}
          <Text style={textStyle}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const createDynamicStyles = (theme: any) => StyleSheet.create({
  base: {
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
    ...theme.shadows.sm,
  },
  primary: {
    backgroundColor: theme.colors.primary,
  },
  secondary: {
    backgroundColor: theme.colors.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  sm: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    minHeight: 32,
  },
  md: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    minHeight: 40,
  },
  lg: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    minHeight: 48,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: theme.fontWeight.semibold,
    textAlign: 'center',
    
  },
  primaryText: {
    color: theme.colors.primaryDark,
  },
  secondaryText: {
    color: theme.colors.text.inverse,
  },
  outlineText: {
    color: theme.colors.primary,
  },
  ghostText: {
    color: theme.colors.primary,
  },
  smText: {
    fontSize: theme.fontSize.sm,
  },
  mdText: {
    fontSize: theme.fontSize.md,
  },
  lgText: {
    fontSize: theme.fontSize.lg,
  },
  pressed: {
    backgroundColor: theme.colors.darkgreen,
  },
  pressedText: {
      color: theme.colors.text.inverse,
  }
});

