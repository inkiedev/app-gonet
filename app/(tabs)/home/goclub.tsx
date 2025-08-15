import { Header } from "@/components/layout/header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/custom-button";
import { theme } from "@/styles/theme"; // 👈 Importamos el theme
import { FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CedulaScreen() {
  const userData = {
    nombre: "Juan Pérez",
    cedula: "1234567890",
  };

  const [showQR, setShowQR] = useState(false);
  const rotate = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateY: `${rotate.value}deg` }],
    };
  });

  const handleFlip = () => {
    rotate.value = withTiming(showQR ? 0 : 180, { duration: 500 });
    setTimeout(() => {
      setShowQR(!showQR);
    }, 250);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Header
        leftAction={{
          icon: "arrow-back",
          onPress: () => router.back(),
        }}
        title="Go Club"
      />

      <View style={styles.container}>
        <TouchableOpacity onPress={handleFlip} activeOpacity={0.8}>
          <Animated.View style={[styles.cardContainer, animatedStyle]}>
            {showQR ? (
              <QRCode value={userData.cedula} />
            ) : (
              <ImageBackground
                source={require("@/assets/images/tarjetaGoclub.jpg")}
                style={styles.cardImage}
              >
                <Text style={styles.overlayText}>{userData.nombre}</Text>
              </ImageBackground>
            )}
          </Animated.View>
        </TouchableOpacity>

        <Card style={styles.infoCard}>
          <FontAwesome5 name="info-circle" size={theme.fontSize.xl} color={theme.colors.primary} />
          <Text style={styles.infoText}>
            Conoce los beneficios que GoNet trae para ti en los mejores establecimientos gracias a tu tarjeta GoClub, presenta el código QR en los locales afiliados.
          </Text>
        </Card>

        <View style={styles.buttonRow}>
          <Button style={styles.button} title="Establecimientos" onPress={() => console.log("Establecimientos")} />
          <Button style={styles.button} title="Historial" onPress={() => console.log("Historial")} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    alignItems: "center",
    padding: theme.spacing.lg,
  },
  cardContainer: {
    width: 300,
    height: 200,
    justifyContent: "center",
    alignItems: "center",

  },
  cardImage: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
    borderRadius: theme.borderRadius.md,
    overflow: "hidden",

  },
  overlayText: {
    color: theme.colors.text.inverse,
    fontWeight: theme.fontWeight.bold,
    fontSize: theme.fontSize.lg,
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
    bottom: 90,
    left: 10,
  },
  infoCard: {
    alignItems: "center",
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    ...theme.shadows.sm,
  },
  infoText: {
    fontSize: theme.fontSize.md,
    marginTop: theme.spacing.sm,
    color: theme.colors.text.primary,
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: theme.spacing.xl,
    width: "100%",
  },
  button: {
    width: "48%",
  },
});
