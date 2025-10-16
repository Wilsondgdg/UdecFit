import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

interface Ejercicio {
  id: string;
  nombre: string;
  descripcion: string;
  maquina: string;
}

const ejerciciosData: Ejercicio[] = [
  {
    id: '1',
    nombre: 'Press de Pecho',
    descripcion: 'Ejercicio para fortalecer el pecho y tríceps utilizando la máquina de press.',
    maquina: 'Máquina de Press de Pecho',
  },
  {
    id: '2',
    nombre: 'Extensión de Piernas',
    descripcion: 'Fortalece los músculos del cuádriceps usando la máquina de extensión de piernas.',
    maquina: 'Máquina de Extensión de Piernas',
  },
  {
    id: '3',
    nombre: 'Remo Sentado',
    descripcion: 'Desarrolla la espalda media y los bíceps usando la máquina de remo sentado.',
    maquina: 'Máquina de Remo',
  },
  {
    id: '4',
    nombre: 'Curl de Bíceps',
    descripcion: 'Ejercicio de aislamiento para los bíceps utilizando una barra o mancuernas.',
    maquina: 'Banco Scott o Mancuernas',
  },
];

export default function BibliotecaScreen() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Biblioteca de Ejercicios</Text>

      <FlatList
        data={ejerciciosData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, selected === item.id && styles.cardSelected]}
            onPress={() => setSelected(item.id === selected ? null : item.id)}
          >
            <Text style={styles.nombre}>{item.nombre}</Text>
            <Text style={styles.maquina}>{item.maquina}</Text>
            {selected === item.id && <Text style={styles.descripcion}>{item.descripcion}</Text>}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
    color: '#7AC637',
  },
  card: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cardSelected: {
    backgroundColor: '#EAF8E3',
    borderColor: '#7AC637',
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  maquina: {
    color: '#666',
    marginTop: 4,
  },
  descripcion: {
    marginTop: 8,
    color: '#444',
  },
});
