import Tabs from '@/components/app/tabs';
import { Input } from '@/components/ui/custom-input';
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View
} from "react-native";

import { SafeAreaView } from 'react-native-safe-area-context';

/* --- Tab Ajustes --- */
const AjustesTab = () => {
  const [faceId, setFaceId] = useState(false);
  const [loginFaceId, setLoginFaceId] = useState(false);

  return (
    <SafeAreaView>
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
    </SafeAreaView>
  );
};

/* --- Tab Actualizar Datos --- */
const ActualizarDatosTab = () => (
  <View>
    <Text style={styles.tabTitle}>Actualizar datos</Text>
    <Input placeholder="Contraseña actual" secureTextEntry />
    <Input placeholder="Correo" />
    <Input placeholder="Teléfono" />
    <Input placeholder="Teléfono opcional" />
  </View>
);

/* --- Tab Cambiar Contraseña --- */
const CambiarContrasenaTab = () => (
  <View>
    <Text style={styles.tabTitle}>Actualizar contraseña</Text>
    <Input placeholder="Contraseña actual" secureTextEntry />
    <Input placeholder="Contraseña nueva" secureTextEntry />
    <Input placeholder="Confirmar nueva contraseña" secureTextEntry />
  </View>
);

/* --- Pantalla principal --- */
export default function PerfilScreen() {
  const nombre = "Juan Gonzales";
  const campos = [
    { campo: "Edad", valor: "32" },
    { campo: "Ciudad", valor: "Quito" },
    { campo: "Ocupación", valor: "Ingeniero" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Información inicial */}
        <Text style={styles.title}>Información</Text>
        <View style={styles.infoContainer}>
          <View style={styles.row}>
            <Text style={styles.field}>Nombre:</Text>
            <Text style={styles.value}>{nombre}</Text>
          </View>
          {campos.map((item, idx) => (
            <View style={styles.row} key={idx}>
              <Text style={styles.field}>{item.campo}:</Text>
              <Text style={styles.value}>{item.valor}</Text>
            </View>
          ))}
        </View>


        <Tabs
          tabNames={["Ajustes", "Actualizar datos", "Cambiar contraseña"]}
          tabContents={[
            <AjustesTab key="ajustes" />,
            <ActualizarDatosTab key="actualizar" />,
            <CambiarContrasenaTab key="cambiar" />
          ]}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

/* --- Estilos --- */
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  infoContainer: {
    marginBottom: 20, backgroundColor: "#f2f2f2",
    padding: 10, borderRadius: 8,
  },
  row: { flexDirection: "row", marginBottom: 8 },
  field: { fontWeight: "bold", marginRight: 5 },
  value: { color: "#333" },

  /* Tabs */
  tabsContainer: { flexDirection: "row", marginBottom: 10 },
  tab: {
    flex: 1, paddingVertical: 8, backgroundColor: "#ddd",
    alignItems: "center", borderRadius: 6, marginHorizontal: 3,
  },
  tabActiva: { backgroundColor: "#6200ee" },
  tabText: { color: "#000", fontSize: 12 },
  tabTextActiva: { color: "#fff", fontWeight: "bold" },
  tabContent: {
    backgroundColor: "#f2f2f2", padding: 12, borderRadius: 8,
  },

  /* Tab contenido */
  tabTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
  subTitle: { fontSize: 16, fontWeight: "bold", marginTop: 10, marginBottom: 5 },
  centerText: { textAlign: "center", marginBottom: 15, color: "#333" },

  /* Switch */
  switchRow: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#fff", padding: 8, borderRadius: 8, marginBottom: 10,
  },
  switchLabel: { flex: 1, fontSize: 14, marginLeft: 10, color: "#333" },
  availableText: { marginTop: 10, fontSize: 13, color: "#777" },
});
