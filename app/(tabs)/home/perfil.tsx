import { Input } from '@/components/ui/custom-input';
import Tabs from '@/components/ui/tabs';
import { theme } from '@/styles/theme'; // Asegúrate de importar tu tema
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View
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

const ActualizarDatosContent = () => (
  <>
    <Text style={styles.tabTitle}>Actualizar datos</Text>
    <Input placeholder="Contraseña actual" secureTextEntry />
    <Input placeholder="Correo" />
    <Input placeholder="Teléfono" />
    <Input placeholder="Teléfono opcional" />
  </>
);

const CambiarContrasenaContent = () => (
  <>
    <Text style={styles.tabTitle}>Actualizar contraseña</Text>
    <Input placeholder="Contraseña actual" secureTextEntry />
    <Input placeholder="Contraseña nueva" secureTextEntry />
    <Input placeholder="Confirmar nueva contraseña" secureTextEntry />
  </>
);


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
  const nombre = "Juan Gonzales";
  const campos = [
    { campo: "CEDULA", valor: "0123456789" },
    { campo: "CORREO", valor: "correo@correo.com" },
    { campo: "TELF1", valor: "0124910258" },
    { campo: "TELF2", valor: "1234567890" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Información inicial */}
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
            variant="default"
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
    padding: theme.spacing.md, 
    backgroundColor: theme.colors.surface 
  },

  title: { 
    fontSize: theme.fontSize.xxl, 
    fontWeight: theme.fontWeight.bold, 
    marginBottom: theme.spacing.xs, 
    alignSelf: "center",
    color: theme.colors.text.primary
  },
  nombre: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.text.secondary,
    textAlign: "center",
    marginBottom: theme.spacing.md
  },

  infoContainer: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.lg,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingVertical: theme.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light
  },
  lastInfoRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingVertical: theme.spacing.xs,
    borderBottomWidth: 0
  },
  field: { 
    fontWeight: theme.fontWeight.bold, 
    textTransform: "uppercase", 
    fontSize: theme.fontSize.sm, 
    width: "20%",
    color: theme.colors.text.primary
  },
  value: { 
    color: theme.colors.text.secondary, 
    fontSize: theme.fontSize.sm,
    maxWidth: "60%",
    textAlign: "right"
  },
  tabTitle: { 
    fontSize: theme.fontSize.xl, 
    fontWeight: theme.fontWeight.bold, 
    marginBottom: theme.spacing.md,
    color: theme.colors.text.primary
  },
  subTitle: { 
    fontSize: theme.fontSize.md, 
    fontWeight: theme.fontWeight.bold, 
    marginTop: theme.spacing.sm, 
    marginBottom: theme.spacing.xs,
    color: theme.colors.text.primary
  },
  centerText: { 
    textAlign: "center", 
    marginBottom: theme.spacing.md, 
    color: theme.colors.text.secondary 
  },

  /* Switch */
  switchRow: {
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "flex-start",
    backgroundColor: theme.colors.surface, 
    padding: theme.spacing.sm, 
    borderRadius: theme.borderRadius.sm, 
    marginBottom: theme.spacing.sm,
    ...theme.shadows.sm
  },
  switchLabel: { 
    flex: 1, 
    fontSize: theme.fontSize.sm, 
    marginLeft: theme.spacing.sm, 
    color: theme.colors.text.primary 
  },
  availableText: { 
    marginTop: theme.spacing.sm, 
    fontSize: theme.fontSize.xs, 
    color: theme.colors.text.secondary 
  },

  /* Tabs Container */
  tabsContainer: {
    flex: 1,
    marginTop: theme.spacing.md,
  },
});
