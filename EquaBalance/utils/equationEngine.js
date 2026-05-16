// utils/equationEngine.js
/**
 * Motor de lógica algebraica para EquaBalance.
 * Decide qué movimientos son válidos y cómo transforman la ecuación.
 * Todo se maneja de forma inmutable, aislando esta lógica del render de React.
 */

// Crea un nuevo término algebraico con un ID único
export const createTerm = (type, value, symbol = 'x') => ({
  id: Math.random().toString(36).substring(2, 9),
  type, // 'number' o 'variable'
  value, // coeficiente numérico (puede ser negativo)
  symbol: type === 'variable' ? symbol : null
});

// Parsea una ecuación en string (ej: "3x - 4 = 2x + 1") a arrays de objetos term
export const parseEquation = (equationString) => {
  const [leftStr, rightStr] = equationString.split('=').map(s => s.trim());
  
  const parseSide = (str) => {
    // Separamos la string por los signos + o - conservándolos
    const termsStr = str.replace(/\s+/g, '').match(/[+-]?[^+-]+/g) || [];
    return termsStr.map(t => {
      if (/[a-zA-Z]/.test(t)) {
        const symbol = t.match(/[a-zA-Z]/)[0];
        let coeff = t.replace(symbol, '');
        if (coeff === '' || coeff === '+') coeff = '1';
        if (coeff === '-') coeff = '-1';
        return createTerm('variable', parseInt(coeff, 10), symbol);
      }
      return createTerm('number', parseInt(t, 10));
    });
  };

  return { left: parseSide(leftStr), right: parseSide(rightStr) };
};

// Aplica la acción de agregar un término a ambos lados (principio de balanza)
export const applyActionToBothSides = (leftSide, rightSide, term) => {
  return {
    newLeft: [...leftSide, createTerm(term.type, term.value, term.symbol)],
    newRight: [...rightSide, createTerm(term.type, term.value, term.symbol)]
  };
};

// Aplica una división a ambos lados (para despejar cuando queda algo como 2x = 6)
export const applyDivisionToBothSides = (leftSide, rightSide, divisor) => {
  if (divisor === 0) return { success: false, newLeft: leftSide, newRight: rightSide };
  
  const divideSide = (side) => {
    return side.map(t => {
      // Nota: En esta simplificación asumimos divisiones exactas.
      return { ...t, value: t.value / divisor, id: Math.random().toString(36).substring(2, 9) };
    });
  };
  
  return {
    success: true,
    newLeft: divideSide(leftSide),
    newRight: divideSide(rightSide)
  };
}

// Intenta combinar dos términos semejantes en un mismo lado (ej: arrastrar +3 sobre -3)
export const tryCombineTerms = (side, id1, id2) => {
  const t1Index = side.findIndex(t => t.id === id1);
  const t2Index = side.findIndex(t => t.id === id2);
  
  if (t1Index === -1 || t2Index === -1) return { success: false, newSide: side };
  
  const t1 = side[t1Index];
  const t2 = side[t2Index];
  
  // Validación de términos semejantes
  if (t1.type !== t2.type || t1.symbol !== t2.symbol) {
    return { success: false, newSide: side }; // No son semejantes, movimiento inválido
  }
  
  const newValue = t1.value + t2.value;
  let newSide = [...side];
  
  // Si la suma es 0, los términos se cancelan mutuamente (desaparecen)
  if (newValue === 0) {
    newSide = newSide.filter(t => t.id !== id1 && t.id !== id2);
  } else {
    // Se fusionan: se actualiza el valor del primero y el segundo desaparece
    newSide[t1Index] = { ...t1, value: newValue };
    newSide = newSide.filter(t => t.id !== id2);
  }
  
  return { success: true, newSide };
};

// Comprueba si la ecuación ya fue resuelta exitosamente (x aislada y del otro lado un número)
export const checkSolved = (leftSide, rightSide) => {
  const isIsolatedVar = (side) => side.length === 1 && side[0].type === 'variable' && side[0].value === 1;
  const isSingleNumber = (side) => side.length === 1 && side[0].type === 'number';
  
  return (isIsolatedVar(leftSide) && isSingleNumber(rightSide)) || 
         (isSingleNumber(leftSide) && isIsolatedVar(rightSide));
};
