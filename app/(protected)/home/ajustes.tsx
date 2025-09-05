import Back from '@/assets/images/iconos gonet back.svg';
import { Header } from '@/components/layout/header';
import { Input } from '@/components/ui/custom-input';
import Text from '@/components/ui/custom-text';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { useNotificationContext } from '@/contexts/notification-context';
import { useTheme } from '@/contexts/theme-context';
import { useBiometricAuth } from '@/hooks/use-biometric-auth';
import { RootState } from '@/store';
import { loadBiometricPreferences, loadSubscriptionsData, loadThemePreferences, saveBiometricPreferences, saveThemePreferences, updateBiometricPreferences, updateStoredPassword, updateThemePreferences } from '@/store/slices/auth-slice';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from "react";
import {
  StyleSheet,
  Switch,
  TouchableOpacity,
  View
} from "react-native";
import { useDispatch, useSelector } from 'react-redux';

import { Button } from '@/components/ui/custom-button';
import { useResponsive } from '@/hooks/use-responsive';
import Checkbox from 'expo-checkbox';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

const AjustesContent = () => {
  const dispatch = useDispatch();
  const { rememberMe, biometricPreferences, themePreferences } = useSelector((state: RootState) => state.auth);
  const { authenticateWithBiometrics, checkBiometricAvailability } = useBiometricAuth();
  const { showError } = useNotificationContext();
  const { theme: currentTheme, isDark, toggleTheme, setFollowSystem } = useTheme();
  
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
      followSystem: newFollowSystem 
    }) as any);
    
    // Update theme context
    setFollowSystem(newFollowSystem);
  }

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

const ActualizarDatosContent = () => {
  const dispatch = useDispatch();
  const { theme: currentTheme } = useTheme();
  const { authenticateWithBiometrics, checkBiometricAvailability } = useBiometricAuth();
  const { biometricPreferences, currentAccount, subscriptions } = useSelector((state: RootState) => state.auth);
  const { showError } = useNotificationContext();

  // Pre-calcular el estado inicial para evitar flash
  const initialVerificationState = useMemo(() => {
    return !biometricPreferences.useBiometricForPassword;
  }, [biometricPreferences.useBiometricForPassword]);

  const [isVerified, setIsVerified] = useState(initialVerificationState);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeTab = async () => {
      // Sincronizar el estado con las preferencias actuales
      setIsVerified(!biometricPreferences.useBiometricForPassword);
      
      if (!currentAccount && subscriptions.length === 0) {
        dispatch(loadSubscriptionsData() as any);
      }
      
      // Micro delay solo para asegurar que el render sea estable
      await new Promise(resolve => setTimeout(resolve, 10));
      setIsInitialized(true);
    };
    
    initializeTab();
  }, [biometricPreferences.useBiometricForPassword, dispatch, currentAccount, subscriptions.length]);

  const dynamicStyles = createDynamicStyles(currentTheme);

  const handleSecureAction = async () => {
    if (biometricPreferences.useBiometricForPassword) {
      const isAvailable = await checkBiometricAvailability();
      if (isAvailable) {
        const result = await authenticateWithBiometrics();
        if (result.success) {
          setIsVerified(true);
        } else {
          showError('Autenticación fallida', 'La verificación biométrica no fue exitosa');
        }
      } else {
        showError('Biometría no disponible', 'Autenticación biométrica no disponible en este dispositivo');
      }
    } else {
      setIsVerified(true);
    }
  };

  // Mostrar loading mientras se inicializa para evitar flash
  if (!isInitialized) {
    return (
      <View style={dynamicStyles.tabContent}>
        <Text style={dynamicStyles.tabTitle}>Perfil</Text>
        <View style={dynamicStyles.loadingContainer}>
          <Text style={dynamicStyles.loadingText}>Cargando...</Text>
        </View>
      </View>
    );
  }

  if (!isVerified) {
    return (
      <ScrollView style={dynamicStyles.tabContent}>
        <Text style={dynamicStyles.tabTitle}>Perfil</Text>
        <View style={dynamicStyles.verificationContainer}>
          <View style={dynamicStyles.verificationCard}>
            <Text style={dynamicStyles.verificationText}>
              Esta acción requiere verificación de identidad
            </Text>
            <Button 
              title={biometricPreferences.useBiometricForPassword ? 'Verificar con biometría' : 'Continuar'}
              onPress={handleSecureAction}
              style={dynamicStyles.verificationButton}
            />
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={dynamicStyles.tabContent}>
      <View style={dynamicStyles.sectionContainer}>
        <Text style={dynamicStyles.subTitle}>Actualizar Datos</Text>
        <View style={dynamicStyles.formContainer}>
          <Input placeholder="Contraseña actual" secureTextEntry />
          <Input placeholder="Correo" value={currentAccount?.partner?.email || ''} />
          <Input placeholder="Teléfono móvil" value={currentAccount?.partner?.mobile || ''} />
          <Input placeholder="Teléfono fijo" value={currentAccount?.partner?.phone || ''} />
          <Input placeholder="Dirección" value={currentAccount?.partner?.street || ''} />
          <Input placeholder="Ciudad" value={currentAccount?.partner?.city || ''} />
        </View>
      </View>
    </ScrollView>
  );
};

const CambiarContrasenaContent = () => {
  const dispatch = useDispatch();
  const { theme: currentTheme } = useTheme();
  const { uid, username, rememberMe } = useSelector((state: RootState) => state.auth);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { showSuccess, showError, showWarning } = useNotificationContext();

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      showError('Error de validación', 'Las contraseñas no coinciden. Verifica que ambas sean idénticas.');
      return;
    }
    if (newPassword.length < 4) {
      showError('Contraseña débil', 'La contraseña debe tener al menos 4 caracteres.');
      return;
    }

    try {
      const { authService } = await import('@/services/auth');
      const { secureStorageService } = await import('@/services/secure-storage');
      const credentials = await secureStorageService.getCredentials();
      if (!credentials) {
        showWarning('Credenciales no encontradas', 'No se pudieron recuperar las credenciales guardadas. Intenta cerrar sesión y volver a iniciarla.');
        return;
      }
      

      if (credentials.password !=currentPassword ) {
        showError('Contraseña incorrecta', 'La contraseña actual ingresada no es correcta.');
        return;
      }

      const response = await authService.changePassword(newPassword);
      if (response.success) {
        if (uid && username) {
          await dispatch(updateStoredPassword({ 
            newPassword, 
            uid, 
            username, 
            rememberMe 
          }) as any);
        }
        showSuccess(
          '¡Contraseña actualizada!',
          'Tu contraseña ha sido cambiada exitosamente. Ya puedes usar la nueva contraseña para iniciar sesión.',
          5000
        );
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        showError(
          'Error al cambiar contraseña',
          response.error || 'No se pudo cambiar la contraseña. Inténtalo nuevamente.',
          5000
        );
      }
    } catch (error) {
      showError(
        'Error inesperado',
        'Ocurrió un error inesperado al cambiar la contraseña. Verifica tu conexión e inténtalo nuevamente.',
        5000
      );
    }
  };

  const dynamicStyles = createDynamicStyles(currentTheme);

  return (
    <View style={dynamicStyles.tabContent}>
      <View style={dynamicStyles.sectionContainer}>
        <Text style={dynamicStyles.subTitle}>Cambiar contraseña</Text>
        <View style={dynamicStyles.formContainer}>
          <Input
            placeholder="Contraseña actual"
            secureTextEntry
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />
          <Input
            placeholder="Contraseña nueva"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <Input
            placeholder="Confirmar nueva contraseña"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <Button title='Actualizar contraseña' onPress={handleChangePassword} />
        </View>
      </View>
    </View>
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
        <SegmentedControl
          segments={[
            {
              id: 'ajustes',
              label: 'Configuración',
              content: <AjustesContent />,
            },
            {
              id: 'actualizar-datos',
              label: 'Perfil',
              content: <ActualizarDatosContent />,
            },
            {
              id: 'cambiar-contraseña',
              label: 'Seguridad',
              content: <CambiarContrasenaContent />,
            },
          ]}
          variant="material"
          animated={true}
          size="md"
          tintColor={currentTheme.colors.primary}
          contentStyle={dynamicStyles.segmentContent}
        />
      </View>
    </SafeAreaView>
  );
}

/* --- Estilos dinámicos --- */
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
});

/* --- Estilos estáticos --- */
const styles = StyleSheet.create({
  themeChangeContainer: {
    flexDirection: "row", 
    alignItems: "center", 
  }
});