import { Header } from '@/components/layout/header';
import { Input } from '@/components/ui/custom-input';
import Tabs from '@/components/ui/tabs';
import { useNotificationContext } from '@/contexts/notification-context';
import { useBiometricAuth } from '@/hooks/use-biometric-auth';
import { RootState } from '@/store';
import { loadBiometricPreferences, loadUserData, saveBiometricPreferences, updateBiometricPreferences, updateStoredPassword } from '@/store/slices/auth-slice';
import { theme } from '@/styles/theme';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
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

  return (
    <>
      <Text style={styles.tabTitle}>Ajustes</Text>
      <Text style={styles.subTitle}>Sesión</Text>
      <Text style={styles.centerText}>Administrar dispositivos activos</Text>

      <Text style={styles.subTitle}>Seguridad</Text>
      
      {!rememberMe && (
        <Text style={styles.disabledNotice}>
          Active &ldquo;Recuérdame&rdquo; en el login para habilitar las opciones biométricas
        </Text>
      )}
      
      <View style={[styles.switchRow, !rememberMe && styles.switchRowDisabled]}>
        <Switch 
          value={biometricPreferences.useBiometricForPassword} 
          onValueChange={handleBiometricPasswordChange}
          disabled={!rememberMe}
        />
        <Text style={[styles.switchLabel, !rememberMe && styles.switchLabelDisabled]}>
          Usar Huella o Face ID en lugar de su contraseña
        </Text>
      </View>

      <View style={[styles.switchRow, !rememberMe && styles.switchRowDisabled]}>
        <Switch 
          value={biometricPreferences.useBiometricForLogin} 
          onValueChange={handleBiometricLoginChange}
          disabled={!rememberMe}
        />
        <Text style={[styles.switchLabel, !rememberMe && styles.switchLabelDisabled]}>
          Inicio de sesión con Huella o Face ID
        </Text>
      </View>
    </>
  );
};

const ActualizarDatosContent = () => {
  const dispatch = useDispatch();
  const { authenticateWithBiometrics, checkBiometricAvailability } = useBiometricAuth();
  const { biometricPreferences, userData } = useSelector((state: RootState) => state.auth);
  const [isVerified, setIsVerified] = useState(false);
  const { showError } = useNotificationContext();

  useEffect(() => {
    if (!biometricPreferences.useBiometricForPassword) {
      setIsVerified(true);
    } else {
      setIsVerified(false);
    }
    
    if (!userData) {
      dispatch(loadUserData() as any);
    }
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

  if (!isVerified) {
    return (
      <View style={styles.verificationContainer}>
        <Text style={styles.tabTitle}>Actualizar datos</Text>
        <Text style={styles.verificationText}>
          Esta acción requiere verificación de identidad
        </Text>
        <Text style={styles.verificationSubtext} onPress={handleSecureAction}>
          {biometricPreferences.useBiometricForPassword ? 'Toca aquí para verificar con biometría' : 'Toca aquí para continuar'}
        </Text>
      </View>
    );
  }

  return (
    <>
      <Text style={styles.tabTitle}>Actualizar datos</Text>
      <Input placeholder="Contraseña actual" secureTextEntry />
      <Input placeholder="Correo" value={userData?.email || ''} />
      <Input placeholder="Teléfono móvil" value={userData?.mobile || ''} />
      <Input placeholder="Teléfono fijo" value={userData?.phone || ''} />
      <Input placeholder="Dirección" value={userData?.street || ''} />
      <Input placeholder="Ciudad" value={userData?.city || ''} />
    </>
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
    <>
      <Text style={styles.tabTitle}>Actualizar contraseña</Text>
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
    </>
  );
};

/* --- Pantalla principal --- */
export default function PerfilScreen() {
  const router = useRouter();
  const handleGoBack = () => {
    router.back();
  };


  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header
        title="Ajustes"
        leftAction={{
          icon: "arrow-back",
          onPress: handleGoBack,
        }}
        variant="default"
      />

      <ScrollView style={styles.content}>
        <View style={styles.tabsContainer}>
          <Tabs
            tabs={[
              {
                id: 'ajustes',
                label: 'Ajustes',
                content: <AjustesContent />,
              },
              {
                id: 'actualizar-datos',
                label: 'Actualizar datos',
                content: <ActualizarDatosContent />,
              },
              {
                id: 'cambiar-contraseña',
                label: 'Cambiar contraseña',
                content: <CambiarContrasenaContent />,
              },
            ]}
            variant="minimal"
            contentScrollable={true}
            tabsScrollable={true}
            testID="perfil-tabs"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* --- Estilos --- */
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

  /* Tabs Container */
  tabsContainer: {
    minHeight: 400,
    marginVertical: theme.spacing.xl,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.md,
  },

  content: {
    padding: theme.spacing.lg,
    flexGrow: 1,
  },

  /* Verification */
  verificationContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  verificationText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  verificationSubtext: {
    fontSize: theme.fontSize.md,
    color: theme.colors.primary,
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontWeight: theme.fontWeight.medium,
  },
});