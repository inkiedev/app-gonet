import Back from '@/assets/images/iconos gonet back.svg';
import { Header } from '@/components/layout/header';
import { Input } from '@/components/ui/custom-input';
import Text from '@/components/ui/custom-text';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { useNotificationContext } from '@/contexts/notification-context';
import { useTheme } from '@/contexts/theme-context';
import { useBiometricAuth } from '@/hooks/use-biometric-auth';
import { RootState } from '@/store';
import { loadBiometricPreferences, loadUserData, saveBiometricPreferences, updateBiometricPreferences, updateStoredPassword } from '@/store/slices/auth-slice';
import { theme } from '@/styles/theme';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from "react";
import {
  StyleSheet,
  Switch,
  View
} from "react-native";
import { useDispatch, useSelector } from 'react-redux';

import { Button } from '@/components/ui/custom-button';
import { SafeAreaView } from 'react-native-safe-area-context';

const AjustesContent = () => {
  const dispatch = useDispatch();
  const { rememberMe, biometricPreferences } = useSelector((state: RootState) => state.auth);
  const { authenticateWithBiometrics, checkBiometricAvailability } = useBiometricAuth();
  const { showSuccess, showError } = useNotificationContext();
  const { theme: currentTheme, isDark, toggleTheme } = useTheme();
  
  useEffect(() => {
    if (rememberMe) {
      dispatch(loadBiometricPreferences() as any);
    }
  }, [dispatch, rememberMe]);

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

  const dynamicStyles = createDynamicStyles(currentTheme);

  return (
    <View style={styles.tabContent}>
      <Text style={dynamicStyles.tabTitle}>Configuración</Text>
      
      <View style={styles.sectionContainer}>
        <Text style={dynamicStyles.subTitle}>Sesión</Text>
        <Text style={dynamicStyles.centerText}>Administrar dispositivos activos</Text>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={dynamicStyles.subTitle}>Apariencia</Text>
        <View style={dynamicStyles.switchRow}>
          <Switch 
            value={isDark} 
            onValueChange={toggleTheme}
            trackColor={{ false: currentTheme.colors.border.medium, true: currentTheme.colors.primary }}
            thumbColor={isDark ? currentTheme.colors.surface : currentTheme.colors.surface}
          />
          <Text style={dynamicStyles.switchLabel}>
            {isDark ? '🌙 Tema Oscuro' : '🌞 Tema Claro'}
          </Text>
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={dynamicStyles.subTitle}>Seguridad</Text>
        
        {!rememberMe && (
          <Text style={[styles.disabledNotice, { color: currentTheme.colors.text.secondary }]}>
            Active "Recuérdame" en el login para habilitar las opciones biométricas
          </Text>
        )}
        
        <View style={[dynamicStyles.switchRow, !rememberMe && styles.switchRowDisabled]}>
          <Switch 
            value={biometricPreferences.useBiometricForPassword} 
            onValueChange={handleBiometricPasswordChange}
            disabled={!rememberMe}
            trackColor={{ false: currentTheme.colors.border.medium, true: currentTheme.colors.primary }}
          />
          <Text style={[dynamicStyles.switchLabel, !rememberMe && styles.switchLabelDisabled]}>
            Usar Huella o Face ID en lugar de su contraseña
          </Text>
        </View>

        <View style={[dynamicStyles.switchRow, !rememberMe && styles.switchRowDisabled]}>
          <Switch 
            value={biometricPreferences.useBiometricForLogin} 
            onValueChange={handleBiometricLoginChange}
            disabled={!rememberMe}
            trackColor={{ false: currentTheme.colors.border.medium, true: currentTheme.colors.primary }}
          />
          <Text style={[dynamicStyles.switchLabel, !rememberMe && styles.switchLabelDisabled]}>
            Inicio de sesión con Huella o Face ID
          </Text>
        </View>
      </View>
    </View>
  );
};

const ActualizarDatosContent = () => {
  const dispatch = useDispatch();
  const { authenticateWithBiometrics, checkBiometricAvailability } = useBiometricAuth();
  const { biometricPreferences, userData } = useSelector((state: RootState) => state.auth);
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
      
      if (!userData) {
        dispatch(loadUserData() as any);
      }
      
      // Micro delay solo para asegurar que el render sea estable
      await new Promise(resolve => setTimeout(resolve, 10));
      setIsInitialized(true);
    };
    
    initializeTab();
  }, [biometricPreferences.useBiometricForPassword, dispatch, userData]);

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
      <View style={styles.tabContent}>
        <Text style={styles.tabTitle}>Perfil</Text>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
      </View>
    );
  }

  if (!isVerified) {
    return (
      <View style={styles.tabContent}>
        <Text style={styles.tabTitle}>Perfil</Text>
        <View style={styles.verificationContainer}>
          <View style={styles.verificationCard}>
            <Text style={styles.verificationText}>
              Esta acción requiere verificación de identidad
            </Text>
            <Button 
              title={biometricPreferences.useBiometricForPassword ? 'Verificar con biometría' : 'Continuar'}
              onPress={handleSecureAction}
              style={styles.verificationButton}
            />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Perfil</Text>
      <View style={styles.formContainer}>
        <Input placeholder="Contraseña actual" secureTextEntry />
        <Input placeholder="Correo" value={userData?.email || ''} />
        <Input placeholder="Teléfono móvil" value={userData?.mobile || ''} />
        <Input placeholder="Teléfono fijo" value={userData?.phone || ''} />
        <Input placeholder="Dirección" value={userData?.street || ''} />
        <Input placeholder="Ciudad" value={userData?.city || ''} />
      </View>
    </View>
  );
};

const CambiarContrasenaContent = () => {
  const dispatch = useDispatch();
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
        console.log(credentials.password, currentPassword)
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

  return (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Seguridad</Text>
      <View style={styles.formContainer}>
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
  );
};

/* --- Pantalla principal --- */
export default function PerfilScreen() {
  const router = useRouter();
  const { theme: currentTheme } = useTheme();
  
  const handleGoBack = () => {
    router.back();
  };

  const dynamicStyles = createDynamicStyles(currentTheme);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.colors.background }]} edges={['top']}>
      <Header
        title="Ajustes"
        leftAction={{
          icon: <Back width={24} height={24} color={currentTheme.colors.text.primary} />,
          onPress: handleGoBack,
        }}
        variant="default"
      />

      <View style={styles.segmentedContainer}>
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
          contentStyle={styles.segmentContent}
        />
      </View>
    </SafeAreaView>
  );
}

/* --- Estilos dinámicos --- */
const createDynamicStyles = (theme: any) => StyleSheet.create({
  tabTitle: { 
    fontSize: theme.fontSize.xl, 
    fontWeight: theme.fontWeight.bold, 
    color: theme.colors.text.primary,
    textAlign: "center",
    marginBottom: theme.spacing.xl,
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
  switchLabel: { 
    flex: 1, 
    fontSize: theme.fontSize.md, 
    marginLeft: theme.spacing.md, 
    color: theme.colors.text.primary,
    lineHeight: 20,
  },
});

/* --- Estilos estáticos --- */
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.colors.background 
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
    color: theme.colors.primaryDark,
    textAlign: "center",
    marginBottom: theme.spacing.xl
    
  },
  subTitle: { 
    fontSize: theme.fontSize.lg, 
    fontWeight: theme.fontWeight.bold, 
    marginTop: theme.spacing.lg, 
    marginBottom: theme.spacing.md,
    color: theme.colors.primaryDark
  },
  centerText: { 
    textAlign: "center", 
    marginBottom: theme.spacing.lg, 
    color: theme.colors.text.secondary,
    fontSize: theme.fontSize.sm,
    fontStyle: "italic"
  },

  /* Switch */
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
    lineHeight: 20
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

  /* Segmented Container */
  segmentedContainer: {
    flex: 1,
    marginVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  segmentContent: {
    paddingVertical: theme.spacing.lg,
  },

  content: {
    padding: theme.spacing.lg,
    flexGrow: 1,
  },

  /* Tab Content */
  tabContent: {
    flex: 1,
    paddingTop: theme.spacing.md,
  },
  
  sectionContainer: {
    marginBottom: theme.spacing.lg,
  },
  
  formContainer: {
    gap: theme.spacing.md,
  },

  /* Verification */
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
  
  /* Loading */
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