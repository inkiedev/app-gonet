import LogoSvgComponent from "@/assets/images/iconos gonet app svg_GoneetLogo.svg";
import { BaseComponentProps } from "@/types/common";
import React, { JSX, useEffect, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Svg, { G, Path } from "react-native-svg";

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedSvg = Animated.createAnimatedComponent(Svg);

interface LoadingPromp extends BaseComponentProps {
  scale?: number;
  variant?: 'default' | 'small' | 'large';
}

export default function LogoLoaderPhone(props: LoadingPromp): JSX.Element {
  const pathRef = useRef<Path>(null);
  const [pathLength, setPathLength] = useState(0);
  const loadingScale = props.scale || 1;
  const progress = useSharedValue(0); // for the rotating stroke
  const scale = useSharedValue(1); // for the heartbeat

  const segmentRatio = 0.3; // visible percentage of the path

  // Measure path length
  useEffect(() => {
    if (pathRef.current) {
      let length = 397;
      try{
         length = (pathRef.current as any).getTotalLength();
      }catch(e){
         
      }
      
      setPathLength(length);
    }
  }, []);

  // Start stroke animation
  useEffect(() => {
    if (pathLength > 0) {
      progress.value = withRepeat(
        withTiming(4, { duration: 2000, easing: Easing.linear }),
        -1, // Loop indefinitely
        false // Don't reverse
      );
    }
  }, [pathLength]);

  // Start heartbeat animation
  useEffect(() => {
    scale.value = withRepeat(withTiming(1.1, { duration: 500 }), -1, true);
  }, []);

  // Animated props for stroke
  const animatedProps = useAnimatedProps(() => {
    const segLength = pathLength * segmentRatio;
    const gapLength = pathLength * (1 - segmentRatio); // Correct gap length
    return {
      strokeDasharray: [segLength, gapLength],
      strokeDashoffset: pathLength * (1 - progress.value),
    };
  });

  // Animated style for the "heartbeat"
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value * loadingScale }],
    };
  });

  return (
    <AnimatedSvg
      style={[styles.container, animatedStyle]}
      height={220}
      width={220}
      viewBox="0 0 129.02 119.66"
    >
      {/* Base Logo */}
      <G>
        <LogoSvgComponent style={styles.logoSvg} />
      </G>

      {/* Gray outline */}
      <Path
        ref={pathRef}
        x={2}
        y={6.5}
        d="M60.57,108.15c-19.01,0-36.89-10.15-46.68-26.48-6.89-11.5-8.95-24.3-5.79-36.04,2.91-10.84,10.1-19.9,20.25-25.52,10.36-5.74,28.22-9.45,45.49-9.45,12.45,0,34.71,1.98,43.95,15.22,4.86,6.96,5.79,16.6,2.71,27.87-5.45,19.95-23.13,42.75-38.6,49.81-6.68,3.04-13.85,4.59-21.32,4.59h0Z"
        stroke="#0beaa0ee"
        strokeWidth={2}
        fill="transparent"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Animated segment */}
      {pathLength > 0 && (
        <AnimatedPath
          d="M60.57,108.15c-19.01,0-36.89-10.15-46.68-26.48-6.89-11.5-8.95-24.3-5.79-36.04,2.91-10.84,10.1-19.9,20.25-25.52,10.36-5.74,28.22-9.45,45.49-9.45,12.45,0,34.71,1.98,43.95,15.22,4.86,6.96,5.79,16.6,2.71,27.87-5.45,19.95-23.13,42.75-38.6,49.81-6.68,3.04-13.85,4.59-21.32,4.59h0Z"
          x={2}
          y={6.5}
          stroke="#7cf966ff"
          strokeWidth={2}
          fill="transparent"
          strokeLinejoin="round"
          strokeLinecap="round"
          animatedProps={animatedProps}
        />
      )}
    </AnimatedSvg>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
  },
  logoSvg: {
    alignSelf: "center",
    width: 133,
    height: 133,
    paddingBottom: 200,
  },
});