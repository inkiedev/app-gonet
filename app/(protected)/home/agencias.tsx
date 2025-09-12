import LogoCall from '@/assets/icons/phone.svg';
import LogoMensaje from '@/assets/images/iconos gonet app svg_mensaje.svg';
import LogoUbicacion from "@/assets/images/iconos gonet app svg_ubicacion.svg";
import Back from "@/assets/images/iconos gonet back.svg";
import LogoNaviagation from "@/assets/images/icons/navigation.svg";
import LogoSearch from "@/assets/images/icons/search.svg";
import { Header } from "@/components/layout/header";
import { BOTTOM_SHEET_MIN_HEIGHT, BottomSheet, BottomSheetRef } from "@/components/ui/bottom-sheet";
import { Input as CustomInput } from "@/components/ui/custom-input";
import Text from "@/components/ui/custom-text";
import { Map, MapRef } from "@/components/ui/map";
import { useTheme } from "@/contexts/theme-context";
import { AgencyData, getAgencies, getImageLink } from "@/services/public-api";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  LayoutAnimation,
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
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
  width?: number;
  height?: number;
};
const DAYS_MAP: Record<string, string> = {
  "0": "Lunes",
  "1": "Martes",
  "2": "Miércoles",
  "3": "Jueves",
  "4": "Viernes",
  "5": "Sábado",
  "6": "Domingo",
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
    <View style={[styles.line, { backgroundColor: theme.colors.primaryDark }]} />
    <Text style={[styles.titleText, { color: theme.colors.primaryDark }]}>
      {text}
    </Text>
    <View style={[styles.line, { backgroundColor: theme.colors.primaryDark }]} />
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

  const handlePhonePress = () => {
    if (agency.phone) {
      Linking.openURL(`tel:${agency.phone}`);
    }
  };

  const handleEmailPress = () => {
    if (agency.email) {
      Linking.openURL(`mailto:${agency.email}`);
    }
  };

  return (
    <TouchableWithoutFeedback>
      <Animated.View style={[dynamicStyles.agencyInfoContainer, style]}>
        <Text style={dynamicStyles.agencyTitle}>{agency.name}</Text>
        <View style={dynamicStyles.detailItem}>
          <LogoUbicacion width={24} height={24} color={theme.colors.primaryDark} fill = {theme.colors.primaryDark}/>
          <Text style={dynamicStyles.detailValue}>{agency.address}</Text>
        </View>
        <TouchableOpacity onPress={handlePhonePress}>
          <View style={dynamicStyles.detailItem}>
            <LogoCall width={24} height={24} color={theme.colors.primaryDark} />
            <Text style={dynamicStyles.detailValue}>{agency.phone}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleEmailPress}>
          <View style={dynamicStyles.detailItem}>
            <LogoMensaje width={24} height={24} color={theme.colors.primaryDark} />
            <Text style={dynamicStyles.detailValue}>{agency.email}</Text>
          </View>
        </TouchableOpacity>
        <View style={dynamicStyles.separator} />
        
          <Text style={dynamicStyles.scheduleTitle}>Horario</Text>  
        
        <View style={dynamicStyles.scheduleContainer}>
          {agency.days_schedule.map((dia, index) => (
            <View key={index} style={dynamicStyles.scheduleItem}>
              <Text style={dynamicStyles.scheduleDay}>{DAYS_MAP[dia.dia]}</Text>
              <Text style={dynamicStyles.scheduleTime}>
                {dia.start_time}:00 - {dia.end_time}:00
              </Text>
            </View>
          ))}
        </View>
        <View style={dynamicStyles.separator} />

        <TouchableOpacity onPress={handleSendToMaps} style={dynamicStyles.mapsButton}>
          <LogoNaviagation width={24} height={16} color={theme.colors.primaryDark} fill = {theme.colors.primaryDark} />
          <Text style={dynamicStyles.mapsButtonText}>Enviar ruta a Maps</Text>
        </TouchableOpacity>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const CityGroup = ({ city, agencies, onCitySelect, onAgencyPress }: { city: string; agencies: Agency[]; onCitySelect: (city: string) => void; onAgencyPress: (agency: Agency) => void; }) => {
  const { theme } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const toggleExpand = () => {
    const toValue = expanded ? 0 : 1;
    setExpanded(!expanded);

    Animated.timing(animation, {
      toValue,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();

    if (!expanded) {
      onCitySelect(city);
    }
  };

  const rotateStyle = {
    transform: [
      {
        rotate: animation.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", "90deg"],
        }),
      },
    ],
  };

  const animatedStyle = {
    maxHeight: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1000], // A large enough value to show all content
    }),
    opacity: animation,
  };

  return (
    <View style={styles.cityGroupContainer}>
      <TouchableOpacity style={[styles.cityHeader, { backgroundColor: '#808080' }]} onPress={toggleExpand} activeOpacity={0.8}>
        <Text style={[styles.cityTitle, { color: 'white' }]}>{city}</Text>
        <Animated.View style={rotateStyle}>
          <Text style={{ color: theme.colors.primary, fontSize: 20 }}>▶</Text>
        </Animated.View>
      </TouchableOpacity>
      <Animated.View style={[{ overflow: 'hidden' }, animatedStyle]}>
        <View style={styles.agencyListContainer}>
          {agencies.map((agency) => (
            <TouchableOpacity key={agency.id} style={styles.agencyListItem} onPress={() => onAgencyPress(agency)}>
              <Text style={{ color: theme.colors.text.primary, fontWeight: "bold" }}>{agency.name}</Text>
              <Text style={{ color: theme.colors.text.secondary }}>{agency.address}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
    </View>
  );
};

// --- Main Screen Component ---

export default function AgenciesScreen() {
  const { theme } = useTheme();
  const dynamicStyles = createDynamicStyles(theme);
  const router = useRouter();

  const bottomSheetRef = useRef<BottomSheetRef>(null);
  const mapRef = useRef<MapRef>(null);

  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  const [visibleAgency, setVisibleAgency] = useState<Agency | null>(null);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [isMapReady, setIsMapReady] = useState(false);

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
        image: typeof agency.id_img === 'number' ? getImageLink(agency.id_img) : undefined,
        width: 40,
        height: 40,
      })),
    [agencies]
  );

  const handleMarkerPress = useCallback(
    (marker: any) => {
      const agency = agencies.find((a) => a.id.toString() === marker.id);
      if (agency) {
        setSelectedAgency(agency);
        bottomSheetRef.current?.snapTo("down");
      }
    },
    [agencies]
  );

  const handleAgencyListPress = (agency: Agency) => {
    setSelectedAgency(agency);
    bottomSheetRef.current?.snapTo("down");
    mapRef.current?.animateToRegion({
      latitude: agency.latitude,
      longitude: agency.longitude,
    });
    console.log(agency)
  };

  const handleCitySelect = (city: string) => {
    // This might need a mapRef if we want to animate, but let's keep it simple for now
  };

  useEffect(() => {
    if (selectedAgency) {
      setVisibleAgency(selectedAgency);
    }
    Animated.timing(animatedValue, {
      toValue: selectedAgency ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      if (!selectedAgency) {
        setVisibleAgency(null);
      }
    });
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

  const defaultInitialRegion = {
    latitude: -1.8312,
    longitude: -78.1834,
    latitudeDelta: 7,
    longitudeDelta: 7,
  };

  useEffect(() => {
    if (isMapReady) {
      const region = userLocation
        ? { latitude: userLocation.latitude, longitude: userLocation.longitude }
        : agencies.length > 0
          ? { latitude: agencies[0].latitude, longitude: agencies[0].longitude }
          : null;

      if (region) {
        mapRef.current?.animateToRegion(region);
      }
    }
  }, [userLocation, agencies, isMapReady]);

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

      <>
        <Map
          ref={mapRef}
          initialRegion={defaultInitialRegion}
          style={styles.map}
          markers={markers}
          userLocation={userLocation}
          onMarkerPress={handleMarkerPress}
          onMapReady={() => setIsMapReady(true)}
        />

        {visibleAgency && (
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setSelectedAgency(null)}
          >
            <AgencyInfo
              agency={visibleAgency}
              style={animatedStyle}
              onClose={() => {
                setSelectedAgency(null);
              }}
            />
          </TouchableOpacity>
        )}

        <BottomSheet ref={bottomSheetRef}>
          <View style={styles.bottomSheetContent}>
            <TitleWithLines text="Buscar Agencia" theme={theme} />
            <CustomInput
              placeholder="Escribe el nombre de la agencia..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              leftIcon={<LogoSearch width={40} height={20} color={theme.colors.text.secondary} />}
            />
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
      alignSelf: "center",
      backgroundColor: theme.colors.background,
      paddingVertical: 5,
      paddingHorizontal: 15,
      borderRadius: 15,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 10,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      minWidth: 250,
    },

    agencyTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 5, color: "#009a92", textAlign: "center" },
    detailItem: { flexDirection: "row", marginBottom: 8, alignItems: "center", justifyContent: "center", columnGap: 10 },
    detailValue: { color: theme.colors.primaryDark, textAlign: "center" },
    scheduleTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.colors.primaryDark,
      textAlign: "center",
      marginVertical: 5,
    },
    scheduleContainer: {
      marginHorizontal: 10,
      marginBottom: 5,
    },
    scheduleItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 2,
    },
    scheduleDay: {
      color: theme.colors.text.primary,
      fontWeight: "bold",
    },
    scheduleTime: {
      color: theme.colors.text.secondary,
    },
    separator: {
      height: 1,
      backgroundColor: 'white',
      width: '100%',
      marginVertical: 0,
    },
    mapsButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10,
      justifyContent: 'center',
    },
    mapsButtonText: {
      color: "#009a92",
      marginLeft: 10,
      fontWeight: 'bold',
    },
    iconsContainer: { flexDirection: "row" },
    iconContainer: { marginLeft: 10 },
  });