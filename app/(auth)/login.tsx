import Text from '@/components/ui/custom-text';
import { zodResolver } from '@hookform/resolvers/zod';
import Checkbox from 'expo-checkbox';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import * as z from 'zod';

import { AppLogo } from '@/components/app/app-logo';
import { AuthGuest } from '@/components/auth/auth-guest';
import { Button } from '@/components/ui/custom-button';
import { Input } from '@/components/ui/custom-input';
import { useNotificationContext } from '@/contexts/notification-context';
import { authService } from '@/services/auth';
import { secureStorageService } from '@/services/secure-storage';
import { loginSuccess, setSubscriptions } from '@/store/slices/auth-slice';
import { useTheme } from '@/contexts/theme-context';
import { FontAwesome } from '@expo/vector-icons';

const loginSchema = z.object({
  username: z.string().min(3, 'Mínimo 3 caracteres'),
  password: z.string().min(2, 'Mínimo 6 caracteres'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loginError, setLoginError] = useState<string>('');
  const { showSuccess, showError, showWarning } = useNotificationContext();
  const { theme: currentTheme } = useTheme();
  const dynamicStyles = createDynamicStyles(currentTheme);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoginError('');
      
      const result = await authService.login({
        username: data.username,
        password: data.password,
      });

      if (result.success && result.user && result.subscriptions) {
        try {
          const loginData = {
            uid: result.user.uid,
            password: data.password,
            username: data.username,
            rememberMe: data.rememberMe || false
          };

          // Dispatch login success and subscriptions
          dispatch(loginSuccess(loginData));
          dispatch(setSubscriptions(result.subscriptions));

          if (data.rememberMe) {
            console.log('Guardando credenciales en el dispositivo')
            await secureStorageService.saveCredentials({
              uid: result.user.uid,
              username: data.username,
              password: data.password
            }, true);
          }

          showSuccess(
            '¡Bienvenido!',
            `Hola ${result.user.name}, sesión iniciada correctamente`,
            3000
          );
          router.replace('/home');
        } catch (storageError) {
          console.error('Storage error:', storageError);
          showWarning(
            'Advertencia',
            'Sesión iniciada pero hubo un problema guardando las credenciales',
            4000
          );
          router.replace('/home');
        }
      } else {
        setLoginError(result.error || 'Error desconocido');
        showError(
          'Error de autenticación',
          result.error || 'Credenciales incorrectas. Verifica tu usuario y contraseña.',
          5000
        );
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error de conexión';
      setLoginError(errorMessage);
      showError(
        'Error de conexión',
        'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
        5000
      );
    }
  };

  const renderContent = () => (
    <ScrollView
      contentContainerStyle={dynamicStyles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.content}>
        <Text style={dynamicStyles.welcomeText}>BIENVENIDO</Text>

        <AppLogo variant="small" />

        <TouchableOpacity style={dynamicStyles.userSection} onPress={() => router.navigate("./register")}>
        <FontAwesome name = {"user"} style = {dynamicStyles.iconFP}/>
        <View style={dynamicStyles.userSection}>
          <Text style={dynamicStyles.newUserText}>¿Nuevo Usuario?</Text>
          <Text style={dynamicStyles.registerText}>Regístrate aquí</Text>
        </View>
        </TouchableOpacity>

        <View style={dynamicStyles.divider} />

        <View style={styles.form}>
          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, value, onBlur } }) => (
              <Input
                placeholder="Nombre de Usuario"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.username?.message}
                autoCapitalize="none"
                autoCorrect={false}
                testID="username-input"
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value, onBlur } }) => (
              <Input
                placeholder="Contraseña"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
                secureTextEntry
                showPasswordToggle
                testID="password-input"
              />
            )}
          />

          <Controller
            control={control}
            name="rememberMe"
            render={({ field: { onChange, value } }) => (
              <View style={dynamicStyles.checkboxContainer}>
                <Checkbox
                  value={value || false}
                  onValueChange={onChange}
                  style={dynamicStyles.checkbox}
                  color={value ? currentTheme.colors.primary : undefined}
                />
                <TouchableOpacity onPress={() => onChange(!value)}>
                  <Text style={dynamicStyles.checkboxLabel}>Recuérdame</Text>
                </TouchableOpacity>
              </View>
            )}
          />

          {loginError ? (
            <Text style={dynamicStyles.errorText} testID="login-error">
              {loginError}
            </Text>
          ) : null}

          <Button 
            title="Iniciar Sesión"
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
            fullWidth
            testID="login-button"
          />
        </View>
      </View>
    </ScrollView>
  );

  return (
    <AuthGuest>
      <ImageBackground
        source={Platform.OS === 'web' 
          ? require('@/assets/images/iconos gonet app svg_backing desktop.png')
          : require('@/assets/images/iconos gonet app svg_backing.png')
        }
        style={Platform.OS === 'web' ? styles.webBackground : styles.background}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.container}>
          <KeyboardAvoidingView
            style={styles.keyboardView}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            {renderContent()}
          </KeyboardAvoidingView>
        </SafeAreaView>
      </ImageBackground>
    </AuthGuest>
  );
}

const createDynamicStyles = (theme: any) => StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  welcomeText: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text.inverse,
    marginBottom: theme.spacing.xl,
    letterSpacing: 2,
  },
  userSection: {
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  },
  newUserText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.text.inverse,
    fontWeight: theme.fontWeight.bold,
  },
  registerText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.text.inverse,
    fontWeight: theme.fontWeight.bold,
    marginBottom: theme.spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.text.inverse,
    width: '70%',
    marginVertical: theme.spacing.lg,
    maxWidth: 500,
    marginBottom: theme.spacing.xxl,
  },
  iconFP : {
    color: theme.colors.surface,
    fontSize: theme.fontSize.xl*2,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.fontSize.sm,
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.md,
  },
  checkbox: {
    marginRight: theme.spacing.sm,
  },
  checkboxLabel: {
    color: theme.colors.text.inverse,
    fontSize: theme.fontSize.sm,
  },
});

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  webBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
    ...(Platform.OS === 'web' && {
      minHeight: '100vh',
      minWidth: '100vw',
    }),
  } as any,
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
  },
  form: {
    width: '100%',
    maxWidth: 300,
  },
});
