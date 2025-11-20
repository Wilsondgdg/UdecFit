import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
// Asegúrate de que las importaciones de firebase/config sean correctas en tu proyecto
import { db, auth } from '../firebase/config';
import { signOut } from 'firebase/auth';

// Definición de tipos para las máquinas (opcional, pero útil)
interface Maquina {
  id: string;
  nombre: string;
  estado: "activa" | "mantenimiento";
}

export default function AdminPanel({ navigation }: any) {
  // State para la gestión de máquinas
  const [nombre, setNombre] = useState('');
  const [maquinas, setMaquinas] = useState<Maquina[]>([]);

  // State para la gestión de copias de seguridad
  const [loading, setLoading] = useState(false);
  // Estado para el mensaje de estado del backup/restore
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // --- Lógica de Máquinas (useEffect y Funciones) ---

  // Escuchar cambios en la colección "maquinas" (Mounting & Update)
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "maquinas"), (snapshot) => {
      const lista: Maquina[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Maquina, 'id'>),
      }));
      setMaquinas(lista);
    });
    return unsubscribe; // Cleanup function
  }, []);

  const agregarMaquina = async () => {
    if (nombre.trim() === '') {
      Alert.alert("Aviso", "El nombre de la máquina no puede estar vacío.");
      return;
    }
    try {
      await addDoc(collection(db, "maquinas"), {
        nombre: nombre.trim(),
        estado: "activa"
      });
      setNombre('');
    } catch (error) {
      Alert.alert("Error", "No se pudo agregar la máquina.");
    }
  };

  const eliminarMaquina = async (id: string) => {
    try {
      await deleteDoc(doc(db, "maquinas", id));
    } catch (error) {
      Alert.alert("Error", "No se pudo eliminar la máquina.");
    }
  };

  const marcarMantenimiento = async (id: string, estadoActual: string) => {
    try {
      const nuevoEstado = estadoActual === "activa" ? "mantenimiento" : "activa";
      await updateDoc(doc(db, "maquinas", id), { estado: nuevoEstado });
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el estado de la máquina.");
    }
  };

  const cerrarSesion = async () => {
    try {
      await signOut(auth);
      navigation.replace('Login');
    } catch (error) {
      Alert.alert("Error", "No se pudo cerrar la sesión.");
    }
  };

  // --- Lógica de Copias de Seguridad (Funciones) ---

  const handleBackup = async () => {
    setStatusMessage("⏳ Creando copia de seguridad...");
    setLoading(true); 
    try {
      const response = await fetch("https://crearbackup-er54jbqu2q-uc.a.run.app", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const data = await response.json();
      if (response.ok) {
        setStatusMessage(`✅ ${data.message} — Carpeta: ${data.folder}`);
      } else {
        setStatusMessage(`❌ Error: ${data.error || "Error desconocido"}`);
        Alert.alert("Error en Backup", `Detalle: ${data.error || "Error desconocido"}`);
      }
    } catch (error: any) {
      setStatusMessage(`⚠️ Error de conexión: ${error.message}`);
      Alert.alert("Error de Conexión", `Detalle: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    const folderPrompt = (callback: (text: string) => Promise<void>) => {
        Alert.prompt(
            "Restaurar copia",
            "🗂️ Ingresa el nombre de la carpeta de backup (Ej: 2025-10-09T05-38-40_67699):",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Restaurar",
                    onPress: (folderName) => {
                        if (folderName) {
                            callback(folderName);
                        } else {
                            setStatusMessage("❗ Restauración cancelada o carpeta vacía.");
                        }
                    },
                },
            ],
            Platform.OS === 'ios' ? "plain-text" : undefined // 'plain-text' solo en iOS
        );
    };

    folderPrompt(async (folderName) => {
      const trimmedFolderName = folderName.trim();
      if (trimmedFolderName === "") {
        setStatusMessage("❗ Restauración cancelada o carpeta vacía.");
        return;
      }

      setStatusMessage(`♻️ Restaurando desde: ${trimmedFolderName}...`);
      setLoading(true);

      try {
        const response = await fetch(
          `https://restaurarbackup-er54jbqu2q-uc.a.run.app?carpeta=${encodeURIComponent(trimmedFolderName)}`,
          { method: "POST" }
        );
        
        const text = await response.text();
        let data;
        try {
            data = JSON.parse(text); // Intentar parsear como JSON
        } catch (e) {
            data = { error: `Respuesta no JSON: ${text.substring(0, 50)}...` }; // Manejar respuesta no JSON
        }
        
        if (response.ok) {
          setStatusMessage(`✅ ${data.message || "Restauración iniciada."}`);
        } else {
          setStatusMessage(`❌ Error: ${data.error || "Error desconocido"}`);
          Alert.alert("Error en Restore", `Detalle: ${data.error || "Error desconocido"} (Status: ${response.status})`);
        }
      } catch (error: any) {
        setStatusMessage(`⚠️ Error de conexión: ${error.message}`);
        Alert.alert("Error de Conexión", `Detalle: ${error.message}`);
      } finally {
        setLoading(false);
      }
    });
  };

  // --- Renderizado ---

  const renderItem = ({ item }: { item: Maquina }) => (
    <View style={styles.machineItem}>
      <Text style={styles.machineName}>{item.nombre}</Text>
      <Text style={styles.machineStatus}>Estado: <Text style={{ fontWeight: 'bold', color: item.estado === 'activa' ? '#7AC637' : '#F0AD4E' }}>{item.estado}</Text></Text>
      <View style={styles.machineButtons}>
        <Button title="Eliminar" onPress={() => eliminarMaquina(item.id)} color="#D9534F" />
        <Button
          title={item.estado === 'activa' ? 'Mantenimiento' : 'Activar'}
          onPress={() => marcarMantenimiento(item.id, item.estado)}
          color={item.estado === 'activa' ? '#4A90E2' : '#7AC637'} // Azúl/Verde
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      
      {/* CABECERA PERSONALIZADA */}
      <View style={styles.customHeader}>
        <Text style={styles.header}>Panel de Administración</Text>
      </View>

      {/* Contenido principal envuelto en ScrollView si la lista es grande */}
      <View style={styles.content}>
        {/* Sección de Gestión de Máquinas */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>Gestión de Máquinas</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre de la máquina"
            placeholderTextColor="#888"
            value={nombre}
            onChangeText={setNombre}
          />
          <Button title="➕ Agregar Máquina" onPress={agregarMaquina} color="#7AC637" />

          <Text style={styles.listHeader}>Máquinas registradas ({maquinas.length})</Text>
          <FlatList
            data={maquinas}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            style={styles.list}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </View>

        <View style={styles.separator} />

        {/* Sección de Copias de Seguridad */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>Copias de Seguridad</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#7B61FF" style={{ marginVertical: 20 }} />
          ) : (
            <View style={styles.backupContainer}>
              <TouchableOpacity style={styles.backupButton} onPress={handleBackup}>
                <Ionicons name="cloud-upload-outline" size={24} color="#fff" />
                <Text style={styles.buttonText}>Crear Copia</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.backupButton, styles.restoreButton]} onPress={handleRestore}>
                <Ionicons name="cloud-download-outline" size={24} color="#fff" />
                <Text style={styles.buttonText}>Restaurar Copia</Text>
              </TouchableOpacity>
            </View>
          )}
          
          {/* Renderizado del mensaje de estado */}
          {statusMessage && (
            <Text style={[styles.statusMessage, { color: statusMessage.startsWith('❌') ? '#FF4B4B' : '#7AC637' }]}>
              {statusMessage}
            </Text>
          )}
          
        </View>

        <View style={styles.separator} />

        {/* Sección de Cerrar Sesión */}
        <View style={{ marginTop: 10, width: '100%', paddingHorizontal: 20, marginBottom: 40 }}>
          <Button title="🚪 Cerrar Sesión" onPress={cerrarSesion} color="#FF4B4B" />
        </View>
      </View>
    </View>
  );
}

// --- Estilos Unificados (Oscuros) ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1C', // Fondo Oscuro
  },
  content: {
    flex: 1,
    paddingHorizontal: 0,
  },
  customHeader: {
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: '#222', // Fondo para la barra de cabecera
    borderBottomColor: '#333',
    borderBottomWidth: 1,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff", // Texto Blanco
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: "#7B61FF", // Título en color de marca
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: 5,
  },
  listHeader: {
    fontSize: 18,
    marginVertical: 15,
    fontWeight: 'bold',
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#444',
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#2A2A2A', // Fondo de Input oscuro
    fontSize: 16,
    color: '#fff', // Texto Blanco en Input
  },
  list: {
    maxHeight: 250, // Límite de altura para la lista de máquinas
  },
  machineItem: {
    backgroundColor: '#2A2A2A', // Fondo de Item Oscuro
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: "#000",
    elevation: 3,
  },
  machineName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#fff', // Texto Blanco
    marginBottom: 5,
  },
  machineStatus: {
    fontSize: 14,
    marginBottom: 10,
    color: '#bbb', // Texto gris claro
  },
  machineButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  backupContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backupButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#7B61FF", // Color Morado de Marca
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 12,
    width: "48%", // Distribución para dos botones
    justifyContent: "center",
  },
  restoreButton: {
    backgroundColor: "#4A90E2", // Color Azúl
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 10,
  },
  separator: {
    borderBottomColor: '#333',
    borderBottomWidth: 1,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  statusMessage: {
    marginTop: 15,
    textAlign: "center",
    fontWeight: 'bold',
    padding: 8,
    borderRadius: 5,
    backgroundColor: '#333',
  }
});
