// src/screens/DetalleEjercicioScreen.tsx
import React from 'react';
import { 
    ScrollView, 
    StyleSheet, 
    Text, 
    View, 
    Platform,
    TouchableOpacity 
} from "react-native";
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Definición de tipos simplificada para el detalle
type EjercicioDetalle = {
  nombre: string;
  categoria: string;
  descripcion: string;
};

// Datos dummy de detalle (tu compañero lo tenía hardcodeado)
const UdeC_GREEN = "#76B82A";

const getDetalleDummy = (nombre: string) => ({
  nombre: nombre,
  musculoPrincipal: "Pecho", // Asumimos un valor para el ejemplo
  dificultad: "Intermedio",
  equipo: "Mancuernas, Banco",
  instrucciones:
    "Acuéstese en un banco, sostenga las mancuernas al nivel del pecho. Empuje hacia arriba hasta extender los brazos. Baje lentamente de forma controlada.",
});

export default function DetalleEjercicioScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    
    // Recuperamos el objeto Ejercicio del parámetro de navegación
    const { ejercicio } = (route.params as { ejercicio: EjercicioDetalle });
    
    const datos = getDetalleDummy(ejercicio.nombre); // Usamos el nombre real para el título

  return (
    <View style={styles.fullContainer}>
        {/* CABECERA PERSONALIZADA CON RETROCESO */}
        <View style={styles.customHeader}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Detalle del Ejercicio</Text>
        </View>

        <ScrollView style={styles.container}>
          {/*CONTENEDOR DE IMÁGENES*/}
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imageText}>[Video/Imagen aquí]</Text>
          </View>

          <View style={styles.contentArea}>
            {/*ENCABEZADO*/}
            <Text style={styles.title}>{datos.nombre}</Text>

            {/*ETIQUETAS*/}
            <View style={styles.metadataContainer}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>
                  Músculo: {datos.musculoPrincipal}
                </Text>
              </View>
              <View style={[styles.tag, styles.tagAccent]}>
                <Text style={styles.tagTextAccent}>
                  Dificultad: {datos.dificultad}
                </Text>
              </View>
            </View>

            {/*INSTRUCCIONES*/}
            <Text style={styles.sectionTitle}>Instrucciones</Text>
            <Text style={styles.instructionsText}>{datos.instrucciones}</Text>
          </View>
        </ScrollView>
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
  container: {
    flex: 1,
    backgroundColor: "#111111",
  },

  //IMAGENES
  imagePlaceholder: {
    height: 250,
    backgroundColor: "#2C2C2C",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  imageText: {
    color: "#A9A9A9",
    fontSize: 16,
  },

  //ENCABEZADO Y ETIQUETAS
  contentArea: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  metadataContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 25,
  },
  tag: {
    backgroundColor: "#2C2C2C",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#444444",
  },
  tagText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  tagAccent: {
    backgroundColor: UdeC_GREEN, // Color verde de la marca
    borderColor: UdeC_GREEN,
  },
  tagTextAccent: {
    color: "#111111",
    fontWeight: "bold",
    fontSize: 14,
  },

  //INSTRUCCIONES
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 10,
    marginBottom: 10,
  },
  instructionsText: {
    fontSize: 16,
    color: "#A9A9A9",
    lineHeight: 24,
    marginBottom: 20,
  },
});