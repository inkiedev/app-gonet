import { theme } from "@/styles/theme";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ItemProps {
  id: string;
  title: string;
  route?: string;
}

const gridItems: ItemProps[] = [
  { id: "1", title: "Agencias", route: "/home/agencias" },
  { id: "2", title: "Home", route: "/home" },
  { id: "3", title: "Pago", route: "/home/pagos" },
  { id: "4", title: "Go Club", route:"/home/goclub" },
  { id: "5", title: "Soporte", route: "/home/soporte" },
  { id: "6", title: "Perfil" , route: "/home/perfil" },
  { id: "7", title: "Calificanos", route: "/home/calificanos" },
  { id: "8", title: "Mi Plan", route: "/home/planes" },
  { id: "9", title: "Promociones", route: "/home/promociones" },
  { id: "10", title: "Servicios", route: "/home/servicios" },
  { id: "11", title: "Ajustes", route: "/home/ajustes" },
];

export default function IndexScreens() {
  const router = useRouter();

  const handleItemPress = (item: ItemProps) => {
    if (item.route) {
      router.push(item.route);
    }
  };

  const renderGridItem = ({ item }: { item: ItemProps }) => (
    <TouchableOpacity 
      style={styles.gridItem}
      onPress={() => handleItemPress(item)}
      activeOpacity={0.7}
    >
      <Text style={styles.gridText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: "https://picsum.photos/800/400" }}
          style={styles.image}
        />
      </View>

      <View style={styles.gridContainer}>
        <FlatList
          data={gridItems}
          renderItem={renderGridItem}
          keyExtractor={(item) => item.id}
          numColumns={3}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.colors.background,
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.text.primary,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  gridContainer: {
    flex: 1, 
    padding: theme.spacing.md,
  },
  gridItem: {
    flex: 1,
    margin: theme.spacing.xs,
    height: 80,
    backgroundColor: theme.colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    ...theme.shadows.md,
  },
  gridText: {
    color: theme.colors.text.primary,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    textAlign: "center",
  },
});