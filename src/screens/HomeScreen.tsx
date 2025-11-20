import React from 'react';
import { View, Text, StyleSheet, Button, Platform } from 'react-native';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';

export default function HomeScreen({ navigation }: any) {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace('Login');
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <View style={styles.fullContainer}>
        {/* CABECERA PERSONALIZADA */}
        <View style={styles.customHeader}>
            <Text style={styles.headerTitle}>Bienvenido a UdecFit</Text>
        </View>

        <View style={styles.container}>
            <Text style={styles.text}>¡Hola! Has iniciado sesión.</Text>
            <Text style={styles.sub}>Esta es la pantalla de inicio principal.</Text>
            
            {/* El botón de cerrar sesión se mantiene aquí por funcionalidad */}
            <View style={styles.logoutButtonWrapper}>
                <Button title="🚪 Cerrar Sesión" onPress={handleLogout} color="#FF4B4B" />
            </View>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
    fullContainer: { 
        flex: 1, 
        backgroundColor: '#1C1C1C' // Fondo Oscuro Principal
    },
    customHeader: {
        // Asegura espacio bajo el notch en iOS
        paddingTop: Platform.OS === 'ios' ? 50 : 20, 
        paddingHorizontal: 24,
        paddingBottom: 15,
        backgroundColor: '#222', // Fondo oscuro de la cabecera
        borderBottomColor: '#333',
        borderBottomWidth: 1,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff', // Título blanco
        textAlign: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1C1C1C',
        padding: 20,
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#fff', // Texto blanco
    },
    sub: {
        fontSize: 16,
        marginBottom: 30,
        color: '#bbb', // Texto gris claro
    },
    logoutButtonWrapper: {
        width: '80%', // Le da un ancho definido al botón si no es TouchableOpacity
        marginTop: 20,
    }
});
