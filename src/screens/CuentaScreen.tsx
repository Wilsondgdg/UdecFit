import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, TouchableOpacity, Platform } from 'react-native';
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
    <View style={styles.fullContainer}>
        {/* CABECERA PERSONALIZADA */}
        <View style={styles.customHeader}>
            <Text style={styles.headerTitle}>Mi Cuenta</Text>
        </View>

        <View style={styles.container}>
          <View style={styles.infoContainer}>
            <Ionicons name="person-circle-outline" size={80} color="#7B61FF" />
            <Text style={styles.nombre}>{nombre}</Text>
            <Text style={styles.email}>{email}</Text>
            <Text style={styles.rol}>Rol: {rol}</Text>
          </View>

          <TouchableOpacity 
                style={styles.editButton} 
                onPress={() => navigation.navigate('EditarPerfil')}
            >
            <Ionicons name="create-outline" size={20} color="#fff" />
            <Text style={styles.editButtonText}>Editar perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.premiumButton}>
            <Ionicons name="star-outline" size={20} color="#000" />
            <Text style={styles.premiumButtonText}>Hacerse Premium</Text>
          </TouchableOpacity>

          <View style={styles.logout}>
            <Button title="🚪 Cerrar sesión" color="#FF4B4B" onPress={cerrarSesion} />
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
        color: '#fff',
        textAlign: 'center',
    },
  container: { 
    flex: 1, 
    padding: 24,
    // Eliminamos el backgroundColor aquí, ya que fullContainer lo maneja
},
  infoContainer: {
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: '#2A2A2A', // Fondo de Contenedor Oscuro
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  nombre: { fontSize: 22, fontWeight: 'bold', marginTop: 10, color: '#fff' }, // Texto Blanco
  email: { fontSize: 16, color: '#bbb' }, // Texto Gris Claro
  rol: { fontSize: 16, color: '#999', marginTop: 8 }, // Texto Gris

  editButton: {
    backgroundColor: '#7B61FF', // Color de marca principal
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 15, 
  },
  editButtonText: { color: '#fff', marginLeft: 8, fontSize: 16, fontWeight: '700' },

  premiumButton: {
    backgroundColor: '#FFD700', // Amarillo
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 20,
  },
  premiumButtonText: {
    color: '#000', // Texto Negro en botón Amarillo
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '700',
  },

  logout: { marginTop: 'auto' },
});
