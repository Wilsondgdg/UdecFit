import React, { useState, useEffect, useCallback } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    ScrollView, 
    ActivityIndicator, 
    Platform,
    FlatList,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

// --- TIPOS DE DATOS ---
interface CompletedSession {
    id: string;
    nombre: string;
    fecha: string; // Formato YYYY-MM-DD
}

// --- CONSTANTES DE DISEÑO ---
const COLORS = {
    background: '#1C1C1C',
    card: '#2C2C2C',
    textPrimary: '#FFFFFF',
    textSecondary: '#A9A9A9',
    accent: '#7B61FF',
    success: '#7AC637',
    danger: '#FF6161',
    border: '#333333',
};

const MONTHLY_GOAL = 10; // Meta de ejemplo

// --- LÓGICA DE CÁLCULO DE DATOS ---
const calculateStats = (sessions: CompletedSession[]) => {
    if (!sessions || sessions.length === 0) {
        return {
            totalSessions: 0,
            currentMonthSessions: 0,
            lastSessionDate: 'N/A',
            progressPercentage: 0,
            monthlySessions: [],
        };
    }

    // 1. Sesiones Totales
    const totalSessions = sessions.length;

    // 2. Sesiones del Mes Actual
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const currentMonthSessions = sessions.filter(session => {
        const sessionDate = new Date(session.fecha);
        return sessionDate.getMonth() === currentMonth && sessionDate.getFullYear() === currentYear;
    }).length;

    // 3. Última Sesión
    const lastSession = sessions.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())[0];
    const lastSessionDate = lastSession ? lastSession.fecha : 'N/A';
    
    // 4. Progreso del Mes
    const progressPercentage = Math.min(100, Math.round((currentMonthSessions / MONTHLY_GOAL) * 100));

    // 5. Tendencia Mensual (Simulación de Datos)
    // Agrupa por Mes/Año para la simulación de gráficos
    const monthlySessionsMap = sessions.reduce((acc, session) => {
        const [year, month] = session.fecha.split('-');
        const key = `${year}-${month}`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Conviértelo en un array para mostrar las últimas 6 entradas
    const monthlySessions = Object.entries(monthlySessionsMap)
        .map(([key, count]) => ({ monthYear: key, count }))
        .sort((a, b) => new Date(b.monthYear).getTime() - new Date(a.monthYear).getTime())
        .slice(0, 6)
        .reverse(); // Para que el más antiguo esté primero

    return {
        totalSessions,
        currentMonthSessions,
        lastSessionDate,
        progressPercentage,
        monthlySessions,
    };
};

export default function ProgresoScreen() {
    const [completedSessions, setCompletedSessions] = useState<CompletedSession[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState(calculateStats([]));
    
    // Función de escucha en tiempo real de Firestore
    useEffect(() => {
        const user = auth.currentUser;
        if (!user) {
            setIsLoading(false);
            Alert.alert("Error de Autenticación", "Debes iniciar sesión para ver tu progreso.");
            return;
        }

        const userId = user.uid;
        const userDocRef = doc(db, 'users', userId);

        const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                const sessions: CompletedSession[] = data.sesionesCompletadas || [];
                
                // Actualiza las sesiones y recalcula las estadísticas
                setCompletedSessions(sessions);
                setStats(calculateStats(sessions));
            } else {
                setCompletedSessions([]);
                setStats(calculateStats([]));
            }
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching progress data:", error);
            setIsLoading(false);
            Alert.alert("Error de Datos", "No se pudo cargar el progreso. Intenta de nuevo.");
        });

        // Limpiar el listener al desmontar
        return () => unsubscribe();
    }, []);

    // Componente para el historial de sesiones
    const renderSessionItem = useCallback(({ item }: { item: CompletedSession }) => (
        <View style={styles.historyItem}>
            <Ionicons name="trophy-outline" size={20} color={COLORS.success} style={{ marginRight: 10 }} />
            <View style={styles.historyTextContainer}>
                <Text style={styles.historyTitle}>{item.nombre}</Text>
                <Text style={styles.historyDate}>Completado el: {item.fecha}</Text>
            </View>
        </View>
    ), []);

    // Función para simular el gráfico de tendencia
    const renderMonthlyChart = () => {
        if (stats.monthlySessions.length === 0) {
            return <Text style={styles.emptyChartText}>No hay datos suficientes para la tendencia mensual.</Text>;
        }

        const maxCount = Math.max(...stats.monthlySessions.map(s => s.count), 1); // Evitar división por cero

        return (
            <View style={styles.chartContainer}>
                {stats.monthlySessions.map((data, index) => (
                    <View key={index} style={styles.chartBarWrapper}>
                        {/* Barra */}
                        <View style={[
                            styles.chartBar, 
                            { height: `${(data.count / maxCount) * 100}%` }
                        ]} />
                        {/* Etiqueta */}
                        <Text style={styles.chartLabel}>{data.monthYear.substring(5)}</Text>
                        <Text style={styles.chartCount}>{data.count}</Text>
                    </View>
                ))}
            </View>
        );
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.accent} />
                <Text style={styles.loadingText}>Cargando tu historial de progreso...</Text>
            </View>
        );
    }

    return (
        <View style={styles.fullContainer}>
            {/* CABECERA PERSONALIZADA */}
            <View style={styles.customHeader}>
                <Text style={styles.headerTitle}>Mi Progreso</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                
                {/* --- SECCIÓN DE ESTADÍSTICAS CLAVE --- */}
                <Text style={styles.sectionTitle}>Estadísticas Clave</Text>
                <View style={styles.statsGrid}>
                    
                    {/* Tarjeta 1: Sesiones Totales */}
                    <View style={styles.statCard}>
                        <Ionicons name="calendar-sharp" size={30} color={COLORS.accent} />
                        <Text style={styles.statNumber}>{stats.totalSessions}</Text>
                        <Text style={styles.statText}>Sesiones Totales</Text>
                    </View>

                    {/* Tarjeta 2: Última Sesión */}
                    <View style={styles.statCard}>
                        <Ionicons name="time-outline" size={30} color={COLORS.textPrimary} />
                        <Text style={styles.statNumber}>{stats.lastSessionDate === 'N/A' ? '---' : stats.lastSessionDate.substring(5).replace('-', '/')}</Text>
                        <Text style={styles.statText}>Última Sesión</Text>
                    </View>
                </View>

                {/* --- PROGRESO MENSUAL --- */}
                <Text style={styles.sectionTitle}>Meta Mensual ({MONTHLY_GOAL} Sesiones)</Text>
                <View style={styles.progressContainer}>
                    <Text style={styles.progressText}>
                        {stats.currentMonthSessions} / {MONTHLY_GOAL} sesiones completadas este mes
                    </Text>
                    <View style={styles.progressBarBackground}>
                        <View style={[styles.progressBarFill, { width: `${stats.progressPercentage}%` }]} />
                    </View>
                    <Text style={styles.progressPercentageText}>{stats.progressPercentage}%</Text>
                </View>

                {/* --- TENDENCIA MENSUAL (Simulación de Gráfico) --- */}
                <Text style={styles.sectionTitle}>Tendencia de Entrenamiento</Text>
                <View style={styles.trendCard}>
                    {renderMonthlyChart()}
                </View>

                {/* --- HISTORIAL DE SESIONES --- */}
                <Text style={styles.sectionTitle}>Historial Completo ({stats.totalSessions})</Text>
                
                {completedSessions.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="barbell-outline" size={40} color={COLORS.textSecondary} />
                        <Text style={styles.emptyText}>
                            Aún no has completado ninguna rutina. ¡Empieza hoy mismo!
                        </Text>
                    </View>
                ) : (
                    // Usamos FlatList para manejar la lista dentro del ScrollView
                    <FlatList
                        data={[...completedSessions].reverse()} // Muestra el más reciente primero
                        keyExtractor={(item) => item.id}
                        renderItem={renderSessionItem}
                        scrollEnabled={false} // Deshabilita el scroll de la lista ya que está dentro de ScrollView
                    />
                )}
                
                <View style={{ height: 50 }} /> 
            </ScrollView>
        </View>
    );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
    fullContainer: { flex: 1, backgroundColor: COLORS.background }, 
    
    // Header
    customHeader: {
        paddingTop: Platform.OS === 'ios' ? 50 : 20,
        paddingHorizontal: 24,
        paddingBottom: 15,
        backgroundColor: COLORS.card,
        borderBottomColor: COLORS.border,
        borderBottomWidth: 1,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        textAlign: 'left',
    },

    // Loading/Empty
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
    loadingText: { color: COLORS.textSecondary, marginTop: 10, fontSize: 16 },
    emptyContainer: { 
        padding: 20, 
        backgroundColor: COLORS.card, 
        borderRadius: 12, 
        alignItems: 'center', 
        justifyContent: 'center', 
        marginTop: 10,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    emptyText: { color: COLORS.textSecondary, textAlign: 'center', marginTop: 10 },

    // Scroll Content
    scrollContent: { paddingHorizontal: 20, paddingVertical: 20, paddingBottom: 100 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.textPrimary, marginTop: 20, marginBottom: 15, },

    // Stats Grid
    statsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, },
    statCard: { 
        backgroundColor: COLORS.card, 
        borderRadius: 12, 
        padding: 15, 
        width: '48%', 
        alignItems: 'center',
        borderLeftWidth: 4,
        borderLeftColor: COLORS.accent,
    },
    statNumber: { fontSize: 32, fontWeight: 'bold', color: COLORS.textPrimary, marginTop: 5 },
    statText: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center' },

    // Progress Bar
    progressContainer: { 
        backgroundColor: COLORS.card, 
        padding: 15, 
        borderRadius: 12, 
        marginBottom: 20,
    },
    progressText: { color: COLORS.textPrimary, marginBottom: 10 },
    progressBarBackground: { 
        height: 10, 
        backgroundColor: COLORS.border, 
        borderRadius: 5, 
        overflow: 'hidden', 
        marginBottom: 8,
    },
    progressBarFill: { height: '100%', backgroundColor: COLORS.success, borderRadius: 5 },
    progressPercentageText: { color: COLORS.textPrimary, textAlign: 'right', fontWeight: 'bold' },

    // Trend Chart (Simulación)
    trendCard: {
        backgroundColor: COLORS.card,
        borderRadius: 12,
        padding: 15,
        marginBottom: 20,
        height: 200, // Altura fija para el gráfico
        justifyContent: 'center',
    },
    chartContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-around',
        flex: 1,
        paddingTop: 10,
    },
    chartBarWrapper: {
        height: '100%',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '12%',
    },
    chartBar: {
        width: '100%',
        backgroundColor: COLORS.accent,
        borderRadius: 4,
        minHeight: 5,
    },
    chartLabel: { fontSize: 10, color: COLORS.textSecondary, marginTop: 5 },
    chartCount: { fontSize: 12, fontWeight: 'bold', color: COLORS.textPrimary, position: 'absolute', top: 0 },
    emptyChartText: { color: COLORS.textSecondary, textAlign: 'center', fontSize: 14 },

    // History List
    historyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.card,
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.success,
    },
    historyTextContainer: { flex: 1 },
    historyTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.textPrimary },
    historyDate: { fontSize: 14, color: COLORS.textSecondary, marginTop: 2 },
});
