import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

type ButtonProps = {
  texto: string;
  onPress?: () => void;
  colorFondo?: string;
  colorTexto?: string;
};

const Button: React.FC<ButtonProps> = ({
  texto,
  onPress,
  colorFondo = "#00fe9b",
  colorTexto = '#009a92',
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, { backgroundColor: colorFondo }]}
      activeOpacity={0.8}
    >
      <Text style={[styles.texto, { color: colorTexto }]}>{texto}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8, // esquinas redondeadas
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2, // sombra para Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, // sombra iOS
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  texto: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Button;
