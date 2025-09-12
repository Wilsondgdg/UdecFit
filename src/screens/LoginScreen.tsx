import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import { db } from '../firebase/config';             
import { doc, getDoc } from 'firebase/firestore';


export default function LoginScreen({ navigation }: any) { 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Leer rol desde Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
  
      if (userDoc.exists()) {
        const rol = userDoc.data().rol;
        if (rol === "admin") {
          navigation.replace('Admin');
        } else {
          navigation.replace('Inicio');
        }
      } else {
        Alert.alert("Error", "No se encontró el perfil del usuario.");
      }
    } catch (error: any) {
      Alert.alert('Error 555', 'credenciales invalidas o cuenta inexistente ');
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Iniciar Sesión" onPress={handleLogin} />
      <Text style={styles.link} onPress={() => navigation.navigate('Registro')}>
        ¿No tienes cuenta? Regístrate
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  link: {
    marginTop: 20,
    color: 'blue',
    textAlign: 'center',
  }
});
