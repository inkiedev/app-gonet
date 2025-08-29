import Notification from '@/assets/images/iconos gonet app svg_notificacion.svg';
import { Card } from '@/components/ui/card';
import { ExpandableCard } from '@/components/ui/expandable-card';
import { useCardExpansion } from '@/contexts/card-expansion-container';
import { theme } from '@/styles/theme';
import { BaseComponentProps } from '@/types/common';
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
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

interface HomeExpandableCardProps extends BaseComponentProps {
  plan: string;
  speed: number;
  onToggle?: (expanded: boolean) => void;
}

export const HomeExpandableCard: React.FC<HomeExpandableCardProps> = ({
  plan,
  speed,
  onToggle,
  style,
  testID,
}) => {
  const { isExpanded } = useCardExpansion();

  return (
    <View style={[styles.container, style]} testID={testID}>
      <Card 
        style={{
          ...styles.card, paddingBottom: isExpanded ? 0 : theme.spacing.md
        }} 
        variant="elevated"
      >
        <View style={styles.featuresContainer}>
          <Notification width={35} height={35} />
          <Text style={styles.clientTitle}>{"Juan Gonzales".split(" ").join("\n")}</Text>
          <Text style={styles.planTitle}>{plan}</Text>
          <View style={styles.planSpeedContainer}><Text style={styles.planSpeed}>{speed}</Text><Text style={styles.planMbps}> Mbps</Text></View>
        </View>
        <ExpandableCard
          style={styles.expandableCardContainer}
          onToggle={onToggle}
          renderHeader={(isExpanded, onToggle, rotation) => (
            <View style={styles.centeredHeader}>
              <Text style={styles.detailsLink}>
                {isExpanded ? 'Ocultar Detalles' : 'Ver Detalles'}
              </Text>
              <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                <AntDesign name="down" size={16} color={theme.colors.primaryDark} />
              </Animated.View>
            </View>
          )}
        >
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
        </ExpandableCard>
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
  },
  clientTitle: {
    textAlign: 'center',
    fontStyle: 'italic'
  },
  card: {
    marginTop: theme.spacing.sm,
    width: '100%',
    alignItems: 'center',
    borderRadius: theme.borderRadius.xxl,
    paddingHorizontal: theme.spacing.lg
  },
  planTitle: {
    color: theme.colors.primaryDark,
    fontSize: theme.fontSize.xxl,
    fontStyle: 'italic',
    fontWeight: theme.fontWeight.bold,
    textAlign: 'center',
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
  expandableCardContainer: {
    backgroundColor: 'transparent',
    shadowColor: 'transparent',
    elevation: 0,
    borderWidth: 0,
    paddingHorizontal: 0,
    marginTop: theme.spacing.md,
  },
  centeredHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    marginVertical: theme.spacing.md,
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
  },
  featuresContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  planSpeedContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  planSpeed: {
    color: theme.colors.primaryDark,
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bolder,
    textAlign: 'center',
  },
  planMbps: {
    color: theme.colors.primaryDark,
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
  }
});
