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
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as z from 'zod';

import { AppLogo } from '@/components/app/app-logo';
import { Button } from '@/components/ui/custom-button';
import { Input } from '@/components/ui/custom-input';
import { useNotificationContext } from '@/contexts/notification-context';
import { authService } from '@/services/auth';
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
  cedula: z.string().refine(validateCedula, {
    message: 'Cédula no coincide con el formato',
  }),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const router = useRouter();
  const [registerError, setRegisterError] = useState<string>('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [emailsended, setEmailSent] = useState(false);
  const { showSuccess, showError, showInfo, showWarning } = useNotificationContext();


  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      cedula: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      if (!acceptedTerms) {
        showWarning(
          'Términos requeridos',
          'Debes aceptar los términos y condiciones para continuar'
        );
        return;
      }

       const result = await authService.register ({
              vat: data.cedula,
              
            });

      if (result.destinatary && result.success == true) {
      const email = result.destinatary;
      const [user, domain] = email.split('@');
      const censoredUser = user.length > 2 
          ? user.slice(0, 2) + '*'.repeat(user.length - 2)
          : '*'.repeat(user.length);
      const censoredEmail = `${censoredUser}@${domain}`;
      
      showSuccess(
        '¡Registro exitoso!',
        `Se ha enviado un correo de confirmación a: ${censoredEmail}`,
        6000
      );

      setEmailSent(true);


      }
      else {
      if (result.error?.includes("Ya existe un usuario asociad")) {
        showError(
          'Usuario existente',
          'Ya existe un usuario asociado a esta cédula. Si olvidaste tu contraseña, contacta soporte.',
          5000
        );
      } else if (result.error && result.error.includes("No se encontró contacto con identificador")) {
        showInfo(
          'Registro requerido',
          'No hay ninguna cuenta asociada a ese identificador. Te redirigimos al formulario de contacto.',
          5000
        );
        router.navigate('/contact-form')
      }
        else if (result.error?.includes("Network request failed")){
          showError(
            'Error de conexión',
            'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
            5000
          );
        }
       else {
        showError(
          'Error desconocido',
          'Ocurrió un error inesperado. Por favor, intenta nuevamente.',
          5000
        );
        console.log(result);
      }
    }

      setRegisterError('');
      // Aquí se llamaría al servicio real de registro





      
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error de conexión';
      setRegisterError(errorMessage);
      showError(
        'Error de conexión',
        'No se pudo procesar tu registro. Verifica tu conexión e intenta nuevamente.',
        5000
      );
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
                {/* Cedula */}
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

                {/* Checkbox de Términos */}
                <View style={styles.checkboxContainer}>
                  <Checkbox
                    value={acceptedTerms}
                    onValueChange={setAcceptedTerms}
                    color={acceptedTerms ? theme.colors.primary : undefined}
                  />
                  <TouchableOpacity onPress={() => setAcceptedTerms(!acceptedTerms)}>
                    <Text style={styles.checkboxText}>
                      Aceptar términos y condiciones
                    </Text>
                  </TouchableOpacity>
                </View>

                {registerError ? (
                  <Text style={styles.errorText}>{registerError}</Text>
                ) : null}

                {/* Botón */}
                <Button
                  title="Registrar Cuenta"
                  onPress={handleSubmit(onSubmit)}
                  loading={isSubmitting}
                  fullWidth
                  disabled={!acceptedTerms }
                />
                  {
                    emailsended &&
                    <Text style={styles.infotext} > Email Enviado {emailsended}</Text>
                  }
                

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

  infotext: {
    color: theme.colors.surface,
    fontSize: theme.fontSize.sm,
    marginTop: theme.spacing.xs,
  },
    checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.md,
  },
  checkboxText: {
    marginLeft: theme.spacing.sm,
    color: theme.colors.surface,
    fontSize: theme.fontSize.sm,
  },
});
