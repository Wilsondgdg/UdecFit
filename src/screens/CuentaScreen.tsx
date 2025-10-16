import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

type RootStackParamList = {
  Login: undefined;
  Registro: undefined;
  Inicio: undefined;
  Admin: undefined;
  EditarPerfil: undefined;
};


export default function CuentaScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [rol, setRol] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        setEmail(user.email || '');

        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setNombre(data.nombre);
          setRol(data.rol);
        }
      }
    };

    fetchUserData();
  }, []);

  const cerrarSesion = async () => {
    try {
      await signOut(auth);
      navigation.replace('Login');
    } catch (error: any) {
      Alert.alert('Error al cerrar sesión', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mi Cuenta</Text>

      <View style={styles.infoContainer}>
        <Ionicons name="person-circle-outline" size={80} color="#7B61FF" />
        <Text style={styles.nombre}>{nombre}</Text>
        <Text style={styles.email}>{email}</Text>
        <Text style={styles.rol}>Rol: {rol}</Text>
      </View>

      <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditarPerfil')}>
        <Ionicons name="create-outline" size={20} color="#fff" />
        <Text style={styles.editButtonText}>Editar perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.premiumButton}>
        <Ionicons name="star-outline" size={20} color="#fff" />
        <Text style={styles.premiumButtonText}>Hacerse Premium</Text>
      </TouchableOpacity>

      <View style={styles.logout}>
        <Button title="Cerrar sesión" color="#FF4B4B" onPress={cerrarSesion} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 16,
  },
  nombre: { fontSize: 22, fontWeight: 'bold', marginTop: 10 },
  email: { fontSize: 16, color: '#555' },
  rol: { fontSize: 16, color: '#777', marginTop: 8 },

  editButton: {
    backgroundColor: '#7B61FF',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 30,
  },

  premiumButton: {
    backgroundColor: '#FFD700',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 20,
  },
  premiumButtonText: {
    color: '#000',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },

  editButtonText: { color: '#fff', marginLeft: 8, fontSize: 16, fontWeight: '600' },

  logout: { marginTop: 'auto' },
});
