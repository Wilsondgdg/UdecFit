// Define las estructuras de datos exactamente como las usa tu compañero
export type Ejercicio = {
  nombre: string;
  categoria: string;
  descripcion: string;
};

export type Esquema = {
  dia: number;
  rutina: string[];
};

// --- EJERCICIOS ---
// Estos son los ejercicios base, necesarios para la pantalla de Biblioteca también
export const ejercicios: Ejercicio[] = [
  {
    nombre: "Press banca",
    categoria: "Pecho",
    descripcion: "...",
  },
  {
    nombre: "Press inclinado",
    categoria: "Pecho",
    descripcion: "no se",
  },
  {
    nombre: "Jalon al pecho",
    categoria: "Espalda",
    descripcion: "...",
  },
  {
    nombre: "Remo en polea",
    categoria: "Espalda",
    descripcion: "...",
  },
  {
    nombre: "Extensiones de codo en polea",
    categoria: "Triceps",
    descripcion: "...",
  },
  {
    nombre: "Curl tras nuca",
    categoria: "Triceps",
    descripcion: "..",
  },
  {
    nombre: "Curl de biceps",
    categoria: "Biceps",
    descripcion: "...",
  },
  {
    nombre: "Elevaciones laterales",
    categoria: "Hombro",
    descripcion: "...",
  },
  {
    nombre: "Press militar",
    categoria: "Hombro",
    descripcion: "...",
  },
  {
    nombre: "Peck deck invertido",
    categoria: "Hombro",
    descripcion: "...",
  },
  {
    nombre: "Crunch",
    categoria: "Abdómen",
    descripcion: "...",
  },
  {
    nombre: "Curl invertido",
    categoria: "Antebrazo",
    descripcion: "...",
  },
  {
    nombre: "Flexiones de muñeca",
    categoria: "Antebrazo",
    descripcion: "...",
  },
  {
    nombre: "Encogimientos de hombro",
    categoria: "Trapecio",
    descripcion: "...",
  },
  {
    nombre: "Prensa de pierna",
    categoria: "Cuadriceps",
    descripcion: "...",
  },
  {
    nombre: "Peso muerto rumano",
    categoria: "Femoral",
    descripcion: "...",
  },
  {
    nombre: "Hip thrust",
    categoria: "Glúteos",
    descripcion: "...",
  },
  {
    nombre: "Elevaciones de talón",
    categoria: "Pantorrilla",
    descripcion: "...",
  },
  {
    nombre: "Aductores en máquina",
    categoria: "Aductores",
    descripcion: "...",
  },
];

// --- RUTINAS ---
export const fullBody: Esquema[] = [
  {
    dia: 1,
    rutina: [
      "Press banca",
      "Prensa inclinada",
      "Jalón al pecho",
      "Curl acostado",
      "Press militar",
      "Hip thrust",
      "Extensiones de codo en polea",
      "Elevaciones de talón",
      "Curl de biceps",
    ],
  },
  {
    dia: 2,
    rutina: [
      "Remo en polea baja agarre ancho",
      "Extensiones de pierna",
      "Press inclinado",
      "Peso muerto rumano",
      "Elevaciones laterales",
      "Hip thrust",
      "Extensiones de codo en polea tras nuca",
      "Elevaciones de talón",
      "Curl de biceps en banco inclinado",
    ],
  },
  {
    dia: 3,
    rutina: [
      "Peck deck",
      "Sentadilla hack",
      "Remo en polea baja",
      "Curl de femoral acostado",
      "Peck deck invertido",
      "Hip thrust",
      "Extensiones de codo en polea",
      "Elevaciones de talón",
      "Curl predicador",
    ],
  },
];

export const torsoPierna: Esquema[] = [
  {
    dia: 1,
    rutina: [
      "Press banca",
      "Press militar",
      "Jalón al pecho",
      "Extensiones de codo",
      "Curl de biceps",
      "Elevaciones laterales",
    ],
  },
  {
    dia: 2,
    rutina: [
      "Prensa inclinada",
      "Peso muerto rumano",
      "Hip Thrust",
      "Extensiones de pierna",
      "Curl de femoral acostado",
      "Elevaciones de talón",
    ],
  },
  {
    dia: 3,
    rutina: [
      "Press banca",
      "Press militar",
      "Jalón al pecho",
      "Extensiones de codo",
      "Curl de biceps",
      "Elevaciones laterales",
    ],
  },
  {
    dia: 4,
    rutina: [
      "Prensa inclinada",
      "Peso muerto rumano",
      "Hip Thrust",
      "Extensiones de pierna",
      "Curl de femoral acostado",
      "Elevaciones de talón",
    ],
  },
];

export const ppl: Esquema[] = [
  {
    dia: 1,
    rutina: [
      "Press banca",
      "Press militar",
      "Elevaciones laterales",
      "Extensiones de codo",
      "Encogimientos de hombro",
      "Press inclinado",
    ],
  },
  {
    dia: 2,
    rutina: [
      "Jalón al pecho",
      "Remo en polea baja",
      "Curl de biceps en banco inclinado",
      "Curl predicador",
      "Peck deck invertido",
      "Curl invertido",
    ],
  },
  {
    dia: 3,
    rutina: [
      "Prensa inclinada",
      "Peso muerto rumano",
      "Hip Thrust",
      "Extensiones de pierna",
      "Curl de femoral acostado",
      "Elevaciones de talón",
    ],
  },
  {
    dia: 4,
    rutina: [
      "Press banca",
      "Press militar",
      "Elevaciones laterales",
      "Extensiones de codo",
      "Encogimientos de hombro",
      "Press inclinado",
    ],
  },
  {
    dia: 5,
    rutina: [
      "Jalón al pecho",
      "Remo en polea baja",
      "Curl de biceps en banco inclinado",
      "Curl predicador",
      "Peck deck invertido",
      "Curl invertido",
    ],
  },
  {
    dia: 6,
    rutina: [
      "Prensa inclinada",
      "Peso muerto rumano",
      "Hip Thrust",
      "Extensiones de pierna",
      "Curl de femoral acostado",
      "Elevaciones de talón",
    ],
  },
];

export const torsoPierna_ppl: Esquema[] = [
  {
    dia: 1,
    rutina: [
      "Press banca",
      "Press militar",
      "Jalón al pecho",
      "Extensiones de codo",
      "Curl de biceps",
      "Elevaciones laterales",
    ],
  },
  {
    dia: 2,
    rutina: [
      "Prensa inclinada",
      "Peso muerto rumano",
      "Hip Thrust",
      "Extensiones de pierna",
      "Curl de femoral acostado",
      "Elevaciones de talón",
    ],
  },
  {
    dia: 3,
    rutina: [
      "Press banca",
      "Extensiones de codo en polea",
      "Elevaciones laterales",
      "Press inclinado",
      "Extensiones de codo en polea tras nuca",
      "Encogimientos de hombro",
    ],
  },
  {
    dia: 4,
    rutina: [
      "Remo en polea baja",
      "Curl de biceps en banco inclinado",
      "Peck deck invertido",
      "Flexión de muñeca",
      "Curl invertido",
      "Jalón al pecho con agarre neutro",
      "Curl predicador",
    ],
  },
  {
    dia: 5,
    rutina: [
      "Prensa inclinada",
      "Peso muerto rumano",
      "Hip Thrust",
      "Extensiones de pierna",
      "Curl de femoral acostado",
      "Elevaciones de talón",
    ],
  },
];

//Esto es para poder acceder a los arreglos de rutinas desde [id].tsx
export const ESQUEMAS_DATOS = {
  fullBody: fullBody,
  torsoPierna: torsoPierna,
  ppl: ppl,
  torsoPierna_ppl: torsoPierna_ppl,
};