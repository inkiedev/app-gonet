import React from 'react';
import { Text as RNText, TextProps } from 'react-native';

interface CustomTextProps extends TextProps {
  children?: React.ReactNode;
}

export const Text: React.FC<CustomTextProps> = ({ style, children, ...props }) => {
  return (
    <RNText 
      style={[
        { fontFamily: 'Montserrat_400Regular' }, 
        style
      ]} 
      {...props}
    >
      {children}
    </RNText>
  );
};