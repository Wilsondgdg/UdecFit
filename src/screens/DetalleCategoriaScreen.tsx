// src/screens/DetalleCategoriaScreen.tsx
import React from 'react';
import { 
    FlatList, 
    Pressable, 
    StyleSheet, 
    Text, 
    Platform,
    View,
    TouchableOpacity
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// Importamos los datos de la fusión
import { ejercicios, Ejercicio } from '../data/rutinaDatos';

type RootStackParamList = {
    Biblioteca: undefined;
    DetalleCategoria: { categoria: string };
    DetalleEjercicio: { ejercicio: Ejercicio };
};

export default function DetalleCategoriaScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute();
    // Extraemos la categoría de los parámetros de la ruta
    const categoria = (route.params as { categoria: string }).categoria; 

    // Filtramos los ejercicios por categoría
    const ejerciciosCategoria = ejercicios.filter(
        (ejercicio) =>
            ejercicio.categoria.toLowerCase() ===
            (categoria as string)?.toLocaleLowerCase()
    );

    return (
        <View style={styles.fullContainer}>
            {/* CABECERA PERSONALIZADA CON RETROCESO */}
            <View style={styles.customHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{categoria}</Text>
            </View>

            <FlatList
                style={styles.listContainer}
                contentContainerStyle={styles.contentContainer}
                data={ejerciciosCategoria}
                keyExtractor={(item) => item.nombre}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        style={styles.card}
                        // 💡 Navegación al detalle del ejercicio
                        onPress={() => navigation.navigate('DetalleEjercicio', { ejercicio: item })}
                    >
                        <Text style={styles.text}>{item.nombre}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

// --- ESTILOS FUSIONADOS Y UNIFICADOS ---
const styles = StyleSheet.create({
    fullContainer: { flex: 1, backgroundColor: '#111111' },
    customHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: Platform.OS === 'ios' ? 50 : 20,
        paddingBottom: 15,
        paddingHorizontal: 20,
        backgroundColor: '#222', 
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
        color: '#FFFFFF',
    },

    listContainer: {
        flex: 1,
        backgroundColor: "#111111",
    },
    contentContainer: {
        paddingVertical: 12,
    },
    card: {
        backgroundColor: "#2C2C2C",
        marginHorizontal: 20,
        marginVertical: 8,
        height: 80, 
        borderRadius: 10,
        padding: 20,
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
    },
    text: {
        fontSize: 18,
        fontWeight: "600",
        color: "#FFFFFF",
    },
});