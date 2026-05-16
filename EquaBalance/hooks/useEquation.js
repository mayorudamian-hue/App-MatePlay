// hooks/useEquation.js
import { useState, useCallback } from 'react';
import { parseEquation, applyActionToBothSides, applyDivisionToBothSides, tryCombineTerms, checkSolved } from '../utils/equationEngine';

/**
 * Hook central que maneja el estado de la ecuación.
 * Todo cambio de estado pasa por aquí, aislando las reglas del juego de los componentes visuales.
 */
export const useEquation = (initialEquationStr, onSolved, playSound) => {
  const [equationStr, setEquationStr] = useState(initialEquationStr || '');
  const [leftSide, setLeftSide] = useState([]);
  const [rightSide, setRightSide] = useState([]);
  const [moves, setMoves] = useState(0);
  
  // Inicializamos la ecuación parseando el string del nivel
  const init = useCallback((eqStr) => {
    const { left, right } = parseEquation(eqStr);
    setLeftSide(left);
    setRightSide(right);
    setMoves(0);
    setEquationStr(eqStr);
  }, []);

  // Agregar o restar a ambos lados simultáneamente
  const handleActionBothSides = (term) => {
    playSound?.('tap_block');
    const { newLeft, newRight } = applyActionToBothSides(leftSide, rightSide, term);
    setLeftSide(newLeft);
    setRightSide(newRight);
    setMoves(m => m + 1);
  };

  // Dividir ambos lados (necesario en la etapa 3)
  const handleDivideBothSides = (divisor) => {
    playSound?.('tap_block');
    const { success, newLeft, newRight } = applyDivisionToBothSides(leftSide, rightSide, divisor);
    if (success) {
      setLeftSide(newLeft);
      setRightSide(newRight);
      setMoves(m => m + 1);
      
      if (checkSolved(newLeft, newRight)) {
        playSound?.('level_complete');
        onSolved(moves + 1);
      }
    }
  };

  // Combinar términos dentro de un mismo lado
  const handleCombine = (sideId, id1, id2) => {
    const side = sideId === 'left' ? leftSide : rightSide;
    const { success, newSide } = tryCombineTerms(side, id1, id2);
    
    if (success) {
      playSound?.('cancel_terms');
      let newLeft = sideId === 'left' ? newSide : leftSide;
      let newRight = sideId === 'right' ? newSide : rightSide;
      
      setLeftSide(newLeft);
      setRightSide(newRight);
      setMoves(m => m + 1);
      
      if (checkSolved(newLeft, newRight)) {
        playSound?.('level_complete');
        onSolved(moves + 1); // +1 porque el movimiento actual acaba de suceder
      }
    } else {
      playSound?.('invalid_move');
      // No modificamos estado en movimiento inválido (el motor lo rechaza)
    }
  };

  return {
    leftSide,
    rightSide,
    moves,
    init,
    handleActionBothSides,
    handleDivideBothSides,
    handleCombine
  };
};
