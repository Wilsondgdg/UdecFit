import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert } from 'react-native';
import { auth, db } from '../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Cuenta: undefined;
};

export default function EditarPerfilScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [nombre, setNombre] = useState('');
  const [rol, setRol] = useState('');

  useEffect(() => {
    const cargarDatos = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setNombre(data.nombre);
          setRol(data.rol);
        }
      }
    };

    cargarDatos();
  }, []);

  const handleGuardar = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, {
        nombre: nombre,
        rol: rol,
      });

      Alert.alert('Éxito', 'Tu perfil ha sido actualizado.');
      navigation.navigate('Cuenta');
    } catch (error: any) {
      Alert.alert('Error al guardar', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Perfil</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre completo"
        value={nombre}
        onChangeText={setNombre}
      />

      <Text style={styles.label}>Selecciona tu rol:</Text>
      <Picker
        selectedValue={rol}
        style={styles.picker}
        onValueChange={(itemValue) => setRol(itemValue)}
      >
        <Picker.Item label="Estudiante" value="estudiante" />
        <Picker.Item label="Docente" value="docente" />
        <Picker.Item label="Administrativo" value="administrativo" />
        <Picker.Item label="Egresado" value="egresado" />
      </Picker>

      <Button title="Guardar cambios" onPress={handleGuardar} color="#7B61FF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  label: { fontSize: 16, marginBottom: 5 },
  picker: { height: 50, width: '100%', marginBottom: 20 },
});
