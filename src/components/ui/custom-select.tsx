import { theme } from '@/styles/theme';
import { BaseComponentProps } from '@/types/common';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';

export interface SelectOption<T = any> {
  label: string;
  value: T;
  color?: string;
  disabled?: boolean;
}

interface SelectProps<T = any> extends BaseComponentProps {
  label?: string;
  placeholder?: string;
  options: SelectOption<T>[];
  value?: T;
  onValueChange: (value: T, index: number) => void;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  variant?: 'default' | 'outline' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  renderItem: (option: SelectOption<T>, index: number, isSelected: boolean) => React.ReactNode;
}

export const Select = <T,>({
  label,
  placeholder = 'Seleccionar...',
  options,
  value,
  onValueChange,
  error,
  helperText,
  disabled = false,
  variant = 'default',
  size = 'md',
  leftIcon,
  renderItem,
  style,
  testID,
}: SelectProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const animatedOpacity = useRef(new Animated.Value(0)).current;
  const animatedRotation = useRef(new Animated.Value(0)).current;

  const hasError = Boolean(error);
  const selectedOption = options.find(option => option.value === value);

  const ITEM_HEIGHT = 48;
  const MAX_VISIBLE_ITEMS = 5;

  useEffect(() => {
    if (isOpen) {
      setIsFocused(true);
      Animated.parallel([
        Animated.timing(animatedHeight, {
          toValue: Math.min(options.length, MAX_VISIBLE_ITEMS) * ITEM_HEIGHT,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(animatedOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(animatedRotation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(animatedHeight, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(animatedOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(animatedRotation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (!isOpen) {
          setIsFocused(false);
        }
      });
    }
  }, [isOpen]);

  const containerStyle: ViewStyle[] = [
    styles.selectContainer,
    styles[variant],
    styles[`${size}Container`],
  ];

  if (isFocused) {
    containerStyle.push(styles.focused);
  }

  if (hasError) {
    containerStyle.push(styles.error);
  }

  if (disabled) {
    containerStyle.push(styles.disabled);
  }

  const mainContainerStyle: ViewStyle[] = [styles.container];
  if (style) {
    mainContainerStyle.push(style);
  }

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { fontSize: theme.fontSize.sm, paddingVertical: theme.spacing.xs };
      case 'md':
        return { fontSize: theme.fontSize.md, paddingVertical: theme.spacing.sm };
      case 'lg':
        return { fontSize: theme.fontSize.lg, paddingVertical: theme.spacing.md };
      default:
        return { fontSize: theme.fontSize.md, paddingVertical: theme.spacing.sm };
    }
  };

  const sizeStyles = getSizeStyles();
  const leftPadding = leftIcon ? theme.spacing.xl + theme.spacing.xs : theme.spacing.md;
  const rightPadding = theme.spacing.xl + theme.spacing.sm;

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleOptionSelect = (option: SelectOption<T>, index: number) => {
    onValueChange(option.value, index);
    setIsOpen(false);
  };

  const rotation = animatedRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={mainContainerStyle} testID={testID}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={styles.dropdownContainer}>
        <TouchableOpacity
          style={containerStyle}
          onPress={handleToggle}
          disabled={disabled}
          activeOpacity={0.8}
        >
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
          
          <View style={[styles.inputContainer, { paddingLeft: leftPadding, paddingRight: rightPadding }]}>
            {selectedOption ? (
              renderItem(selectedOption, options.findIndex(opt => opt.value === value), true)
            ) : (
              <Text style={[
                styles.inputText,
                { fontSize: sizeStyles.fontSize },
                styles.placeholderText
              ]}>
                {placeholder}
              </Text>
            )}
          </View>

          <Animated.View style={[styles.iconContainer, { transform: [{ rotate: rotation }] }]}>
            <Ionicons
              name="chevron-down"
              size={size === 'sm' ? 16 : size === 'md' ? 18 : 20}
              color={disabled ? theme.colors.text.secondary : theme.colors.text.primary}
            />
          </Animated.View>
        </TouchableOpacity>

        {isOpen && (
          <Modal transparent visible={isOpen} animationType="none">
            <TouchableWithoutFeedback onPress={() => setIsOpen(false)}>
              <View style={styles.modalOverlay}>
                <TouchableWithoutFeedback>
                  <View style={styles.dropdownWrapper}>
                    <Animated.View
                      style={[
                        styles.dropdown,
                        {
                          height: animatedHeight,
                          opacity: animatedOpacity,
                        },
                      ]}
                    >
                      <ScrollView
                        style={[
                          styles.scrollView,
                          { maxHeight: MAX_VISIBLE_ITEMS * ITEM_HEIGHT }
                        ]}
                        showsVerticalScrollIndicator={false}
                        bounces={false}
                      >
                        {options.map((option, index) => {
                          const isSelected = option.value === value;
                          return (
                            <TouchableOpacity
                              key={index}
                              style={[
                                styles.option,
                                option.disabled && styles.optionDisabled,
                                isSelected && styles.selectedOption,
                              ]}
                              onPress={() => handleOptionSelect(option, index)}
                              disabled={option.disabled}
                            >
                              {renderItem(option, index, isSelected)}
                            </TouchableOpacity>
                          );
                        })}
                      </ScrollView>
                    </Animated.View>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        )}
      </View>

      {(error || helperText) && (
        <Text style={[styles.helperText, hasError && styles.errorText]}>
          {error || helperText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
  },
  label: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  dropdownContainer: {
    position: 'relative',
    zIndex: 1000,
  },
  selectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    position: 'relative',
  },
  // Variants
  default: {
    borderColor: theme.colors.border.light,
  },
  outline: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  filled: {
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.border.light,
  },
  // States
  focused: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  error: {
    borderColor: theme.colors.error,
  },
  disabled: {
    opacity: 0.5,
    backgroundColor: theme.colors.border.light,
  },
  // Sizes
  smContainer: {
    minHeight: 36,
  },
  mdContainer: {
    minHeight: 48,
  },
  lgContainer: {
    minHeight: 56,
  },
  inputContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  inputText: {
    color: theme.colors.text.primary,
    fontSize: theme.fontSize.md,
  },
  placeholderText: {
    color: theme.colors.text.secondary,
  },
  leftIcon: {
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.xs,
  },
  iconContainer: {
    position: 'absolute',
    right: theme.spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownWrapper: {
    width: '90%',
    maxWidth: 400,
  },
  dropdown: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    minHeight: 48,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  selectedOption: {
    backgroundColor: theme.colors.primary + '10',
  },
  optionDisabled: {
    opacity: 0.5,
  },
  optionText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text.primary,
    flex: 1,
  },
  selectedOptionText: {
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.medium,
  },
  optionTextDisabled: {
    color: theme.colors.text.secondary,
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