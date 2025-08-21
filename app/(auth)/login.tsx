import { zodResolver } from '@hookform/resolvers/zod';
import Checkbox from 'expo-checkbox';
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
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import * as z from 'zod';

import { GuestGuard } from '@/components/auth/GuestGuard';

import { AppLogo } from '@/components/app/app-logo';
import { Button } from '@/components/ui/custom-button';
import { Input } from '@/components/ui/custom-input';
import { authService } from '@/services/auth';
import { secureStorageService } from '@/services/secure-storage';
import { loginSuccess } from '@/store/slices/auth-slice';
import { setUser } from '@/store/slices/user-slice';
import { theme } from '@/styles/theme';
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

      if (result.success && result.user) {
        try {
          const loginData = {
            uid: result.user.uid,
            password: data.password,
            username: data.username,
            rememberMe: data.rememberMe || false
          };

          dispatch(loginSuccess(loginData));
          dispatch(setUser({
            id: result.user.id,
            name: result.user.name,
            email: result.user.email,
            uid: result.user.uid
          }));

          if (data.rememberMe) {
            console.log('Guardando credenciales en el dispositivo')
            await secureStorageService.saveCredentials({
              uid: result.user.uid,
              username: data.username,
              password: data.password
            }, true);
          }

          Alert.alert('Login exitoso', `Bienvenido ${result.user.name}`);
          router.replace('/home');
        } catch (storageError) {
          console.error('Storage error:', storageError);
          Alert.alert('Login exitoso', `Bienvenido ${result.user.name}`);
          router.replace('/home');
        }
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
    <GuestGuard>
      <ImageBackground
        source={require('@/assets/images/iconos gonet app svg_backing.png')}
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

              <TouchableOpacity onPress={() => router.navigate("./register")}>
              <FontAwesome name = {"user"} style = {styles.iconFP}/>
              <View style={styles.userSection}>
                <Text style={styles.newUserText}>¿Nuevo Usuario?</Text>
                <Text style={styles.registerText}>Regístrate aquí</Text>
              </View>
              </TouchableOpacity>

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

                <Controller
                  control={control}
                  name="rememberMe"
                  render={({ field: { onChange, value } }) => (
                    <View style={styles.checkboxContainer}>
                      <Checkbox
                        value={value || false}
                        onValueChange={onChange}
                        style={styles.checkbox}
                        color={value ? theme.colors.primary : undefined}
                      />
                      <Text style={styles.checkboxLabel}>Recuérdame</Text>
                    </View>
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
    </GuestGuard>
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
