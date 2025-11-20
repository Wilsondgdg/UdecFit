// src/screens/RegisterScreen.tsx
import React, { useState } from 'react';
import { 
    View, 
    TextInput, 
    Text, 
    StyleSheet, 
    Alert, 
    TouchableOpacity, 
    ActivityIndicator, 
    KeyboardAvoidingView, 
    Platform, 
    ScrollView 
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

type RootStackParamList = {
    Login: undefined;
};

export default function RegisterScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [clave, setClave] = useState('');
    const [rol, setRol] = useState('estudiante'); 
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!nombre || !correo || !clave) {
            Alert.alert('Error', 'Por favor completa todos los campos.');
            return;
        }
        
        setLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, correo.trim(), clave);
            const user = userCredential.user;

            await setDoc(doc(db, 'users', user.uid), {
                nombre: nombre.trim(),
                email: correo.trim(),
                rol: rol,
                createdAt: new Date(),
            });

            Alert.alert('¡Registro exitoso!', 'Tu cuenta ha sido creada. Ya puedes iniciar sesión.');
            navigation.navigate('Login');
        } catch (error: any) {
            let errorMsg = 'Ocurrió un error desconocido.';
            
            if (error.code === 'auth/email-already-in-use') {
                errorMsg = 'Esta dirección de correo ya está asociada a una cuenta existente.';
            } else if (error.code === 'auth/invalid-email') {
                errorMsg = 'El formato del correo electrónico es inválido.';
            } else if (error.code === 'auth/weak-password') {
                errorMsg = 'La contraseña debe tener al menos 6 caracteres.';
            }

            Alert.alert('Error de Registro', errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView 
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Crear Cuenta</Text>
                <Text style={styles.subtitle}>Únete a la plataforma UdecFit.</Text>

                {/* Campo Nombre */}
                <TextInput
                    style={styles.input}
                    placeholder="👤 Nombre completo"
                    value={nombre}
                    onChangeText={setNombre}
                    autoCapitalize="words"
                    // MODIFICACIÓN: Deshabilitar autocompletado para el nombre
                    autoComplete="off" 
                    textContentType="none"
                />

                {/* Campo Correo */}
                <TextInput
                    style={styles.input}
                    placeholder="📧 Correo electrónico"
                    value={correo}
                    onChangeText={setCorreo}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    // MODIFICACIÓN: Deshabilitar autocompletado para el correo
                    autoComplete="off" 
                    textContentType="none"
                />

                {/* Campo Contraseña */}
                <TextInput
                    style={styles.input}
                    placeholder="🔒 Contraseña (mín. 6 caracteres)"
                    value={clave}
                    onChangeText={setClave}
                    secureTextEntry
                    // MODIFICACIÓN: Deshabilitar autocompletado para la contraseña
                    autoComplete="off" 
                    textContentType="none"
                />

                {/* Selector de Rol (Sin cambios) */}
                <View style={styles.pickerContainer}>
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
                            color="#333" 
                            style={styles.pickerIcon} 
                        />
                    </View>
                </View>

                {/* Botón de Registro */}
                <TouchableOpacity 
                    style={styles.button}
                    onPress={handleRegister}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Registrarse</Text>
                    )}
                </TouchableOpacity>
                
                {/* Enlace a Login */}
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.link}>
                        ¿Ya tienes cuenta? <Text style={{fontWeight: 'bold'}}>Inicia Sesión</Text>
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { 
        flexGrow: 1, 
        justifyContent: 'center', 
        padding: 30, 
        backgroundColor: '#fff', 
    },
    title: { 
        fontSize: 32, 
        fontWeight: '800', 
        marginBottom: 10, 
        textAlign: 'center', 
        color: '#333' 
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 40,
        textAlign: 'center',
        color: '#666',
    },
    input: {
        height: 55,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        marginBottom: 15,
        paddingHorizontal: 15,
        backgroundColor: '#f9f9f9',
        fontSize: 16,
        color: '#333',
    },
    label: { 
        fontSize: 16, 
        marginBottom: 8, 
        color: '#333',
        fontWeight: '600'
    },
    pickerContainer: {
        marginBottom: 20,
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#f9f9f9',
        height: 55,
        justifyContent: 'center',
    },
    picker: {
        height: 55,
        width: '100%',
        color: '#333',
    },
    pickerIcon: {
        position: 'absolute',
        right: 15,
        top: 17,
        pointerEvents: 'none',
    },
    button: {
        backgroundColor: '#7B61FF', 
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        height: 55,
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
    link: {
        marginTop: 30,
        color: '#7B61FF',
        textAlign: 'center',
        fontSize: 15,
    },
});
