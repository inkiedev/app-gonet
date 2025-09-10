import Back from '@/assets/images/iconos gonet back.svg';
import { Header } from '@/components/layout/header';
import { Select, SelectOption } from '@/components/ui/custom-select';
import Text from '@/components/ui/custom-text';
import { useNotificationContext } from '@/contexts/notification-context';
import { useTheme } from '@/contexts/theme-context';
import { useBiometricAuth } from '@/hooks/use-biometric-auth';
import { FontSize } from '@/services/secure-storage';
import { RootState } from '@/store';
import { loadBiometricPreferences, loadThemePreferences, saveBiometricPreferences, saveThemePreferences, updateBiometricPreferences, updateThemePreferences } from '@/store/slices/auth-slice';
import { useRouter } from 'expo-router';
import React, { useEffect } from "react";
import {
  StyleSheet,
  Switch,
  TouchableOpacity,
  View
} from "react-native";
import { useDispatch, useSelector } from 'react-redux';

import { useResponsive } from '@/hooks/use-responsive';
import Checkbox from 'expo-checkbox';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

const AjustesContent = () => {
  const dispatch = useDispatch();
  const { rememberMe, biometricPreferences, themePreferences } = useSelector((state: RootState) => state.auth);
  const { authenticateWithBiometrics, checkBiometricAvailability } = useBiometricAuth();
  const { showError } = useNotificationContext();
  const { theme: currentTheme, isDark, toggleTheme, setFollowSystem, fontSize, setFontSize } = useTheme();
  
  useEffect(() => {
    if (rememberMe) {
      dispatch(loadBiometricPreferences() as any);
    }
  }, [dispatch, rememberMe]);

  useEffect(() => {
    dispatch(loadThemePreferences() as any);
  }, [dispatch]);

  const authenticateForSettingsChange = async (): Promise<boolean> => {
    const isAvailable = await checkBiometricAvailability();
    if (isAvailable) {
      const result = await authenticateWithBiometrics();
      if (result.success) {
        return true;
      } else {
        showError('Verificación requerida', 'Verificación biométrica requerida para cambiar ajustes');
        return false;
      }
    } else {
      showError('Biometría no disponible', 'Autenticación biométrica no disponible en este dispositivo');
      return false;
    }
  };

  const handleBiometricPasswordChange = async (value: boolean) => {
    if (!rememberMe) return;
    
    const authenticated = await authenticateForSettingsChange();
    if (authenticated) {
      const newPreferences = { ...biometricPreferences, useBiometricForPassword: value };
      dispatch(updateBiometricPreferences({ useBiometricForPassword: value }));
      dispatch(saveBiometricPreferences(newPreferences) as any);
    }
  };

  const handleBiometricLoginChange = async (value: boolean) => {
    if (!rememberMe) return;
    
    const authenticated = await authenticateForSettingsChange();
    if (authenticated) {
      const newPreferences = { ...biometricPreferences, useBiometricForLogin: value };
      dispatch(updateBiometricPreferences({ useBiometricForLogin: value }));
      dispatch(saveBiometricPreferences(newPreferences) as any);
    }
  };

  const handleSystemThemeChange = async () => {
    const newFollowSystem = !themePreferences.followSystem;
    
    // Update store preferences
    dispatch(updateThemePreferences({ followSystem: newFollowSystem }));
    dispatch(saveThemePreferences({ 
      isDark: themePreferences.isDark, 
      followSystem: newFollowSystem,
      fontSize: themePreferences.fontSize || 'medium'
    }) as any);
    
    // Update theme context
    setFollowSystem(newFollowSystem);
  }

  const fontSizeOptions: SelectOption<FontSize>[] = [
    { value: 'small' },
    { value: 'medium' },
    { value: 'large' }
  ];

  const handleFontSizeChange = (selectedFontSize: FontSize) => {
    setFontSize(selectedFontSize);
  };

  const dynamicStyles = createDynamicStyles(currentTheme);

  return (
    <ScrollView style={dynamicStyles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={dynamicStyles.sectionContainer}>
        <Text style={dynamicStyles.subTitle}>Sesión</Text>
        <Text style={dynamicStyles.centerText}>Administrar dispositivos activos</Text>
      </View>

      <View style={dynamicStyles.sectionContainer}>
        <Text style={dynamicStyles.subTitle}>Apariencia</Text>
        <View style={dynamicStyles.switchRow}>
          <TouchableOpacity onPress={handleSystemThemeChange} style={styles.themeChangeContainer}>
            <Checkbox value={themePreferences.followSystem} onValueChange={handleSystemThemeChange} />
            <Text style={dynamicStyles.switchLabel}>Usar tema del sistema</Text>
          </TouchableOpacity>
        </View>
        <View style={dynamicStyles.switchRow}>
          <Switch 
            disabled={themePreferences.followSystem}
            value={isDark} 
            onValueChange={toggleTheme}
            trackColor={{ false: currentTheme.colors.border.medium, true: currentTheme.colors.primary }}
            thumbColor={isDark ? currentTheme.colors.surface : currentTheme.colors.surface}
          />
          <Text style={dynamicStyles.switchLabel}>
            {isDark ? 'Tema Oscuro' : 'Tema Claro'}
          </Text>
        </View>

        <View style={dynamicStyles.selectContainer}>
          <Text style={dynamicStyles.selectLabel}>Tamaño de letra</Text>
          <Select<FontSize>
            options={fontSizeOptions}
            value={fontSize}
            onValueChange={handleFontSizeChange}
            placeholder="Seleccionar tamaño"
            renderItem={(option, index, isSelected) => (
              <Text style={[
                dynamicStyles.selectOption,
                isSelected && dynamicStyles.selectOptionSelected
              ]}>
                {option.value === 'small' ? 'Pequeño' : 
                 option.value === 'medium' ? 'Mediano' : 
                 'Grande'}
              </Text>
            )}
            style={dynamicStyles.select}
          />
        </View>
      </View>

      <View style={dynamicStyles.sectionContainer}>
        <Text style={dynamicStyles.subTitle}>Seguridad</Text>
        
        {!rememberMe && (
          <Text style={[dynamicStyles.disabledNotice, { color: currentTheme.colors.text.secondary }]}>
            Active "Recuérdame" en el login para habilitar las opciones biométricas
          </Text>
        )}
        
        <View style={[dynamicStyles.switchRow, !rememberMe && dynamicStyles.switchRowDisabled]}>
          <Switch 
            value={biometricPreferences.useBiometricForPassword} 
            onValueChange={handleBiometricPasswordChange}
            disabled={!rememberMe}
            trackColor={{ false: currentTheme.colors.border.medium, true: currentTheme.colors.primary }}
          />
          <Text style={[dynamicStyles.switchLabel, !rememberMe && dynamicStyles.switchLabelDisabled]}>
            Usar Huella o Face ID en lugar de su contraseña
          </Text>
        </View>

        <View style={[dynamicStyles.switchRow, !rememberMe && dynamicStyles.switchRowDisabled]}>
          <Switch 
            value={biometricPreferences.useBiometricForLogin} 
            onValueChange={handleBiometricLoginChange}
            disabled={!rememberMe}
            trackColor={{ false: currentTheme.colors.border.medium, true: currentTheme.colors.primary }}
          />
          <Text style={[dynamicStyles.switchLabel, !rememberMe && dynamicStyles.switchLabelDisabled]}>
            Inicio de sesión con Huella o Face ID
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

/* --- Pantalla principal --- */
export default function PerfilScreen() {
  const router = useRouter();
  const { theme: currentTheme } = useTheme();
  const { isTablet } = useResponsive()
  
  const handleGoBack = () => {
    router.back();
  };

  const dynamicStyles = createDynamicStyles(currentTheme);

  return (
    <SafeAreaView style={[dynamicStyles.container, { backgroundColor: currentTheme.colors.background }]} edges={['top']}>
      <Header
        title="Ajustes"
        leftAction={{
          icon: <Back width={24} height={24} color={currentTheme.colors.text.primary} />,
          onPress: handleGoBack,
        }}
        variant="default"
      />

      <View style={[dynamicStyles.segmentedContainer, isTablet && { marginTop: 10 } ]}>
        <AjustesContent />
      </View>
    </SafeAreaView>
  );
}

const createDynamicStyles = (theme: any) => StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.colors.background,
  },
  title: { 
    fontSize: theme.fontSize.xxl, 
    fontWeight: theme.fontWeight.bold, 
    marginBottom: theme.spacing.xs, 
    alignSelf: "center",
    color: theme.colors.primaryDark,
    letterSpacing: 1.2
  },
  nombre: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.text.secondary,
    textAlign: "center",
    marginBottom: theme.spacing.lg,
    fontWeight: theme.fontWeight.medium
  },
  infoContainer: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.md,
    borderWidth: 1,
    borderColor: theme.colors.border.light
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light
  },
  lastInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 0
  },
  field: { 
    fontWeight: theme.fontWeight.bold, 
    fontSize: theme.fontSize.sm, 
    color: theme.colors.primaryDark,
    textTransform: "uppercase",
    letterSpacing: 0.8
  },
  value: { 
    color: theme.colors.text.primary, 
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium
  },
  tabTitle: { 
    fontSize: theme.fontSize.xl, 
    fontWeight: theme.fontWeight.bold, 
    color: theme.colors.text.primary,
    textAlign: "center",
    marginBottom: theme.spacing.md,
  },
  subTitle: { 
    fontSize: theme.fontSize.lg, 
    fontWeight: theme.fontWeight.bold, 
    marginTop: theme.spacing.lg, 
    marginBottom: theme.spacing.md,
    color: theme.colors.primaryDark,
  },
  centerText: { 
    textAlign: "center", 
    marginBottom: theme.spacing.lg, 
    color: theme.colors.text.secondary,
    fontSize: theme.fontSize.sm,
    fontStyle: "italic",
  },
  switchRow: {
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: theme.colors.surface, 
    padding: theme.spacing.lg, 
    borderRadius: theme.borderRadius.md, 
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
    borderWidth: 1,
    borderColor: theme.colors.border.light
  },
  switchRowDisabled: {
    opacity: 0.5,
    backgroundColor: theme.colors.background,
  },
  switchLabel: { 
    flex: 1, 
    fontSize: theme.fontSize.md, 
    marginLeft: theme.spacing.md, 
    color: theme.colors.text.primary,
    lineHeight: 20,
  },
  switchLabelDisabled: {
    color: theme.colors.text.secondary,
  },
  disabledNotice: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    fontStyle: 'italic',
    paddingHorizontal: theme.spacing.md,
  },
  availableText: { 
    marginTop: theme.spacing.lg, 
    fontSize: theme.fontSize.sm, 
    color: theme.colors.text.secondary,
    textAlign: "center",
    fontStyle: "italic",
    paddingHorizontal: theme.spacing.md
  },
  segmentedContainer: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    flexDirection: 'column',
    alignItems: 'center',
  },
  segmentContent: {
    width: '100%'
  },
  content: {
    padding: theme.spacing.lg,
    flexGrow: 1,
  },
  tabContent: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  sectionContainer: {
  },
  formContainer: {
    gap: theme.spacing.md,
  },
  verificationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  verificationCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    ...theme.shadows.md,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    maxWidth: 320,
  },
  verificationText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    lineHeight: 20,
  },
  verificationButton: {
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  loadingText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  selectContainer: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  selectLabel: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  select: {
    flex: 1,
  },
  selectOption: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text.primary,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  selectOptionSelected: {
    color: theme.colors.text.primary,
    fontWeight: theme.fontWeight.bold,
  },
});

/* --- Estilos estáticos --- */
const styles = StyleSheet.create({
  themeChangeContainer: {
    flexDirection: "row", 
    alignItems: "center", 
  }
});