import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as z from 'zod';

import { AppLogo } from '@/components/app/app-logo';
import { Button } from '@/components/ui/custom-button';
import { Input } from '@/components/ui/custom-input';
import { authService } from '@/services/auth';
import { theme } from '@/styles/theme';
import { DEV_CONFIG } from '@/utils/dev-config';
import { FontAwesome } from '@expo/vector-icons';

const loginSchema = z.object({
  username: z.string().min(3, 'Mínimo 3 caracteres'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const router = useRouter();
  const [loginError, setLoginError] = useState<string>('');
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  // Mock authentication function for development
  const mockLogin = async (username: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, DEV_CONFIG.MOCK_API_DELAY));
    
    const user = DEV_CONFIG.MOCK_USERS.find(u => u.username === username && u.password === password);
    
    if (user) {
      return {
        success: true,
        user: {
          id: 1,
          name: user.name,
          email: user.email,
          uid: 1,
          session_id: `mock-session-${Date.now()}`
        }
      };
    } else {
      return {
        success: false,
        error: 'Credenciales incorrectas'
      };
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoginError('');
      
      let result;
      
      if (DEV_CONFIG.USE_MOCK_AUTH) {
        // Use mock authentication for development
        result = await mockLogin(data.username, data.password);
      } else {
        // Use real API service
        result = await authService.login({
          username: data.username,
          password: data.password,
        });
      }

      if (result.success && result.user) {
        const message = DEV_CONFIG.USE_MOCK_AUTH 
          ? `Bienvenido ${result.user.name} (MOCK)` 
          : `Bienvenido ${result.user.name}`;
        Alert.alert('Login exitoso', message);
        router.replace('/(tabs)');
      } else {
        setLoginError(result.error || 'Error desconocido');
        Alert.alert('Error', result.error || 'Credenciales incorrectas');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error de conexión';
      setLoginError(errorMessage);
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <ImageBackground
      source={require('@/assets/images/fondo_login.jpg')}
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.content}>
              <Text style={styles.welcomeText}>BIENVENIDO</Text>

              <AppLogo variant="small" />

              <FontAwesome name = {"user"} style = {styles.iconFP}/>

            

              <View style={styles.userSection}>
                <Text style={styles.newUserText}>¿Nuevo Usuario?</Text>
                <Text style={styles.registerText}>Regístrate aquí</Text>
              </View>

              {DEV_CONFIG.SHOW_DEV_INFO && DEV_CONFIG.USE_MOCK_AUTH && (
                <View style={styles.mockInfo}>
                  <Text style={styles.mockTitle}>MODO DESARROLLO</Text>
                  <Text style={styles.mockText}>Usuarios de prueba:</Text>
                  {DEV_CONFIG.MOCK_USERS.map((user, index) => (
                    <Text key={index} style={styles.mockCredentials}>
                      {user.username}/{user.password}
                    </Text>
                  ))}
                </View>
              )}

              <View style={styles.divider} />

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

                {loginError ? (
                  <Text style={styles.errorText} testID="login-error">
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
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  content: {
    alignItems: 'center',
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
  },
  form: {
    width: '100%',
    maxWidth: 300,
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
  mockInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  mockTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.warning,
    marginBottom: theme.spacing.xs,
    letterSpacing: 1,
  },
  mockText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.text.inverse,
    marginBottom: theme.spacing.xs,
  },
  mockCredentials: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.text.inverse,
    fontFamily: 'monospace',
    opacity: 0.9,
  },
});
