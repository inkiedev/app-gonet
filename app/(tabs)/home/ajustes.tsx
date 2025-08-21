import { Header } from '@/components/layout/header';
import { Input } from '@/components/ui/custom-input';
import Tabs from '@/components/ui/tabs';
import { theme } from '@/styles/theme';
import { useBiometricAuth } from '@/hooks/useBiometricAuth';
import { useRouter } from 'expo-router';
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
  Alert
} from "react-native";

import { SafeAreaView } from 'react-native-safe-area-context';

const AjustesContent = () => {
  const [faceId, setFaceId] = useState(false);
  const [loginFaceId, setLoginFaceId] = useState(false);

  return (
    <>
      <Text style={styles.tabTitle}>Ajustes</Text>
      <Text style={styles.subTitle}>Sesión</Text>
      <Text style={styles.centerText}>Administrar dispositivos activos</Text>

      <Text style={styles.subTitle}>Seguridad</Text>
      <View style={styles.switchRow}>
        <Switch value={faceId} onValueChange={setFaceId} />
        <Text style={styles.switchLabel}>
          Usar Huella o Face ID en lugar de su contraseña
        </Text>
      </View>

      <View style={styles.switchRow}>
        <Switch value={loginFaceId} onValueChange={setLoginFaceId} />
        <Text style={styles.switchLabel}>
          Inicio de sesión con Huella o Face ID
        </Text>
      </View>

      <Text style={styles.availableText}>
        Disponibilidad: Este dispositivo{" "}
        {faceId || loginFaceId ? "soporta" : "no soporta"} estas tecnologías.
      </Text>
    </>
  );
};

const ActualizarDatosContent = () => {
  const { authenticateWithBiometrics, checkBiometricAvailability } = useBiometricAuth();
  const [isVerified, setIsVerified] = useState(false);

  const handleSecureAction = async () => {
    const isAvailable = await checkBiometricAvailability();
    if (isAvailable) {
      const result = await authenticateWithBiometrics();
      if (result.success) {
        setIsVerified(true);
      } else {
        Alert.alert('Error', 'Autenticación fallida');
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
          Toca aquí para verificar
        </Text>
      </View>
    );
  }

  return (
    <>
      <Text style={styles.tabTitle}>Actualizar datos</Text>
      <Input placeholder="Contraseña actual" secureTextEntry />
      <Input placeholder="Correo" />
      <Input placeholder="Teléfono" />
      <Input placeholder="Teléfono opcional" />
    </>
  );
};

const CambiarContrasenaContent = () => {
  const { authenticateWithBiometrics, checkBiometricAvailability } = useBiometricAuth();
  const [isVerified, setIsVerified] = useState(false);

  const handleSecureAction = async () => {
    const isAvailable = await checkBiometricAvailability();
    if (isAvailable) {
      const result = await authenticateWithBiometrics();
      if (result.success) {
        setIsVerified(true);
      } else {
        Alert.alert('Error', 'Autenticación fallida');
      }
    } else {
      setIsVerified(true);
    }
  };

  if (!isVerified) {
    return (
      <View style={styles.verificationContainer}>
        <Text style={styles.tabTitle}>Actualizar contraseña</Text>
        <Text style={styles.verificationText}>
          Esta acción requiere verificación de identidad
        </Text>
        <Text style={styles.verificationSubtext} onPress={handleSecureAction}>
          Toca aquí para verificar
        </Text>
      </View>
    );
  }

  return (
    <>
      <Text style={styles.tabTitle}>Actualizar contraseña</Text>
      <Input placeholder="Contraseña actual" secureTextEntry />
      <Input placeholder="Contraseña nueva" secureTextEntry />
      <Input placeholder="Confirmar nueva contraseña" secureTextEntry />
    </>
  );
};


export const defaultUser = {
  nombre: "Juan Gonzales",
  campos: [
    { campo: "CEDULA", valor: "0123456789" },
    { campo: "CORREO", valor: "correo@correo.com" },
    { campo: "TELF1", valor: "0124910258" },
    { campo: "TELF2", valor: "1234567890" },
  ],
};


/* --- Pantalla principal --- */
export default function PerfilScreen() {
  const router = useRouter();
  const nombre = "Juan Gonzales";
  const campos = [
    { campo: "CEDULA", valor: "0123456789" },
    { campo: "CORREO", valor: "correo@correo.com" },
    { campo: "TELF1", valor: "0124910258" },
    { campo: "TELF2", valor: "1234567890" },
  ];
  
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
        <Text style={styles.title}>Información</Text>
        <Text style={styles.nombre}>{nombre}</Text>

        <View style={styles.infoContainer}>
          {campos.map((item, idx) => (
            <View
              style={idx === campos.length - 1 ? styles.lastInfoRow : styles.infoRow}
              key={idx}
            >
              <Text style={styles.field}>{item.campo}</Text>
              <Text style={styles.value}>{item.valor}</Text>
            </View>
          ))}
        </View>

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
    textAlign: "center"
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
  switchLabel: { 
    flex: 1, 
    fontSize: theme.fontSize.md, 
    marginLeft: theme.spacing.md, 
    color: theme.colors.text.primary,
    lineHeight: 20
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
