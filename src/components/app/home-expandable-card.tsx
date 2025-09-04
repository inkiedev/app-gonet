import Notification from '@/assets/images/iconos gonet app svg_notificacion.svg';
import Down from '@/assets/images/iconos gonet down.svg';
import Gomax from '@/assets/images/iconos gonet gomax.svg';
import Wifi from '@/assets/images/iconos gonet wifi.svg';
import { Card } from '@/components/ui/card';
import Text from '@/components/ui/custom-text';
import { ExpandableCard } from '@/components/ui/expandable-card';
import { useCardExpansion } from '@/contexts/card-expansion-container';
import { useTheme } from '@/contexts/theme-context';
import { useResponsive } from '@/hooks/use-responsive';
import { RootState } from '@/store';
import { BaseComponentProps } from '@/types/common';
import { formatGoWord } from '@/utils';
import React, { ReactNode } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import Badge from './badge';

interface HomeExpandableCardProps extends BaseComponentProps {
  plan: string;
  speed: number;
  onToggle?: (expanded: boolean) => void;
}

export const HomeExpandableCard: React.FC<HomeExpandableCardProps> = ({
  onToggle,
  style,
  testID,
}) => {
  const { theme, isDark } = useTheme();
  const dynamicStyles = createDynamicStyles(theme);
  const { currentAccount } = useSelector((state: RootState) => state.auth);
  const { isExpanded } = useCardExpansion();
  const { isTablet } = useResponsive();
  
  const features = [
    {
      icon: <Gomax color={theme.colors.primaryDark} />,
      title: 'Lite Tv Streaming',
      detail: '5 meses',
      value: '1 pantalla',
      canUpgrade: true
    },
    {
      icon: <Wifi color={theme.colors.primaryDark} />,
      title: 'Wifi Total',
      detail: '2 Routers',
      value: 'Wifi6',
      canUpgrade: true
    },
  ];

  return (
    <View style={[dynamicStyles.container, style]} testID={testID}>
      <Card 
        style={{
          ...dynamicStyles.card, paddingBottom: isExpanded ? 0 : theme.spacing.md
        }} 
        variant="elevated"
      >
        <View style={[dynamicStyles.featuresContainer, isTablet && { justifyContent: 'space-around' } ]}>
          <Notification width={35} height={35} fill={isDark ? theme.colors.primaryDark : theme.colors.shadow} />
          <Text style={dynamicStyles.clientTitle}>{currentAccount?.partner.name}</Text>
          <Text style={dynamicStyles.planTitle}>{formatGoWord(currentAccount?.plan[0]?.name)}</Text>
          <View style={dynamicStyles.planSpeedContainer}><Text style={dynamicStyles.planSpeed}>{currentAccount?.plan[0]?.name.match(/\d+/)}</Text><Text style={dynamicStyles.planMbps}>Mbps</Text></View>
        </View>
        <ExpandableCard
          style={dynamicStyles.expandableCardContainer}
          onToggle={onToggle}
          renderHeader={(isExpanded, onToggle, rotation) => (
            <View style={dynamicStyles.centeredHeader}>
              <Text style={dynamicStyles.detailsLink}>
                {isExpanded ? 'Ocultar Detalles' : 'Ver Detalles'}
              </Text>
              <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                <Down color={theme.colors.primaryDark} width={15} height={15} />
              </Animated.View>
            </View>
          )}
        >
          <View style={dynamicStyles.detailsContainer}>
            {features.map((feature, index) => (
              <DetailRow
                key={index}
                icon={feature.icon}
                title={feature.title}
                value={feature.value}
                canUpgrade={feature.canUpgrade}
              />
            ))}
            <View style={dynamicStyles.addServiceContainer}>
              <Badge count={"+"} />
              <Text style={dynamicStyles.addServiceText}>Agrega mas servicios</Text>
            </View>
          </View>
        </ExpandableCard>
      </Card>
    </View>
  );
};

interface DetailRowProps {
  icon: ReactNode;
  title: string;
  value: string;
  canUpgrade?: boolean;
}

const DetailRow: React.FC<DetailRowProps> = ({ icon, title, value, canUpgrade }) => {
  const { theme } = useTheme();
  const dynamicStyles = createDynamicStyles(theme);
  
  return (
    <View style={dynamicStyles.detailRow}>
      { icon }
      <Text style={dynamicStyles.detailTitle}>{title}</Text>
      <Text style={dynamicStyles.detailValue}>{value}</Text>
      { canUpgrade ? <Badge count={"+"} /> : <Text> </Text> }
    </View>
  );
};

const createDynamicStyles = (theme: any) => StyleSheet.create({
  container: {
    width: '100%',
  },
  clientTitle: {
    color: theme.colors.primaryDark,
    flexWrap: 'wrap',
    fontSize: theme.fontSize.xs,
    width: '25%',
    textAlign: 'center'
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
    fontSize: theme.fontSize.md,
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
    textAlign: 'center',
  },
  expandableCardContainer: {
    width: '100%',
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
    flexDirection: 'column',
    alignItems: 'center'

  },
  planSpeed: {
    color: theme.colors.primaryDark,
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bolder,
    textAlign: 'center',
  },
  planMbps: {
    color: theme.colors.primaryDark,
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,

  }
});
