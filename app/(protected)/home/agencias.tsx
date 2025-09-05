import LogoMensaje from "@/assets/images/iconos gonet app svg_mensaje.svg";
import LogoWhatsapp from "@/assets/images/iconos gonet app svg_wpp.svg";
import Back from "@/assets/images/iconos gonet back.svg";
import LogoCall from "@/assets/images/icons/phone.svg";
import { Header } from "@/components/layout/header";
import { BOTTOM_SHEET_MIN_HEIGHT, BottomSheet } from "@/components/ui/bottom-sheet";
import { Button as CustomButton } from "@/components/ui/custom-button";
import { Input as CustomInput } from "@/components/ui/custom-input";
import Text from "@/components/ui/custom-text";
import { Map } from "@/components/ui/map";
import { useTheme } from "@/contexts/theme-context";
import { AgencyData, getAgencies } from "@/services/public-api";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  LayoutAnimation,
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// --- Types ---
type Agency = AgencyData;
type MarkerData = {
  id: string;
  title: string;
  description: string;
  coordinate: { latitude: number; longitude: number };
  image?: any;
};

// --- Custom Hook for User Location ---
const useUserLocation = () => {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Permission to access location was denied");
        return;
      }
      try {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation(location.coords);
      } catch (error) {
        console.error("Failed to get location:", error);
      }
    })();
  }, []);

  return { userLocation };
};

// --- UI Components ---

const TitleWithLines = ({ text, theme }: { text: string; theme: any }) => (
  <View style={styles.titleContainer}>
    <View style={[styles.line, { backgroundColor: theme.colors.primary }]} />
    <Text style={[styles.titleText, { color: theme.colors.text.primary }]}>
      {text}
    </Text>
    <View style={[styles.line, { backgroundColor: theme.colors.primary }]} />
  </View>
);

const AgencyInfo = ({ agency, style, onClose }: { agency: Agency; style?: any; onClose: () => void; }) => {
  const { theme } = useTheme();
  const dynamicStyles = createDynamicStyles(theme);

  const handleSendToMaps = () => {
    const { latitude, longitude, address } = agency;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&query=${encodeURIComponent(
      address ?? ""
    )}`;
    Linking.openURL(url);
  };

  const DetailItem = ({ label, value, icons }: { label: string; value: string | boolean | undefined; icons?: { icon: React.ReactNode; onPress: () => void }[] }) => {
    if (typeof value !== "string" || !value) return null;
    return (
      <View style={dynamicStyles.detailItem}>
        <Text style={dynamicStyles.detailLabel}>{label}:</Text>
        <Text style={dynamicStyles.detailValue}>{value}</Text>
        <View style={dynamicStyles.iconsContainer}>
          {icons &&
            icons.map((iconData, index) => (
              <TouchableOpacity key={index} onPress={iconData.onPress} style={dynamicStyles.iconContainer}>
                {iconData.icon}
              </TouchableOpacity>
            ))}
        </View>
      </View>
    );
  };

  return (
    <Animated.View style={[dynamicStyles.agencyInfoContainer, style]}>
      <Text style={dynamicStyles.agencyTitle}>{agency.name}</Text>
      <DetailItem label="Dirección" value={agency.address} />
      <DetailItem
        label="Teléfono"
        value={agency.phone}
        icons={[
          { icon: <LogoCall width={24} height={24} color={theme.colors.text.primary} />, onPress: () => Linking.openURL(`tel:${agency.phone}`) },
          { icon: <LogoWhatsapp width={24} height={24} fill={theme.colors.text.primary} color={theme.colors.text.primary} />, onPress: () => Linking.openURL(`whatsapp://send?phone=${agency.phone}`) },
        ]}
      />
      <DetailItem
        label="Correo"
        value={agency.email}
        icons={[{ icon: <LogoMensaje width={24} height={24} color={theme.colors.text.primary} />, onPress: () => Linking.openURL(`mailto:${agency.email}`) }]}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, gap: 10 }}>
            <CustomButton title="Enviar Ruta a Mapas" onPress={handleSendToMaps} style={{ flex: 1 }} />
            <CustomButton title="Cerrar" onPress={onClose} variant="secondary" style={{ flex: 1 }} />
      </View>
    </Animated.View>
  );
};

const CityGroup = ({ city, agencies, onCitySelect, onAgencyPress }: { city: string; agencies: Agency[]; onCitySelect: (city: string) => void; onAgencyPress: (agency: Agency) => void; }) => {
  const { theme } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const rotation = useRef(new Animated.Value(0)).current;

  const toggleExpand = () => {
    const toValue = expanded ? 0 : 1;
    Animated.timing(rotation, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);

    if (!expanded) {
      onCitySelect(city);
    }
  };

  const rotateStyle = {
    transform: [
      {
        rotate: rotation.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", "90deg"],
        }),
      },
    ],
  };

  return (
    <View style={styles.cityGroupContainer}>
      <TouchableOpacity style={[styles.cityHeader, { backgroundColor: '#808080' }]} onPress={toggleExpand} activeOpacity={0.8}>
        <Text style={[styles.cityTitle, { color: 'white' }]}>{city}</Text>
        <Animated.View style={rotateStyle}>
          <Text style={{ color: theme.colors.primary, fontSize: 20 }}>▶</Text>
        </Animated.View>
      </TouchableOpacity>
      {expanded && (
        <View style={styles.agencyListContainer}>
          {agencies.map((agency) => (
            <TouchableOpacity key={agency.id} style={styles.agencyListItem} onPress={() => onAgencyPress(agency)}>
              <Text style={{ color: theme.colors.text.primary, fontWeight: "bold" }}>{agency.name}</Text>
              <Text style={{ color: theme.colors.text.secondary }}>{agency.address}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

// --- Main Screen Component ---

export default function AgenciesScreen() {
  const { theme } = useTheme();
  const dynamicStyles = createDynamicStyles(theme);
  const router = useRouter();

  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  const animatedValue = useRef(new Animated.Value(0)).current;

  const { userLocation } = useUserLocation();

  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        const data = await getAgencies();
        setAgencies(data);
      } catch (error) {
        console.error("Failed to fetch agencies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAgencies();
  }, []);

  const groupedAgencies = useMemo(() => {
    return agencies.reduce((acc, agency) => {
      const city = agency.city || "Sin ciudad";
      if (!acc[city]) {
        acc[city] = [];
      }
      acc[city].push(agency);
      return acc;
    }, {} as Record<string, Agency[]>);
  }, [agencies]);

  const filteredCities = useMemo(() => {
    if (!searchQuery) {
      return groupedAgencies;
    }
    return Object.keys(groupedAgencies).reduce((acc, city) => {
      const filtered = groupedAgencies[city].filter((agency) =>
        agency.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (filtered.length > 0) {
        acc[city] = filtered;
      }
      return acc;
    }, {} as Record<string, Agency[]>);
  }, [searchQuery, groupedAgencies]);

  const markers: MarkerData[] = useMemo(
    () =>
      agencies.map((agency) => ({
        id: agency.id.toString(),
        title: agency.name,
        description: typeof agency.address === "string" ? agency.address : "",
        coordinate: { latitude: agency.latitude, longitude: agency.longitude },
      })),
    [agencies]
  );

  const handleMarkerPress = useCallback(
    (marker: any) => {
      const agency = agencies.find((a) => a.id.toString() === marker.id);
      if (agency) {
        setSelectedAgency(agency);
      }
    },
    [agencies]
  );

  const handleAgencyListPress = (agency: Agency) => {
    setSelectedAgency(agency);
  };

  const handleCitySelect = (city: string) => {
    // This might need a mapRef if we want to animate, but let's keep it simple for now
  };

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: selectedAgency ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [selectedAgency]);

  const animatedStyle = {
    opacity: animatedValue,
    transform: [
      {
        translateY: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [100, 0],
        }),
      },
    ],
  };

  const initialRegion = useMemo(() => {
    if (userLocation) {
      return { latitude: userLocation.latitude, longitude: userLocation.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 };
    }
    if (agencies.length > 0) {
      return { latitude: agencies[0].latitude, longitude: agencies[0].longitude, latitudeDelta: 10, longitudeDelta: 10 };
    }
    return undefined;
  }, [userLocation, agencies]);

  return (
    <SafeAreaView style={dynamicStyles.container} edges={['top']}>
      <Header
        title="Agencias"
        leftAction={{
          icon: <Back width={24} height={24} color={theme.colors.text.primary} />,
          onPress: () => router.back(),
        }}
        variant="transparent"
      />

      {!initialRegion ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={{ marginTop: 10, color: theme.colors.text.primary }}>Cargando mapa...</Text>
        </View>
      ) : (
        <>
          <Map
            initialRegion={initialRegion}
            style={styles.map}
            markers={markers}
            userLocation={userLocation}
            onMarkerPress={handleMarkerPress}
            onPress={() => {
              setSelectedAgency(null);
            }}
          />

          {selectedAgency && (
            <AgencyInfo
              agency={selectedAgency}
              style={animatedStyle}
              onClose={() => {
                setSelectedAgency(null);
              }}
            />
          )}

          <BottomSheet>
            <View style={styles.bottomSheetContent}>
              <TitleWithLines text="Buscar Agencia" theme={theme} />
              <CustomInput placeholder="Escribe el nombre de la agencia..." value={searchQuery} onChangeText={setSearchQuery} />
              <TitleWithLines text="Listado General" theme={theme} />
              {loading ? (
                <ActivityIndicator size="large" color={theme.colors.primary} />
              ) : (
                <ScrollView showsVerticalScrollIndicator={false}>
                  {Object.keys(filteredCities).map((city) => (
                    <CityGroup
                      key={city}
                      city={city}
                      agencies={filteredCities[city]}
                      onCitySelect={handleCitySelect}
                      onAgencyPress={handleAgencyListPress}
                    />
                  ))}
                </ScrollView>
              )}
            </View>
          </BottomSheet>
        </>
      )}
    </SafeAreaView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  map: { flex: 1 },
  centerContent: { justifyContent: "center", alignItems: "center", flex: 1 },
  bottomSheetContent: { paddingHorizontal: 20, flex: 1 },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 15,
  },
  line: { flex: 1, height: 1, backgroundColor: "#ccc" },
  titleText: { marginHorizontal: 15, fontSize: 18, fontWeight: "bold" },
  cityGroupContainer: { marginVertical: 5 },
  cityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  cityTitle: { fontSize: 16, fontWeight: "bold" },
  agencyListContainer: { paddingLeft: 15, marginTop: 5 },
  agencyListItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
});

const createDynamicStyles = (theme: any) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    agencyInfoContainer: {
      position: "absolute",
      bottom: BOTTOM_SHEET_MIN_HEIGHT + 20,
      left: 20,
      right: 20,
      backgroundColor: theme.colors.background,
      padding: 20,
      borderRadius: 15,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 10,
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    agencyTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 12, color: theme.colors.text.primary },
    detailItem: { flexDirection: "row", marginBottom: 4, alignItems: "center" },
    detailLabel: { fontWeight: "bold", marginRight: 5, color: theme.colors.text.primary },
    detailValue: { flex: 1, color: theme.colors.text.primary },
    iconsContainer: { flexDirection: "row" },
    iconContainer: { marginLeft: 10 },
  });
