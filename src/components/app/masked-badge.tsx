import React, { ReactNode } from 'react';
import { View, ViewStyle } from 'react-native';
import { Circle, G, Mask, Rect, Svg } from 'react-native-svg';

export interface MaskedBadgeProps {
  size?: number;
  backgroundColor?: string;
  style?: ViewStyle;
  children?: ReactNode;
  iconSize?: number;
}

const MaskedBadge: React.FC<MaskedBadgeProps> = ({ 
  size = 60, 
  backgroundColor = 'red',
  style,
  children,
  iconSize = 30
}) => {
  const maskId = `mask-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size}>
        {/* Definimos la máscara */}
        <Mask id={maskId} x="0" y="0" width={size} height={size}>
          {/* Círculo base con margen para evitar cortes */}
          <Circle cx={size / 2} cy={size / 2} r={(size / 2) - 1} fill="white" />
          
          {/* Centramos el children en el círculo */}
          <G fill="black" transform={`translate(${(size - iconSize) / 2}, ${(size - iconSize) / 2})`}>
            {children}
          </G>
        </Mask>

        {/* Fondo recortado por la máscara */}
        <Rect width={size} height={size} fill={backgroundColor} mask={`url(#${maskId})`} />
      </Svg>
    </View>
  );
};

export default MaskedBadge;
