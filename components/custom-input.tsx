// components/InputField.tsx
import { FontAwesome } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

export type InputFieldProps = {
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
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = React.useRef<TextInput>(null);

  const isPassword = secureTextEntry;

  return (
    <View style={[styles.container, { width }]}>      
      {!isFocused && value.length === 0 && (
        <TouchableWithoutFeedback onPress={() => inputRef.current?.focus()}>
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholder}>{placeholder}</Text>
          </View>
        </TouchableWithoutFeedback>
      )}

      <View style={styles.inputWrapper}>
        {isPassword && (
          <TouchableOpacity
            style={styles.icon}
            onPress={() => setShowPassword(!showPassword)}>
            <FontAwesome name={!showPassword ? 'eye-slash' : 'eye'} size={16} color="#227492" />
          </TouchableOpacity>
        )}

        <TextInput
          ref={inputRef}
          style={[
            styles.input,
            (!isFocused && value.length === 0) ? { color: 'transparent' } : {},
            isPassword ? { paddingHorizontal: 30 } : {},
          ]}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={isPassword && !showPassword}
          keyboardType={keyboardType}
          selectionColor="#227492ff"
          textAlign="center"
          textAlignVertical="center"
          underlineColorAndroid="transparent"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginVertical: 7,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginBottom: 3,
    height: 35,
    justifyContent: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  placeholderContainer: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    zIndex: 1,
  },
  placeholder: {
    fontSize: 15,
    fontStyle: 'italic',
    fontFamily: 'work-sans',
    color: '#208f9eff',
  },
  input: {
    
    height: 40,
    flex: 1,
    fontSize: 15,
    fontStyle: 'italic',
    fontFamily: 'work-sans',
    color: '#227492ff',
  },
  icon: {
    position: 'absolute',
    left: 8,
    zIndex: 2,
  },
});

export default InputField;