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
    Alert.alert(
      "Confirmar Copia de Seguridad",
      "¿Estás seguro de que deseas crear una copia de seguridad de la base de datos?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Crear Copia",
          onPress: async () => {
            try {
              setLoading(true);
              const response = await fetch(
                "https://us-central1-udecfit-b6d1f.cloudfunctions.net/crearBackup"
              );
              if (response.ok) {
                Alert.alert("✅ Copia creada", "La copia de seguridad se generó correctamente en Firebase Storage.");
              } else {
                Alert.alert("❌ Error", "No se pudo crear la copia. Revisa los permisos o la conexión.");
              }
            } catch (error) {
              Alert.alert("⚠️ Error de conexión", (error as Error).message);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleRestore = async () => {
    Alert.prompt(
      "Restaurar copia",
      "Introduce el nombre de la carpeta del backup que deseas restaurar (Ej: 2023-10-26T14-30-00):",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Restaurar",
          onPress: async (folderName) => {
            if (!folderName || folderName.trim() === "") {
                Alert.alert("Aviso", "Debes ingresar el nombre de la carpeta.");
                return;
            }
            try {
              setLoading(true);
              const response = await fetch(
                `https://us-central1-udecfit-b6d1f.cloudfunctions.net/restaurarBackup?carpeta=${folderName.trim()}`
              );
              if (response.ok) {
                Alert.alert("✅ Restauración completa", "Los datos fueron restaurados exitosamente.");
              } else {
                Alert.alert("❌ Error", "No se pudo restaurar el backup. Verifica el nombre o permisos.");
              }
            } catch (error) {
              Alert.alert("⚠️ Error de conexión", (error as Error).message);
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      "plain-text"
    );
  };

  // --- Renderizado ---

  const renderItem = ({ item }: { item: Maquina }) => (
    <View style={styles.machineItem}>
      <Text style={styles.machineName}>{item.nombre}</Text>
      <Text style={styles.machineStatus}>Estado: <Text style={{ fontWeight: 'bold', color: item.estado === 'activa' ? 'green' : 'orange' }}>{item.estado}</Text></Text>
      <View style={styles.machineButtons}>
        <Button title="Eliminar" onPress={() => eliminarMaquina(item.id)} color="#D9534F" />
        <Button
          title={item.estado === 'activa' ? 'Mantenimiento' : 'Activar'}
          onPress={() => marcarMantenimiento(item.id, item.estado)}
          color={item.estado === 'activa' ? '#F0AD4E' : '#5CB85C'}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Panel de Administración</Text>

      {/* Sección de Gestión de Máquinas */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Gestión de Máquinas</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre de la máquina"
          value={nombre}
          onChangeText={setNombre}
        />
        <Button title="➕ Agregar Máquina" onPress={agregarMaquina} color="#7B61FF" />

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
      </View>
      
      <View style={styles.separator} />

      {/* Sección de Cerrar Sesión */}
      <View style={{ marginTop: 10, width: '100%', paddingHorizontal: 20 }}>
        <Button title="🚪 Cerrar Sesión" onPress={cerrarSesion} color="#333" />
      </View>
    </View>
  );
}

// --- Estilos Unificados ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    paddingTop: 40,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: "#666",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 5,
  },
  listHeader: {
    fontSize: 18,
    marginVertical: 15,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'white',
    fontSize: 16,
  },
  list: {
    maxHeight: 250, // Límite de altura para la lista de máquinas
  },
  machineItem: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  machineName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  machineStatus: {
    fontSize: 14,
    marginBottom: 10,
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
    backgroundColor: "#7B61FF",
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 12,
    width: "48%", // Distribución para dos botones
    justifyContent: "center",
  },
  restoreButton: {
    backgroundColor: "#4A90E2",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 10,
  },
  separator: {
    borderBottomColor: '#E0E0E0',
    borderBottomWidth: 1,
    marginHorizontal: 20,
    marginVertical: 10,
  }
});
