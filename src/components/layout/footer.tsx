import Facebook from '@/assets/images/iconos gonet app svg_face.svg';
import Instagram from '@/assets/images/iconos gonet app svg_instagram.svg';
import Location from '@/assets/images/iconos gonet app svg_ubicacion.svg';
import Web from '@/assets/images/iconos gonet app svg_web.svg';
import Whatsapp from '@/assets/images/iconos gonet app svg_wpp.svg';
import { theme } from '@/styles/theme';
import { BaseComponentProps } from '@/types/common';
import { useCardExpansion } from '@/contexts/CardExpansionContext';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const SVG_SIZE = 26

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
    icon: <Facebook width={SVG_SIZE} height={SVG_SIZE} fill={theme.colors.text.inverse}/>,
    url: 'https://www.facebook.com',
    name: 'Facebook',
  },
  {
    icon: <Instagram width={SVG_SIZE} height={SVG_SIZE} fill={theme.colors.text.inverse} />,
    url: 'https://www.instagram.com',
    name: 'Instagram',
  },
  {
    icon: <Web width={SVG_SIZE} height={SVG_SIZE} fill={theme.colors.text.inverse} />,
    url: 'https://www.gonet.com',
    name: 'Website',
  },
  {
    icon: <Whatsapp width={SVG_SIZE} height={SVG_SIZE} fill={theme.colors.text.inverse} />,
    url: 'https://www.whatsapp.com',
    name: 'WhatsApp',
  },
  {
    icon: <Location width={SVG_SIZE} height={SVG_SIZE} fill={theme.colors.text.inverse} />,
    url: 'https://www.google.com',
    name: 'Location',
  },
];

export const Footer: React.FC<FooterProps> = ({
                                                version = 'Ver 2.00.00.01',
                                                style,
                                                testID,
                                              }) => {
  const { showFooter } = useCardExpansion();

  if (!showFooter) {
    return null;
  }

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
        colors={['#919191','#919191', '#b3b3b3']}
        locations={[0, 0.1, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
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
                {item.icon}
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
    height: 80,
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
    gap: theme.spacing.md + theme.spacing.xs,
    paddingHorizontal: theme.spacing.lg,
    flexWrap: 'wrap',
  },
  socialCard: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius.md,
  },
  versionText: {
    color: theme.colors.text.inverse,
    fontSize: theme.fontSize.xs,
    marginTop: theme.spacing.xs,
    fontWeight: theme.fontWeight.medium,
  },
});
