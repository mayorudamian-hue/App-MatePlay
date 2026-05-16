// data/levels.js
/**
 * Definición estructurada de las etapas y niveles.
 * Permite una progresión pedagógica incremental (DragonBox style).
 */

export const stages = [
  {
    id: 1,
    name: "El Cofre Misterioso",
    description: "Descubre qué oculta la caja manteniendo el equilibrio.",
    mechanics: "Suma y resta simple, incógnita visual",
    levels: [
      { id: '1-1', equation: 'x + 1 = 3', optimalMoves: 2 }, // Restar 1 a ambos, combinar en derecha
      { id: '1-2', equation: 'x + 2 = 5', optimalMoves: 2 },
      { id: '1-3', equation: 'x - 1 = 4', optimalMoves: 2 }, // Sumar 1 a ambos, combinar en derecha
      { id: '1-4', equation: 'x - 3 = 1', optimalMoves: 2 }
    ]
  },
  {
    id: 2,
    name: "Positivos y Negativos",
    description: "Cuidado, algunos bloques tienen energía inversa.",
    mechanics: "Cancelación visual, números enteros, negativos",
    levels: [
      { id: '2-1', equation: 'x - 5 = -2', optimalMoves: 2 },
      { id: '2-2', equation: 'x + 4 = -1', optimalMoves: 2 },
      { id: '2-3', equation: 'x - 3 = -5', optimalMoves: 2 },
      { id: '2-4', equation: 'x + 6 = -3', optimalMoves: 2 }
    ]
  },
  {
    id: 3,
    name: "El Mundo de X",
    description: "Multiplicando la incógnita. ¡Agrupa sabiamente!",
    mechanics: "Notación algebraica formal, coeficientes",
    levels: [
      { id: '3-1', equation: '2x = x + 3', optimalMoves: 2 }, // Restar x a ambos lados, combinar
      { id: '3-2', equation: '3x - 1 = 2x + 4', optimalMoves: 4 }, // -2x, combinar x, +1, combinar nums
      { id: '3-3', equation: '2x + 2 = 8', optimalMoves: 3 }, // -2, combinar, dividir ambos entre 2
      { id: '3-4', equation: '4x - 2 = 3x + 3', optimalMoves: 4 }
    ]
  }
];
