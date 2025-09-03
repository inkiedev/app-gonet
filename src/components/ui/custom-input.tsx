import Text from '@/components/ui/custom-text';
import { useTheme } from '@/contexts/theme-context';
import { BaseComponentProps } from '@/types/common';
import { FontAwesome } from '@expo/vector-icons';
import React, { forwardRef, useState } from 'react';
import {
  Platform,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

interface InputProps extends BaseComponentProps, Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showPasswordToggle?: boolean;
  inputStyle?: TextStyle | TextStyle[]; // Cambiado aquí
}

export const Input = forwardRef<TextInput, InputProps>(({
                                                          label,
                                                          error,
                                                          helperText,
                                                          leftIcon,
                                                          rightIcon,
                                                          showPasswordToggle = false,
                                                          secureTextEntry = false,
                                                          style,
                                                          inputStyle, // <- prop
                                                          testID,
                                                          ...textInputProps
                                                        }, ref) => {
  const { theme } = useTheme();
  const dynamicStyles = createDynamicStyles(theme);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const hasError = Boolean(error);
  const isSecure = secureTextEntry && !isPasswordVisible;

  const containerStyle: ViewStyle[] = [dynamicStyles.inputContainer];

  if (hasError) {
    containerStyle.push(dynamicStyles.error);
  } else if (isFocused) {
    containerStyle.push(dynamicStyles.focused);
  }

  // Renombrar variable local para evitar conflicto
  const combinedInputStyle: TextStyle[] = [dynamicStyles.input];

  if (inputStyle) {
    // Permitir array o objeto
    if (Array.isArray(inputStyle)) {
      combinedInputStyle.push(...inputStyle);
    } else {
      combinedInputStyle.push(inputStyle);
    }
  }

  if (leftIcon) {
    combinedInputStyle.push(dynamicStyles.inputWithLeftIcon);
  }

  if (rightIcon || showPasswordToggle) {
    combinedInputStyle.push(dynamicStyles.inputWithRightIcon);
  }

  const mainContainerStyle: ViewStyle[] = [dynamicStyles.container];
  if (style) {
    mainContainerStyle.push(style);
  }

  return (
    <View style={mainContainerStyle} testID={testID}>
      {label && <Text style={dynamicStyles.label}>{label}</Text>}

      <View style={containerStyle}>
        {leftIcon && <View style={dynamicStyles.leftIcon}>{leftIcon}</View>}

        <TextInput
          ref={ref}
          {...textInputProps}
          style={combinedInputStyle}
          placeholderTextColor={theme.colors.text.secondary}
          onFocus={(e) => {
            setIsFocused(true);
            textInputProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            textInputProps.onBlur?.(e);
          }}
          secureTextEntry={isSecure}
        />

        {showPasswordToggle && (
          <TouchableOpacity
            testID="password-toggle"
            style={dynamicStyles.rightIcon}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <FontAwesome
              name={isPasswordVisible ? 'eye' : 'eye-slash'}
              size={20}
              color={theme.colors.text.secondary}
            />
          </TouchableOpacity>
        )}

        {rightIcon && !showPasswordToggle && (
          <View style={dynamicStyles.rightIcon}>{rightIcon}</View>
        )}
      </View>

      {(error || helperText) && (
        <Text style={[dynamicStyles.helperText, hasError && dynamicStyles.errorText]}>
          {error || helperText}
        </Text>
      )}
    </View>
  );
});

Input.displayName = 'Input';

const createDynamicStyles = (theme: any) => StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    minHeight: 48,
  },
  focused: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  error: {
    borderColor: theme.colors.error,
  },
  input: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.fontSize.md,
    color: theme.colors.text.primary,
    ...(Platform.OS === 'web' && {
      outlineStyle: 'none'
    }),
  } as any,
  inputWithLeftIcon: {
    paddingLeft: 0,
  },
  inputWithRightIcon: {
    paddingRight: 0,
  },
  leftIcon: {
    paddingLeft: theme.spacing.md,
  },
  rightIcon: {
    paddingRight: theme.spacing.md,
    paddingHorizontal: theme.spacing.xs,
  },
  helperText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  errorText: {
    color: theme.colors.error,
  },
});
