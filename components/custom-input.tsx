import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';

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
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, { width }]}>
      {!isFocused && value.length === 0 && (
        <TouchableWithoutFeedback onPress={() => inputRef.current?.focus()}>
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholder}>{placeholder}</Text>
          </View>
        </TouchableWithoutFeedback>
      )}

      <TextInput
        ref={inputRef}
        style={[styles.input, (!isFocused && value.length === 0) ? { color: 'transparent' } : {}]}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        selectionColor="#227492ff"
        textAlign="center"
        textAlignVertical="center"
        underlineColorAndroid="transparent"
      />
    </View>
  );
};

const inputRef = React.createRef<TextInput>();

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginBottom: 3,
    height: 50,
    justifyContent: 'center',
  },
  placeholderContainer: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
  },
  placeholder: {
    fontSize: 20,
    fontStyle: 'italic',
    fontFamily: 'work-sans',
    color: '#208f9eff',
  },
  input: {
    height: 50,
    fontSize: 20,
    fontStyle: 'italic',
    fontFamily: 'work-sans',
    color: '#227492ff',
  },
});

export default InputField;
