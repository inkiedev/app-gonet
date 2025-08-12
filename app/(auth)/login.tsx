import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React from 'react';
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

const loginSchema = z.object({
  username: z.string().min(3, 'Mínimo 3 caracteres'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const router = useRouter();
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

  const onSubmit = async (data: LoginFormData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      Alert.alert('Login exitoso', `Bienvenido ${data.username}`);
      router.replace('/home');
    } catch (error) {
      Alert.alert('Error', 'Credenciales incorrectas');
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/fondo_login.jpg')}
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

                <Button 
                  title="Iniciar Sesión"
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

});
