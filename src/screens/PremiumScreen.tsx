import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';

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

export default function BibliotecaScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Biblioteca de Ejercicios</Text>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  card: {
    backgroundColor: '#f4f4f4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16
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
    marginBottom: 6
  },
  descripcion: {
    fontSize: 14,
    color: '#555'
  },
  maquinas: {
    fontSize: 14,
    marginTop: 8,
    color: '#888'
  }
});
