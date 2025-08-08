import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Settings: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Ajustes</Text>
            {/* Agrega aquí tus componentes de ajustes */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});

export default Settings;