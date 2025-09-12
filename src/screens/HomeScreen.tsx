import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';

export default function HomeScreen({ navigation }: any) {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace('Login');
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Bienvenido a UdecFit </Text>
      <Text style={styles.sub}>Has iniciado sesión correctamente.</Text>
      <Button title="Cerrar Sesión" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eef2f3',
    padding: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sub: {
    fontSize: 16,
    marginBottom: 30,
  }
});
