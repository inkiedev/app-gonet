import { StyleSheet } from 'react-native';
import { theme } from './theme';

export const globalStyles = StyleSheet.create({
  defaultText: {
    fontFamily: theme.fontFamily.regular,
  },
  mediumText: {
    fontFamily: theme.fontFamily.medium,
  },
  semiBoldText: {
    fontFamily: theme.fontFamily.semiBold,
  },
  boldText: {
    fontFamily: theme.fontFamily.bold,
  },
});