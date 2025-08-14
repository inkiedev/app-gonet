import { theme } from '@/styles/theme';
import { BaseComponentProps } from '@/types/common';
import { FontAwesome } from '@expo/vector-icons';
import React, { forwardRef, useState } from 'react';
import {
  StyleSheet,
  Text,
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
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const hasError = Boolean(error);
  const isSecure = secureTextEntry && !isPasswordVisible;

  const containerStyle: ViewStyle[] = [styles.inputContainer];

  if (isFocused) {
    containerStyle.push(styles.focused);
  }

  if (hasError) {
    containerStyle.push(styles.error);
  }

  // Renombrar variable local para evitar conflicto
  const combinedInputStyle: TextStyle[] = [styles.input];

  if (inputStyle) {
    // Permitir array o objeto
    if (Array.isArray(inputStyle)) {
      combinedInputStyle.push(...inputStyle);
    } else {
      combinedInputStyle.push(inputStyle);
    }
  }

  if (leftIcon) {
    combinedInputStyle.push(styles.inputWithLeftIcon);
  }

  if (rightIcon || showPasswordToggle) {
    combinedInputStyle.push(styles.inputWithRightIcon);
  }

  const mainContainerStyle: ViewStyle[] = [styles.container];
  if (style) {
    mainContainerStyle.push(style);
  }

  return (
    <View style={mainContainerStyle} testID={testID}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={containerStyle}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

        <TextInput
          ref={ref}
          style={combinedInputStyle}
          placeholderTextColor={theme.colors.text.secondary}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={isSecure}
          {...textInputProps}
        />

        {showPasswordToggle && (
          <TouchableOpacity
            style={styles.rightIcon}
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
          <View style={styles.rightIcon}>{rightIcon}</View>
        )}
      </View>

      {(error || helperText) && (
        <Text style={[styles.helperText, hasError && styles.errorText]}>
          {error || helperText}
        </Text>
      )}
    </View>
  );
});

Input.displayName = 'Input';

const styles = StyleSheet.create({
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
  },
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
