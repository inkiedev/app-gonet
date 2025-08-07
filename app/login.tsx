import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button, Checkbox, TextInput } from 'react-native-paper';

export default function LoginScreen( ) {

    type RootStackParamList = {
  'explore': undefined;
  'mapaAgencia': undefined;
  // add other routes here if needed
};


  const [cedula, setCedula] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleLogin = () => {
    // Aquí colocas la lógica de autenticación
    console.log('Login:', { cedula, password, rememberMe });
     navigation.navigate('screenPrivada'); // ejemplo de redirección
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>

      <TextInput
        label="Cédula o RUC"
        value={cedula}
        onChangeText={setCedula}
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        mode="outlined"
      />

      <View style={styles.rememberContainer}>
        <Checkbox
          status={rememberMe ? 'checked' : 'unchecked'}
          onPress={() => setRememberMe(!rememberMe)}
        />
        <Text>Recordarme</Text>
      </View>

      <Button mode="contained" onPress={handleLogin} style={styles.loginButton}>
        Ingresar
      </Button>

      <View style={styles.linkContainer}>
        <TouchableOpacity>
          <Text style={styles.link}>¿Olvidó la contraseña?</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.link}>Registrarse</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.link}>Contáctanos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 16,
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButton: {
    marginBottom: 30,
    paddingVertical: 5,
  },
  linkContainer: {
    alignItems: 'center',
  },
  link: {
    color: '#007BFF',
    marginTop: 10,
    fontSize: 15,
  },
});
