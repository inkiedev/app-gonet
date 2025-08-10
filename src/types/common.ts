import { ViewStyle, TextStyle } from 'react-native';

export interface BaseComponentProps {
  style?: ViewStyle;
  testID?: string;
}

export interface BaseTextProps {
  style?: TextStyle;
  testID?: string;
}

export type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type Size = 'sm' | 'md' | 'lg';
export type ColorScheme = 'light' | 'dark';
