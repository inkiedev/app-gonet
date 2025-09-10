import Back from '@/assets/images/iconos gonet back.svg';
import { Header } from "@/components/layout/header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/custom-button";
import { Input } from "@/components/ui/custom-input";
import { Select } from "@/components/ui/custom-select";
import Text from '@/components/ui/custom-text';
import { Map, MapRef } from "@/components/ui/map";
import { useTheme } from "@/contexts/theme-context";
import { useCoverage } from "@/hooks/useCoverage";
import { useLocation } from "@/hooks/useLocation";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ReferidoForm {
  nombre: string;
  correo: string;
  telefono: string;
  callePrincipal: string;
  calleSecundaria: string;
  referencia: string;
  horarioDisponibilidad: string;
}

interface FormErrors extends Partial<ReferidoForm> {
  location?: string;
}

const HORARIOS_OPTIONS = [
  { value: 'mañana', label: 'Mañana (8:00 - 12:00)' },
  { value: 'tarde', label: 'Tarde (12:00 - 17:00)' },
  { value: 'noche', label: 'Noche (17:00 - 20:00)' },
  { value: 'flexible', label: 'Horario flexible' },
];

const COVERAGE_POLYGONS = [
  {
    coordinates: [
      { latitude: -2.8700, longitude: -79.0300 },
      { latitude: -2.8700, longitude: -78.9500 },
      { latitude: -2.9500, longitude: -78.9500 },
      { latitude: -2.9500, longitude: -79.0300 },
    ],
    strokeColor: '#007AFF',
    fillColor: '#007AFF20',
    strokeWidth: 2,
  },
];

export default function ReferirScreen() {
  const { theme } = useTheme();
  const dynamicStyles = createDynamicStyles(theme);
  
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const [selectedLocation, setSelectedLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [locationVerified, setLocationVerified] = useState(false);
  const [showExpandedMap, setShowExpandedMap] = useState(false);
  
  const [formData, setFormData] = useState<ReferidoForm>({
    nombre: '',
    correo: '',
    telefono: '',
    callePrincipal: '',
    calleSecundaria: '',
    referencia: '',
    horarioDisponibilidad: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { coordinates, hasPermission, getLocationWithPermission } = useLocation();
  const { isPointCovered } = useCoverage({ polygons: COVERAGE_POLYGONS });
  
  const mapRef = useRef<MapRef>(null);
  const expandedMapRef = useRef<MapRef>(null);

  const handleTermsPress = useCallback(() => {
    Linking.openURL('https://example.com/terminos-condiciones');
  }, []);

  const handleLocationSelect = useCallback((event: any) => {
    console.log('Location select event:', event);
    
    if (!event || !event.coordinate || typeof event.coordinate.latitude === 'undefined' || typeof event.coordinate.longitude === 'undefined') {
      console.warn('Invalid coordinate data:', event);
      return;
    }
    
    const { coordinate } = event;
    setSelectedLocation(coordinate);
    
    const covered = isPointCovered(coordinate);
    setLocationVerified(covered);
    
    if (!covered) {
      setErrors(prev => ({ ...prev, location: 'Esta ubicación no está dentro del área de cobertura' }));
    } else {
      setErrors(prev => ({ ...prev, location: undefined }));
    }

    setTimeout(() => {
      mapRef.current?.animateToRegion({
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
      });
    }, 100);
  }, [isPointCovered]);

  const handleGetCurrentLocation = useCallback(async (useExpandedMap = false) => {
    const location = await getLocationWithPermission();
    if (location && location.coords) {
      const coordinate = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      if (useExpandedMap) {
        expandedMapRef.current?.animateToRegion({
          latitude: coordinate.latitude,
          longitude: coordinate.longitude,
        });
        setTimeout(() => {
          mapRef.current?.animateToRegion({
            latitude: coordinate.latitude,
            longitude: coordinate.longitude,
          });
        }, 100);
      } else {
        mapRef.current?.animateToRegion({
          latitude: coordinate.latitude,
          longitude: coordinate.longitude,
        });
      }
    }
  }, [getLocationWithPermission, isPointCovered]);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.correo.trim()) newErrors.correo = 'El correo es requerido';
    else if (!/\S+@\S+\.\S+/.test(formData.correo)) newErrors.correo = 'Correo inválido';
    if (!formData.telefono.trim()) newErrors.telefono = 'El teléfono es requerido';
    if (!formData.callePrincipal.trim()) newErrors.callePrincipal = 'La calle principal es requerida';
    if (!formData.calleSecundaria.trim()) newErrors.calleSecundaria = 'La calle secundaria es requerida';
    if (!formData.horarioDisponibilidad) newErrors.horarioDisponibilidad = 'Selecciona un horario';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm() || !locationVerified || !selectedLocation) return;
    
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Referido enviado:', {
        ...formData,
        ubicacion: selectedLocation,
      });
      
      router.back();
      
    } catch (error) {
      console.error('Error al enviar referido:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, selectedLocation, locationVerified, validateForm]);

  const renderTermsSection = () => (
    <Card style={dynamicStyles.sectionCard}>
      <View style={dynamicStyles.sectionHeader}>
        <MaterialIcons name="gavel" size={24} color={theme.colors.primary} />
        <Text style={dynamicStyles.sectionTitle}>Términos y Condiciones</Text>
      </View>
      
      <Text style={dynamicStyles.sectionDescription}>
        Para continuar con el proceso de referido, debes aceptar nuestros términos y condiciones.
      </Text>
      
      <View style={dynamicStyles.termsContainer}>
        <TouchableOpacity
          style={dynamicStyles.checkboxContainer}
          onPress={() => setTermsAccepted(!termsAccepted)}
        >
          <View style={[dynamicStyles.checkbox, termsAccepted && dynamicStyles.checkboxChecked]}>
            {termsAccepted && (
              <Ionicons name="checkmark" size={16} color={theme.colors.text.button} />
            )}
          </View>
          <Text style={dynamicStyles.checkboxText}>
            Acepto los{' '}
            <Text style={dynamicStyles.linkText} onPress={handleTermsPress}>
              términos y condiciones
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  const renderLocationSection = () => (
    <Card style={dynamicStyles.sectionCard}>
      <View style={dynamicStyles.sectionHeader}>
        <Ionicons name="location" size={24} color={theme.colors.primary} />
        <Text style={dynamicStyles.sectionTitle}>Ubicación del Referido</Text>
      </View>
      
      <Text style={dynamicStyles.sectionDescription}>
        Selecciona la ubicación donde vive el referido para verificar la cobertura.
      </Text>

      <View style={dynamicStyles.mapContainer}>
        <Map
          ref={mapRef}
          style={dynamicStyles.map}
          initialRegion={{
            latitude: coordinates?.latitude || -2.8700,
            longitude: coordinates?.longitude || -78.9900,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          polygons={COVERAGE_POLYGONS}
          onPress={handleLocationSelect}
          markers={selectedLocation ? [{
            id: 'selected',
            coordinate: selectedLocation,
            title: 'Ubicación seleccionada',
            description: locationVerified ? 'Área con cobertura' : 'Sin cobertura',
          }] : []}
          userLocation={coordinates}
        />
        
        <View style={dynamicStyles.mapControls}>
          <TouchableOpacity
            style={dynamicStyles.mapButton}
            onPress={() => handleGetCurrentLocation()}
            disabled={!hasPermission}
          >
            <Ionicons name="locate" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={dynamicStyles.mapButton}
            onPress={() => setShowExpandedMap(true)}
          >
            <Ionicons name="expand" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {selectedLocation && (
        <View style={[
          dynamicStyles.coverageStatus,
          { backgroundColor: locationVerified ? theme.colors.success + '15' : theme.colors.error + '15' }
        ]}>
          <Ionicons
            name={locationVerified ? "checkmark-circle" : "close-circle"}
            size={20}
            color={locationVerified ? theme.colors.success : theme.colors.error}
          />
          <Text style={[
            dynamicStyles.coverageText,
            { color: locationVerified ? theme.colors.success : theme.colors.error }
          ]}>
            {locationVerified ? 'Ubicación con cobertura' : 'Ubicación sin cobertura'}
          </Text>
        </View>
      )}

      {errors.location && (
        <Text style={dynamicStyles.errorText}>{errors.location}</Text>
      )}
    </Card>
  );

  const renderFormSection = () => (
    <Card style={dynamicStyles.sectionCard}>
      <View style={dynamicStyles.sectionHeader}>
        <Ionicons name="person-add" size={24} color={theme.colors.primary} />
        <Text style={dynamicStyles.sectionTitle}>Datos del Referido</Text>
      </View>

      <View style={dynamicStyles.formContainer}>
        <Input
          label="Nombre completo"
          placeholder="Ingresa el nombre completo"
          value={formData.nombre}
          onChangeText={(text) => setFormData(prev => ({ ...prev, nombre: text }))}
          error={errors.nombre}
          style={dynamicStyles.input}
        />

        <Input
          label="Correo electrónico"
          placeholder="correo@ejemplo.com"
          value={formData.correo}
          onChangeText={(text) => setFormData(prev => ({ ...prev, correo: text }))}
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.correo}
          style={dynamicStyles.input}
        />

        <Input
          label="Número de contacto"
          placeholder="0987654321"
          value={formData.telefono}
          onChangeText={(text) => setFormData(prev => ({ ...prev, telefono: text }))}
          keyboardType="phone-pad"
          error={errors.telefono}
          style={dynamicStyles.input}
        />

        <Input
          label="Calle principal"
          placeholder="Ej: Av. 9 de Octubre"
          value={formData.callePrincipal}
          onChangeText={(text) => setFormData(prev => ({ ...prev, callePrincipal: text }))}
          error={errors.callePrincipal}
          style={dynamicStyles.input}
        />

        <Input
          label="Calle secundaria"
          placeholder="Ej: García Moreno"
          value={formData.calleSecundaria}
          onChangeText={(text) => setFormData(prev => ({ ...prev, calleSecundaria: text }))}
          error={errors.calleSecundaria}
          style={dynamicStyles.input}
        />

        <Input
          label="Referencia"
          placeholder="Ej: Casa blanca con portón negro"
          value={formData.referencia}
          onChangeText={(text) => setFormData(prev => ({ ...prev, referencia: text }))}
          style={dynamicStyles.input}
          error={errors.referencia}
          multiline
        />

        <Select
          label="Horario de disponibilidad"
          placeholder="Selecciona un horario"
          options={HORARIOS_OPTIONS}
          value={formData.horarioDisponibilidad}
          onValueChange={(value) => setFormData(prev => ({ ...prev, horarioDisponibilidad: value }))}
          error={errors.horarioDisponibilidad}
          style={dynamicStyles.input}
          renderItem={(option, index, isSelected) => (
            <View style={dynamicStyles.selectOption}>
              <Text style={[
                dynamicStyles.selectOptionText,
                isSelected && { color: theme.colors.primary }
              ]}>
                {option.value}
              </Text>
              {isSelected && (
                <Ionicons name="checkmark" size={16} color={theme.colors.primary} />
              )}
            </View>
          )}
        />
      </View>
    </Card>
  );

  const renderExpandedMap = () => (
    <Modal visible={showExpandedMap} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <Header
          leftAction={{
            icon: <Ionicons name="close" size={24} color={theme.colors.text.primary} />,
            onPress: () => setShowExpandedMap(false),
          }}
          title="Seleccionar Ubicación"
        />
        
        <View style={{ flex: 1 }}>
          <Map
            ref={expandedMapRef}
            style={{ flex: 1 }}
            initialRegion={{
              latitude: selectedLocation?.latitude || coordinates?.latitude || -2.8700,
              longitude: selectedLocation?.longitude || coordinates?.longitude || -78.9900,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
            polygons={COVERAGE_POLYGONS}
            onPress={handleLocationSelect}
            markers={selectedLocation ? [{
              id: 'selected',
              coordinate: selectedLocation,
              title: 'Ubicación seleccionada',
              description: locationVerified ? 'Área con cobertura' : 'Sin cobertura',
            }] : []}
            userLocation={coordinates}
          />
          
          <View style={dynamicStyles.expandedMapControls}>
            <TouchableOpacity
              style={dynamicStyles.floatingButton}
              onPress={() => handleGetCurrentLocation(true)}
              disabled={!hasPermission}
            >
              <Ionicons name="locate" size={24} color={theme.colors.text.button} />
            </TouchableOpacity>
          </View>

          {selectedLocation && (
            <View style={dynamicStyles.expandedMapStatus}>
              <View style={[
                dynamicStyles.statusCard,
              ]}>
                <Ionicons
                  name={locationVerified ? "checkmark-circle" : "close-circle"}
                  size={24}
                  color={locationVerified ? theme.colors.success : theme.colors.error}
                />
                <Text style={[
                  dynamicStyles.statusText,
                  { color: locationVerified ? theme.colors.success : theme.colors.error }
                ]}>
                  {locationVerified ? 'Ubicación con cobertura' : 'Ubicación sin cobertura'}
                </Text>
              </View>
            </View>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );

  const canProceed = termsAccepted && locationVerified && selectedLocation;

  return (
    <SafeAreaView style={dynamicStyles.container} edges={['top']}>
      <Header
        leftAction={{
          icon: <Back width={24} height={24} color={theme.colors.text.primary} />,
          onPress: () => router.back(),
        }}
        title="Referir Cliente"
      />

      <ScrollView 
        style={dynamicStyles.scrollView} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {renderTermsSection()}
        
        {termsAccepted && renderLocationSection()}
        
        {canProceed && renderFormSection()}

        {canProceed && (
          <View style={dynamicStyles.submitContainer}>
            <Button
              title={isSubmitting ? "Enviando..." : "Referir Cliente"}
              onPress={handleSubmit}
              variant="primary"
              disabled={isSubmitting}
              icon={<Ionicons name="send" size={20} color={theme.colors.text.button} />}
              style={dynamicStyles.submitButton}
            />
          </View>
        )}
      </ScrollView>

      {renderExpandedMap()}
    </SafeAreaView>
  );
}

const createDynamicStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  sectionCard: {
    margin: theme.spacing.lg,
    marginBottom: 0,
    padding: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.sm,
  },
  sectionDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.secondary,
    lineHeight: 20,
    marginBottom: theme.spacing.lg,
  },
  
  // Terms Section
  termsContainer: {
    marginTop: theme.spacing.md,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: theme.colors.border.light,
    borderRadius: 4,
    marginRight: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  checkboxText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.primary,
    flex: 1,
  },
  linkText: {
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  },
  
  // Location Section
  mapContainer: {
    position: 'relative',
    height: 200,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    marginBottom: theme.spacing.md,
  },
  map: {
    flex: 1,
  },
  mapControls: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  mapButton: {
    width: 40,
    height: 40,
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  coverageStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  coverageText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    marginLeft: theme.spacing.sm,
  },
  errorText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
  
  // Form Section
  formContainer: {
    gap: theme.spacing.md,
  },
  selectOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.sm,
  },
  selectOptionText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.primary,
    flex: 1,
  },
  input: {
    marginBottom: 0
  },
  
  // Expanded Map
  expandedMapControls: {
    position: 'absolute',
    bottom: theme.spacing.xl,
    right: theme.spacing.lg,
  },
  floatingButton: {
    width: 56,
    height: 56,
    backgroundColor: theme.colors.primary,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  expandedMapStatus: {
    position: 'absolute',
    bottom: theme.spacing.lg,
    left: theme.spacing.lg,
    right: 80,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: theme.colors.surface,
    width: '80%'
  },
  statusText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    marginLeft: theme.spacing.sm,
  },
  
  // Submit Section
  submitContainer: {
    margin: theme.spacing.lg,
    marginTop: theme.spacing.xl,
  },
  submitButton: {
    height: 56,
  },
});