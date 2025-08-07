import type { PropsWithChildren } from 'react';
import { Image, ScrollView, StyleSheet } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { useBottomTabOverflow } from '@/components/ui/TabBarBackground';
import { useColorScheme } from '@/hooks/useColorScheme';

const HEADER_HEIGHT = 400;

type Props = PropsWithChildren<{
  headerBackgroundColor: { dark: string; light: string };
}>;

export default function SimpleScrollView({
  children,
  headerBackgroundColor,
}: Props) {
  const colorScheme = useColorScheme() ?? 'light';
  const bottomInset = useBottomTabOverflow();

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        scrollIndicatorInsets={{ bottom: bottomInset }}
        contentContainerStyle={{ paddingBottom: bottomInset }}
      >
        <ThemedView
          style={[
            styles.header,
            { backgroundColor: headerBackgroundColor[colorScheme] },
          ]}
        >
          <Image
            source={require('@/assets/images/gonetPublicidad2.jpg')}
            style={styles.headerImage}
          />
        </ThemedView>

        <ThemedView style={styles.content}>{children}</ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: '100%',
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  content: {
    paddingTop: 50,
    paddingHorizontal: 32,
  },
});
