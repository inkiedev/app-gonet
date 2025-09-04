import Back from '@/assets/images/iconos gonet back.svg';
import Cross from '@/assets/images/iconos gonet cross.svg';
import Text from '@/components/ui/custom-text';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import * as z from 'zod';

import { Header } from '@/components/layout/header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/custom-button';
import { useNotificationContext } from '@/contexts/notification-context';
import { useTheme } from '@/contexts/theme-context';
import { useResponsive } from '@/hooks/use-responsive';
import { apiService } from '@/services/api';
import { RootState } from '@/store';
import { loadSubscriptionsData, refreshSubscriptionsFromAPI } from '@/store/slices/auth-slice';

// Validation schema for editable fields
const profileSchema = z.object({
  email: z.email('Email inválido').min(1, 'Email requerido'),
  mobile: z.string().min(10, 'Mínimo 10 dígitos').max(15, 'Máximo 15 dígitos'),
  phone: z.string().min(7, 'Mínimo 7 dígitos').max(15, 'Máximo 15 dígitos').or(z.literal('')),
  street: z.string().min(5, 'Dirección muy corta').max(100, 'Dirección muy larga'),
  street2: z.string().max(100, 'Dirección muy larga').optional().or(z.literal('')),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface UserField {
  label: string;
  value: string;
  icon?: string;
  key: keyof ProfileFormData | 'dni' | 'name' | 'type_doc' | 'country' | 'state' | 'city';
  iconColor?: string;
  editable: boolean;
  type?: 'text' | 'email' | 'phone';
}

export default function AjustesScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isSmall } = useResponsive();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showWarning, showError } = useNotificationContext();
  const [formData, setFormData] = useState<ProfileFormData>({
    email: '',
    mobile: '',
    phone: '',
    street: '',
    street2: ''
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ProfileFormData, string>>>({});
  
  const { currentAccount, subscriptions, uid, password } = useSelector((state: RootState) => state.auth);
  const { theme } = useTheme();
  const dynamicStyles = createDynamicStyles(theme);

  useEffect(() => {
    if (!currentAccount && subscriptions.length === 0) {
      dispatch(loadSubscriptionsData() as any);
    }
  }, [dispatch, currentAccount, subscriptions.length]);

  useEffect(() => {
    if (currentAccount?.partner) {
      const partner = currentAccount.partner;
      setFormData({
        email: partner.email || '',
        mobile: partner.mobile || '',
        phone: partner.phone || '',
        street: partner.street || '',
        street2: partner.street2 || ''
      });
    }
  }, [currentAccount]);

  const userFields: UserField[] = [
    {
      label: 'Tipo de Documento',
      value: currentAccount?.partner?.type_doc || 'No disponible',
      icon: 'document-outline',
      key: 'type_doc',
      editable: false
    },
    {
      label: 'Cédula',
      value: currentAccount?.partner?.dni || 'No disponible',
      icon: 'card-outline',
      key: 'dni',
      editable: false
    },
    {
      label: 'Correo',
      value: isEditing ? formData.email : currentAccount?.partner?.email || 'No disponible',
      icon: 'mail-outline',
      key: 'email',
      editable: true,
      type: 'email'
    },
    {
      label: 'Móvil',
      value: isEditing ? formData.mobile : currentAccount?.partner?.mobile || 'No disponible',
      icon: 'call-outline',
      key: 'mobile',
      editable: true,
      type: 'phone'
    },
    {
      label: 'Teléfono',
      value: isEditing ? (formData.phone || '') : (currentAccount?.partner?.phone || 'No disponible'),
      icon: 'call-outline',
      key: 'phone',
      editable: true,
      type: 'phone'
    },
    {
      label: 'País',
      value: currentAccount?.partner?.country || 'No disponible',
      icon: 'globe-outline',
      key: 'country',
      editable: false
    },
    {
      label: 'Provincia',
      value: currentAccount?.partner?.state || 'No disponible',
      icon: 'location-outline',
      key: 'state',
      editable: false
    },
    {
      label: 'Ciudad',
      value: currentAccount?.partner?.city || 'No disponible',
      icon: 'location-outline',
      key: 'city',
      editable: false
    },
    {
      label: 'Dirección Principal',
      value: isEditing ? formData.street : currentAccount?.partner?.street || 'No disponible',
      icon: 'home-outline',
      key: 'street',
      editable: true
    },
    {
      label: 'Dirección Secundaria',
      value: isEditing ? (formData.street2 || '') : (currentAccount?.partner?.street2 || 'No disponible'),
      icon: 'home-outline',
      key: 'street2',
      editable: true
    },
  ];

  const validateForm = (): boolean => {
    try {
      profileSchema.parse(formData);
      setFormErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Partial<Record<keyof ProfileFormData, string>> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0] as keyof ProfileFormData] = err.message;
          }
        });
        setFormErrors(errors);
        return false;
      }
      return false;
    }
  };

  const handleFieldChange = (key: keyof ProfileFormData, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    // Clear error for this field when user starts typing
    if (formErrors[key]) {
      setFormErrors(prev => ({ ...prev, [key]: undefined }));
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      showError('Error', 'Ingrese los campos faltantes correctamente', 2000);
      return;
    }

    if (!currentAccount?.partner?.id || !uid || !password) {
      showError('Error', 'Informacion de sesion no disponible', 2000);
      return;
    }

    setIsLoading(true);
    try {
      await apiService.updateUserProfile(
        'enterprise', // database
        uid,
        password,
        currentAccount.partner.id,
        formData
      );
      
      await dispatch(refreshSubscriptionsFromAPI() as any);
      
      setIsEditing(false);
      showSuccess('Exito', 'Perfil actualizado correctamente', 2000);
    } catch (error) {
      console.error('Error updating profile:', error);
      showError('Error', 'Error al actualizar el perfil', 2000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    if (isEditing) {
      handleSave();
    } else {
      setIsEditing(true);
      setFormErrors({});
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    if (currentAccount?.partner) {
      const partner = currentAccount.partner;
      setFormData({
        email: partner.email || '',
        mobile: partner.mobile || '',
        phone: partner.phone || '',
        street: partner.street || '',
        street2: partner.street2 || '',
      });
    }
    setFormErrors({});
    setIsEditing(false);
    showWarning('Aviso', 'Cambios cancelados', 2000);
  };

  return (
    <SafeAreaView style={dynamicStyles.container} edges={['top']}>
      <Header
        title="Ajustes de perfil"
        leftAction={{
          icon: <Back width={24} height={24} color={theme.colors.text.primary} />,
          onPress: () => router.back(),
        }}
        rightAction={isEditing ? {
          icon: <Cross width={24} height={24} color={theme.colors.text.primary} />,
          onPress: handleCancel,
        } : undefined}
        variant="transparent"
      />

      <ScrollView
        style={dynamicStyles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={dynamicStyles.scrollContent}
      >
        <View style={dynamicStyles.editProfileContent}>
          <View style={dynamicStyles.profileHeader}>
            <View style={dynamicStyles.avatarContainer}>
              <Ionicons
                name="person-circle"
                size={isSmall ? 80 : 100}
                color={theme.colors.primary}
              />
            </View>
            <Text style={[
              dynamicStyles.userName,
              { fontSize: isSmall ? theme.fontSize.xl : theme.fontSize.xxl }
            ]}>
              {currentAccount?.partner?.name || 'Usuario'}
            </Text>
          </View>

          <View style={dynamicStyles.dividerContainer}>
            <View style={dynamicStyles.dividerLine} />
            <Text style={dynamicStyles.dividerText}>Información Personal</Text>
            <View style={dynamicStyles.dividerLine} />
          </View>

          <Card
            style={dynamicStyles.infoCard}
            padding={isSmall ? "sm" : "md"}
            variant="elevated"
          >
            {userFields.map((field, index) => (
              <UserInfoRow
                key={index}
                field={field}
                isLast={index === userFields.length - 1}
                isEditing={isEditing}
                isSmall={isSmall}
                onFieldChange={handleFieldChange}
                error={field.editable && field.key !== 'dni' && field.key !== 'name' && field.key !== 'type_doc' ? formErrors[field.key as keyof ProfileFormData] : undefined}
              />
            ))}
          </Card>

          <View style={dynamicStyles.buttonContainer}>
            <Button
              title={isEditing ? "Guardar Cambios" : "Editar Perfil"}
              onPress={handleEdit}
              variant="primary"
              size={isSmall ? "md" : "lg"}
              fullWidth
              loading={isLoading}
              disabled={isLoading}
              icon={
                !isLoading && (
                  <Ionicons
                    name={isEditing ? "save-outline" : "create-outline"}
                    size={20}
                    color={theme.colors.text.inverse}
                    style={{ marginRight: theme.spacing.xs }}
                  />
                )
              }
            />

            {isEditing && (
              <Button
                title="Cancelar"
                onPress={handleCancel}
                variant="secondary"
                size={isSmall ? "md" : "lg"}
                fullWidth
              />
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

interface UserInfoRowProps {
  field: UserField;
  isLast: boolean;
  isEditing: boolean;
  isSmall: boolean;
  onFieldChange: (key: keyof ProfileFormData, value: string) => void;
  error?: string;
}

const UserInfoRow: React.FC<UserInfoRowProps> = ({
  field,
  isLast,
  isEditing,
  isSmall,
  onFieldChange,
  error
}) => {
  const { theme } = useTheme();
  const dynamicStyles = createDynamicStyles(theme);

  const getKeyboardType = () => {
    if (field.type === 'email') return 'email-address';
    if (field.type === 'phone') return 'phone-pad';
    return 'default';
  };

  const canEdit = isEditing && field.editable;

  return (
    <View>
      <View style={[
        dynamicStyles.fieldRow,
        !isLast && !error && dynamicStyles.fieldRowBorder,
        { paddingVertical: isSmall ? theme.spacing.sm : theme.spacing.md }
      ]}>
        <View style={dynamicStyles.fieldLeft}>
          {field.icon && (
            <Ionicons
              name={field.icon as any}
              size={20}
              color={field.editable ? theme.colors.primary : theme.colors.secondary}
              style={dynamicStyles.fieldIcon}
            />
          )}
          <Text style={[
            dynamicStyles.fieldLabel,
            { fontSize: isSmall ? theme.fontSize.sm : theme.fontSize.md },
            !field.editable && { color: theme.colors.text.secondary }
          ]}>
            {field.label}:
          </Text>
        </View>

        {canEdit ? (
          <TextInput
            style={[
              dynamicStyles.fieldInput,
              { fontSize: isSmall ? theme.fontSize.sm : theme.fontSize.md },
              error && dynamicStyles.fieldInputError
            ]}
            value={field.value}
            onChangeText={(value) => onFieldChange(field.key as keyof ProfileFormData, value)}
            keyboardType={getKeyboardType()}
            placeholder={`Ingresa ${field.label.toLowerCase()}`}
            placeholderTextColor={theme.colors.text.placeholder}
            multiline={field.key === 'street' || field.key === 'street2'}
            numberOfLines={field.key === 'street' || field.key === 'street2' ? 2 : 1}
          />
        ) : (
          <Text style={[
            dynamicStyles.fieldValue,
            { fontSize: isSmall ? theme.fontSize.sm : theme.fontSize.md },
            !field.editable && { color: theme.colors.text.secondary }
          ]}>
            {field.value}
          </Text>
        )}
      </View>
      
      {error && (
        <Text style={[
          dynamicStyles.errorText,
          { fontSize: theme.fontSize.xs, marginBottom: theme.spacing.sm, textAlign: 'right' }
        ]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const createDynamicStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xl,
    alignItems: 'center'
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  avatarContainer: {
    marginBottom: theme.spacing.md,
  },
  userName: {
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.secondary,
    textAlign: 'center',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    width: '100%'
  },
  editProfileContent: {
    width: '100%',
    maxWidth: 1000
  },
  dividerLine: {
    flex: 1,
    height: 2,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.sm,
  },
  dividerText: {
    marginHorizontal: theme.spacing.md,
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  infoCard: {
    marginBottom: theme.spacing.lg,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fieldRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  fieldLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fieldIcon: {
    marginRight: theme.spacing.sm,
  },
  fieldLabel: {
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.secondary,
  },
  fieldValue: {
    flex: 1.5,
    textAlign: 'right',
    color: theme.colors.text.secondary,
  },
  fieldValueEditing: {
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.medium,
  },
  fieldInput: {
    flex: 1.5,
    textAlign: 'right',
    color: theme.colors.text.primary,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.background,
    minHeight: 36,
  },
  fieldInputError: {
    borderColor: theme.colors.error,
  },
  errorText: {
    color: theme.colors.error,
    fontWeight: theme.fontWeight.medium,
  },
  statsCard: {
    marginBottom: theme.spacing.lg,
  },
  statsTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  statIcon: {
    marginBottom: theme.spacing.xs,
  },
  statValue: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: theme.spacing.md,
    paddingTop: theme.spacing.lg,
  },
  toastContainer: {
    position: 'absolute',
    top: 100,
    left: theme.spacing.md,
    right: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  toastSuccess: {
    backgroundColor: theme.colors.success || theme.colors.primary,
  },
  toastError: {
    backgroundColor: theme.colors.error || '#ff4444',
  },
  toastWarning: {
    backgroundColor: theme.colors.warning || '#ff9900',
  },
  toastInfo: {
    backgroundColor: theme.colors.info || theme.colors.secondary,
  },
  toastText: {
    color: theme.colors.text.inverse,
    fontSize: theme.fontSize.md,
    flex: 1,
  },
});
