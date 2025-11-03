import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Ejercicio = {
  id: string;
  nombre: string;
  descripcion: string;
  maquina: string;
  grupo: 'Pecho' | 'Espalda' | 'Piernas' | 'Brazos' | 'Hombros' | 'Core' | 'Cardio';
  musculos: string[];
  videoUrl?: string;
};

const EJERCICIOS_INICIALES: Ejercicio[] = [
  {
    id: '1',
    nombre: 'Press de Pecho en Máquina',
    descripcion: 'Press guiado para fortalecer pectorales y tríceps. Mantén la espalda recta.',
    maquina: 'Máquina de Press de Pecho',
    grupo: 'Pecho',
    musculos: ['Pectoral mayor', 'Tríceps'],
    videoUrl: '',
  },
  {
    id: '2',
    nombre: 'Extensión de Piernas',
    descripcion: 'Aislamiento de cuádriceps. Ajusta el recorrido al tamaño de la pierna.',
    maquina: 'Máquina de Extensión de Piernas',
    grupo: 'Piernas',
    musculos: ['Cuádriceps'],
  },
  {
    id: '3',
    nombre: 'Remo Sentado',
    descripcion: 'Tira con el torso estable para activar la espalda media y bíceps.',
    maquina: 'Máquina de Remo',
    grupo: 'Espalda',
    musculos: ['Dorsal ancho', 'Romboides', 'Bíceps'],
  },
  {
    id: '4',
    nombre: 'Curl de Bíceps',
    descripcion: 'Aislamiento de bíceps con banco o mancuernas. Control en la fase excéntrica.',
    maquina: 'Banco Scott / Mancuernas',
    grupo: 'Brazos',
    musculos: ['Bíceps braquial'],
  },
  {
    id: '5',
    nombre: 'Press Militar Sentado',
    descripcion: 'Press para hombros. Evita hiperextender la espalda.',
    maquina: 'Banco + Barra/ Mancuernas',
    grupo: 'Hombros',
    musculos: ['Deltoides anterior', 'Deltoides medial'],
  },
  {
    id: '6',
    nombre: 'Peso Muerto Rumano',
    descripcion: 'Trabajo de isquiotibiales y cadena posterior, mantener la espalda neutra.',
    maquina: 'Barra / Rack',
    grupo: 'Piernas',
    musculos: ['Isquiotibiales', 'Glúteos', 'Erectores'],
  },
  {
    id: '7',
    nombre: 'Plancha Frontal',
    descripcion: 'Ejercicio de core estático para estabilidad.',
    maquina: 'Ninguna',
    grupo: 'Core',
    musculos: ['Recto abdominal', 'Transverso'],
  },
  {
    id: '8',
    nombre: 'Remo con Polea Alta',
    descripcion: 'Variante vertical para dorsal y trapecio.',
    maquina: 'Polea',
    grupo: 'Espalda',
    musculos: ['Dorsal', 'Trapecio'],
  },
];

export default function BibliotecaScreen() {
  const [query, setQuery] = useState('');
  const [grupoFiltro, setGrupoFiltro] = useState<'Todos' | Ejercicio['grupo']>('Todos');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const grupos: Array<'Todos' | Ejercicio['grupo']> = useMemo(
    () => ['Todos', 'Pecho', 'Espalda', 'Piernas', 'Brazos', 'Hombros', 'Core', 'Cardio'],
    []
  );

  const ejercicios = useMemo(() => EJERCICIOS_INICIALES, []);

  const resultados = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ejercicios.filter((e) => {
      if (grupoFiltro !== 'Todos' && e.grupo !== grupoFiltro) return false;
      if (!q) return true;
      return (
        e.nombre.toLowerCase().includes(q) ||
        e.descripcion.toLowerCase().includes(q) ||
        e.maquina.toLowerCase().includes(q) ||
        e.musculos.join(' ').toLowerCase().includes(q)
      );
    });
  }, [ejercicios, query, grupoFiltro]);

  const renderItem = ({ item }: { item: Ejercicio }) => {
    const expanded = selectedId === item.id;
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={[styles.card, expanded && styles.cardSelected]}
        onPress={() => setSelectedId((s) => (s === item.id ? null : item.id))}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.nombre}>{item.nombre}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.grupo}</Text>
          </View>
        </View>

        <Text style={styles.maquina}>{item.maquina}</Text>

        {expanded && (
          <>
            <Text style={styles.descripcion}>{item.descripcion}</Text>
            <Text style={styles.musculosTitle}>Músculos:</Text>
            <View style={styles.musculosList}>
              {item.musculos.map((m) => (
                <View key={m} style={styles.musculoChip}>
                  <Text style={styles.musculoText}>{m}</Text>
                </View>
              ))}
            </View>
          </>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Biblioteca de Ejercicios</Text>

      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#aaa" style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Buscar ejercicio, máquina o músculo..."
            placeholderTextColor="#8b8b8b"
            value={query}
            onChangeText={setQuery}
            style={styles.searchInput}
            returnKeyType="search"
            selectionColor="#7AC637"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color="#aaa" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.filtersRow}>
        <FlatList
          data={grupos}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(g) => g}
          renderItem={({ item }) => {
            const active = item === grupoFiltro;
            return (
              <TouchableOpacity
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setGrupoFiltro(item)}
                activeOpacity={0.8}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{item}</Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <FlatList
        data={resultados}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 40 }}
        style={{ width: '100%' }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No se encontró ningún ejercicio.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: 12,
  },
  searchRow: {
    marginBottom: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#222',
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
  },
  filtersRow: {
    marginVertical: 12,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#222',
  },
  chipActive: {
    backgroundColor: '#17230f',
    borderColor: '#7AC637',
  },
  chipText: {
    color: '#cfcfcf',
    fontSize: 13,
  },
  chipTextActive: {
    color: '#7AC637',
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#0f0f0f',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1a1a1a',
  },
  cardSelected: {
    borderColor: '#7AC637',
    shadowColor: '#7AC637',
    shadowOpacity: 0.08,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nombre: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  badge: {
    backgroundColor: '#111',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#222',
  },
  badgeText: {
    color: '#cfcfcf',
    fontSize: 12,
    fontWeight: '600',
  },
  maquina: {
    color: '#9a9a9a',
    fontSize: 13,
    marginTop: 6,
  },
  descripcion: {
    color: '#ddd',
    marginTop: 10,
    lineHeight: 18,
  },
  musculosTitle: {
    color: '#cfcfcf',
    marginTop: 10,
    fontWeight: '700',
  },
  musculosList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  musculoChip: {
    backgroundColor: '#17230f',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#224422',
  },
  musculoText: {
    color: '#7AC637',
    fontWeight: '700',
    fontSize: 12,
  },
  empty: {
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    color: '#888',
  },
});
