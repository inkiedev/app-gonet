import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

type InputFieldProps = {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address';
  width?: number;
};

const InputField: React.FC<InputFieldProps> = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  width = 300,
}) => {
  return (
    <View style={[styles.container, { width }]}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        placeholderTextColor="#208f9eff"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  input: {
    paddingVertical: 4,
    paddingHorizontal: 16,
    fontSize: 20,
    fontStyle: 'italic',
    fontFamily: 'work-sans',
    color: '#227492ff',
    width: '100%',
    textAlign: 'center', //  Centra el texto horizontalmente
    transform: [{ scaleY: 0.8 }], //  Forma correcta en React Native
  },
});

export default InputField;