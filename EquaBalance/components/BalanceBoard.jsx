// components/BalanceBoard.jsx
import React, { useState } from 'react';
import { TermBlock, CancelAnimation } from './TermBlock';

/**
 * El tablero principal interactivo dividido en dos lados, separados por el signo =.
 */
export const BalanceBoard = ({ leftSide, rightSide, onCombineTerms, isVibrating }) => {
  // Estado local para efectos visuales (las coordenadas de la animación se establecen al cancelar)
  const [cancelPos, setCancelPos] = useState(null);

  const handleDrop = (sideId, draggedId, targetId) => {
    onCombineTerms(sideId, draggedId, targetId);
    
    // Simula una explosión en el centro del tablero de forma temporal
    // En un caso real más robusto se calcularían las (x,y) relativas al drop
    setCancelPos({ x: '50%', y: '50%' }); 
    setTimeout(() => setCancelPos(null), 600);
  };

  return (
    <div className={`eb-balance-board ${isVibrating ? 'vibrating' : ''}`}>
      {cancelPos && <CancelAnimation x={cancelPos.x} y={cancelPos.y} />}
      
      {/* Lado Izquierdo */}
      <div className="eb-board-side eb-left-side" onDragOver={e => e.preventDefault()}>
        <div className="eb-terms-container">
          {leftSide.map(term => (
            <TermBlock 
              key={term.id} 
              term={term} 
              isDraggable={true}
              onDrop={(draggedId, targetId) => handleDrop('left', draggedId, targetId)}
            />
          ))}
        </div>
      </div>

      {/* Centro (Fulcro y signo =) */}
      <div className="eb-balance-center">
        <div className="eb-equals-sign">=</div>
        <div className="eb-fulcrum"></div>
      </div>

      {/* Lado Derecho */}
      <div className="eb-board-side eb-right-side" onDragOver={e => e.preventDefault()}>
        <div className="eb-terms-container">
          {rightSide.map(term => (
            <TermBlock 
              key={term.id} 
              term={term} 
              isDraggable={true}
              onDrop={(draggedId, targetId) => handleDrop('right', draggedId, targetId)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
