import Back from '@/assets/images/iconos gonet back.svg';
import { Header } from "@/components/layout/header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/custom-button";
import { Input } from "@/components/ui/custom-input";
import { Select } from "@/components/ui/custom-select";
import Text from '@/components/ui/custom-text';
import LocationPicker, { LocationPickerRef } from "@/components/ui/location-picker";
import { useTheme } from "@/contexts/theme-context";
import { Coordinate } from "@/hooks/useCoverage";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
  Linking,
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
  
  const [selectedLocation, setSelectedLocation] = useState<Coordinate | null>(null);
  const [locationVerified, setLocationVerified] = useState(false);
  
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

  const locationPickerRef = useRef<LocationPickerRef>(null);

  const handleTermsPress = useCallback(() => {
    Linking.openURL('https://example.com/terminos-condiciones');
  }, []);

  const handleLocationSelect = useCallback((coordinate: Coordinate, isVerified: boolean) => {
    setSelectedLocation(coordinate);
    setLocationVerified(isVerified);
  }, []);

  const handleLocationError = useCallback((error: string | undefined) => {
    setErrors(prev => ({ ...prev, location: error }));
  }, []);

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

      <LocationPicker
        ref={locationPickerRef}
        polygons={COVERAGE_POLYGONS}
        onLocationSelect={handleLocationSelect}
        onLocationError={handleLocationError}
        selectedLocation={selectedLocation}
        mapHeight={200}
        style={dynamicStyles.locationPickerContainer}
      />

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
  locationPickerContainer: {
    marginBottom: theme.spacing.md,
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
  
  // Submit Section
  submitContainer: {
    margin: theme.spacing.lg,
    marginTop: theme.spacing.xl,
  },
  submitButton: {
    height: 56,
  },
});