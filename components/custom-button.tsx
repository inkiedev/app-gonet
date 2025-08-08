import React from 'react';
<<<<<<< HEAD
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
=======
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type ButtonProps = {
  text: string;
  onPress?: () => void;
  backgroundColor?: string;
  textColor?: string;
  width?: number; // ancho opcional en número, por ejemplo 200
};

const Button: React.FC<ButtonProps> = ({
  text,
  onPress,
  backgroundColor = '#00fe9b',
  textColor = '#009a92',
  width = 200, // valor por defecto
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.button,
          { backgroundColor: backgroundColor, width: width },
        ]}
        activeOpacity={0.8}
      >
        <Text style={[styles.buttonText, { color: textColor }]}>{text}</Text>
      </TouchableOpacity>
    </View>
>>>>>>> b36764c2d5c145bd55cfb6ed21e41b63c5d6fb38
  );
};

const styles = StyleSheet.create({
<<<<<<< HEAD
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
=======
  container: {
    alignItems: 'center', // centra horizontalmente
    marginVertical: 8, // espaciado vertical opcional
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white', fontStyle : "italic",
    fontFamily: 'falcon', // Asegúrate de que la fuente 'falcon' esté disponible en tu proyecto
    
>>>>>>> b36764c2d5c145bd55cfb6ed21e41b63c5d6fb38
  },
});

export default Button;
