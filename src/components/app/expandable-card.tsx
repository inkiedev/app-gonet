import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import { Card } from '@/components/ui/card';
import { SpeedCircle } from '@/components/app/speed-circle';
import { theme } from '@/styles/theme';
import { BaseComponentProps } from '@/types/common';

interface ExpandableCardProps extends BaseComponentProps {
  plan: string;
  speed: number;
  isExpanded: boolean;
  onToggle: () => void;
}

export const ExpandableCard: React.FC<ExpandableCardProps> = ({
                                                                plan,
                                                                speed,
                                                                isExpanded,
                                                                onToggle,
                                                                style,
                                                                testID,
                                                              }) => {
  const expandAnimation = useSharedValue(0);

  React.useEffect(() => {
    expandAnimation.value = withTiming(isExpanded ? 1 : 0, {
      duration: 400,
    });
  }, [isExpanded]);

  const animatedDetailsStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      expandAnimation.value,
      [0, 0.3, 1],
      [0, 0, 1],
      Extrapolate.CLAMP
    );

    const maxHeight = interpolate(
      expandAnimation.value,
      [0, 1],
      [0, 200],
      Extrapolate.CLAMP
    );

    return {
      opacity,
      maxHeight,
      overflow: 'hidden',
    };
  });

  const animatedArrowStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      expandAnimation.value,
      [0, 1],
      [0, 180],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ rotate: `${rotate}deg` }],
    };
  });

  return (
    <View style={[styles.container, style]} testID={testID}>
      <Card style={styles.card} variant="elevated">
        <Text style={styles.planTitle}>{plan}</Text>

        <SpeedCircle speed={speed} />

        <View style={styles.planFeatures}>
          <Text style={styles.featuresText}>
            Incluye: <AntDesign name="Safety" size={15} color={theme.colors.primaryDark} />{' '}
            <FontAwesome5 name="wifi" size={15} color={theme.colors.primaryDark} />{' '}
            <FontAwesome5 name="dollar-sign" size={15} color={theme.colors.primaryDark} />
          </Text>
        </View>

        <TouchableOpacity onPress={onToggle} style={styles.detailsButton}>
          <Text style={styles.detailsLink}>
            {isExpanded ? 'Ocultar Detalles' : 'Ver Detalles'}
          </Text>
          <Animated.View style={animatedArrowStyle}>
            <AntDesign name="down" size={16} color={theme.colors.primaryDark} />
          </Animated.View>
        </TouchableOpacity>

        <Animated.View style={animatedDetailsStyle}>
          <View style={styles.detailsContainer}>
            <DetailRow
              icon="wifi"
              title="Velocidad de descarga"
              value={`${speed} Mbps`}
            />
            <DetailRow
              icon="upload"
              title="Velocidad de subida"
              value={`${Math.floor(speed / 10)} Mbps`}
            />
            <DetailRow
              icon="shield-check"
              title="Antivirus incluido"
              value="Sí"
            />
            <DetailRow
              icon="users"
              title="Dispositivos conectados"
              value="Ilimitados"
            />
            <DetailRow
              icon="clock"
              title="Soporte técnico"
              value="24/7"
            />
          </View>
        </Animated.View>
      </Card>
    </View>
  );
};

interface DetailRowProps {
  icon: string;
  title: string;
  value: string;
}

const DetailRow: React.FC<DetailRowProps> = ({ icon, title, value }) => (
  <View style={styles.detailRow}>
    <View style={styles.detailLeft}>
      <FontAwesome5 name={icon} size={16} color={theme.colors.primary} />
      <Text style={styles.detailTitle}>{title}</Text>
    </View>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 300,
  },
  card: {
    width: '100%',
    alignItems: 'center',
  },
  planTitle: {
    color: theme.colors.primaryDark,
    fontSize: theme.fontSize.xxl,
    fontStyle: 'italic',
    fontWeight: theme.fontWeight.bold,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  planFeatures: {
    width: '100%',
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
  },
  featuresText: {
    color: theme.colors.primaryDark,
    fontSize: theme.fontSize.md,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  detailsLink: {
    color: theme.colors.primaryDark,
    fontSize: theme.fontSize.sm,
    fontStyle: 'italic',
    textDecorationLine: 'underline',
  },
  detailsContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    flex: 1,
  },
  detailTitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.primary,
    fontWeight: theme.fontWeight.medium,
  },
  detailValue: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primaryDark,
    fontWeight: theme.fontWeight.semibold,
  },
});
