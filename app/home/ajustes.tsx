import Button from '@/components/custom-button';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const fields = [
  { label: 'Nombre', value: 'John Doe' },
  {label: 'Cédula', value:'0102525225-1'},
  { label: 'Correo', value: 'john@example.com' },

  {label: 'Contacto', value:'0990909809'},
  {label: 'Dirección', value:'Av. Cerca 1-01 y Transversal' }
];


const Settings: React.FC = () => {
    const navigation = useRouter();


    
  return (
    
    <SafeAreaView style={styles.container}>



      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.back()}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Ionicons name="person-circle" size={32} color="#00fe9b" style={styles.centerIcon} />
        <View style={{ width: 28 }} />
      </View>


      <View style={styles.formContainer}>
        <Text style={styles.title}>Ajustes de perfil</Text>

        <Text style={styles.name}>{fields.at(0)?.value}</Text>



<View style={{
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 20,
}}>
  {/* Línea izquierda */}
  <View style={{
    marginLeft:40,
    flex: 1,
    height: 1.5,
    backgroundColor: '#32e9a2'
  }} />

  {/* Texto con fondo */}
  <Text style={{
    marginHorizontal: 10,
    backgroundColor: 'transparent', 
    paddingHorizontal: 5,
    fontSize: 17,
  }}>
    Información
  </Text>

  {/* Línea derecha */}
  <View style={{
    flex: 1,
    height: 1.5,
    backgroundColor: '#32e9a2',
    marginRight:40,
  }} />
</View>


<View style={styles.infomationContainer}>
{fields
  .filter(item => item.label !== 'Nombre')
  .map((item, index) => (
    <View style={styles.fieldRow} key={index}>
      <Text style={styles.label}>{item.label}: </Text>
      <Text style={styles.value}>{item.value}</Text>
    </View>
))}

</View>
      </View>

  
      <Button text="Editar" onPress={() => console.log('boton editor')} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ededed',
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingBottom: 0,
    
  },
  centerIcon: {
    alignSelf: 'center',
  },
  formContainer: {
    paddingTop: 20,

    borderRadius: 10,
    

  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#07938d',
  },

  infomationContainer:{
    marginLeft: 20,

  },

  title: {
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#07938d',
  },
  fieldRow: {
    flexDirection: 'row',
    textAlign: 'left',
    marginBottom: 12,
    marginRight: 60,
  },
  label: {
    flex: 1,
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'right',
    marginRight:10,
    color: '#008781ff',
  },
  value: {
    flex: 2,
    fontSize: 17,
    color: '#555',
  },
});

export default Settings;
