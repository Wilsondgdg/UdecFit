import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * RutinaScreen (modo oscuro)
 * - Permite elegir tipo de rutina (Fullbody, Torso-Pierna, PPL)
 * - Elegir número de días (3..6)
 * - Genera rutina en memoria usando ejercicios base (tomados del mismo dataset)
 * - Muestra vista previa por día y botones simples (iniciar/reiniciar)
 */

type EjercicioMin = {
  id: string;
  nombre: string;
  grupo: string;
  maquina?: string;
};

const EJERCICIOS_BASE: EjercicioMin[] = [
  { id: '1', nombre: 'Press de Pecho en Máquina', grupo: 'Pecho', maquina: 'Press' },
  { id: '2', nombre: 'Remo Sentado', grupo: 'Espalda', maquina: 'Remo' },
  { id: '3', nombre: 'Sentadilla Smith', grupo: 'Piernas', maquina: 'Smith' },
  { id: '4', nombre: 'Peso Muerto Rumano', grupo: 'Piernas', maquina: 'Barra' },
  { id: '5', nombre: 'Press Militar', grupo: 'Hombros', maquina: 'Mancuernas' },
  { id: '6', nombre: 'Curl Bíceps', grupo: 'Brazos', maquina: 'Mancuernas' },
  { id: '7', nombre: 'Extensión de Piernas', grupo: 'Piernas', maquina: 'Extensión' },
  { id: '8', nombre: 'Polea al Pecho', grupo: 'Espalda', maquina: 'Polea' },
  { id: '9', nombre: 'Fondos Asistidos', grupo: 'Pecho', maquina: 'Asistida' },
  { id: '10', nombre: 'Plancha', grupo: 'Core', maquina: 'Ninguna' },
];

type RutinaGenerada = {
  [dia: string]: EjercicioMin[];
};

const TIPOS = ['Fullbody', 'Torso-Pierna', 'PPL'] as const;
type TipoRutina = typeof TIPOS[number];

export default function RutinaScreen() {
  const [tipo, setTipo] = useState<TipoRutina>('Fullbody');
  const [dias, setDias] = useState<number>(4);
  const [rutina, setRutina] = useState<RutinaGenerada | null>(null);
  const [iniciada, setIniciada] = useState(false);

  // Generador simple: selecciona ejercicios evitando repetir el mismo ejercicio en un día.
  const generarRutina = () => {
    // reglas básicas según tipo
    const diasCount = Math.max(3, Math.min(6, dias));
    const available = EJERCICIOS_BASE.slice();

    // función auxiliar: escoger n ejercicios distintos priorizando grupos
    const pickExercisesForDay = (preferredGroups: string[], count = 4) => {
      const picked: EjercicioMin[] = [];
      const pool = available.slice();
      // 1) intentar cubrir preferred groups
      preferredGroups.forEach((g) => {
        const idx = pool.findIndex((p) => p.grupo === g);
        if (idx >= 0) {
          picked.push(pool.splice(idx, 1)[0]);
        }
      });
      // 2) completar con aleatorios evitando duplicados
      while (picked.length < count && pool.length > 0) {
        const idx = Math.floor(Math.random() * pool.length);
        picked.push(pool.splice(idx, 1)[0]);
      }
      return picked;
    };

    const generated: RutinaGenerada = {};
    for (let d = 1; d <= diasCount; d++) {
      let preferred: string[] = [];
      if (tipo === 'Fullbody') {
        preferred = ['Pecho', 'Espalda', 'Piernas', 'Core'];
      } else if (tipo === 'Torso-Pierna') {
        preferred = d % 2 === 1 ? ['Pecho', 'Espalda', 'Brazos'] : ['Piernas', 'Core'];
      } else if (tipo === 'PPL') {
        const mod = ((d - 1) % 3);
        preferred = mod === 0 ? ['Pecho', 'Hombros', 'Tríceps'] : mod === 1 ? ['Espalda', 'Bíceps'] : ['Piernas', 'Core'];
      }
      const dayKey = `Día ${d}`;
      generated[dayKey] = pickExercisesForDay(preferred, 4);
    }

    setRutina(generated);
    setIniciada(false);
  };

  const reiniciar = () => {
    setRutina(null);
    setIniciada(false);
  };

  const iniciarRutina = () => {
    if (!rutina) {
      Alert.alert('Genera la rutina', 'Primero genera la rutina para poder iniciarla.');
      return;
    }
    setIniciada(true);
    Alert.alert('Rutina iniciada', 'La rutina ha sido iniciada (simulación, en memoria).');
  };

  const renderDay = (day: string, index: number) => {
    const ejercicios = rutina ? rutina[day] || [] : [];
    return (
      <View key={day} style={styles.dayCard}>
        <Text style={styles.dayTitle}>{day}</Text>
        <FlatList
          data={ejercicios}
          keyExtractor={(e) => e.id}
          renderItem={({ item, index: idx }) => (
            <View style={styles.execRow}>
              <Text style={styles.execIndex}>{idx + 1}.</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.execName}>{item.nombre}</Text>
                <Text style={styles.execMeta}>{item.grupo} • {item.maquina}</Text>
              </View>
              <TouchableOpacity style={styles.smallBtn}>
                <Ionicons name="play" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Generador de Rutinas</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Tipo de rutina</Text>
        <View style={styles.row}>
          {TIPOS.map((t) => {
            const active = t === tipo;
            return (
              <TouchableOpacity
                key={t}
                style={[styles.typeBtn, active && styles.typeBtnActive]}
                onPress={() => setTipo(t)}
                activeOpacity={0.85}
              >
                <Text style={[styles.typeBtnText, active && styles.typeBtnTextActive]}>{t}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Días por semana</Text>
        <View style={styles.row}>
          {[3, 4, 5, 6].map((n) => (
            <TouchableOpacity
              key={n}
              style={[styles.dayBtn, dias === n && styles.dayBtnActive]}
              onPress={() => setDias(n)}
            >
              <Text style={[styles.dayBtnText, dias === n && styles.dayBtnTextActive]}>{n}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.genBtn} onPress={generarRutina}>
          <Ionicons name="shuffle" size={18} color="#fff" />
          <Text style={styles.genBtnText}>Generar Rutina</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.clearBtn} onPress={reiniciar}>
          <Ionicons name="trash" size={18} color="#fff" />
          <Text style={styles.clearBtnText}>Reiniciar</Text>
        </TouchableOpacity>
      </View>

      {rutina ? (
        <>
          <View style={styles.previewHeader}>
            <Text style={styles.previewTitle}>Vista previa</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity style={styles.smallAction} onPress={iniciarRutina}>
                <Ionicons name="play" size={16} color="#fff" />
                <Text style={styles.smallActionText}>Iniciar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.smallAction, { marginLeft: 8 }]} onPress={() => { setIniciada(false); Alert.alert('Pausado', 'La rutina ha sido pausada (simulado).'); }}>
                <Ionicons name="pause" size={16} color="#fff" />
                <Text style={styles.smallActionText}>Pausar</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ width: '100%', paddingHorizontal: 12 }}>
            {Object.keys(rutina).map((day, idx) => renderDay(day, idx))}
          </View>
        </>
      ) : (
        <View style={styles.hintBox}>
          <Text style={styles.hintText}>Genera una rutina para ver la vista previa por días.</Text>
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 40,
    paddingHorizontal: 12,
    backgroundColor: '#111',
    alignItems: 'center',
  },
  header: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 12,
  },
  section: {
    width: '100%',
    marginBottom: 12,
  },
  label: {
    color: '#bdbdbd',
    marginBottom: 8,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  typeBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#0f0f0f',
    marginRight: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1a1a1a',
  },
  typeBtnActive: {
    backgroundColor: '#17230f',
    borderColor: '#7AC637',
  },
  typeBtnText: {
    color: '#cfcfcf',
    fontWeight: '700',
  },
  typeBtnTextActive: {
    color: '#7AC637',
  },
  dayBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#0f0f0f',
    marginRight: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1a1a1a',
  },
  dayBtnActive: {
    borderColor: '#7AC637',
    backgroundColor: '#17230f',
  },
  dayBtnText: {
    color: '#cfcfcf',
    fontWeight: '700',
  },
  dayBtnTextActive: {
    color: '#7AC637',
  },
  actionsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 12,
  },
  genBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7AC637',
    padding: 12,
    borderRadius: 12,
    flex: 1,
    justifyContent: 'center',
    marginRight: 8,
  },
  genBtnText: {
    color: '#012200',
    fontWeight: '800',
    marginLeft: 8,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7B61FF',
    padding: 12,
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  clearBtnText: {
    color: '#fff',
    fontWeight: '700',
    marginLeft: 8,
  },
  previewHeader: {
    width: '100%',
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewTitle: {
    color: '#fff',
    fontWeight: '800',
  },
  dayCard: {
    backgroundColor: '#0f0f0f',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1a1a1a',
  },
  dayTitle: {
    color: '#cfcfcf',
    fontWeight: '800',
    marginBottom: 8,
  },
  execRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  execIndex: {
    width: 22,
    color: '#9a9a9a',
    marginRight: 8,
  },
  execName: {
    color: '#fff',
    fontWeight: '700',
  },
  execMeta: {
    color: '#9a9a9a',
    fontSize: 12,
  },
  smallBtn: {
    backgroundColor: '#7B61FF',
    padding: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  smallAction: {
    backgroundColor: '#7B61FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallActionText: {
    color: '#fff',
    marginLeft: 6,
    fontWeight: '700',
  },
  hintBox: {
    marginTop: 24,
    padding: 18,
    backgroundColor: '#0f0f0f',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1a1a1a',
  },
  hintText: {
    color: '#9a9a9a',
  },
});
