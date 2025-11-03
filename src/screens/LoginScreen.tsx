import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function LoginScreen({ navigation }: any) { 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async () => {
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Por favor ingresa correo y contraseña.');
      return;
    }

    const emailKey = email.toLowerCase().trim();
    const loginDocRef = doc(db, "loginAttempts", emailKey);
    const loginDocSnap = await getDoc(loginDocRef);
    const now = Date.now();

    try {
      // 🔹 Intentar iniciar sesión primero (aunque esté bloqueado)
      const userCredential = await signInWithEmailAndPassword(auth, emailKey, password);
      const user = userCredential.user;

      // 🔹 Si logra autenticarse, reiniciamos el contador
      await setDoc(loginDocRef, { attempts: 0, blockedUntil: 0 });

      // 🔹 Consultar el rol y navegar
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const rol = userDoc.data().rol;
        if (rol === "admin") {
          navigation.replace('Admin');
        } else {
          navigation.replace('Inicio');
        }
      } else {
        setErrorMsg("No se encontró el perfil del usuario.");
      }

    } catch (error: any) {
      console.log("Error de login:", error.message);

      // 🔹 Solo se ejecuta si las credenciales son inválidas
      const data = loginDocSnap.exists() ? loginDocSnap.data() : {};
      const { blockedUntil = 0 } = data;

      // Verificar si sigue bloqueado
      if (blockedUntil && now < blockedUntil) {
        const remaining = Math.ceil((blockedUntil - now) / 60000);
        setErrorMsg(`Has superado los intentos. Intenta nuevamente en ${remaining} min.`);
        return;
      }

      // Contar intento fallido
      const attempts = (data.attempts || 0) + 1;

      if (attempts >= 3) {
        const newBlockedUntil = now + 180 * 1000; // Bloquear por 180 segundos (3 minutos)
        await setDoc(loginDocRef, {
          attempts: 3,
          blockedUntil: newBlockedUntil,
        });
        setErrorMsg("Has excedido los 3 intentos. Intenta de nuevo en 180 segundos.");
      } else {
        await setDoc(loginDocRef, {
          attempts,
          blockedUntil: 0,
        });
        setErrorMsg("Usuario y/o contraseña inválidos.");
      }
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

      {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

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
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
  },
  link: {
    marginTop: 20,
    color: 'blue',
    textAlign: 'center',
  },
});
