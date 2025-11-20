import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Platform } from 'react-native';
import { auth, db } from '../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons'; // Importamos Ionicons

type RootStackParamList = {
  Cuenta: undefined;
};

export default function EditarPerfilScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [nombre, setNombre] = useState('');
  const [rol, setRol] = useState('');
  const [loading, setLoading] = useState(false);

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
    if (!user || loading) return;

    setLoading(true);

    try {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, {
        nombre: nombre.trim(),
        rol: rol,
      });

      Alert.alert('Éxito', 'Tu perfil ha sido actualizado.');
      navigation.navigate('Cuenta');
    } catch (error: any) {
      Alert.alert('Error al guardar', error.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <View style={styles.fullContainer}>
        {/* CABECERA PERSONALIZADA CON BOTÓN DE RETROCESO */}
        <View style={styles.customHeader}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Editar Perfil</Text>
        </View>

        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Nombre completo"
                placeholderTextColor="#888" // Color de placeholder para fondo oscuro
                value={nombre}
                onChangeText={setNombre}
                autoCapitalize="words"
            />

            <Text style={styles.label}>Selecciona tu rol:</Text>
            
            <View style={styles.pickerWrapper}>
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
                <Ionicons 
                    name="chevron-down-outline" 
                    size={20} 
                    color="#fff" 
                    style={styles.pickerIcon} 
                />
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleGuardar} disabled={loading}>
                <Text style={styles.saveButtonText}>
                    {loading ? 'Guardando...' : 'GUARDAR CAMBIOS'}
                </Text>
            </TouchableOpacity>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
    fullContainer: { flex: 1, backgroundColor: '#1C1C1C' }, // Fondo oscuro principal
    
    customHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        // Ajustamos el paddingTop para respetar el área segura (notch)
        paddingTop: Platform.OS === 'ios' ? 50 : 20, 
        paddingBottom: 15,
        paddingHorizontal: 20,
        backgroundColor: '#222', // Fondo de la cabecera
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    backButton: {
        marginRight: 15,
        padding: 5,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff', // Texto blanco
    },

    container: { 
        flex: 1, 
        padding: 24, 
    },
    input: {
        height: 55,
        borderColor: '#444',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 15,
        marginBottom: 25,
        backgroundColor: '#2A2A2A', // Fondo de Input oscuro
        color: '#fff', // Texto en blanco
        fontSize: 16,
    },
    label: { 
        fontSize: 16, 
        marginBottom: 8, 
        color: '#fff', // Texto blanco
        fontWeight: '600'
    },
    
    // Estilos del Picker (coherentes con el diseño oscuro)
    pickerWrapper: {
        borderWidth: 1,
        borderColor: '#444',
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#2A2A2A',
        height: 55,
        justifyContent: 'center',
        marginBottom: 30,
    },
    picker: { 
        height: 55, 
        width: '100%', 
        color: '#fff', // Texto del Picker en blanco
    },
    pickerIcon: {
        position: 'absolute',
        right: 15,
        top: 17,
        pointerEvents: 'none',
    },
    
    saveButton: {
        backgroundColor: '#7B61FF', // Color de marca principal
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    }
});