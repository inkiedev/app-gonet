import { Header } from "@/components/layout/header";
import { Button as CustomButton } from "@/components/ui/custom-button";
import { Map } from "@/components/ui/map";
import { agencies, cities, neighborhoods, polygons, regionCoordinates } from "@/data/agencies";
import { useTheme } from "@/contexts/theme-context";
import * as Location from 'expo-location';
import { Router, useRouter } from "expo-router";
import Back from '@/assets/images/iconos gonet back.svg';
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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

interface Agency {
  id: string;
  name: string;
  address: string;
  phone: string;
  location: {
    latitude: number;
    longitude: number;
  };
  city: string;
}

interface MarkerData {
    id: string;
    title: string;
    description: string;
    coordinate: {
        latitude: number;
        longitude: number;
    };
    image: {
        uri: string;
    };
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

const CitySelector = ({ onCitySelect, router }: { onCitySelect: (city: City) => void, router: Router }) => {
    const { theme } = useTheme();
    const dynamicStyles = createDynamicStyles(theme);
    
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
                {cities.map(city => (
                    <CustomButton 
                        key={city.value} 
                        title={city.label} 
                        onPress={() => onCitySelect(city)} 
                        style={dynamicStyles.cityButton}
                    />
                ))}
            </View>
        </SafeAreaView>
    );
};

const NeighborhoodSelector = ({ city, selectedNeighborhood, onNeighborhoodSelect }: { city: City, selectedNeighborhood: Neighborhood | null, onNeighborhoodSelect: (neighborhood: Neighborhood | null) => void }) => {
    const { theme } = useTheme();
    const dynamicStyles = createDynamicStyles(theme);
    const availableNeighborhoods = neighborhoods[city.value] || [];
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
                    {availableNeighborhoods.map(neighborhood => (
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

const AgencyInfo = ({ agency, onClose }: { agency: Agency; onClose: () => void }) => {
    const { theme } = useTheme();
    const dynamicStyles = createDynamicStyles(theme);
    
    return (
        <View style={dynamicStyles.agencyInfoContainer}>
            <Text style={dynamicStyles.agencyTitle}>{agency.name}</Text>
            <Text>{agency.address}</Text>
            <Text>{agency.phone}</Text>
            <Button title="Cerrar" onPress={onClose} />
        </View>
    );
};


// --- Main Screen Component ---

export default function AgenciesScreen() {
    const { theme } = useTheme();
    const dynamicStyles = createDynamicStyles(theme);
    const [selectedCity, setSelectedCity] = useState<City | null>(null);
    const [selectedNeighborhood, setSelectedNeighborhood] = useState<Neighborhood | null>(null);
    const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
    const [showCityPolygon, setShowCityPolygon] = useState(true);
    const { userLocation } = useUserLocation();
    const router = useRouter();

    const handleMarkerPress = useCallback((marker: MarkerData) => {
        const agency = agencies.find(a => a.id === marker.id);
        if (agency) {
            setSelectedAgency(agency);
        }
    }, []);

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
        if (!selectedCity) return [];
        return agencies.filter(agency => agency.city === selectedCity.value);
    }, [selectedCity]);

    const markers: MarkerData[] = useMemo(() =>
        filteredAgencies.map(agency => ({
            id: agency.id,
            title: agency.name,
            description: agency.address,
            coordinate: agency.location,
            image: { uri: 'https://i.imgur.com/M010000.png' } // Placeholder icon
        })), [filteredAgencies]);

    const displayPolygon = useMemo(() => {
        if (selectedNeighborhood) {
            return [{
                coordinates: selectedNeighborhood.polygon,
                fillColor: 'rgba(255, 165, 0, 0.5)', // Orange for neighborhood
                strokeColor: 'rgba(255, 165, 0, 0.8)',
            }];
        }
        if (showCityPolygon && selectedCity && polygons[selectedCity.value]) {
            return [{
                coordinates: polygons[selectedCity.value],
                fillColor: 'rgba(164, 192, 37, 0.5)',
                strokeColor: 'rgba(0, 255, 72, 0.8)',
            }];
        }
        return [];
    }, [selectedCity, selectedNeighborhood, showCityPolygon]);

    const mapRegion = useMemo(() => {
        if (selectedNeighborhood) return selectedNeighborhood.region;
        if (selectedCity) return selectedCity.region;
        return regionCoordinates;
    }, [selectedCity, selectedNeighborhood]);

    if (!selectedCity) {
        return <CitySelector onCitySelect={handleCitySelect} router={router} />;
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

            {selectedAgency && (
                <AgencyInfo agency={selectedAgency} onClose={() => setSelectedAgency(null)} />
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
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    cityButton: {
        marginVertical: 8,
        width: '80%',
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
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 10,
    },
    agencyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
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