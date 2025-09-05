
import { useTheme } from "@/contexts/theme-context";
import React, { useRef } from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  View,
} from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const BOTTOM_SHEET_MAX_HEIGHT = SCREEN_HEIGHT * 0.8;
export const BOTTOM_SHEET_MIN_HEIGHT = SCREEN_HEIGHT * 0.15;

export const BottomSheet = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme();
  const animatedValue = useRef(
    new Animated.Value(BOTTOM_SHEET_MIN_HEIGHT)
  ).current;
  const lastY = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        lastY.current = animatedValue._value;
      },
      onPanResponderMove: (_, gestureState) => {
        const newHeight = lastY.current - gestureState.dy;
        if (
          newHeight >= BOTTOM_SHEET_MIN_HEIGHT &&
          newHeight <= BOTTOM_SHEET_MAX_HEIGHT
        ) {
          animatedValue.setValue(newHeight);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const isTap =
          Math.abs(gestureState.dx) < 5 && Math.abs(gestureState.dy) < 5;

        if (isTap) {
          if (animatedValue._value < BOTTOM_SHEET_MAX_HEIGHT * 0.5) {
            springAnimation("up");
          } else {
            springAnimation("down");
          }
          return;
        }

        const newHeight = lastY.current - gestureState.dy;
        if (gestureState.vy < -0.5) {
          // Swipe up
          springAnimation("up");
        } else if (gestureState.vy > 0.5) {
          // Swipe down
          springAnimation("down");
        } else {
          // Snap based on position
          if (newHeight > BOTTOM_SHEET_MAX_HEIGHT * 0.5) {
            springAnimation("up");
          } else {
            springAnimation("down");
          }
        }
      },
    })
  ).current;

  const springAnimation = (direction: "up" | "down") => {
    const toValue =
      direction === "up"
        ? BOTTOM_SHEET_MAX_HEIGHT
        : BOTTOM_SHEET_MIN_HEIGHT;
    Animated.spring(animatedValue, {
      toValue,
      useNativeDriver: false,
    }).start();
  };

  const animatedStyle = {
    height: animatedValue,
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
        animatedStyle,
      ]}
    >
      <View style={styles.draggerContainer} {...panResponder.panHandlers}>
        <View
          style={[styles.dragger, { backgroundColor: theme.colors.primary }]}
        />
      </View>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: "hidden",
  },
  draggerContainer: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 20,
    cursor: "grab",
  },
  dragger: {
    width: 50,
    height: 5,
    borderRadius: 3,
  },
});
