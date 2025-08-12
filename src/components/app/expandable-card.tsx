import { SpeedCircle } from '@/components/app/speed-circle';
import { Card } from '@/components/ui/card';
import { theme } from '@/styles/theme';
import { BaseComponentProps } from '@/types/common';
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Badge from './badge';

const features = [
  {
    icon: 'Safety',
    title: 'Lite Tv Streaming',
    detail: '5 meses',
    value: '1 pantalla',
    canUpgrade: true
  },
  {
    icon: 'wifi',
    title: 'Wifi Total',
    detail: '2 Routers',
    value: 'Wifi6',
    canUpgrade: true
  },
  {
    icon: 'upload',
    title: 'Precio Promocional',
    detail: '$ 19.90',
    value: 'x 8 Pagos',
    canUpgrade: false
  },
];

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
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    const maxHeight = interpolate(
      expandAnimation.value,
      [0, 1],
      [0, 200],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
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
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    return {
      transform: [{ rotate: `${rotate}deg` }],
    };
  });

  return (
    <View style={[styles.container, style]} testID={testID}>
      <Card style={styles.card} variant="elevated">
        <Text style={styles.planTitle}>{plan}</Text>

        <View style={styles.speedContainer}>
          <SpeedCircle speed={speed} />
          <View style={styles.speedShadow}></View>
        </View>

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
            {features.map((feature, index) => (
              <DetailRow
                key={index}
                icon={feature.icon}
                title={feature.title}
                detail={feature.detail}
                value={feature.value}
                canUpgrade={feature.canUpgrade}
              />
            ))}
            <View style={styles.addServiceContainer}>
              <Badge count={"+"} />
              <Text style={styles.addServiceText}>Agrega mas servicios</Text>
            </View>
          </View>
        </Animated.View>
      </Card>
    </View>
  );
};

interface DetailRowProps {
  icon: string;
  title: string;
  detail: string;
  value: string;
  canUpgrade?: boolean;
}

const DetailRow: React.FC<DetailRowProps> = ({ icon, title, detail, value, canUpgrade }) => (
  <View style={styles.detailRow}>
    <FontAwesome5 name={icon} size={16} color={theme.colors.primary} />
    <Text style={styles.detailTitle}>{title}</Text>
    <Text style={styles.detailDetail}>{detail}</Text>
    <Text style={styles.detailValue}>{value}</Text>
    { canUpgrade ? <Badge count={"+"} /> : <Text> </Text> }
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
    borderRadius: theme.borderRadius.full,
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
  detailRow: {
    width: '100%',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.medium,
  },
  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  detailTitle: {
    fontSize: theme.fontSize.xs,
    maxWidth: theme.spacing.xxl * 2,
    textAlign: 'center',
    color: theme.colors.text.primary,
    fontWeight: theme.fontWeight.medium,
  },
  detailsContainer: {
    width: '100%',
  },
  detailDetail: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.primaryDark,
    fontWeight: theme.fontWeight.semibold,
  },
  detailValue: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.primaryDark,
    fontWeight: theme.fontWeight.semibold,
  },
  addServiceText: {
    paddingVertical: theme.spacing.md,
    textAlign: 'center',
    fontSize: theme.fontSize.xs,
    color: theme.colors.primaryDark,
    fontWeight: theme.fontWeight.semibold,
  },
  addServiceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.md,
  },
  speedShadow: {
    marginVertical: theme.spacing.sm,
    width: 10,
    height: 10,
    transform: [{ scaleX: 9  }],
    filter: 'blur(2px)',
    opacity: 0.2,
    borderRadius: 50,
    backgroundColor: theme.colors.text.primary,
    elevation: 5,
  },
  speedContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});
