// src/screens/RegisterScreen.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Login: undefined;
};

export default function RegisterScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [rol, setRol] = useState('estudiante'); // Valor predeterminado

  const handleRegister = async () => {
    if (!nombre || !correo || !clave) {
      Alert.alert('Error 324: Campos incompletos', 'Por favor completa todos los campos.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, correo, clave);
      const user = userCredential.user;

      // Guardar datos adicionales en Firestore
      await setDoc(doc(db, 'users', user.uid), {
        nombre: nombre,
        email: correo,
        rol: rol,
      });

      Alert.alert('¡Registro exitoso!', 'Ya puedes iniciar sesión.');
      navigation.navigate('Login');
    } catch (error: any) {
      Alert.alert('Error 656: Cuenta existente', 'las credenciales ya estan asociadas a una cuenta existente');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Cuenta</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre completo"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={correo}
        onChangeText={setCorreo}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={clave}
        onChangeText={setClave}
        secureTextEntry
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

      <Button title="Registrarse" onPress={handleRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: {
    height: 50,
    borderColor: '#999',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  label: { fontSize: 16, marginTop: 10, marginBottom: 5 },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
});
