import LogoSvgComponent from "@/assets/images/iconos gonet app svg_GoneetLogo.svg";
import { BaseComponentProps } from "@/types/common";
import React, { JSX } from "react";
import { StyleSheet, View } from "react-native";

interface LoadingPromp extends BaseComponentProps {
  scale?: number;
  variant?: 'default' | 'small' | 'large';
}

export default function LogoLoader(props: LoadingPromp): JSX.Element {
  const scale = props.scale || 1;
  const size = 220 * scale;

  const path = "M60.57,108.15c-19.01,0-36.89-10.15-46.68-26.48-6.89-11.5-8.95-24.3-5.79-36.04,2.91-10.84,10.1-19.9,20.25-25.52,10.36-5.74,28.22-9.45,45.49-9.45,12.45,0,34.71,1.98,43.95,15.22,4.86,6.96,5.79,16.6,2.71,27.87-5.45,19.95-23.13,42.75-38.6,49.81-6.68,3.04-13.85,4.59-21.32,4.59h0Z";
  const pathLength = 450; // Approximate length of the path
  const segment = pathLength * 0.25;

  return (
    <View style={styles.container}>
      <svg width={size} height={size} viewBox="0 0 220 220">
        {/* The logo in the center */}
        <g transform={`translate(43.5, 43.5)`}>
          <LogoSvgComponent width={133} height={133} />
        </g>
        
        <g transform="translate(42, 50)">
          {/* Gray outline */}
          <path
            d={path}
            stroke="#0beaa0ee"
            strokeWidth="4"
            fill="none"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {/* Animated segment */}
          <path
            d={path}
            stroke="#7cf966ff"
            strokeWidth="4"
            fill="none"
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeDasharray={`${segment} ${pathLength - segment}`}
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to={-pathLength}
              dur="2s"
              repeatCount="indefinite"
              decelerate={"in"}
            />
          </path>
        </g>
      </svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
});
