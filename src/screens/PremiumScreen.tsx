import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, Platform } from 'react-native'; // Añadimos Platform

const ejercicios = [
  {
    id: '1',
    nombre: 'Sentadilla en máquina Smith',
    descripcion: 'Ejercicio enfocado en piernas y glúteos con soporte de barra guiada.',
    maquinas: 'Máquina Smith',
    imagen: 'https://i.imgur.com/yjHwoaK.png'
  },
  {
    id: '2',
    nombre: 'Press de banca',
    descripcion: 'Trabaja el pecho, los hombros y los tríceps.',
    maquinas: 'Máquina de press horizontal o banco libre',
    imagen: 'https://i.imgur.com/pfMoECo.png'
  },
  {
    id: '3',
    nombre: 'Remo sentado',
    descripcion: 'Ejercicio de espalda y bíceps con tracción horizontal.',
    maquinas: 'Máquina de remo',
    imagen: 'https://i.imgur.com/q41lms6.png'
  },
  // Agrega más ejercicios según el gimnasio
];

// Nota: Cambié el nombre de la función exportada de 'BibliotecaScreen' a 'PremiumScreen'
// si esta es realmente tu pantalla Premium. Si no, mantén el nombre original.
export default function PremiumScreen() { 
  return (
    <View style={styles.fullContainer}>
        {/* CABECERA PERSONALIZADA */}
        <View style={styles.customHeader}>
            <Text style={styles.headerTitle}>Biblioteca Premium</Text>
        </View>

        <View style={styles.container}>
          <FlatList
            data={ejercicios}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Image source={{ uri: item.imagen }} style={styles.image} />
                <Text style={styles.nombre}>{item.nombre}</Text>
                <Text style={styles.descripcion}>{item.descripcion}</Text>
                <Text style={styles.maquinas}>Máquinas: {item.maquinas}</Text>
              </View>
            )}
          />
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
        paddingTop: Platform.OS === 'ios' ? 50 : 20,
        paddingHorizontal: 16,
        paddingBottom: 15,
        backgroundColor: '#222', // Fondo oscuro de la cabecera
        borderBottomColor: '#333',
        borderBottomWidth: 1,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#1C1C1C',
        padding: 16
    },
  card: {
    backgroundColor: '#2A2A2A', // Fondo oscuro de tarjeta
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 10
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#fff' // Texto blanco
  },
  descripcion: {
    fontSize: 14,
    color: '#bbb' // Texto gris claro
  },
  maquinas: {
    fontSize: 14,
    marginTop: 8,
    color: '#999' // Texto gris
  }
});