import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Alert, 
  Platform,
  ScrollView,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { 
  doc, 
  updateDoc, 
  arrayUnion, 
} from 'firebase/firestore';
import { auth, db } from '../firebase/config';

// 🛠️ Importación de UUID (limpia y funcional)
import { v4 as uuidv4 } from 'uuid';

// Importamos los datos de la fusión (ESQUEMAS_DATOS, Esquema)
import { 
    ESQUEMAS_DATOS, 
    Esquema, 
} from '../data/rutinaDatos'; 

// --- TIPOS DE DATOS ---
interface Ejercicio {
  nombre: string;
  series: number;
  repeticiones: string; 
  completado: boolean;
  id: string;
}

type Rutina = {
  id: string;
  nombre: string;
  dias: number;
  esquemaId: keyof typeof ESQUEMAS_DATOS;
  esquema: Esquema[];
  detalle: { dia: string; rutina: string[] }[];
};

const OPCIONES_DIAS = [3, 4, 5, 6]; 

export default function RutinaScreen() {
    // ESTADOS
    const [rutinasCreadas, setRutinasCreadas] = useState<Rutina[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [rutinaSeleccionada, setRutinaSeleccionada] = useState<Rutina | null>(null);

    // --- FUNCIONES DE GENERACIÓN DE RUTINA ---
    const seleccionDias = (dias: number) => {
        let esquemaRutina: Esquema[] = [];
        let nombreRutina: string = "";
        let esquemaId: keyof typeof ESQUEMAS_DATOS;

        let detalleRutina: { dia: string; rutina: string[] }[] = [
            { dia: "Lunes", rutina: [] },
            { dia: "Martes", rutina: [] },
            { dia: "Miércoles", rutina: [] },
            { dia: "Jueves", rutina: [] },
            { dia: "Viernes", rutina: [] },
            { dia: "Sábado", rutina: [] },
        ];
        
        switch (dias) {
            case 3:
                esquemaId = "fullBody";
                nombreRutina = "FULLBODY";
                esquemaRutina = ESQUEMAS_DATOS.fullBody;
                break;
            case 4:
                esquemaId = "torsoPierna";
                nombreRutina = "TORSO-PIERNA";
                esquemaRutina = ESQUEMAS_DATOS.torsoPierna;
                break;
            case 5:
                esquemaId = "torsoPierna_ppl";
                nombreRutina = "TORSO-PIERNA/PPL";
                esquemaRutina = ESQUEMAS_DATOS.torsoPierna_ppl;
                break;
            case 6:
                esquemaId = "ppl";
                nombreRutina = "PPL";
                esquemaRutina = ESQUEMAS_DATOS.ppl;
                break;
            default:
                setModalVisible(false);
                return;
        }

        esquemaRutina.forEach((esq, index) => {
            if (detalleRutina[index]) {
                detalleRutina[index].rutina = esq.rutina;
            }
        });

        const nuevaRutina: Rutina = {
            id: uuidv4(),
            nombre: nombreRutina,
            dias: dias,
            esquemaId: esquemaId,
            esquema: esquemaRutina,
            detalle: detalleRutina.slice(0, dias),
        };

        setRutinasCreadas((prevRutinas) => [...prevRutinas, nuevaRutina]);
        setModalVisible(false);
    };

    const verDetalle = (rutina: Rutina) => {
        setRutinaSeleccionada(rutina);
    };

    const cerrarDetalle = () => {
        setRutinaSeleccionada(null);
    };

    // --- Lógica de Completar Sesión ---
    const guardarSesionCompletada = async (rutina: Rutina) => {
        const user = auth.currentUser;
        if (!user || isLoading) return;
        
        setIsLoading(true);
        const userId = user.uid;
        const sessionDate = new Date().toISOString().split('T')[0];

        try {
            const userDocRef = doc(db, 'users', userId);
            
            await updateDoc(userDocRef, {
                sesionesCompletadas: arrayUnion({ id: rutina.id, nombre: rutina.nombre, fecha: sessionDate })
            });

            Alert.alert("¡Felicidades!", `Has completado la rutina ${rutina.nombre}. ¡Sigue así!`);
            setRutinasCreadas(prev => prev.filter(r => r.id !== rutina.id));
            setRutinaSeleccionada(null);
        } catch (error: any) {
            Alert.alert("Error al guardar", "No se pudo registrar la sesión completada.");
        } finally {
            setIsLoading(false);
        }
    };


    // --- RENDERIZADO DEL DETALLE (CONDICIONAL) ---

    if (rutinaSeleccionada) {
        return (
            <DetalleRutinaView 
                rutina={rutinaSeleccionada} 
                onClose={cerrarDetalle} 
                onComplete={guardarSesionCompletada}
                isLoading={isLoading}
            />
        );
    }


    // --- RENDERIZADO DE LA LISTA PRINCIPAL (DEFAULT) ---
    return (
        <>
            <ScrollView 
                style={styles.scroll}
                contentContainerStyle={rutinasCreadas.length === 0 ? styles.scrollVacio : styles.scrollContent}
            >
                {/* CABECERA PERSONALIZADA */}
                <View style={styles.customHeader}>
                    <Text style={styles.headerTitle}>Mis Rutinas</Text>
                </View>
                
                <View style={{ flex: 1, paddingHorizontal: 20 }}>
                    {rutinasCreadas.length > 0 ? (
                        // Muestra las rutinas creadas
                        rutinasCreadas.map((rutina) => (
                            <View style={styles.cardContainer} key={rutina.id}>
                                <TouchableOpacity
                                    style={styles.card}
                                    onPress={() => verDetalle(rutina)}
                                >
                                    <View style={styles.cardInfo}>
                                        <Text style={styles.cardTitle}>{rutina.nombre}</Text>
                                        <Text style={styles.cardText}>{rutina.dias} días de entreno</Text>
                                        <Text style={styles.cardMeta}>{rutina.esquemaId.toUpperCase()}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        ))
                    ) : (
                        // Mensaje cuando no hay rutinas
                        <View style={styles.containerVacio}>
                            <Text style={styles.textoContainerVacio}>
                                Toca el botón '+' para generar tu primera rutina.
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Botón Flotante para Agregar Rutina */}
            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                <Ionicons name="add-circle-sharp" size={70} color="#7B61FF" />
            </TouchableOpacity>

            {/* MODAL DE SELECCIÓN DE DÍAS */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>
                            ¿Cuántos días a la semana quieres entrenar?
                        </Text>
                        {OPCIONES_DIAS.map((dias) => (
                            <TouchableOpacity
                                style={styles.modalButtons}
                                key={dias}
                                onPress={() => seleccionDias(dias)}
                            >
                                <Text style={styles.modalButtonText}>{dias} días</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </Modal>
        </>
    );
}

// --- SUBCOMPONENTE DE DETALLE DE LA RUTINA (VISUALIZACIÓN) ---
const DetalleRutinaView = ({ rutina, onClose, onComplete, isLoading }: { rutina: Rutina, onClose: () => void, onComplete: (r: Rutina) => void, isLoading: boolean }) => {
    return (
        <View style={detalleStyles.fullContainer}>
            {/* CABECERA DE DETALLE (Con botón de retroceso) */}
            <View style={detalleStyles.customHeader}>
                <TouchableOpacity onPress={onClose} style={detalleStyles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={detalleStyles.headerTitle}>Detalle de Rutina</Text>
            </View>

            <ScrollView contentContainerStyle={detalleStyles.container}>
                <View style={detalleStyles.infoBox}>
                    <Text style={detalleStyles.title}>{rutina.nombre} ({rutina.dias} Días)</Text>
                    <Text style={detalleStyles.subtitle}>ID: {rutina.id.substring(0, 8)}... </Text>
                    <Text style={detalleStyles.subtitle}>{rutina.dias} Días de Entrenamiento</Text>
                </View>

                <Text style={detalleStyles.sectionTitle}>Esquema de la Semana</Text>
                
                {rutina.detalle.map((diaDetalle, index) => (
                    <View key={index} style={detalleStyles.dayCard}>
                        <Text style={detalleStyles.dayTitle}>{diaDetalle.dia.toUpperCase()}</Text>
                        <Text style={detalleStyles.dayMeta}>
                            ({rutina.esquemaId.toUpperCase()})
                        </Text>

                        {diaDetalle.rutina.map((ejercicio, ejIndex) => (
                            <Text key={ejIndex} style={detalleStyles.ejercicioItem}>
                                • {ejercicio}
                            </Text>
                        ))}
                    </View>
                ))}

                <TouchableOpacity 
                    style={detalleStyles.completeButton}
                    onPress={() => onComplete(rutina)}
                    disabled={isLoading}
                >
                    <Ionicons name="trophy-outline" size={20} color="#000" />
                    <Text style={detalleStyles.completeButtonText}>
                        {isLoading ? 'Guardando Progreso...' : 'FINALIZAR RUTINA'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};


// --- ESTILOS (Adaptados para la versión final) ---
const styles = StyleSheet.create({
    fullContainer: { flex: 1, backgroundColor: '#1C1C1C' }, 
    customHeader: {
        paddingTop: Platform.OS === 'ios' ? 50 : 20,
        paddingHorizontal: 24,
        paddingBottom: 15,
        backgroundColor: '#222',
        borderBottomColor: '#333',
        borderBottomWidth: 1,
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
    },
    
    // Estilos del Scroll/Contenido
    scroll: { flex: 1, backgroundColor: "#1C1C1C", },
    scrollContent: { paddingTop: 10, paddingBottom: 100, },
    scrollVacio: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#1C1C1C", paddingTop: 200, },
    
    // Contenedores
    cardContainer: {
        backgroundColor: "#2C2C2C",
        marginVertical: 10,
        borderRadius: 15,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#333',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    card: {
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardInfo: { flex: 1, },
    cardMeta: { fontSize: 14, fontWeight: '600', color: '#7AC637', marginTop: 5, },
    cardTitle: { fontSize: 22, fontWeight: "700", color: "#FFFFFF", marginBottom: 5, },
    cardText: { fontSize: 16, fontWeight: "500", color: "#A9A9A9", },
    
    // Botón Flotante
    addButton: {
        position: "absolute",
        bottom: 85, 
        right: 20,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 12,
    },
    
    // Estilos del Modal
    modalContainer: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0, 0, 0, 0.8)", },
    modalView: { backgroundColor: "#1C1C1C", borderRadius: 20, padding: 25, width: "80%", alignItems: "center", borderWidth: 1, borderColor: '#333', },
    modalTitle: { marginBottom: 20, fontSize: 18, fontWeight: "bold", textAlign: "center", color: "#FFFFFF", },
    modalButtons: { backgroundColor: "#2C2C2C", width: "100%", padding: 15, borderRadius: 10, marginVertical: 8, alignItems: "center", borderWidth: 1, borderColor: '#7B61FF', },
    modalButtonText: { color: '#FFFFFF', fontWeight: '600' },
    containerVacio: { alignItems: "center", justifyContent: "center", padding: 20, },
    textoContainerVacio: { color: "#A9A9A9", fontSize: 18, },
});

const detalleStyles = StyleSheet.create({
    fullContainer: { flex: 1, backgroundColor: '#1C1C1C' },
    customHeader: {
        flexDirection: 'row', alignItems: 'center', paddingTop: Platform.OS === 'ios' ? 50 : 20, paddingBottom: 15, paddingHorizontal: 20, backgroundColor: '#222', borderBottomWidth: 1, borderColor: '#333',
    },
    backButton: { marginRight: 15, padding: 5, },
    headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff', },
    container: { paddingHorizontal: 20, paddingVertical: 20, },
    infoBox: { marginBottom: 30, padding: 15, backgroundColor: '#2C2C2C', borderRadius: 12, borderLeftWidth: 4, borderLeftColor: '#7AC637', },
    title: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 5, },
    subtitle: { fontSize: 16, color: '#A9A9A9', },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF', marginTop: 10, marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#333', paddingBottom: 5, },
    dayCard: { backgroundColor: '#2C2C2C', padding: 15, borderRadius: 12, marginBottom: 15, borderLeftWidth: 4, borderLeftColor: '#7B61FF', },
    dayTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF', },
    dayMeta: { fontSize: 12, color: '#A9A9A9', marginBottom: 10, },
    ejercicioItem: { fontSize: 16, color: '#FFFFFF', marginBottom: 5, marginLeft: 10, borderLeftWidth: 2, borderLeftColor: '#444', paddingLeft: 8, },
    completeButton: { backgroundColor: '#7AC637', padding: 18, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 30, marginBottom: 50, },
    completeButtonText: { color: '#111111', fontWeight: '800', marginLeft: 10, fontSize: 16, }
});