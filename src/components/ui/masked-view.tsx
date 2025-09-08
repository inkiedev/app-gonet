import React, { ReactNode } from 'react';
import { View, ViewStyle } from 'react-native';
import Svg, { Defs, Mask, Rect, G } from 'react-native-svg';

export interface MaskedViewProps {
  style?: ViewStyle;
  maskElement: ReactNode;
  children: ReactNode;
}

const MaskedView: React.FC<MaskedViewProps> = ({
  style,
  maskElement,
  children
}) => {
  const maskId = `mask-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <View style={style}>
      <Svg style={{ position: 'absolute', width: '100%', height: '100%' }}>
        <Defs>
          <Mask id={maskId}>
            <Rect width="100%" height="100%" fill="white" />
            <G fill="black">
              {maskElement}
            </G>
          </Mask>
        </Defs>
        <G mask={`url(#${maskId})`}>
          {children}
        </G>
      </Svg>
    </View>
  );
};

export default MaskedView;