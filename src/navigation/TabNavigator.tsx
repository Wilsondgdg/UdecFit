import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import RutinaScreen from '../screens/RutinaScreen';
import ProgresoScreen from '../screens/ProgresoScreen';
import CuentaScreen from '../screens/CuentaScreen';
import PremiumScreen from '../screens/PremiumScreen';
import { Ionicons } from '@expo/vector-icons';


const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#7AC637',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'help-circle'; // ícono por defecto

          if (route.name === 'Rutina') iconName = focused ? 'barbell' : 'barbell-outline';
          else if (route.name === 'Progreso') iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          else if (route.name === 'Cuenta') iconName = focused ? 'person' : 'person-outline';
          else if (route.name === 'Biblioteca') iconName = focused ? 'star' : 'star-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Rutina" component={RutinaScreen} />
      <Tab.Screen name="Progreso" component={ProgresoScreen} />
      <Tab.Screen name="Biblioteca" component={PremiumScreen} />
      <Tab.Screen name="Cuenta" component={CuentaScreen} />
    </Tab.Navigator>
  );
}
