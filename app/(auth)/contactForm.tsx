import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as z from "zod";

import { AppLogo } from "@/components/app/app-logo";
import { Button } from "@/components/ui/custom-button";
import { Input } from "@/components/ui/custom-input";
import { Select, SelectOption } from "@/components/ui/custom-select";
import { theme } from "@/styles/theme";
import { FontAwesome } from "@expo/vector-icons";

/* --- Validación con Zod --- */
const formSchema = z.object({
  servicio: z.string().min(1, "Seleccione un servicio"),
  nombre: z.string().min(1, "El nombre es obligatorio"),
  celular: z
    .string()
    .min(10, "El celular debe tener al menos 10 dígitos")
    .regex(/^\d+$/, "Solo números"),
  email: z.string().email("Formato de e-mail inválido"),
  ciudad: z.string().min(1, "Seleccione una ciudad"),
});

type FormData = z.infer<typeof formSchema>;

export default function ContactFormScreen() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      servicio: "",
      nombre: "",
      celular: "",
      email: "",
      ciudad: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      Alert.alert("Formulario enviado", JSON.stringify(data, null, 2));
    } catch (error) {
      Alert.alert("Error", "No se pudo enviar el formulario");
    }
  };

  const servicioOptions: SelectOption<string>[] = [
    { value: "Internet" },
    { value: "Telefonía" },
    { value: "TV Cable" },
  ];

  const ciudadOptions: SelectOption<string>[] = [
    { value: "Quito" },
    { value: "Guayaquil" },
    { value: "Cuenca" },
  ];

  return (
    <ImageBackground
      source={require("@/assets/images/iconos gonet app svg_backing.png")}
      style={styles.background}
    >
      <SafeAreaView style={styles.container} edges={["top"]}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.content}>
              <Text style={styles.title}>GONECTATE</Text>
              <Text style={styles.subtitle}>
                Déjanos tus datos y nos pondremos en contacto contigo y puedas
                navegar sin problemas con GONET
              </Text>

              <AppLogo variant="small" />
              <FontAwesome name={"paper-plane"} style={styles.iconFP} />

              <View style={styles.form}>
                {/* Servicio a contratar */}
                <Text style={styles.label}>Servicio a contratar</Text>
                <Controller
                  control={control}
                  name="servicio"
                  render={({ field: { onChange, value } }) => (


                    <Select
                      style={styles.select}
                      
                      placeholder="Seleccionar servicio"
                      options={servicioOptions}
                      value={value}
                      onValueChange={onChange}
                      error={errors.servicio?.message}
                      renderItem={(option, index, isSelected) => (
                        <Text
                          style={{
                            color: isSelected
                              ? theme.colors.primary
                              : theme.colors.text.primary,
                          }}
                        >
                          {option.value}
                        </Text>
                      )}
                    />
                  )}
                />

                {/* Nombre */}
                <Controller
                  control={control}
                  name="nombre"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      placeholder="Nombre*"
                      value={value}
                      onChangeText={onChange}
                      error={errors.nombre?.message}
                    />
                  )}
                />

                {/* Celular */}
                <Controller
                  control={control}
                  name="celular"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      placeholder="Celular*"
                      value={value}
                      onChangeText={onChange}
                      error={errors.celular?.message}
                      keyboardType="numeric"
                    />
                  )}
                />

                {/* Email */}
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      placeholder="E-mail*"
                      value={value}
                      onChangeText={onChange}
                      error={errors.email?.message}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  )}
                />

                {/* Ciudad */}
                <Text style={styles.label}>Ciudad</Text>
                <Controller
                  control={control}
                  name="ciudad"
                  render={({ field: { onChange, value } }) => (
                    <Select
                      
                      placeholder="Seleccionar ciudad"
                      options={ciudadOptions}
                      value={value}
                      onValueChange={onChange}
                      error={errors.ciudad?.message}
                      renderItem={(option, index, isSelected) => (
                        <Text
                          style={{
                            color: isSelected
                              ? theme.colors.primary
                              : theme.colors.text.primary,
                          }}
                        >
                          {option.value}
                        </Text>
                      )}
                    />
                  )}
                />

                {/* Botón */}
                <Button
                  style={styles.button}
                  title="ENVIAR"
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
    justifyContent: "center",
    paddingHorizontal: theme.spacing.xl,
  },
  content: { alignItems: "center" },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text.inverse,
    marginBottom: theme.spacing.sm,
    letterSpacing: 1.5,
  },

  button: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xxl,
  },

  select: {
    marginBottom: theme.spacing.md,

  },

  label:{
    color: theme.colors.surface,
    fontSize: theme.fontSize.md,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    textAlign: "center",
    color: theme.colors.surface,
    marginBottom: theme.spacing.lg,
  },
  form: {
    width: "100%",
    maxWidth: 350,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
    
  },
  iconFP: {
    color: theme.colors.surface,
    fontSize: theme.fontSize.xl * 2,
    marginBottom: theme.spacing.lg,
  },
});
