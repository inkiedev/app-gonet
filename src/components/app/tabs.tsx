import { theme } from "@/styles/theme";
import React, { ReactNode, useMemo, useState } from "react";
import {
    LayoutChangeEvent,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextStyle,
    View,
    ViewStyle,
} from "react-native";

export interface TabsProps {
  tabNames: string[];
  tabContents: ReactNode[];
  initialIndex?: number;
  onChange?(index: number, name: string): void;
  scrollable?: boolean;
  containerStyle?: ViewStyle;
  tabsWrapperStyle?: ViewStyle;
  tabStyle?: ViewStyle;
  activeTabStyle?: ViewStyle;
  tabTextStyle?: TextStyle;
  activeTabTextStyle?: TextStyle;
  contentContainerStyle?: ViewStyle;
}

const Tabs: React.FC<TabsProps> = ({
  tabNames,
  tabContents,
  initialIndex = 0,
  onChange,
  scrollable = false,
  containerStyle,
  tabsWrapperStyle,
  tabStyle,
  activeTabStyle,
  tabTextStyle,
  activeTabTextStyle,
  contentContainerStyle,
}) => {
  if (tabNames.length !== tabContents.length) {
    console.warn("[Tabs] 'tabNames' y 'tabContents' deben tener la misma longitud.");
  }

  const safeInitial = useMemo(
    () => Math.min(Math.max(initialIndex, 0), Math.max(tabNames.length - 1, 0)),
    [initialIndex, tabNames.length]
  );

  const [selectedIndex, setSelectedIndex] = useState<number>(safeInitial);
  const [maxTabHeight, setMaxTabHeight] = useState<number>(0);

  const handleSelect = (idx: number) => {
    setSelectedIndex(idx);
    onChange?.(idx, tabNames[idx]);
  };

  const handleLayout = (e: LayoutChangeEvent) => {
    const { height } = e.nativeEvent.layout;
    if (height > maxTabHeight) {
      setMaxTabHeight(height);
    }
  };

  const Header = (
    <View style={[styles.headerContainer, tabsWrapperStyle]}>
      {tabNames.map((name, idx) => {
        const selected = selectedIndex === idx;
        return (
          <Pressable
            key={`${name}-${idx}`}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            onPress={() => handleSelect(idx)}
            android_ripple={{ foreground: true }}
            onLayout={!scrollable ? handleLayout : undefined}
            style={({ pressed }) => [
              styles.tabBase,
              scrollable ? { flexShrink: 0, minWidth: 80, maxWidth: 200 } : { flex: 1 },
              selected ? styles.tabActive : styles.tabInactive,
              pressed && { transform: [{ scale: 0.98 }] },
              tabStyle,
              selected && activeTabStyle,
              !scrollable && maxTabHeight ? { height: maxTabHeight } : {},
            ]}
            hitSlop={10}
          >
            <Text
              style={[
                styles.tabTextBase,
                selected ? styles.tabTextActive : styles.tabTextInactive,
                tabTextStyle,
                selected && activeTabTextStyle,
              ]}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );

  return (
    <View style={[styles.container, containerStyle]}>
      {scrollable ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollHeaderContent}
        >
          {Header}
        </ScrollView>
      ) : (
        Header
      )}
      <View style={[styles.contentContainer, contentContainerStyle]}>
        {tabContents[selectedIndex]}
      </View>
    </View>
  );
};

export default Tabs;

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.xs,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
  },
  scrollHeaderContent: {
    paddingHorizontal: theme.spacing.xs,
  },
  tabBase: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    ...theme.shadows.sm,
  },
  tabInactive: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  tabActive: {
    backgroundColor: theme.colors.primary,
    borderWidth: 0,
  },
  tabTextBase: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    textAlign: "center",
  },
  tabTextInactive: {
    color: theme.colors.text.primary,
  },
  tabTextActive: {
    color: theme.colors.text.inverse,
  },
  contentContainer: {
    marginTop: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
});
