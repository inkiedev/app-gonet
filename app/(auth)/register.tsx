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
import { theme } from '@/styles/theme';
import { FontAwesome } from '@expo/vector-icons';

/* --- Custom cedula validation function --- */
const validateCedula = (cedula: string): boolean => {
  if (!/^\d{10}$/.test(cedula)) return false;

  const province = parseInt(cedula.substring(0, 2), 10);
  if (province < 1 || province > 24) return false;

  const lastDigit = parseInt(cedula[9]);
  let sum = 0;

  for (let i = 0; i < 9; i++) {
    let digit = parseInt(cedula[i]);
    if (i % 2 === 0) {
      digit = digit * 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }

  const calculatedDigit = sum % 10 === 0 ? 0 : 10 - (sum % 10);
  return calculatedDigit === lastDigit;
};

/* --- Schema with Zod --- */
const registerSchema = z.object({
  fullName: z.string().min(3, 'Mínimo 3 caracteres'),
  email: z.string().email('Formato de email invalido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  cedula: z.string().refine(validateCedula, {
    message: 'Cédula no coincide el formato',
  }),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const router = useRouter();
  const [registerError, setRegisterError] = useState<string>('');
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      cedula: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setRegisterError('');
      // Aquí se llamaría al servicio real de registro
      Alert.alert('Registration Successful', `Welcome ${data.fullName}`);
      router.replace('/(tabs)');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Connection error';
      setRegisterError(errorMessage);
      Alert.alert('Error', errorMessage);
    }
  };

  return (
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
              <Text style={styles.welcomeText}>REGISTER</Text>
              <AppLogo variant="small" />
              <FontAwesome name={'user-plus'} style={styles.iconFP} />

              <View style={styles.form}>
                <Controller
                  control={control}
                  name="fullName"
                  render={({ field: { onChange, value, onBlur } }) => (
                    <Input
                      placeholder="Nombre Completo"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.fullName?.message}
                      autoCapitalize="words"
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, value, onBlur } }) => (
                    <Input
                      placeholder="Email"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.email?.message}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
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
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="cedula"
                  render={({ field: { onChange, value, onBlur } }) => (
                    <Input
                      placeholder="Cédula"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.cedula?.message}
                      keyboardType="numeric"
                      maxLength={10}
                    />
                  )}
                />

                {registerError ? (
                  <Text style={styles.errorText}>{registerError}</Text>
                ) : null}

                <Button
                  title="Registrar Cuenta"
                  onPress={handleSubmit(onSubmit)}
                  loading={isSubmitting}
                  fullWidth
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
  background: { flex: 1 },
  container: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  content: { alignItems: 'center' },
  welcomeText: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text.inverse,
    marginBottom: theme.spacing.xl,
    letterSpacing: 2,
  },
  form: {
    width: '100%',
    maxWidth: 300,
    marginTop: theme.spacing.lg,
  },
  iconFP: {
    color: theme.colors.surface,
    fontSize: theme.fontSize.xl * 2,
    marginBottom: theme.spacing.lg,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.fontSize.sm,
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
});
