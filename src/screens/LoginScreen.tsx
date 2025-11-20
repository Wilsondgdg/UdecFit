import React, { useState } from 'react';
import { 
    View, 
    TextInput, 
    StyleSheet, 
    Text, 
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

// Función de utilería para consultar el rol del usuario (reducida)
const checkUserRoleAndNavigate = async (userId: string, navigation: any, setErrorMsg: (msg: string) => void) => {
    try {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
            const rol = userDoc.data().rol;
            if (rol === "admin") {
                navigation.replace('Admin');
            } else {
                navigation.replace('Inicio');
            }
            return true;
        } else {
            setErrorMsg("Error: No se encontró el perfil del usuario.");
            return false;
        }
    } catch (err: any) {
        setErrorMsg("Error de Perfil: No se pudo consultar el perfil.");
        return false;
    }
};

export default function LoginScreen({ navigation }: any) { 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);
   
    // --- Manejador del Login con Email/Password ---
    const handleEmailLogin = async () => {
        setErrorMsg('');
        setLoading(true);

        if (!email || !password) {
            setErrorMsg('Por favor ingresa correo y contraseña.');
            setLoading(false);
            return;
        }

        const emailKey = email.toLowerCase().trim();
        const loginDocRef = doc(db, "loginAttempts", emailKey);
        const loginDocSnap = await getDoc(loginDocRef);
        const now = Date.now();

        try {
            const userCredential = await signInWithEmailAndPassword(auth, emailKey, password);
            
            await setDoc(loginDocRef, { attempts: 0, blockedUntil: 0 });
            await checkUserRoleAndNavigate(userCredential.user.uid, navigation, setErrorMsg);

        } catch (error: any) {
            console.log("Error de login:", error.message);
            
            const data = loginDocSnap.exists() ? loginDocSnap.data() : {};
            const { blockedUntil = 0 } = data;

            if (blockedUntil && now < blockedUntil) {
                const remaining = Math.ceil((blockedUntil - now) / 60000);
                setErrorMsg(`Has superado los intentos. Intenta nuevamente en ${remaining} min.`);
                return;
            }

            const attempts = (data.attempts || 0) + 1;

            if (attempts >= 3) {
                const newBlockedUntil = now + 180 * 1000;
                await setDoc(loginDocRef, { attempts: 3, blockedUntil: newBlockedUntil });
                setErrorMsg("Has excedido los 3 intentos. Intenta de nuevo en 180 segundos.");
            } else {
                await setDoc(loginDocRef, { attempts, blockedUntil: 0 });
                setErrorMsg("Usuario y/o contraseña inválidos.");
            }
        } finally {
            setLoading(false);
        }
    };
        
    // --- Renderizado ---
    return (
        <View style={styles.container}>
            <Text style={styles.title}>¡Bienvenido!</Text>
            <Text style={styles.subtitle}>Ingresa para acceder a tu panel.</Text>

            {/* Inputs de Email y Contraseña */}
            <TextInput
                style={styles.input}
                placeholder="📧 Correo electrónico"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
            />
            <TextInput
                style={styles.input}
                placeholder="🔒 Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="password"
            />

            {/* Botón de Login Estándar */}
            <TouchableOpacity 
                style={styles.button}
                onPress={handleEmailLogin}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? <ActivityIndicator color="#fff" /> : 'Iniciar Sesión'}
                </Text>
            </TouchableOpacity>
            
            {/* Separador */}
            <View style={styles.separatorContainer}>
                <View style={styles.separator} />
                <Text style={styles.separatorText}>O</Text>
                <View style={styles.separator} />
            </View>

            {/* Botón de Login con Google (Mantenido, pero sin funcionalidad) */}
            <TouchableOpacity 
                style={styles.googleButton}
                onPress={() => Alert.alert("Funcionalidad Pendiente", "La autenticación con Google se activará en futuras versiones.")}
            >
                <Ionicons name="logo-google" size={20} color="#fff" />
                <Text style={styles.googleButtonText}>Iniciar Sesión con Google</Text>
            </TouchableOpacity>
            
            {/* Mensaje de Error */}
            {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

            {/* Enlace de Registro */}
            <TouchableOpacity onPress={() => navigation.navigate('Registro')}>
                <Text style={styles.link}>
                    ¿No tienes cuenta? <Text style={{fontWeight: 'bold'}}>Regístrate aquí</Text>
                </Text>
            </TouchableOpacity>
        </View>
    );
}

// --- Estilos Modernos ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 30,
        backgroundColor: '#fff', 
    },
    title: {
        fontSize: 32,
        marginBottom: 10,
        textAlign: 'center',
        fontWeight: '800', 
        color: '#333',
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
    button: {
        backgroundColor: '#7B61FF', 
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
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
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 10,
        fontSize: 14,
    },
    link: {
        marginTop: 30,
        color: '#7B61FF',
        textAlign: 'center',
        fontSize: 15,
    },
    separatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 25,
    },
    separator: {
        flex: 1,
        height: 1,
        backgroundColor: '#ccc',
    },
    separatorText: {
        width: 30,
        textAlign: 'center',
        color: '#888',
        fontSize: 16,
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4285F4', 
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
        height: 55,
    },
    googleButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 10,
    }
});