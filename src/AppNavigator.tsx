// src/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen';
import TabNavigator from './navigation/TabNavigator';
import AdminPanel from './screens/AdminPanel'; 
import EditarPerfilScreen from './screens/EditarPerfilScreen';
// 💡 Rutas de la Biblioteca (Nuevas)
import DetalleCategoriaScreen from './screens/DetalleCategoriaScreen';
import DetalleEjercicioScreen from './screens/DetalleEjercicioScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      {/* 🛠️ Oculta el header y añade las nuevas rutas */}
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Registro" component={RegisterScreen} />
        <Stack.Screen name="Inicio" component={TabNavigator} />
        <Stack.Screen name="Admin" component={AdminPanel} />
        <Stack.Screen name="EditarPerfil" component={EditarPerfilScreen} />
        
        {/* 💡 RUTAS DE DETALLE DE LA BIBLIOTECA (Nuevas) */}
        <Stack.Screen name="DetalleCategoria" component={DetalleCategoriaScreen} />
        <Stack.Screen name="DetalleEjercicio" component={DetalleEjercicioScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
