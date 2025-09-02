import Facebook from '@/assets/images/iconos gonet app svg_face.svg';
import Instagram from '@/assets/images/iconos gonet app svg_instagram.svg';
import Location from '@/assets/images/iconos gonet app svg_ubicacion.svg';
import Web from '@/assets/images/iconos gonet app svg_web.svg';
import Whatsapp from '@/assets/images/iconos gonet app svg_wpp.svg';
import Text from '@/components/ui/custom-text';
import { useCardExpansion } from '@/contexts/card-expansion-container';
import { useTheme } from '@/contexts/theme-context';
import { BaseComponentProps } from '@/types/common';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Linking, StyleSheet, TouchableOpacity, View } from 'react-native';

const SVG_SIZE = 26

interface SocialMediaItem {
  icon: React.ReactNode;
  url: string;
  name: string;
}

interface FooterProps extends BaseComponentProps {
  version?: string;
}

export const Footer: React.FC<FooterProps> = ({
                                                version = 'Ver 2.00.00.01',
                                                style,
                                                testID,
                                              }) => {
  const { theme, isDark} = useTheme();
  const dynamicStyles = createDynamicStyles(theme, isDark);
  const { showFooter } = useCardExpansion();
  
  const iconColor = isDark ? '#f0f0f0' : theme.colors.text.inverse;
  
  const socialMediaItems: SocialMediaItem[] = [
    {
      icon: <Facebook width={SVG_SIZE} height={SVG_SIZE} fill={iconColor}/>,
      url: 'https://www.facebook.com',
      name: 'Facebook',
    },
    {
      icon: <Instagram width={SVG_SIZE} height={SVG_SIZE} fill={iconColor} />,
      url: 'https://www.instagram.com',
      name: 'Instagram',
    },
    {
      icon: <Web width={SVG_SIZE} height={SVG_SIZE} fill={iconColor} />,
      url: 'https://www.gonet.com',
      name: 'Website',
    },
    {
      icon: <Whatsapp width={SVG_SIZE} height={SVG_SIZE} fill={iconColor} />,
      url: 'https://www.whatsapp.com',
      name: 'WhatsApp',
    },
    {
      icon: <Location width={SVG_SIZE} height={SVG_SIZE} fill={iconColor} />,
      url: 'https://www.google.com',
      name: 'Location',
    },
  ];

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
    <View style={[dynamicStyles.container, style]} testID={testID}>
      <LinearGradient
        colors={isDark ? ['#2c2c2e', '#3a3a3c', '#1c1c1e'] : ['#919191','#919191', '#b3b3b3']}
        locations={[0, 0.1, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={dynamicStyles.gradient}
      >
        <View style={dynamicStyles.content}>
          <View style={dynamicStyles.socialContainer}>
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

          <Text style={dynamicStyles.versionText}>{version}</Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const createDynamicStyles = (theme: any, isDark: boolean) => StyleSheet.create({
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
    color: isDark ? '#f0f0f0' : theme.colors.text.inverse,
    fontSize: theme.fontSize.xs * 0.6,
    marginTop: theme.spacing.xs,
    fontWeight: theme.fontWeight.medium,
  },
});