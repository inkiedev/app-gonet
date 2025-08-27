import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from '@/components/ui/custom-button';
import { useNotificationContext } from '@/contexts/NotificationContext';
import { theme } from '@/styles/theme';

export const NotificationExample: React.FC = () => {
  const { showSuccess, showError, showWarning, showInfo, showNotification } = useNotificationContext();

  const handleSuccess = () => {
    showSuccess(
      'Operación exitosa',
      'Los datos se han guardado correctamente.',
      3000
    );
  };

  const handleError = () => {
    showError(
      'Error de conexión',
      'No se pudo conectar con el servidor. Por favor, intenta nuevamente.',
      5000
    );
  };

  const handleWarning = () => {
    showWarning(
      'Advertencia',
      'Tu sesión expirará en 5 minutos. Guarda tu trabajo.',
      4000
    );
  };

  const handleInfo = () => {
    showInfo(
      'Información',
      'Hay actualizaciones disponibles para la aplicación.',
      4000
    );
  };

  const handleCustom = () => {
    showNotification({
      type: 'success',
      title: 'Notificación personalizada',
      message: 'Esta notificación incluye una acción personalizada.',
      duration: 0, // No auto-hide
      action: {
        label: 'Ver detalles',
        onPress: () => {
          console.log('Acción personalizada ejecutada');
        },
      },
      onClose: () => {
        console.log('Notificación cerrada');
      },
    });
  };

  return (
    <View style={styles.container}>
      <Button
        title="Mostrar éxito"
        onPress={handleSuccess}
        variant="primary"
        style={styles.button}
      />
      <Button
        title="Mostrar error"
        onPress={handleError}
        variant="secondary"
        style={styles.button}
      />
      <Button
        title="Mostrar advertencia"
        onPress={handleWarning}
        variant="outline"
        style={styles.button}
      />
      <Button
        title="Mostrar información"
        onPress={handleInfo}
        variant="ghost"
        style={styles.button}
      />
      <Button
        title="Notificación con acción"
        onPress={handleCustom}
        variant="primary"
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  button: {
    marginVertical: theme.spacing.xs,
  },
});