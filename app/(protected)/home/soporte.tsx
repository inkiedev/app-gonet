import Whatsapp from '@/assets/images/iconos gonet app svg_wpp.svg';
import Back from '@/assets/images/iconos gonet back.svg';
import { Header } from "@/components/layout/header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/custom-button";
import { Input } from "@/components/ui/custom-input";
import { Select } from "@/components/ui/custom-select";
import Text from '@/components/ui/custom-text';
import LocationPicker, { LocationPickerRef } from "@/components/ui/location-picker";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { useTheme } from "@/contexts/theme-context";
import { Coordinate } from "@/hooks/useCoverage";
import { RootState } from '@/store';
import { Subscription } from '@/types/subscription';
import { Foundation, Ionicons } from "@expo/vector-icons";
import { createSelector } from '@reduxjs/toolkit';
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
import { useSelector } from 'react-redux';

const selectAuthData = createSelector(
  (state: RootState) => state.auth.subscriptions,
  (state: RootState) => state.auth.currentAccount,
  (subscriptions, currentAccount) => ({
    subscriptions,
    currentAccount,
  })
);

interface WiFiForm {
  nuevaPassword: string;
  confirmarPassword: string;
}

interface ReclamoForm {
  problemas: string[];
  descripcion: string;
  horarioDisponibilidad?: string;
  contactoAlternativo?: string;
}

interface TrasladoForm {
  motivoTraslado: string;
  fechaDeseada: string;
  horarioDisponibilidad: string;
  observaciones: string;
}

interface FormErrors {
  [key: string]: string;
}


const PROBLEMAS_OPTIONS = [
  'Internet lento',
  'Cortes frecuentes',
  'WiFi no funciona',
  'Problemas de conexión',
  'Facturación incorrecta',
  'Servicio técnico',
  'Cambio de plan',
  'Otro'
];

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


export default function SoporteScreen() {
  const { theme } = useTheme();
  const dynamicStyles = createDynamicStyles(theme);
  
  const { subscriptions, currentAccount } = useSelector(selectAuthData);
  
  // Estados principales
  const [selectedAccount, setSelectedAccount] = useState<Subscription | undefined>(currentAccount || undefined);
  
  // Estados de formularios
  const [wifiForm, setWifiForm] = useState<WiFiForm>({
    nuevaPassword: '',
    confirmarPassword: '',
  });
  
  const [reclamoForm, setReclamoForm] = useState<ReclamoForm>({
    problemas: [],
    descripcion: '',
    horarioDisponibilidad: '',
    contactoAlternativo: '',
  });
  
  const [trasladoForm, setTrasladoForm] = useState<TrasladoForm>({
    motivoTraslado: '',
    fechaDeseada: '',
    horarioDisponibilidad: '',
    observaciones: '',
  });

  // Estados de ubicación para traslado
  const [selectedLocation, setSelectedLocation] = useState<Coordinate | null>(null);
  const [locationVerified, setLocationVerified] = useState(false);
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const locationPickerRef = useRef<LocationPickerRef>(null);

  // Handlers generales
  const handleAccountChange = useCallback((account: Subscription) => {
    setSelectedAccount(account);
    // Limpiar formularios al cambiar cuenta
    setWifiForm({ nuevaPassword: '', confirmarPassword: '' });
    setReclamoForm({ problemas: [], descripcion: '', horarioDisponibilidad: '', contactoAlternativo: '' });
    setTrasladoForm({ motivoTraslado: '', fechaDeseada: '', horarioDisponibilidad: '', observaciones: '' });
    setErrors({});
  }, []);


  // Handlers específicos de WiFi
  const handleWifiSubmit = useCallback(async () => {
    const newErrors: FormErrors = {};
    
    if (!wifiForm.nuevaPassword.trim()) {
      newErrors.nuevaPassword = 'La contraseña es requerida';
    } else if (wifiForm.nuevaPassword.length < 8) {
      newErrors.nuevaPassword = 'La contraseña debe tener al menos 8 caracteres';
    }
    
    if (wifiForm.nuevaPassword !== wifiForm.confirmarPassword) {
      newErrors.confirmarPassword = 'Las contraseñas no coinciden';
    }
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Contraseña WiFi cambiada:', { accountId: selectedAccount?.id, ...wifiForm });
      setWifiForm({ nuevaPassword: '', confirmarPassword: '' });
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [wifiForm, selectedAccount]);

  // Handlers específicos de Reclamos
  const handleProblemaToggle = useCallback((problema: string) => {
    setReclamoForm(prev => ({
      ...prev,
      problemas: prev.problemas.includes(problema)
        ? prev.problemas.filter(p => p !== problema)
        : [...prev.problemas, problema]
    }));
  }, []);

  const handleReclamoSubmit = useCallback(async () => {
    const newErrors: FormErrors = {};
    
    if (reclamoForm.problemas.length === 0) {
      newErrors.problemas = 'Selecciona al menos un problema';
    }
    
    if (!reclamoForm.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
    }
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Reclamo enviado:', { accountId: selectedAccount?.id, ...reclamoForm });
      setReclamoForm({ problemas: [], descripcion: '', horarioDisponibilidad: '', contactoAlternativo: '' });
    } catch (error) {
      console.error('Error al enviar reclamo:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [reclamoForm, selectedAccount]);

  // Handlers específicos de Traslado
  const handleLocationSelect = useCallback((coordinate: Coordinate, isVerified: boolean) => {
    setSelectedLocation(coordinate);
    setLocationVerified(isVerified);
  }, []);

  const handleLocationError = useCallback((error: string | undefined) => {
    setErrors(prev => ({ ...prev, location: error } as FormErrors));
  }, []);

  const handleTrasladoSubmit = useCallback(async () => {
    const newErrors: FormErrors = {};
    
    if (!trasladoForm.motivoTraslado.trim()) {
      newErrors.motivoTraslado = 'El motivo es requerido';
    }
    
    if (!trasladoForm.fechaDeseada) {
      newErrors.fechaDeseada = 'La fecha es requerida';
    }
    
    if (!trasladoForm.horarioDisponibilidad) {
      newErrors.horarioDisponibilidad = 'Selecciona un horario';
    }
    
    if (!selectedLocation) {
      newErrors.location = 'Selecciona la nueva ubicación';
    } else if (!locationVerified) {
      newErrors.location = 'La ubicación seleccionada no tiene cobertura';
    }
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Traslado solicitado:', { 
        accountId: selectedAccount?.id, 
        ...trasladoForm, 
        nuevaUbicacion: selectedLocation 
      });
      setTrasladoForm({ motivoTraslado: '', fechaDeseada: '', horarioDisponibilidad: '', observaciones: '' });
      setSelectedLocation(null);
      setLocationVerified(false);
    } catch (error) {
      console.error('Error al solicitar traslado:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [trasladoForm, selectedAccount, selectedLocation, locationVerified]);

  // Handlers de Ayuda
  const handleWhatsAppContact = useCallback(() => {
    const phoneNumber = '+593987654321';
    const message = encodeURIComponent(`Hola, necesito ayuda con mi servicio GoNet. Cuenta: ${selectedAccount?.partner?.name}`);
    Linking.openURL(`https://wa.me/${phoneNumber}?text=${message}`);
  }, [selectedAccount]);

  const handlePhoneCall = useCallback(() => {
    Linking.openURL('tel:+593987654321');
  }, []);

  // Renderizadores de secciones
  const renderCuentaSelector = () => (
    <View style={dynamicStyles.header}>
      <View style={dynamicStyles.headerContent}>
        <Text style={dynamicStyles.contentTitle}>Cuenta Seleccionada</Text>
        
        <Select
          options={subscriptions.map(subscription => ({ value: subscription }))}
          value={selectedAccount}
          onValueChange={(value, index) => setSelectedAccount(value)}
          renderItem={(option, index, isSelected) => {
            return (
              <View>
                <Text style={dynamicStyles.selectText}>#{option.value.id}</Text>
                <Text style={dynamicStyles.selectText}>{option.value.partner.name}</Text>
                <Text style={dynamicStyles.selectText}>{option.value.partner.street}</Text>
              </View>
            );
          }}
          variant="default"
          size="md"
          leftIcon={<Foundation name="info" size={24} color={theme.colors.text.primary} />}
          placeholder="Selecciona una cuenta"
        />
      </View>
    </View>
  );

  const WiFiContent = () => (
    <View style={dynamicStyles.tabContent}>
      <Card style={dynamicStyles.formCard}>
        <View style={dynamicStyles.tabHeader}>
          <Ionicons name="wifi" size={32} color={theme.colors.primary} />
          <Text style={dynamicStyles.tabTitle}>Cambiar Contraseña WiFi</Text>
        </View>
        
        <Text style={dynamicStyles.tabDescription}>
          Cambia la contraseña de tu red WiFi. La nueva contraseña debe tener al menos 8 caracteres.
        </Text>

        <View style={dynamicStyles.formContainer}>
          <Input
            label="Nueva contraseña"
            placeholder="Ingresa la nueva contraseña"
            value={wifiForm.nuevaPassword}
            onChangeText={(text) => setWifiForm(prev => ({ ...prev, nuevaPassword: text }))}
            secureTextEntry
            showPasswordToggle
            error={errors.nuevaPassword}
          />

          <Input
            label="Confirmar contraseña"
            placeholder="Confirma la nueva contraseña"
            value={wifiForm.confirmarPassword}
            onChangeText={(text) => setWifiForm(prev => ({ ...prev, confirmarPassword: text }))}
            secureTextEntry
            showPasswordToggle
            error={errors.confirmarPassword}
          />

          <Button
            title={isSubmitting ? "Cambiando..." : "Cambiar Contraseña"}
            onPress={handleWifiSubmit}
            variant="primary"
            disabled={isSubmitting}
            icon={<Ionicons name="key" size={20} color={theme.colors.text.button} />}
          />
        </View>
      </Card>
    </View>
  );

  const ReclamosContent = () => (
    <View style={dynamicStyles.tabContent}>
      <Card style={dynamicStyles.formCard}>
        <View style={dynamicStyles.tabHeader}>
          <Ionicons name="alert-circle" size={32} color={theme.colors.primary} />
          <Text style={dynamicStyles.tabTitle}>Reportar Problema</Text>
        </View>
        
        <Text style={dynamicStyles.tabDescription}>
          Selecciona los problemas que estás experimentando y proporciona detalles adicionales.
        </Text>

        <View style={dynamicStyles.formContainer}>
          <View style={dynamicStyles.problemasSection}>
            <Text style={dynamicStyles.fieldLabel}>Problemas experimentados:</Text>
            <View style={dynamicStyles.checkboxContainer}>
              {PROBLEMAS_OPTIONS.map((problema) => (
                <TouchableOpacity
                  key={problema}
                  style={dynamicStyles.checkboxItem}
                  onPress={() => handleProblemaToggle(problema)}
                >
                  <View style={[
                    dynamicStyles.checkbox,
                    reclamoForm.problemas.includes(problema) && dynamicStyles.checkboxChecked
                  ]}>
                    {reclamoForm.problemas.includes(problema) && (
                      <Ionicons name="checkmark" size={16} color={theme.colors.text.button} />
                    )}
                  </View>
                  <Text style={dynamicStyles.checkboxText}>{problema}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.problemas && (
              <Text style={dynamicStyles.errorText}>{errors.problemas}</Text>
            )}
          </View>

          <Input
            label="Descripción detallada"
            placeholder="Describe el problema en detalle..."
            value={reclamoForm.descripcion}
            onChangeText={(text) => setReclamoForm(prev => ({ ...prev, descripcion: text }))}
            multiline
            error={errors.descripcion}
          />

          <Select
            label="Horario disponible para contacto (opcional)"
            placeholder="Selecciona un horario"
            options={HORARIOS_OPTIONS}
            value={reclamoForm.horarioDisponibilidad}
            onValueChange={(value) => setReclamoForm(prev => ({ ...prev, horarioDisponibilidad: value }))}
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

          <Input
            label="Contacto alternativo (opcional)"
            placeholder="Otro número de contacto"
            value={reclamoForm.contactoAlternativo}
            onChangeText={(text) => setReclamoForm(prev => ({ ...prev, contactoAlternativo: text }))}
            keyboardType="phone-pad"
          />

          <Button
            title={isSubmitting ? "Enviando..." : "Enviar Reclamo"}
            onPress={handleReclamoSubmit}
            variant="primary"
            disabled={isSubmitting}
            icon={<Ionicons name="send" size={20} color={theme.colors.text.button} />}
          />
        </View>
      </Card>
    </View>
  );

  const TrasladoContent = () => (
    <View style={dynamicStyles.tabContent}>
      <Card style={dynamicStyles.formCard}>
        <View style={dynamicStyles.tabHeader}>
          <Ionicons name="home" size={32} color={theme.colors.primary} />
          <Text style={dynamicStyles.tabTitle}>Solicitar Traslado</Text>
        </View>
        
        <Text style={dynamicStyles.tabDescription}>
          Solicita el traslado de tu servicio a una nueva ubicación. Verificaremos la cobertura en la nueva dirección.
        </Text>

        <View style={dynamicStyles.formContainer}>
          <Input
            label="Motivo del traslado"
            placeholder="Ej: Cambio de domicilio, mudanza, etc."
            value={trasladoForm.motivoTraslado}
            onChangeText={(text) => setTrasladoForm(prev => ({ ...prev, motivoTraslado: text }))}
            error={errors.motivoTraslado}
          />

          <Input
            label="Fecha deseada"
            placeholder="DD/MM/AAAA"
            value={trasladoForm.fechaDeseada}
            onChangeText={(text) => setTrasladoForm(prev => ({ ...prev, fechaDeseada: text }))}
            error={errors.fechaDeseada}
          />

          <Select
            label="Horario de disponibilidad"
            placeholder="Selecciona un horario"
            options={HORARIOS_OPTIONS}
            value={trasladoForm.horarioDisponibilidad}
            onValueChange={(value) => setTrasladoForm(prev => ({ ...prev, horarioDisponibilidad: value }))}
            error={errors.horarioDisponibilidad}
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

          <View style={dynamicStyles.locationSection}>
            <Text style={dynamicStyles.fieldLabel}>Nueva ubicación:</Text>
            <LocationPicker
              ref={locationPickerRef}
              polygons={COVERAGE_POLYGONS}
              onLocationSelect={handleLocationSelect}
              onLocationError={handleLocationError}
              selectedLocation={selectedLocation}
              mapHeight={200}
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
                  {locationVerified ? 'Nueva ubicación con cobertura' : 'Ubicación sin cobertura'}
                </Text>
              </View>
            )}

            {errors.location && (
              <Text style={dynamicStyles.errorText}>{errors.location}</Text>
            )}
          </View>

          <Input
            label="Observaciones adicionales"
            placeholder="Información adicional sobre el traslado..."
            value={trasladoForm.observaciones}
            onChangeText={(text) => setTrasladoForm(prev => ({ ...prev, observaciones: text }))}
            multiline
          />

          <Button
            title={isSubmitting ? "Enviando..." : "Solicitar Traslado"}
            onPress={handleTrasladoSubmit}
            variant="primary"
            disabled={isSubmitting}
            icon={<Ionicons name="send" size={20} color={theme.colors.text.button} />}
          />
        </View>
      </Card>
    </View>
  );

  const AyudaContent = () => (
    <View style={dynamicStyles.tabContent}>
      <Card style={dynamicStyles.formCard}>
        <View style={dynamicStyles.tabHeader}>
          <Ionicons name="help-circle" size={32} color={theme.colors.primary} />
          <Text style={dynamicStyles.tabTitle}>Centro de Ayuda</Text>
        </View>
        
        <Text style={dynamicStyles.tabDescription}>
          ¿Necesitas ayuda inmediata? Contáctanos a través de los siguientes medios. Nuestro equipo está disponible para asistirte.
        </Text>

        <View style={dynamicStyles.contactContainer}>
          <TouchableOpacity style={dynamicStyles.contactCard} onPress={handleWhatsAppContact}>
            <View style={[dynamicStyles.contactIcon, { backgroundColor: '#25D366' + '20' }]}>
              <Whatsapp />
            </View>
            <View style={dynamicStyles.contactInfo}>
              <Text style={dynamicStyles.contactTitle}>WhatsApp</Text>
              <Text style={dynamicStyles.contactDescription}>
                Chatea con nosotros para soporte inmediato
              </Text>
              <Text style={dynamicStyles.contactNumber}>+593 98 765 4321</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.text.secondary} />
          </TouchableOpacity>

          <TouchableOpacity style={dynamicStyles.contactCard} onPress={handlePhoneCall}>
            <View style={[dynamicStyles.contactIcon, { backgroundColor: theme.colors.primary + '20' }]}>
              <Ionicons name="call" size={32} color={theme.colors.primary} />
            </View>
            <View style={dynamicStyles.contactInfo}>
              <Text style={dynamicStyles.contactTitle}>Llamada Telefónica</Text>
              <Text style={dynamicStyles.contactDescription}>
                Llámanos para asistencia personalizada
              </Text>
              <Text style={dynamicStyles.contactNumber}>+593 98 765 4321</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.text.secondary} />
          </TouchableOpacity>
        </View>

        <View style={dynamicStyles.disclaimerContainer}>
          <Ionicons name="information-circle" size={20} color={theme.colors.text.secondary} />
          <Text style={dynamicStyles.disclaimerText}>
            Horario de atención: Lunes a Viernes de 8:00 AM a 8:00 PM, Sábados de 8:00 AM a 6:00 PM. 
            Para emergencias técnicas, nuestro servicio de WhatsApp está disponible 24/7.
          </Text>
        </View>
      </Card>
    </View>
  );


  return (
    <SafeAreaView style={dynamicStyles.container} edges={['top']}>
      <Header
        leftAction={{
          icon: <Back width={24} height={24} color={theme.colors.text.primary} />,
          onPress: () => router.back(),
        }}
        title="Soporte Técnico"
      />

      {renderCuentaSelector()}
      
      <ScrollView 
        style={dynamicStyles.scrollView} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={dynamicStyles.segmentedContainer}>
          <SegmentedControl
            segments={[
              {
                id: 'wifi',
                label: 'Red WiFi',
                content: <WiFiContent />,
              },
              {
                id: 'reclamos',
                label: 'Reclamos',
                content: <ReclamosContent />,
              },
              {
                id: 'traslado',
                label: 'Traslado',
                content: <TrasladoContent />,
              },
              {
                id: 'ayuda',
                label: 'Ayuda',
                content: <AyudaContent />,
              },
            ]}
            variant="material"
            animated={true}
            size="md"
            tintColor={theme.colors.primary}
          />
        </View>
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
  
  // Header Section (from pagos.tsx)
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  headerContent: {
    gap: theme.spacing.md,
  },
  contentTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  selectText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  
  // Segmented Control
  segmentedContainer: {
    margin: theme.spacing.md,
    marginBottom: theme.spacing.lg
  },
  
  // Tab Content
  tabContent: {
    marginTop: 0,
  },
  formCard: {
    padding: theme.spacing.lg,
  },
  tabHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  tabTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
  tabDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: theme.spacing.xl,
  },
  
  // Form Container
  formContainer: {
    gap: theme.spacing.lg,
  },
  fieldLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  
  // Problemas Section
  problemasSection: {
    marginBottom: theme.spacing.md,
  },
  checkboxContainer: {
    gap: theme.spacing.sm,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
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
  
  // Select Options
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
  
  // Location Section
  locationSection: {
    marginBottom: theme.spacing.md,
  },
  coverageStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.sm,
  },
  coverageText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    marginLeft: theme.spacing.sm,
  },
  
  // Contact Section
  contactContainer: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  contactIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  contactDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  contactNumber: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.primary,
  },
  
  // Disclaimer
  disclaimerContainer: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  disclaimerText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.text.secondary,
    lineHeight: 16,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  
  // Error Text
  errorText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
});