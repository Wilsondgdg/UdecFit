import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from 'react-native';
import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { signOut } from 'firebase/auth';

export default function AdminPanel({ navigation }: any) {
  const [nombre, setNombre] = useState('');
  const [maquinas, setMaquinas] = useState<any[]>([]);

  // Escuchar cambios en la colección "maquinas"
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "maquinas"), (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMaquinas(lista);
    });
    return unsubscribe;
  }, []);

  const agregarMaquina = async () => {
    if (nombre.trim() === '') return;
    try {
      await addDoc(collection(db, "maquinas"), {
        nombre: nombre.trim(),
        estado: "activa"
      });
      setNombre('');
    } catch (error) {
      Alert.alert("Error", "No se pudo agregar la máquina.");
    }
  };

  const eliminarMaquina = async (id: string) => {
    await deleteDoc(doc(db, "maquinas", id));
  };

  const marcarMantenimiento = async (id: string, estadoActual: string) => {
    const nuevoEstado = estadoActual === "activa" ? "mantenimiento" : "activa";
    await updateDoc(doc(db, "maquinas", id), { estado: nuevoEstado });
  };

  const cerrarSesion = async () => {
    await signOut(auth);
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Panel de Administración</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre de la máquina"
        value={nombre}
        onChangeText={setNombre}
      />
      <Button title="Agregar máquina" onPress={agregarMaquina} />

      <Text style={styles.subtitulo}>Máquinas registradas</Text>
      <FlatList
        data={maquinas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={{ fontWeight: 'bold' }}>{item.nombre}</Text>
            <Text>Estado: {item.estado}</Text>
            <View style={styles.botones}>
              <Button title="Eliminar" onPress={() => eliminarMaquina(item.id)} color="red" />
              <Button
                title={item.estado === 'activa' ? 'Marcar como mantenimiento' : 'Activar'}
                onPress={() => marcarMantenimiento(item.id, item.estado)}
              />
            </View>
          </View>
        )}
      />

      <View style={{ marginTop: 30 }}>
        <Button title="Cerrar Sesión" onPress={cerrarSesion} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f2f2f2'
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15
  },
  subtitulo: {
    fontSize: 18,
    marginVertical: 15
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 5,
    backgroundColor: 'white'
  },
  item: {
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8
  },
  botones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  }
});
