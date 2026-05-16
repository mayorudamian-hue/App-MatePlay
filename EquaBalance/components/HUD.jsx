// components/HUD.jsx
import React from 'react';

/**
 * Head-Up Display: Muestra estadísticas, progreso y timer.
 * Preparado para soportar "Modo Evaluación" (ocultar ayudas/xp).
 */
export const HUD = ({ stageName, levelId, moves, optimalMoves, time, xp, combo, isEvaluation }) => {
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="eb-hud">
      <div className="eb-hud-left">
        <h2 className="eb-stage-title">{stageName} <span className="eb-level-id">({levelId})</span></h2>
        {!isEvaluation && (
          <div className="eb-moves">
            Movimientos: {moves} {optimalMoves && <span className="eb-optimal">/ Óptimos: {optimalMoves}</span>}
          </div>
        )}
      </div>
      
      <div className="eb-hud-right">
        <div className="eb-timer">{formatTime(time)}</div>
        {!isEvaluation && (
          <>
            <div className={`eb-combo ${combo > 1 ? 'active' : ''}`}>
              Combo x{combo}
            </div>
            <div className="eb-xp">
              XP: {xp}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
