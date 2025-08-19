import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/custom-button";
import { Input } from "@/components/ui/custom-input";
import Tabs from "@/components/ui/tabs";
import { theme } from "@/styles/theme";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,

  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
    
interface StarRatingProps {
  rating: number;
  onChange: (valor: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onChange }) => {
  const totalStars = 5;

  return (
    <View style={styles.starsContainer}>
      {Array.from({ length: totalStars }).map((_, index) => {
        const starNumber = index + 1;
        return (
          <TouchableOpacity key={index} onPress={() => onChange(starNumber)}>
            <Ionicons
            testID="star-icon"
              name={starNumber <= rating ? "star" : "star-outline"}
              size={32}
              color={theme.colors.text.contrast}
              style={styles.starIcon}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const EncuestasContent = () => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>Encuestas</Text>
    <Text style={styles.cardText}>No hay encuestas en este momento</Text>
  </View>
);

const SugerenciasContent = () => {
  const [texto, setTexto] = useState<string>("");

  const enviarSugerencia = () => {
    if (!texto.trim()) {
      Alert.alert("Error", "Por favor escribe una sugerencia.");
      return;
    }
    Alert.alert("Enviado", `Tu sugerencia fue: ${texto}`);
    setTexto("");
  };

  return (
    <View  testID="card_sugerencias">
      <Text style={styles.cardTitle} >Sugerencias</Text>
      <Input
        value={texto}
        onChangeText={setTexto}
        placeholder="Tu sugerencia aquí..."
        multiline
        numberOfLines={4}
        style={styles.inputWrapper}
        inputStyle={styles.inputArea}
      />
      <Button title="Enviar" onPress={enviarSugerencia} />
    </View>
  );
};

const SiguenosContent = () => (
  <View style={[styles.card, { alignItems: "center" }]}>
    <Text style={styles.cardTitle}>Contáctanos</Text>
    <View style={styles.socialContainer}>
      <TouchableOpacity testID="social-icon">
        <FontAwesome5 name="whatsapp" size={theme.fontSize.xl*2} color={theme.colors.text.primary} />
      </TouchableOpacity  >
      <TouchableOpacity testID="social-icon">
        <FontAwesome5 name="facebook-messenger" size={theme.fontSize.xl*2} color={theme.colors.text.primary} />
      </TouchableOpacity>
      <TouchableOpacity testID="social-icon">
        <FontAwesome5 name="envelope" size={theme.fontSize.xl*2} color={theme.colors.text.primary} />
      </TouchableOpacity>
      <TouchableOpacity testID="social-icon">
        <FontAwesome5 name="phone-alt" size={theme.fontSize.xl*2} color={theme.colors.text.primary} />
      </TouchableOpacity>
    </View>
  </View>
);

export default function CalificanosScreen(): React.ReactElement {
  const [puntuacion, setPuntuacion] = useState<number>(0);

  useEffect(() => {
    setTimeout(() => {
      const puntuacionDesdeBD: number = 4;
      setPuntuacion(puntuacionDesdeBD);
    }, 1000);
  }, []);

  return (

   

    <SafeAreaView style={styles.container} edges={['top']}>

<Header style={styles.header} 
        leftAction={{
          icon: "arrow-back",
          onPress: () => router.back(),
        }}
        title="Calificanos"
      />
      
      
      <Text style={styles.title}>Califica Nuestra App</Text>
      <Text style={styles.subtitle}>Puntuación actual: {puntuacion}</Text>

      <StarRating rating={puntuacion} onChange={setPuntuacion} />

      <View style={styles.tabsContainer}>
        <Tabs
          tabs={[
            {
              id: 'encuestas',
              label: 'Encuesta',
              content: <EncuestasContent />,
            },
            {
              id: 'sugerencias',
              label: 'Sugerencias',
              content: <SugerenciasContent />,
            },
            {
              id: 'siguenos',
              label: 'Síguenos',
              content: <SiguenosContent />,
            },
          ]}
          variant="default"
          contentScrollable={false}
          tabsScrollable={false}
          testID="calificanos-tabs"
        />
      </View>

      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    
    padding: theme.spacing.md,
    paddingTop: 0,
    alignItems: "center",
   
    backgroundColor: theme.colors.background,
  },
  title: {
    
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  header: {
    width: '100%',
  },

  subtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  starsContainer: {
    flexDirection: "row",
  },
  starIcon: {
    marginHorizontal: 2,
  },
  tabsContainer: {
    flex: 1,
    marginTop: theme.spacing.lg,
    width: "100%",
  },
  card: {
    padding: theme.spacing.md,
  },
  cardTitle: {
    fontSize: theme.fontSize.xxl,
    textAlign: "center",
    paddingBottom: theme.spacing.sm,
    color: theme.colors.text.contrast,
    fontWeight: theme.fontWeight.semibold,
  },
  cardText: {
    fontSize: theme.fontSize.sm,
    textAlign: "center",
    color: theme.colors.text.secondary,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    marginBottom: theme.spacing.sm,
    textAlign: "center",
    color: theme.colors.text.contrast,
    fontWeight: theme.fontWeight.medium,
  },
  inputWrapper: {
    
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
  inputArea: {
    textAlignVertical: "top",
    minHeight: 200,
    width: '100%',
    fontSize: theme.fontSize.md,
    color: theme.colors.text.primary,
  },
  socialContainer: {
    flexDirection: "row",
    marginTop: theme.spacing.lg,
    justifyContent: "space-between",
    width: "80%",
  },

});
