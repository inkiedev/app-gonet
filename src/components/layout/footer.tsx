import Facebook from '@/assets/images/iconos gonet app svg_face.svg';
import Instagram from '@/assets/images/iconos gonet app svg_instagram.svg';
import Location from '@/assets/images/iconos gonet app svg_ubicacion.svg';
import Web from '@/assets/images/iconos gonet app svg_web.svg';
import Whatsapp from '@/assets/images/iconos gonet app svg_wpp.svg';
import { useCardExpansion } from '@/contexts/card-expansion-container';
import { useTheme } from '@/contexts/theme-context';
import { BaseComponentProps } from '@/types/common';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Linking, StyleSheet, TouchableOpacity, View } from 'react-native';

const SVG_SIZE = 26;

interface SocialMediaItem {
  icon: React.ReactNode;
  url: string;
  name: string;
}

interface FooterProps extends BaseComponentProps {
  version?: string;
  variant?: 'default' | 'transparent'; 
}

export const Footer: React.FC<FooterProps> = ({
  style,
  testID,
  variant = 'default', 
}) => {
  const { theme, isDark } = useTheme();
  const dynamicStyles = createDynamicStyles(theme, isDark);
  const { showFooter } = useCardExpansion();

  const iconColor = isDark ? '#f0f0f0' : theme.colors.text.inverse;

  const socialMediaItems: SocialMediaItem[] = [
    {
      icon: <Facebook width={SVG_SIZE} height={SVG_SIZE} fill={iconColor} />,
      url: 'https://www.facebook.com/gonet.ec',
      name: 'Facebook',
    },
    {
      icon: <Instagram width={SVG_SIZE} height={SVG_SIZE} fill={iconColor} />,
      url: 'https://www.instagram.com/gonet.ec',
      name: 'Instagram',
    },
    {
      icon: <Web width={SVG_SIZE} height={SVG_SIZE} fill={iconColor} />,
      url: 'https://www.gonet.ec',
      name: 'Website',
    },
    {
      icon: <Whatsapp width={SVG_SIZE} height={SVG_SIZE} fill={iconColor} />,
      url: 'https://wa.me/593962925555',
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

  const Content = (
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
    </View>
  );

  return (
    <View style={[dynamicStyles.container, style]} testID={testID}>
      {variant === 'transparent' ? (
        <View style={dynamicStyles.gradient}>{Content}</View>
      ) : (
        <LinearGradient
          colors={
            isDark
              ? ['#2c2c2e', '#3a3a3c', '#1c1c1e']
              : ['#919191', '#919191', '#b3b3b3']
          }
          locations={[0, 0.1, 1]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={dynamicStyles.gradient}
        >
          {Content}
        </LinearGradient>
      )}
    </View>
  );
};

const createDynamicStyles = (theme: any, isDark: boolean) =>
  StyleSheet.create({
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
    versionText: {
      color: isDark ? '#f0f0f0' : theme.colors.text.inverse,
      fontSize: theme.fontSize.xs * 0.6,
      marginTop: theme.spacing.xs,
      fontWeight: theme.fontWeight.medium,
    },
  });
