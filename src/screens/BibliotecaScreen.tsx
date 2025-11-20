// src/screens/BibliotecaScreen.tsx
import React from 'react';
import { 
    View, 
    Text, 
    FlatList, 
    StyleSheet, 
    TouchableOpacity, 
    ScrollView, 
    Platform 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// Importamos los datos de ejercicios de la fusión
import { ejercicios } from '../data/rutinaDatos'; 

type RootStackParamList = {
    DetalleCategoria: { categoria: string };
    // Rutas dinámicas: Usaremos un nombre de Stack fijo para navegar
    Biblioteca: undefined; // Ruta de la pestaña principal
};

export default function BibliotecaScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    
    // Extraemos categorías únicas del array de ejercicios
    const categoriasUnicas = [
        ...new Set(ejercicios.map(ej => ej.categoria))
    ].sort();

    // Adaptamos los estilos y la UI del index.tsx de tu compañero (vista de categorías)
    return (
        <View style={styles.fullContainer}>
            {/* CABECERA PERSONALIZADA */}
            <View style={styles.customHeader}>
                <Text style={styles.headerTitle}>Grupos Musculares</Text>
            </View>

            <ScrollView style={styles.scroll}>
                <View style={styles.container}>
                    {categoriasUnicas.map((categoria) => (
                        <TouchableOpacity 
                            key={categoria} 
                            style={styles.card}
                            // 💡 Navegación a la nueva pantalla de detalle
                            onPress={() => navigation.navigate('DetalleCategoria', { categoria })}
                        >
                            <Text style={styles.text}>{categoria}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

// --- ESTILOS FUSIONADOS Y UNIFICADOS ---
const styles = StyleSheet.create({
    fullContainer: { flex: 1, backgroundColor: '#111111' }, // Fondo principal oscuro
    customHeader: {
        paddingTop: Platform.OS === 'ios' ? 50 : 20,
        paddingHorizontal: 20,
        paddingBottom: 15,
        backgroundColor: '#222', // Fondo oscuro de la cabecera
        borderBottomColor: '#333',
        borderBottomWidth: 1,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 22,
        textAlign: 'center',
        fontWeight: '700',
    },
    
    scroll: {
        flex: 1,
        backgroundColor: "#111111",
    },
    container: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    card: {
        backgroundColor: "#2C2C2C", // Fondo de tarjeta oscura
        width: "47%",
        height: 120,
        marginVertical: 10,
        marginHorizontal: 5,
        borderRadius: 15,
        padding: 15,
        justifyContent: "flex-end",

        // Sombra unificada
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
    },
    text: {
        fontSize: 18,
        fontWeight: "700",
        color: "#FFFFFF",
    },
});
