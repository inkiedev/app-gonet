import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome, Foundation } from '@expo/vector-icons';
import { Card } from '@/components/ui/card';
import { theme } from '@/styles/theme';
import { BaseComponentProps } from '@/types/common';

interface SocialMediaItem {
  icon: React.ReactNode;
  url: string;
  name: string;
}

interface FooterProps extends BaseComponentProps {
  version?: string;
}

const socialMediaItems: SocialMediaItem[] = [
  {
    icon: <FontAwesome name="facebook" size={20} color={theme.colors.text.primary} />,
    url: 'https://www.facebook.com',
    name: 'Facebook',
  },
  {
    icon: <FontAwesome name="twitter" size={20} color={theme.colors.text.primary} />,
    url: 'https://www.twitter.com',
    name: 'Twitter',
  },
  {
    icon: <Foundation name="web" size={20} color={theme.colors.text.primary} />,
    url: 'https://www.gonet.com',
    name: 'Website',
  },
  {
    icon: <FontAwesome name="instagram" size={20} color={theme.colors.text.primary} />,
    url: 'https://www.instagram.com',
    name: 'Instagram',
  },
  {
    icon: <FontAwesome name="linkedin" size={20} color={theme.colors.text.primary} />,
    url: 'https://www.linkedin.com',
    name: 'LinkedIn',
  },
];

export const Footer: React.FC<FooterProps> = ({
                                                version = 'Ver 2.00.00.01',
                                                style,
                                                testID,
                                              }) => {
  const handleSocialPress = async (url: string, name: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        console.warn(`Cannot open URL: ${url}`);
      }
    } catch (error) {
      console.error(`Error opening ${name}:`, error);
    }
  };

  return (
    <View style={[styles.container, style]} testID={testID}>
      <LinearGradient
        colors={['#00543b', '#00d280', '#006a54']}
        locations={[0, 0.5, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.socialContainer}>
            {socialMediaItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleSocialPress(item.url, item.name)}
                activeOpacity={0.7}
                accessibilityLabel={`Open ${item.name}`}
                accessibilityRole="button"
              >
                <Card
                  style={styles.socialCard}
                  variant="elevated"
                  padding="xs"
                >
                  {item.icon}
                </Card>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.versionText}>{version}</Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 150,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    flexWrap: 'wrap',
  },
  socialCard: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  versionText: {
    color: theme.colors.text.inverse,
    fontSize: theme.fontSize.xs,
    marginTop: theme.spacing.lg,
    fontWeight: theme.fontWeight.medium,
  },
});
