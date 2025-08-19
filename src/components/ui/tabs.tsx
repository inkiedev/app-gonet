import { theme } from "@/styles/theme";
import React, { ReactNode, useCallback, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

export interface Tab {
  id: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: Tab[];
  initialTabId?: string;
  onTabChange?: (tabId: string, index: number) => void;
  
  // Layout options
  variant?: 'default' | 'minimal' | 'bordered';
  tabsScrollable?: boolean;
  contentScrollable?: boolean;
  
  // Style customization
  containerStyle?: ViewStyle;
  tabBarStyle?: ViewStyle;
  tabStyle?: ViewStyle;
  activeTabStyle?: ViewStyle;
  disabledTabStyle?: ViewStyle;
  tabTextStyle?: TextStyle;
  activeTabTextStyle?: TextStyle;
  disabledTabTextStyle?: TextStyle;
  contentContainerStyle?: ViewStyle;
  
  // Accessibility
  testID?: string;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  initialTabId,
  onTabChange,
  variant = 'default',
  tabsScrollable = false,
  contentScrollable = false,
  containerStyle,
  tabBarStyle,
  tabStyle,
  activeTabStyle,
  disabledTabStyle,
  tabTextStyle,
  activeTabTextStyle,
  disabledTabTextStyle,
  contentContainerStyle,
  testID,
}) => {
  // State
  const [activeTabId, setActiveTabId] = useState<string>(() => {
    if (!tabs || tabs.length === 0) {
      return '';
    }
    if (initialTabId && tabs.some(tab => tab.id === initialTabId)) {
      return initialTabId;
    }
    return tabs[0]?.id || '';
  });

  // Handlers
  const handleTabPress = useCallback((tab: Tab, index: number) => {
    if (tab.disabled || tab.id === activeTabId) return;
    
    setActiveTabId(tab.id);
    onTabChange?.(tab.id, index);
  }, [activeTabId, onTabChange]);

  // Render tab button
  const renderTab = useCallback((tab: Tab, index: number) => {
    const isActive = tab.id === activeTabId;
    const isDisabled = tab.disabled;

    return (
      <Pressable
        key={tab.id}
        onPress={() => handleTabPress(tab, index)}
        disabled={isDisabled}
        style={({ pressed }) => [
          styles.tab,
          tabsScrollable ? styles.scrollableTab : styles.fixedTab,
          getTabVariantStyle(variant),
          tabStyle,
          isActive && [styles.activeTab, getActiveTabVariantStyle(variant), activeTabStyle],
          isDisabled && [styles.disabledTab, disabledTabStyle],
          pressed && !isDisabled && styles.pressedTab,
        ]}
        accessibilityRole="tab"
        accessibilityState={{ selected: isActive, disabled: isDisabled }}
        accessibilityLabel={`${tab.label} tab`}
        testID={`${testID}-tab-${tab.id}`}
      >
        <Text
          style={[
            styles.tabText,
            getTabTextVariantStyle(variant),
            tabTextStyle,
            isActive && [styles.activeTabText, getActiveTabTextVariantStyle(variant), activeTabTextStyle],
            isDisabled && [styles.disabledTabText, disabledTabTextStyle],
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {tab.label}
        </Text>
      </Pressable>
    );
  }, [activeTabId, variant, tabsScrollable, tabStyle, activeTabStyle, disabledTabStyle, tabTextStyle, activeTabTextStyle, disabledTabTextStyle, testID, handleTabPress]);

  // Validation
  if (!tabs || tabs.length === 0) {
    console.warn("[Tabs] No tabs provided");
    return null;
  }

  // Get active tab content
  const activeTab = tabs.find(tab => tab.id === activeTabId);

  // Render tab bar
  const renderTabBar = () => {
    const tabBarContent = (
      <View style={[styles.tabBar, getTabBarVariantStyle(variant), tabBarStyle]}>
        {tabs.map(renderTab)}
      </View>
    );

    if (tabsScrollable) {
      return (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.scrollableTabBarContent, { flexGrow: 1 }]}
          style={styles.scrollableTabBar}
        >
          {tabBarContent}
        </ScrollView>
      );
    }

    return tabBarContent;
  };

  // Render content
  const renderContent = () => {
    if (!activeTab) return null;

    const content = (
      <View style={[styles.content, getContentVariantStyle(variant), contentContainerStyle]}>
        {activeTab.content}
      </View>
    );

    if (contentScrollable) {
      return (
        <ScrollView 
          style={styles.scrollableContent}
          showsVerticalScrollIndicator={false}
          testID={`${testID}-content-scroll`}
        >
          {content}
        </ScrollView>
      );
    }

    return content;
  };

  return (
    <View 
      style={[styles.container, getContainerVariantStyle(variant), containerStyle]}
      testID={testID}
    >
      {renderTabBar()}
      {renderContent()}
    </View>
  );
};

// Variant style helpers
const getContainerVariantStyle = (variant: string): ViewStyle => {
  switch (variant) {
    case 'minimal':
      return {};
    case 'bordered':
      return {
        borderWidth: 1,
        borderColor: theme.colors.border.light,
        borderRadius: theme.borderRadius.md,
      };
    default:
      return {};
  }
};

const getTabBarVariantStyle = (variant: string): ViewStyle => {
  switch (variant) {
    case 'minimal':
      return {
        backgroundColor: 'transparent',
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border.light,
      };
    case 'bordered':
      return {
        backgroundColor: theme.colors.background,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border.light,
      };
    default:
      return {
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius.lg,
      };
  }
};

const getTabVariantStyle = (variant: string): ViewStyle => {
  switch (variant) {
    case 'minimal':
      return {
        backgroundColor: 'transparent',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
        borderRadius: 0,
      };
    case 'bordered':
      return {
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border.light,
      };
    default:
      return {
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border.light,
      };
  }
};

const getActiveTabVariantStyle = (variant: string): ViewStyle => {
  switch (variant) {
    case 'minimal':
      return {
        borderBottomColor: theme.colors.primary,
      };
    case 'bordered':
      return {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
      };
    default:
      return {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
      };
  }
};

const getTabTextVariantStyle = (variant: string): TextStyle => {
  switch (variant) {
    case 'minimal':
      return {
        color: theme.colors.text.secondary,
      };
    default:
      return {
        color: theme.colors.text.primary,
      };
  }
};

const getActiveTabTextVariantStyle = (variant: string): TextStyle => {
  switch (variant) {
    case 'minimal':
      return {
        color: theme.colors.primary,
        fontWeight: theme.fontWeight.semibold,
      };
    default:
      return {
        color: theme.colors.text.contrast,
      };
  }
};

const getContentVariantStyle = (variant: string): ViewStyle => {
  switch (variant) {
    case 'minimal':
      return {
        backgroundColor: 'transparent',
      };
    case 'bordered':
      return {
        backgroundColor: theme.colors.surface,
      };
    default:
      return {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.border.light,
      };
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  
  // Tab Bar
  tabBar: {
    flexDirection: 'row',
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.xs,
    width: '100%',
  },
  scrollableTabBar: {
    width: '100%',
  },
  scrollableTabBarContent: {
    paddingHorizontal: theme.spacing.xs,
  },
  
  // Tabs
  tab: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 44, // Accessibility minimum touch target
    ...theme.shadows.sm,
  },
  fixedTab: {
    flex: 1,
  },
  scrollableTab: {
    flex: 1,
    flexShrink: 0,
  },
  activeTab: {
    // Variant-specific styles applied via functions
  },
  disabledTab: {
    opacity: 0.5,
    backgroundColor: theme.colors.border.light,
  },
  pressedTab: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  
  // Tab Text
  tabText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    textAlign: 'center',
  },
  activeTabText: {
    fontWeight: theme.fontWeight.semibold,
  },
  disabledTabText: {
    color: theme.colors.text.disabled,
  },
  
  // Content
  content: {
    flex: 1,
    marginTop: theme.spacing.sm,
    padding: theme.spacing.md,
  },
  scrollableContent: {
    flex: 1,
    marginTop: theme.spacing.sm,
  },
});

export default Tabs;