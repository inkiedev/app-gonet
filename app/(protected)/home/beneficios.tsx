import Back from '@/assets/images/iconos gonet back.svg';
import { Header } from "@/components/layout/header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/custom-button";
import Text from '@/components/ui/custom-text';
import { useTheme } from "@/contexts/theme-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ReferidoEstado = 'pendiente' | 'aprobado' | 'rechazado';

interface Referido {
  id: string;
  nombre: string;
  correo: string;
  telefono: string;
  fecha: string;
  estado: ReferidoEstado;
}

interface Promocion {
  id: string;
  titulo: string;
  descripcion: string;
  descuento: string;
  vigencia: string;
  establecimiento: string;
}

const PROMOCIONES_MOCK: Promocion[] = [
  {
    id: '1',
    titulo: '20% OFF en Restaurantes',
    descripcion: 'Descuento en todos los restaurantes afiliados',
    descuento: '20%',
    vigencia: '31/12/2024',
    establecimiento: 'Restaurantes GoNet'
  },
  {
    id: '2',
    titulo: 'Envío Gratis',
    descripcion: 'En compras mayores a $25',
    descuento: 'Gratis',
    vigencia: '15/01/2025',
    establecimiento: 'Delivery GoNet'
  },
  {
    id: '3',
    titulo: '2x1 en Cines',
    descripcion: 'Válido de lunes a miércoles',
    descuento: '2x1',
    vigencia: '28/02/2025',
    establecimiento: 'Cinemas GoNet'
  },
];

const REFERIDOS_MOCK: Referido[] = [
  {
    id: '1',
    nombre: 'María González',
    correo: 'maria@email.com',
    telefono: '0987654321',
    fecha: '2024-01-15',
    estado: 'aprobado'
  },
  {
    id: '2',
    nombre: 'Carlos Ruiz',
    correo: 'carlos@email.com',
    telefono: '0912345678',
    fecha: '2024-01-20',
    estado: 'pendiente'
  },
];

export default function BeneficiosScreen() {
  const { theme } = useTheme();
  const dynamicStyles = createDynamicStyles(theme);

  const [showHistorial, setShowHistorial] = useState(false);

  const getEstadoColor = useCallback((estado: ReferidoEstado) => {
    switch (estado) {
      case 'aprobado': return theme.colors.success;
      case 'rechazado': return theme.colors.error;
      default: return theme.colors.warning;
    }
  }, [theme.colors]);

  const getEstadoIcon = useCallback((estado: ReferidoEstado) => {
    switch (estado) {
      case 'aprobado': return 'checkmark-circle';
      case 'rechazado': return 'close-circle';
      default: return 'time';
    }
  }, []);

  const renderHistorial = useCallback(() => (
    <Modal
      visible={showHistorial}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <Header
          leftAction={{
            icon: <Ionicons name="close" size={24} color={theme.colors.text.primary} />,
            onPress: () => setShowHistorial(false),
          }}
          title="Historial de Referidos"
        />
        
        <ScrollView style={dynamicStyles.historialContainer} showsVerticalScrollIndicator={false}>
          <Card style={dynamicStyles.historialCard}>
            {REFERIDOS_MOCK.length === 0 ? (
              <View style={dynamicStyles.emptyState}>
                <Ionicons name="people-outline" size={48} color={theme.colors.text.secondary} />
                <Text style={dynamicStyles.emptyText}>No tienes referidos aún</Text>
                <Text style={dynamicStyles.emptySubtext}>
                  ¡Comienza a referir amigos y familiares para obtener descuentos!
                </Text>
              </View>
            ) : (
              <View style={dynamicStyles.referidosList}>
                {REFERIDOS_MOCK.map((referido) => (
                  <View key={referido.id} style={dynamicStyles.referidoItem}>
                    <View style={dynamicStyles.referidoInfo}>
                      <Text style={dynamicStyles.referidoNombre}>{referido.nombre}</Text>
                      <Text style={dynamicStyles.referidoFecha}>
                        Referido el {new Date(referido.fecha).toLocaleDateString()}
                      </Text>
                      <Text style={dynamicStyles.referidoEmail}>{referido.correo}</Text>
                      <Text style={dynamicStyles.referidoTelefono}>{referido.telefono}</Text>
                    </View>
                    <View style={[
                      dynamicStyles.estadoBadge,
                      { backgroundColor: getEstadoColor(referido.estado) + '20' }
                    ]}>
                      <Ionicons
                        name={getEstadoIcon(referido.estado)}
                        size={16}
                        color={getEstadoColor(referido.estado)}
                      />
                      <Text style={[
                        dynamicStyles.estadoText,
                        { color: getEstadoColor(referido.estado) }
                      ]}>
                        {referido.estado.charAt(0).toUpperCase() + referido.estado.slice(1)}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </Card>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  ), [
    showHistorial, 
    theme.colors.background, 
    theme.colors.text.primary,
    theme.colors.text.secondary,
    dynamicStyles,
    getEstadoColor,
    getEstadoIcon
  ]);

  const renderPromociones = useCallback(() => (
    <View style={dynamicStyles.promocionesSection}>
      <Text style={dynamicStyles.sectionTitle}>Promociones Activas</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={dynamicStyles.promocionesContainer}
        removeClippedSubviews={true}
      >
        {PROMOCIONES_MOCK.map((promocion) => (
          <Card key={promocion.id} style={dynamicStyles.promocionCard} variant="elevated">
            <View style={dynamicStyles.promocionHeader}>
              <MaterialIcons name="local-offer" size={24} color={theme.colors.primary} />
              <Text style={dynamicStyles.promocionDescuento}>{promocion.descuento}</Text>
            </View>
            <Text style={dynamicStyles.promocionTitulo}>{promocion.titulo}</Text>
            <Text style={dynamicStyles.promocionDescripcion}>{promocion.descripcion}</Text>
            <View style={dynamicStyles.promocionFooter}>
              <Text style={dynamicStyles.promocionEstablecimiento}>{promocion.establecimiento}</Text>
              <Text style={dynamicStyles.promocionVigencia}>Válido hasta: {promocion.vigencia}</Text>
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  ), [dynamicStyles, theme.colors.primary]);

  return (
    <SafeAreaView style={dynamicStyles.container} edges={['top']}>
      <Header
        leftAction={{
          icon: <Back width={24} height={24} color={theme.colors.text.primary} />,
          onPress: () => router.back(),
        }}
        title="Beneficios GoNet"
      />

      <ScrollView 
        style={dynamicStyles.scrollView} 
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        keyboardShouldPersistTaps="handled"
      >
        {/* Sección Refiere y Gana */}
        <Card style={dynamicStyles.heroCard} variant="elevated">
          <View style={dynamicStyles.heroHeader}>
            <Ionicons name="gift" size={32} color={theme.colors.primary} />
            <Text style={dynamicStyles.heroTitle}>Refiere y Gana</Text>
          </View>
          <Text style={dynamicStyles.heroDescription}>
            Obtén hasta 100% de descuento por referir amigos y familiares a GoNet. 
            ¡Comparte los beneficios y ahorra en tu próxima factura!
          </Text>

          {/* Botones principales */}
          <View style={dynamicStyles.actionButtons}>
            <Button
              title="Referir"
              onPress={() => router.push('/home/referir')}
              variant="primary"
              style={dynamicStyles.actionButton}
              icon={<Ionicons name="person-add" size={20} color={theme.colors.text.button} />}
            />
            <Button
              title="Historial"
              onPress={() => setShowHistorial(true)}
              variant="outline"
              style={dynamicStyles.actionButton}
              icon={<Ionicons name="list" size={20} color={theme.colors.primary} />}
            />
          </View>
        </Card>

        {/* Sección de promociones */}
        {renderPromociones()}

      </ScrollView>
      
      {/* Solo modal del historial */}
      {renderHistorial()}
    </SafeAreaView>
  );
}

const createDynamicStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  heroCard: {
    margin: theme.spacing.lg,
    padding: theme.spacing.lg,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  heroTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.sm,
  },
  heroDescription: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text.secondary,
    lineHeight: 22,
    marginBottom: theme.spacing.lg,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  actionButton: {
    flex: 1,
  },
  
  // Info Card
  infoCard: {
    margin: theme.spacing.lg,
    marginTop: 0,
    padding: theme.spacing.lg,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  infoTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.sm,
  },
  benefitsList: {
    gap: theme.spacing.lg,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  benefitIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.success + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  benefitDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.secondary,
    lineHeight: 18,
  },
  
  // Historial Styles
  historialContainer: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  historialCard: {
    marginBottom: theme.spacing.lg,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  emptyText: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.md,
  },
  emptySubtext: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
    paddingHorizontal: theme.spacing.lg,
  },
  referidosList: {
    gap: theme.spacing.sm,
  },
  referidoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  referidoInfo: {
    flex: 1,
  },
  referidoNombre: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  referidoFecha: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  referidoEmail: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.text.secondary,
    marginTop: 1,
  },
  referidoTelefono: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.text.secondary,
    marginTop: 1,
  },
  estadoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  estadoText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.medium,
    marginLeft: theme.spacing.xs,
  },
  
  // Promociones Styles
  promocionesSection: {
    margin: theme.spacing.lg,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  promocionesContainer: {
    paddingHorizontal: theme.spacing.xs,
  },
  promocionCard: {
    width: 280,
    marginRight: theme.spacing.md,
    padding: theme.spacing.md,
  },
  promocionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  promocionDescuento: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
  },
  promocionTitulo: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  promocionDescripcion: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.secondary,
    lineHeight: 18,
    marginBottom: theme.spacing.md,
  },
  promocionFooter: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
    paddingTop: theme.spacing.sm,
  },
  promocionEstablecimiento: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  promocionVigencia: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
});