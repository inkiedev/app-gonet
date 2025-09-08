import LogoCall from '@/assets/icons/phone.svg';
import LogoMensaje from '@/assets/images/iconos gonet app svg_mensaje.svg';
import IconCiudad from "@/assets/images/iconos gonet app svg_ubicacion.svg";
import LogoWhatsapp from '@/assets/images/iconos gonet app svg_wpp.svg';
import Back from '@/assets/images/iconos gonet back.svg';
import { Header } from "@/components/layout/header";
import { Button as CustomButton } from "@/components/ui/custom-button";
import Text from '@/components/ui/custom-text';
import Loading from '@/components/ui/loading';
import { Map } from "@/components/ui/map";
import { useTheme } from "@/contexts/theme-context";
import { neighborhoods, polygons, regionCoordinates } from "@/data/agencies";
import { AgencyData, getAgencies, getImageLink } from "@/services/public-api";
import * as Location from 'expo-location';
import { Router, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Animated, Linking, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// --- Types ---
interface City {
  label: string;
  value: string;
  region: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
}

interface Neighborhood {
    label: string;
    value: string;
    polygon: { latitude: number; longitude: number }[];
    region: {
        latitude: number;
        longitude: number;
        latitudeDelta: number;
        longitudeDelta: number;
    };
}

type Agency = AgencyData; // Using the imported AgencyData

interface MarkerData {
    id: string;
    title: string;
    description: string;
    coordinate: {
        latitude: number;
        longitude: number;
    };
    image: string; // Changed to string
}


// --- Custom Hook for User Location ---
const useUserLocation = () => {
    const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.warn('Permission to access location was denied');
                return;
            }

            try {
                const location = await Location.getCurrentPositionAsync({});
                setUserLocation(location.coords);
            } catch (error) {
                console.error('Failed to get location:', error);
                // userLocation will remain null, which is the desired behavior
            }
        })();
    }, []);

    return { userLocation };
};


// --- UI Components ---

const CitySelector = ({ onCitySelect, router, cities, loading }: { onCitySelect: (city: City) => void, router: Router, cities: City[], loading: boolean }) => {
    const { theme } = useTheme();
    const dynamicStyles = createDynamicStyles(theme);

    if (loading) {
        return <Loading />;
    }
    
    return (
        <SafeAreaView style={dynamicStyles.container} edges={["top"]}>
            <Header
                leftAction={{
                    icon: <Back width={24} height={24} color={theme.colors.text.primary} />,
                    onPress: () => router.back(),
                }}
                title="Seleccionar Ciudad"
            />
            <View style={dynamicStyles.citySelectionContainer}>
                <Text style={dynamicStyles.subtitle}>Elige una ciudad para ver las agencias disponibles.</Text>
                {cities.map(city => (
                    <CustomButton 
                        key={city.value} 
                        title={city.label} 
                        onPress={() => onCitySelect(city)} 
                        style={dynamicStyles.cityButton}
                        icon={<IconCiudad width={40} height={24} color={theme.colors.text.primary}  />}
                    />
                ))}
            </View>
        </SafeAreaView>
    );
};

const NeighborhoodSelector = ({ city, selectedNeighborhood, onNeighborhoodSelect }: { city: City, selectedNeighborhood: Neighborhood | null, onNeighborhoodSelect: (neighborhood: Neighborhood | null) => void }) => {
    const { theme } = useTheme();
    const dynamicStyles = createDynamicStyles(theme);
    const availableNeighborhoods = (neighborhoods as any)[city.value] || [];
    const [showRightArrow, setShowRightArrow] = useState(false);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [containerWidth, setContainerWidth] = useState(0);
    const [contentWidth, setContentWidth] = useState(0);
    const scrollViewRef = useRef<ScrollView>(null);
    const [scrollPosition, setScrollPosition] = useState(0);

    useEffect(() => {
        const scrollable = contentWidth > containerWidth;
        const notAtEnd = contentWidth - scrollPosition > containerWidth + 10;
        setShowRightArrow(scrollable && notAtEnd);
        setShowLeftArrow(scrollable && scrollPosition > 0);
    }, [containerWidth, contentWidth, scrollPosition]);

    const handleScroll = (event: any) => {
        setScrollPosition(event.nativeEvent.contentOffset.x);
    };

    const handleRightArrowPress = () => {
        if (scrollViewRef.current) {
            const newPosition = scrollPosition + containerWidth * 0.8;
            scrollViewRef.current.scrollTo({ x: newPosition, animated: true });
        }
    };

    const handleLeftArrowPress = () => {
        if (scrollViewRef.current) {
            const newPosition = scrollPosition - containerWidth * 0.8;
            scrollViewRef.current.scrollTo({ x: newPosition, animated: true });
        }
    };

    if (availableNeighborhoods.length === 0) {
        return null;
    }

    return (
        <View style={dynamicStyles.neighborhoodSelectorContainer}>
            <Text style={dynamicStyles.neighborhoodSelectorTitle}>Seleccionar Barrio</Text>
            <View 
                style={dynamicStyles.scrollViewContainer}
                onLayout={(event) => setContainerWidth(event.nativeEvent.layout.width)}
            >
                {showLeftArrow && (
                    <View style={dynamicStyles.arrowContainerLeft}>
                    <TouchableOpacity onPress={handleLeftArrowPress} activeOpacity={0.7}>
                        <Text style={dynamicStyles.arrowText}>‹</Text>
                    </TouchableOpacity>
                    
                    </View>

                    
                    

                )}
                
                <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    onContentSizeChange={setContentWidth}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    contentContainerStyle={dynamicStyles.neighborhoodButtonsContainer}
                >
                    {availableNeighborhoods.map((neighborhood: Neighborhood) => (
                        <CustomButton
                            key={neighborhood.value}
                            title={neighborhood.label}
                            onPress={() => onNeighborhoodSelect(neighborhood)}
                            variant={selectedNeighborhood?.value === neighborhood.value ? 'pressed' : 'primary'}
                            style={dynamicStyles.neighborhoodButton}
                        />
                    ))}
                    <CustomButton
                        title="Limpiar"
                        onPress={() => onNeighborhoodSelect(null)}
                        variant="secondary"
                        style={dynamicStyles.neighborhoodButton}
                    />
                </ScrollView>
                {showRightArrow && (
                    <TouchableOpacity onPress={handleRightArrowPress} style={dynamicStyles.arrowContainerRight} activeOpacity={0.7}>
                        <Text style={dynamicStyles.arrowText}>›</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const AgencyInfo = ({ agency, onClose, style }: { agency: Agency; onClose: () => void; style?: any }) => {
    const { theme } = useTheme();
    const dynamicStyles = createDynamicStyles(theme);
    const weekDays: { [key: string]: string } = {
        "0": "Lunes",
        "1": "Martes",
        "2": "Miércoles",
        "3": "Jueves",
        "4": "Viernes",
        "5": "Sábado",
        "6": "Domingo",
    };

    const DetailItem = ({ label, value, icons }: { label: string, value: string | boolean | undefined, icons?: { icon: React.ReactNode, onPress: () => void }[] }) => {
        if (typeof value !== 'string' || !value) return null;
        return (
            <View style={dynamicStyles.detailItem}>
                <Text style={dynamicStyles.detailLabel}>{label}:</Text>
                <Text style={dynamicStyles.detailValue}>{value}</Text>
                <View style={dynamicStyles.iconsContainer}>
                    {icons && icons.map((iconData, index) => (
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
                    {
                        icon: <LogoCall width={24} height={24} color={theme.colors.text.primary} />,
                        onPress: () => Linking.openURL(`tel:${agency.phone}`)
                    },
                    {
                        icon: <LogoWhatsapp width={24} height={24} fill={theme.colors.text.primary} color={theme.colors.text.primary} />,
                        onPress: () => Linking.openURL(`whatsapp://send?phone=${agency.phone}`)
                    }
                ]}
            />
            <DetailItem 
                label="Correo" 
                value={agency.email} 
                icons={[
                    {
                        icon: <LogoMensaje width={24} height={24} color={theme.colors.text.primary} />,
                        onPress: () => Linking.openURL(`mailto:${agency.email}`)
                    }
                ]}
            />
            <DetailItem label="Sitio Web" value={agency.website} />
            <DetailItem label="Horario General" value={agency.schedule} />
            
            {agency.days_schedule && agency.days_schedule.length > 0 && (
                <View style={dynamicStyles.scheduleContainer}>
                    <Text style={dynamicStyles.detailLabel}>Horario por día:</Text>
                    {agency.days_schedule.map(day => (
                        <Text key={day.dia} style={dynamicStyles.scheduleItem}>
                            {`${weekDays[day.dia]}: ${day.start_time}:00 - ${day.end_time}:00`}
                        </Text>
                    ))}
                </View>
            )}
            <CustomButton title="Cerrar" onPress={onClose} style={{marginTop: 10}}/>
        </Animated.View>
    );
};


// --- Main Screen Component ---

export default function AgenciesScreen() {
    const { theme } = useTheme();
    const dynamicStyles = createDynamicStyles(theme);
    const [selectedCity, setSelectedCity] = useState<City | null>(null);
    const [selectedNeighborhood, setSelectedNeighborhood] = useState<Neighborhood | null>(null);
    const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
    const [renderedAgency, setRenderedAgency] = useState<Agency | null>(null);
    const animatedValue = useRef(new Animated.Value(0)).current;
    const [showCityPolygon, setShowCityPolygon] = useState(true);
    const { userLocation } = useUserLocation();
    const router = useRouter();

    const [agenciesData, setAgenciesData] = useState<Agency[]>([]);
    const [loadingAgencies, setLoadingAgencies] = useState(true);

    useEffect(() => {
        const fetchAgencies = async () => {
            try {
                const data = await getAgencies();
                setAgenciesData(data);
            } catch (error) {
                console.error("Failed to fetch agencies:", error);
            } finally {
                setLoadingAgencies(false);
            }
        };
        fetchAgencies();
    }, []);

    const availableCities = useMemo(() => {
        const uniqueCities = new Set<string>();
        agenciesData.forEach(agency => {
            if (agency.city) {
                uniqueCities.add(agency.city);
            }
        });
        return Array.from(uniqueCities).map(city => ({
            label: city,
            value: city,
            region: regionCoordinates // Placeholder, ideally this would come from API or a more specific data source
        }));
    }, [agenciesData]);

    const handleMarkerPress = useCallback((marker: MarkerData) => {
        const agency = agenciesData.find(a => a.id.toString() === marker.id);
        if (agency) {
            setRenderedAgency(agency);
            setSelectedAgency(agency);
        }
    }, [agenciesData]);

    const handleCloseAgencyInfo = () => {
        setSelectedAgency(null);
    };

    useEffect(() => {
        if (selectedAgency) {
            Animated.timing(animatedValue, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(animatedValue, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                setRenderedAgency(null);
            });
        }
    }, [selectedAgency, animatedValue]);

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

    const handleCitySelect = (city: City) => {
        setSelectedCity(city);
        setSelectedNeighborhood(null);
        setShowCityPolygon(true);
    };

    const handleNeighborhoodSelect = (neighborhood: Neighborhood | null) => {
        setSelectedNeighborhood(neighborhood);
        setShowCityPolygon(false);
    };

    const filteredAgencies = useMemo(() => {
        if (!selectedCity) return agenciesData;
        return agenciesData.filter(agency => agency.city === selectedCity.value);
    }, [selectedCity, agenciesData]);

    const markers: MarkerData[] = useMemo(() =>
        filteredAgencies.map(agency => ({
            id: agency.id.toString(),
            title: agency.name,
            description: typeof agency.address === 'string' ? agency.address : '',
            coordinate: { latitude: agency.latitude, longitude: agency.longitude },
            image: agency.id_img ? getImageLink(agency.id_img as number) : 'https://cdn-icons-png.flaticon.com/512/458/458363.png' // Direct string URL
        })), [filteredAgencies]);

    const displayPolygon = useMemo(() => {
        if (selectedNeighborhood) {
            return [{
                coordinates: selectedNeighborhood.polygon,
                fillColor: 'rgba(255, 165, 0, 0.5)', // Orange for neighborhood
                strokeColor: 'rgba(255, 165, 0, 0.8)',
            }];
        }
        if (showCityPolygon && selectedCity && (polygons as any)[selectedCity.value]) {
            return [{
                coordinates: (polygons as any)[selectedCity.value],
                fillColor: 'rgba(164, 192, 37, 0.5)',
                strokeColor: 'rgba(0, 255, 72, 0.8)',
            }];
        }
        return [];
    }, [selectedCity, selectedNeighborhood, showCityPolygon, polygons]);

        const mapRegion = useMemo(() => {
        if (selectedNeighborhood) return selectedNeighborhood.region;

        if (selectedCity) {
            // If the selected city's region is the generic default, or not suitable
            // The condition `selectedCity.region === regionCoordinates` checks if it's the default placeholder.
            // The second part `!(...)` checks if the region has zero values for lat/lon/deltas.
            if (selectedCity.region === regionCoordinates ||
                !(selectedCity.region.latitude !== 0 && selectedCity.region.longitude !== 0 &&
                  selectedCity.region.latitudeDelta !== 0 && selectedCity.region.longitudeDelta !== 0)) {
                // Find the first agency in this city
                const firstAgencyInCity = agenciesData.find(agency => agency.city === selectedCity.value);
                if (firstAgencyInCity) {
                    return {
                        latitude: firstAgencyInCity.latitude,
                        longitude: firstAgencyInCity.longitude,
                        latitudeDelta: 0.0922, // Default delta, can be adjusted
                        longitudeDelta: 0.0421, // Default delta, can be adjusted
                    };
                }
            } else {
                // If selectedCity.region is specific and suitable, use it
                return selectedCity.region;
            }
        } else if (agenciesData.length > 0) { // This else if handles the case where no city is selected
            const firstAgency = agenciesData[0];
            return {
                latitude: firstAgency.latitude,
                longitude: firstAgency.longitude,
                latitudeDelta: 0.0922, // Default delta, can be adjusted
                longitudeDelta: 0.0421, // Default delta, can be adjusted
            };
        }
        return regionCoordinates; // Ultimate fallback
    }, [selectedCity, selectedNeighborhood, agenciesData]);

    if (!selectedCity) {
        return <CitySelector onCitySelect={handleCitySelect} router={router} cities={availableCities} loading={loadingAgencies} />;
    }

    return (
        <SafeAreaView style={dynamicStyles.container} edges={["top"]}>
            <Header
                leftAction={{
                    icon: <Back width={24} height={24} color={theme.colors.text.primary} />,
                    onPress: () => setSelectedCity(null),
                }}
                title={`Agencias en ${selectedCity.label}`}
            />

            <NeighborhoodSelector 
                city={selectedCity} 
                selectedNeighborhood={selectedNeighborhood}
                onNeighborhoodSelect={handleNeighborhoodSelect} 
            />

            <Map
                key={`${selectedCity.value}-${selectedNeighborhood?.value}`}
                initialRegion={mapRegion}
                style={dynamicStyles.map}
                markers={markers}
                polygons={displayPolygon}
                userLocation={userLocation}
                onMarkerPress={handleMarkerPress}
            />

            {renderedAgency && (
                <AgencyInfo
                    agency={renderedAgency}
                    onClose={handleCloseAgencyInfo}
                    style={animatedStyle}
                />
            )}
        </SafeAreaView>
    );
}

// --- Styles ---

const createDynamicStyles = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    map: {
        flex: 1
    },
    citySelectionContainer: {
        flex: 1,
        alignItems: 'stretch',
        padding: 20,
        paddingTop: 40,
    },
    cityButton: {
        marginVertical: 8,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        color: theme.colors.text.secondary,
    },
    neighborhoodSelectorContainer: {
        paddingVertical: 10,
        backgroundColor: '#f0f0f0',
    },
    neighborhoodSelectorTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
    },
    neighborhoodButtonsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    neighborhoodButton: {
        marginHorizontal: 5,
    },
    scrollViewContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
    },
    arrowContainerLeft: {
        position: 'absolute',
        left: theme.spacing.sm,
        
        
        borderWidth: 1.5,
        borderColor: 'rgba(69, 175, 94, 1)',
        justifyContent: 'center',
        paddingHorizontal: 8,
        backgroundColor: 'rgba(150, 204, 163, 1)',
        borderRadius: 5,
        zIndex: 2,
    },
    arrowContainerRight: {
        position: 'absolute',
        right: theme.spacing.sm,
        borderWidth: 1.5,
        borderColor: 'rgba(69, 175, 94, 1)',
        justifyContent: 'center',
        paddingHorizontal: 8,
        backgroundColor: 'rgba(150, 204, 163, 1)',
        borderRadius: 5,
    },
    arrowText: {
        fontSize: 30,
        bottom:4,
        color: '#edf5ebff',
        fontWeight: 'bold',
    },
    agencyInfoContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: theme.colors.background,
        padding: 20,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 10,
        borderWidth: 2,
        borderColor: theme.colors.primaryDark,
    },
    agencyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
        color: theme.colors.text.primary,
    },
    detailItem: {
        flexDirection: 'row',
        marginBottom: 4,
        alignItems: 'center',
        color: theme.colors.text.primary,
    },
    detailLabel: {
        fontWeight: 'bold',
        marginRight: 5,
        color: theme.colors.text.primary,
    },
    detailValue: {
        flex: 1,
        color: theme.colors.text.primary,
    },
    iconsContainer: {
        flexDirection: 'row',
    },
    iconContainer: {
        marginLeft: 10,
    },
    scheduleContainer: {
        marginTop: 8,
    },
    scheduleItem: {
        marginLeft: 10,
        color: theme.colors.text.primary,
    },


        fadeRight: {
          position: "absolute",
            top: 0,
            bottom: 0,
         left: 26,  // lo mueves hacia adentro desde la derecha
        width: 50,  // este será el ancho del gradiente
        zIndex: 1,
    },
});
