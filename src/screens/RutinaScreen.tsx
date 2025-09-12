import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function RutinaScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Sesión del jueves para Wilson</Text>
      <Text style={styles.subtitulo}>4 días • gimnasio • principiante</Text>

      <Image
        source={{ uri: 'https://i.imgur.com/uw1VQbB.jpeg' }}
        style={styles.imagen}
        resizeMode="cover"
      />

      <Text style={styles.nombreEjercicio}>Sentadilla en máquina Smith</Text>

      <View style={styles.detalles}>
        <Text style={styles.detalle}>0 de 3 SERIES</Text>
        <Text style={styles.detalle}>10 REPS</Text>
        <Text style={styles.detalle}>-- DE PESO</Text>
        <Text style={styles.detalle}>00:00 SEGUNDOS</Text>
      </View>

      <View style={styles.botones}>
        <TouchableOpacity style={styles.boton}>
          <Ionicons name="play" size={20} color="#fff" />
          <Text style={styles.textoBoton}>Iniciar serie #1</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.boton}>
          <Ionicons name="pause" size={20} color="#fff" />
          <Text style={styles.textoBoton}>Pausar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.boton}>
          <Ionicons name="barbell" size={20} color="#fff" />
          <Text style={styles.textoBoton}>Peso</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#111',
    flexGrow: 1,
  },
  titulo: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitulo: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 20,
  },
  imagen: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    marginBottom: 20,
  },
  nombreEjercicio: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detalles: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  detalle: {
    color: '#fff',
    width: '48%',
    marginBottom: 10,
  },
  botones: {
    width: '100%',
    alignItems: 'center',
  },
  boton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7B61FF',
    padding: 12,
    borderRadius: 10,
    marginVertical: 8,
    width: '100%',
    justifyContent: 'center',
  },
  textoBoton: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
  },
});
