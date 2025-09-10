import { StyleProp, TextStyle, ViewStyle } from 'react-native';

export interface BaseComponentProps {
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export interface BaseTextProps {
  style?: StyleProp<TextStyle>;
  testID?: string;
}

export type Variant = 'primary' | 'secondary' | 'outline' | 'ghost'|'pressed';
export type Size = 'sm' | 'md' | 'lg';
export type ColorScheme = 'light' | 'dark';
