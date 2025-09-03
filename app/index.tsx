import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/custom-button";
import Text from "@/components/ui/custom-text";
import LogoLoader from "@/components/ui/loading";
import { PlanCard } from "@/components/ui/plan-card";
import { useTheme } from "@/contexts/theme-context";
import { useAuthRoute } from "@/providers/auth-route-provider";
import { getPromotionById, getPromotions, Promotion, PromotionDetail } from "@/services/public-api";
import { RootState } from "@/store";
import { theme } from "@/styles/theme";
import { Redirect, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

const PlanesContent = ({
  promotions,
  isLoading,
  onSelectPromotion,
}: {
  promotions: Promotion[];
  isLoading: boolean;
  onSelectPromotion: (id: number) => void;
}) => (
  <View style={styles.planesSection}>
    <Text style={styles.sectionTitle}>Nuestros Planes</Text>
    {isLoading ? (
      <LogoLoader />
    ) : promotions.length > 0 ? (
      promotions.map((plan) => (
        <PlanCard title={plan.name} style={styles.planCard} key={plan.id}>
          <View style={styles.planContainer}>
            <Text style={styles.planFinalPrice}>
              Precio final: ${plan.total.toFixed(2)}
            </Text>
            <View style={styles.planDetails}>
              {plan.extras.map((detail, index) => (
                <Text key={index} style={styles.planDetail}>
                  {`• ${detail.name}`}
                </Text>
              ))}
            </View>
            <Button
              title="Ver detalle"
              onPress={() => onSelectPromotion(plan.id)}
            />
          </View>
        </PlanCard>
      ))
    ) : (
      <Text style={styles.noPromotionsText}>
        No hay promociones disponibles en este momento.
      </Text>
    )}
  </View>
);


const PromotionDetailsContent = ({ promotionId, onBack }: { promotionId: number, onBack: () => void }) => {
  const [promotion, setPromotion] = useState<PromotionDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPromotionDetails = async () => {
      try {
        setIsLoading(true);
        const fetchedPromotion = await getPromotionById(promotionId);
        setPromotion(fetchedPromotion);
      } catch (error) {
        console.error("Failed to fetch promotion details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPromotionDetails();
  }, [promotionId]);

  const renderDiscountMessage = (extra: any) => {
    if (extra.apply_method === "monthly" && extra.months_discount > 0) {
      return `Por ${extra.months_discount} meses tienes un descuento de ${extra.discount}%.`;
    }
    if (extra.apply_method === "indefinite" && extra.discount > 0) {
      return `Descuento de ${extra.discount}% para siempre.`;
    }
    return null;
  };

  const kbpsToMbps = (kbps: string) => {
    return (parseInt(kbps) / 1000).toFixed(2);
  };

  return (
    <View style={styles.planesSection}>
        <Button title="Volver a la lista" onPress={onBack} />
      {isLoading ? (
        <LogoLoader />
      ) : promotion ? (
        <PlanCard title={promotion.name} style={styles.planCard}>
            <Text style={styles.planFinalPrice}>Precio Total: ${promotion.total.toFixed(2)}</Text>
            <Text style={styles.planDetail}>Tipo de Enlace: {promotion.link_type}</Text>
            <Text style={styles.planDetail}>Nivel de Compartición: {promotion.sharing_level}</Text>
            <Text style={styles.planDetail}>Tipo de Conexión: {promotion.connection_type}</Text>
            <Text style={styles.planDetail}>
              Velocidad de Subida: {kbpsToMbps(promotion["speed:_upload"])} Mbps ({promotion["speed:_upload"]} kbps)
            </Text>
            <Text style={styles.planDetail}>
              Velocidad de Bajada: {kbpsToMbps(promotion["speed:_download"])} Mbps ({promotion["speed:_download"]} kbps)
            </Text>

            <View style={styles.extrasContainer}>
              <Text style={styles.extrasTitle}>Extras:</Text>
              {promotion.extras.map((extra, index) => (
                <View key={index} style={styles.extraItem}>
                  <Text style={styles.extraName}>{extra.name}</Text>
                  <Text style={styles.extraPrice}>Precio: ${extra.price_unit.toFixed(2)}</Text>
                  {renderDiscountMessage(extra) && (
                    <Text style={styles.discountText}>{renderDiscountMessage(extra)}</Text>
                  )}
                </View>
              ))}
            </View>
        </PlanCard>
      ) : (
        <Text style={styles.noPromotionsText}>No se encontraron detalles de la promoción.</Text>
      )}
    </View>
  );
};

export default function PublicHomeScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { isInitialized } = useAuthRoute();
  const dynamicStyles = createDynamicStyles(theme);
  const { isAuthenticated, needsBiometricVerification } = useSelector((state: RootState) => state.auth);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [promotionsLoading, setPromotionsLoading] = useState(true);
  const [selectedPromotionId, setSelectedPromotionId] = useState<number | null>(
    null
  );

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setPromotionsLoading(true);
        const fetchedPromotions = await getPromotions();
        setPromotions(fetchedPromotions);
      } catch (error) {
        console.error("Failed to fetch promotions:", error);
      } finally {
        setPromotionsLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  // Wait for auth initialization
  if (!isInitialized) {
    return null; // AuthRouteProvider handles loading state
  }

  // Redirect authenticated users to protected area
  if (isAuthenticated && !needsBiometricVerification) {
    return <Redirect href="/(protected)/home" />;
  }


  const handleLogin = () => {
    router.push("/(auth)/login");
  };

  const handleSelectPromotion = (id: number) => {
    setSelectedPromotionId(id);
  };

  const handleBackToList = () => {
    setSelectedPromotionId(null);
  };

  return (
    <SafeAreaView style={dynamicStyles.container} edges={["top"]}>
      <ScrollView style={styles.scrollContainer}>
        {/* Banner */}
        <View style={styles.bannerContainer}>
          <Image
            source={{ uri: "https://picsum.photos/800/400" }}
            style={styles.bannerImage}
          />
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerTitle}>Bienvenido a GoNet</Text>
            <Text style={styles.bannerSubtitle}>Internet de alta velocidad para tu hogar</Text>
            <Button 
              title="Iniciar Sesión" 
              onPress={handleLogin}
              style={styles.loginButton}
            />
          </View>
        </View>
        {/* Planes Content */}
        {selectedPromotionId ? (
          <PromotionDetailsContent promotionId={selectedPromotionId} onBack={handleBackToList} />
        ) : (
          <PlanesContent
            promotions={promotions}
            isLoading={promotionsLoading}
            onSelectPromotion={handleSelectPromotion}
          />
        )}
      </ScrollView>

      {/* Footer */}
      <Footer />
    </SafeAreaView>
  );
}

const createDynamicStyles = (theme: any) => StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.colors.background,
  },
  planFinalPrice: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text.primary,
  },
  planDetail: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text.primary,
  },
})


const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  bannerContainer: {
    height: 300,
    position: 'relative',
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  bannerTitle: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text.inverse,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  bannerSubtitle: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.text.inverse,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  loginButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
  },
  planesSection: {
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primaryDark,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  planCard: {
    marginVertical: theme.spacing.md,
  },
  planContainer: {
    paddingHorizontal: theme.spacing.sm,
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing.sm,
    alignItems: 'center',
  },
  planPrice: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.primaryDark,
  },
  planFinalPrice: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text.secondary,
  },
  planDetails: {
    width: '100%',
    marginVertical: theme.spacing.xs,
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "column"
  },
  planDetail: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  noPromotionsText: {
    textAlign: "center",
    fontSize: theme.fontSize.lg,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.lg,
  },
  extrasContainer: {
    marginTop: theme.spacing.md,
  },
  extrasTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  extraItem: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  extraName: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  extraPrice: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text.secondary,
  },
  discountText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    marginTop: theme.spacing.xs,
  },
});
