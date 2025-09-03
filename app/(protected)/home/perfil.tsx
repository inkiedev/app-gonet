import Back from '@/assets/images/iconos gonet back.svg';
import Cross from '@/assets/images/iconos gonet cross.svg';
import Text from '@/components/ui/custom-text';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Animated, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import { Header } from '@/components/layout/header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/custom-button';
import { useTheme } from '@/contexts/theme-context';
import { useResponsive } from '@/hooks/use-responsive';
import { RootState } from '@/store';
import { loadUserData } from '@/store/slices/auth-slice';

interface UserField {
  label: string;
  value: string;
  icon?: string;
}

interface ToastProps {
  message: string;
  type: 'success' | 'info' | 'error' | 'warning';
  visible: boolean;
  onHide: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, visible, onHide }) => {
  const { theme } = useTheme();
  const dynamicStyles = createDynamicStyles(theme);
  const opacity = useState(new Animated.Value(0))[0];

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(2500),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onHide();
      });
    }
  }, [visible]);

  if (!visible) return null;

  const getToastStyle = () => {
    switch (type) {
      case 'success':
        return dynamicStyles.toastSuccess;
      case 'error':
        return dynamicStyles.toastError;
      case 'warning':
        return dynamicStyles.toastWarning;
      case 'info':
        return dynamicStyles.toastInfo;
      default:
        return dynamicStyles.toastInfo;
    }
  };

  return (
    <Animated.View style={[
      dynamicStyles.toastContainer,
      getToastStyle(),
      { opacity }
    ]}>
      <Ionicons
        name={type === 'success' ? 'checkmark-circle' : type === 'error' ? 'close-circle' : type === 'warning' ? 'warning' : 'information-circle'}
        size={20}
        color={theme.colors.text.inverse}
        style={{ marginRight: theme.spacing.xs }}
      />
      <Text style={dynamicStyles.toastText}>{message}</Text>
    </Animated.View>
  );
};

export default function AjustesScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isSmall, isTablet } = useResponsive();
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' | 'warning'; visible: boolean }>({
    message: '',
    type: 'success',
    visible: false
  });
  const { userData } = useSelector((state: RootState) => state.auth);
  const { theme } = useTheme();
  const dynamicStyles = createDynamicStyles(theme);

  useEffect(() => {
    if (!userData) {
      dispatch(loadUserData() as any);
    }
  }, [dispatch, userData]);

  const userFields: UserField[] = [
    {
      label: 'Cédula',
      value: userData?.vat || 'No disponible',
      icon: 'card-outline'
    },
    {
      label: 'Correo',
      value: userData?.email || 'No disponible',
      icon: 'mail-outline'
    },
    {
      label: 'Móvil',
      value: userData?.mobile || 'No disponible',
      icon: 'call-outline'
    },
    {
      label: 'Teléfono',
      value: userData?.phone || 'No disponible',
      icon: 'call-outline'
    },
    {
      label: 'Ciudad',
      value: userData?.city || 'No disponible',
      icon: 'location-outline'
    },
    {
      label: 'Dirección',
      value: userData?.street || 'No disponible',
      icon: 'location-outline'
    },
    {
      label: 'Dirección 2',
      value: userData?.street2 || 'No disponible',
      icon: 'location-outline'
    },
  ];

  const showToast = (message: string, type: 'success' | 'info' | 'error') => {
    setToast({ message, type, visible: true });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, visible: false }));
  };

  const handleEdit = () => {
    if (isEditing) {
      showToast('Tu perfil ha sido actualizado', 'success');
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    showToast('No se guardaron los cambios', 'info');
  };

  return (
    <SafeAreaView style={dynamicStyles.container}>
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
            {userData?.name || 'Usuario'}
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
            icon={
              <Ionicons
                name={isEditing ? "save-outline" : "create-outline"}
                size={20}
                color={theme.colors.text.inverse}
                style={{ marginRight: theme.spacing.xs }}
              />
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
      </ScrollView>
      
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onHide={hideToast}
      />
    </SafeAreaView>
  );
}

interface UserInfoRowProps {
  field: UserField;
  isLast: boolean;
  isEditing: boolean;
  isSmall: boolean;
}

const UserInfoRow: React.FC<UserInfoRowProps> = ({
                                                   field,
                                                   isLast,
                                                   isEditing,
                                                   isSmall
                                                 }) => {
  const { theme } = useTheme();
  const dynamicStyles = createDynamicStyles(theme);

  return (
    <View style={[
      dynamicStyles.fieldRow,
      !isLast && dynamicStyles.fieldRowBorder,
      { paddingVertical: isSmall ? theme.spacing.sm : theme.spacing.md }
    ]}>
      <View style={dynamicStyles.fieldLeft}>
        {field.icon && (
          <Ionicons
            name={field.icon as any}
            size={20}
            color={theme.colors.secondary}
            style={dynamicStyles.fieldIcon}
          />
        )}
        <Text style={[
          dynamicStyles.fieldLabel,
          { fontSize: isSmall ? theme.fontSize.sm : theme.fontSize.md }
        ]}>
          {field.label}:
        </Text>
      </View>

      <Text style={[
        dynamicStyles.fieldValue,
        isEditing && dynamicStyles.fieldValueEditing,
        { fontSize: isSmall ? theme.fontSize.sm : theme.fontSize.md }
      ]}>
        {field.value}
      </Text>
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
