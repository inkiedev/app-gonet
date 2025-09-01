import Back from '@/assets/images/iconos gonet back.svg';
import Cross from '@/assets/images/iconos gonet cross.svg';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import { Header } from '@/components/layout/header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/custom-button';
import { useResponsive } from '@/hooks/use-responsive';
import { RootState } from '@/store';
import { loadUserData } from '@/store/slices/auth-slice';
import { theme } from '@/styles/theme';

interface UserField {
  label: string;
  value: string;
  icon?: string;
}

export default function AjustesScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isSmall, isTablet } = useResponsive();
  const [isEditing, setIsEditing] = useState(false);
  const { userData } = useSelector((state: RootState) => state.auth);

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

  const handleEdit = () => {
    if (isEditing) {
      Alert.alert('Cambios guardados', 'Tu perfil ha sido actualizado');
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    Alert.alert('Cambios cancelados', 'No se guardaron los cambios');
  };

  return (
    <SafeAreaView style={styles.container}>
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
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Ionicons
              name="person-circle"
              size={isSmall ? 80 : 100}
              color={theme.colors.primary}
            />
          </View>
          <Text style={[
            styles.userName,
            { fontSize: isSmall ? theme.fontSize.xl : theme.fontSize.xxl }
          ]}>
            {userData?.name || 'Usuario'}
          </Text>
        </View>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Información Personal</Text>
          <View style={styles.dividerLine} />
        </View>

        <Card
          style={styles.infoCard}
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

        <View style={styles.buttonContainer}>
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
  return (
    <View style={[
      styles.fieldRow,
      !isLast && styles.fieldRowBorder,
      { paddingVertical: isSmall ? theme.spacing.sm : theme.spacing.md }
    ]}>
      <View style={styles.fieldLeft}>
        {field.icon && (
          <Ionicons
            name={field.icon as any}
            size={20}
            color={theme.colors.secondary}
            style={styles.fieldIcon}
          />
        )}
        <Text style={[
          styles.fieldLabel,
          { fontSize: isSmall ? theme.fontSize.sm : theme.fontSize.md }
        ]}>
          {field.label}:
        </Text>
      </View>

      <Text style={[
        styles.fieldValue,
        isEditing && styles.fieldValueEditing,
        { fontSize: isSmall ? theme.fontSize.sm : theme.fontSize.md }
      ]}>
        {field.value}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});
