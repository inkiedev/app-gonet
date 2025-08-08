import React from 'react';
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
  width = 200,
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
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center', // centra horizontalmente
    marginVertical: 8, // espaciado vertical opcional
  },
  button: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white', fontStyle : "italic",
    fontFamily: 'falcon', // Asegúrate de que la fuente 'falcon' esté disponible en tu proyecto
    
  },
});

export default Button;
