// components/TermBlock.jsx
import React from 'react';

/**
 * Animación de partículas simplificada para cuando los términos se cancelan mutuamente
 */
export const CancelAnimation = ({ x, y }) => {
  return (
    <div className="eb-cancel-animation" style={{ left: x, top: y }}>
      <div className="particle p1"></div>
      <div className="particle p2"></div>
      <div className="particle p3"></div>
      <div className="particle p4"></div>
    </div>
  );
};

/**
 * Representa visualmente un término de la ecuación (número o incógnita).
 * Implementa la lógica de Drag and Drop para permitir combinaciones.
 */
export const TermBlock = ({ term, isDraggable, onDrop }) => {
  const isVar = term.type === 'variable';
  
  // Lógica para no mostrar "1x" sino "x", y manejar negativos correctamente
  const displayValue = isVar 
    ? (Math.abs(term.value) === 1 ? (term.value < 0 ? `-${term.symbol}` : term.symbol) : `${term.value}${term.symbol}`)
    : term.value;

  const typeClass = isVar ? 'eb-term-var' : 'eb-term-num';
  const signClass = term.value < 0 ? 'eb-term-negative' : 'eb-term-positive';
  const className = `eb-term-block ${typeClass} ${signClass}`;

  const handleDragStart = (e) => {
    e.dataTransfer.setData('termId', term.id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDropEvent = (e) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('termId');
    if (draggedId && draggedId !== term.id && onDrop) {
      onDrop(draggedId, term.id);
    }
  };

  return (
    <div 
      className={className}
      draggable={isDraggable}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDropEvent}
      title={isDraggable ? "Arrastra para combinar términos" : ""}
    >
      <div className="eb-term-content">
        {displayValue}
      </div>
    </div>
  );
};
