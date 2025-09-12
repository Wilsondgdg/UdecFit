import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen';
//import HomeScreen from './screens/HomeScreen';//
import TabNavigator from './navigation/TabNavigator';
import AdminPanel from './screens/AdminPanel'; 
import EditarPerfilScreen from './screens/EditarPerfilScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Registro" component={RegisterScreen} />
        <Stack.Screen name="Inicio" component={TabNavigator} />
        <Stack.Screen name="Admin" component={AdminPanel} />
        <Stack.Screen name="EditarPerfil" component={EditarPerfilScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

