import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ProgresoScreen() {
  const sesionesSemana = 0;
  const sesionesTotalesSemana = 4;

  const sesionesMes = 2;
  const sesionesTotalesMes = 8;

  const progresoSemana = (sesionesSemana / sesionesTotalesSemana) * 100;
  const progresoMes = (sesionesMes / sesionesTotalesMes) * 100;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tus sesiones de la semana</Text>
      <View style={[styles.circle, { borderColor: '#FFA500' }]}>
        <Text style={styles.porcentaje}>{progresoSemana.toFixed(0)}%</Text>
      </View>
      <Text style={styles.info}>
        Has completado {sesionesSemana} de {sesionesTotalesSemana} sesiones
      </Text>

      <Text style={styles.header}>Tus sesiones del mes</Text>
      <View style={[styles.circle, { borderColor: '#A020F0' }]}>
        <Text style={styles.porcentaje}>{progresoMes.toFixed(0)}%</Text>
      </View>
      <Text style={styles.info}>
        Has completado {sesionesMes} de {sesionesTotalesMes} sesiones
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#111', alignItems: 'center' },
  header: { color: '#fff', fontSize: 18, marginTop: 20, marginBottom: 10 },
  circle: {
    height: 150,
    width: 150,
    borderRadius: 75,
    borderWidth: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  porcentaje: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  info: { color: '#ccc', fontSize: 14, marginBottom: 20, textAlign: 'center' },
});
