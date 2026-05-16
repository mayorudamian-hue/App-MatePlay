import React, { useState, useEffect, useCallback } from 'react';
import { useEquation } from './hooks/useEquation';
import { HUD } from './components/HUD';
import { BalanceBoard } from './components/BalanceBoard';
import { stages } from './data/levels';
import { createTerm } from './utils/equationEngine';
import './EquaBalanceStyles.css';

/**
 * EquaBalance - Componente Principal (Raíz)
 * Conecta la lógica del motor con el progreso de niveles y la interfaz visual.
 * Puede instanciarse con "evaluationMode=true" desde el sistema principal de MatePlay.
 */
export const EquaBalance = ({ evaluationMode = false, onGameEnd }) => {
  // Estado general de la progresión y puntuación
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [time, setTime] = useState(0);
  const [xp, setXp] = useState(0);
  const [combo, setCombo] = useState(1);
  const [isVibrating, setIsVibrating] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const stage = stages[currentStageIdx];
  const level = stage?.levels[currentLevelIdx];

  // Dummy de efectos de audio (debería reemplazarse por una implementación de Web Audio API real)
  const playSound = useCallback((soundName) => {
    // console.log(`[Audio] Playing: ${soundName}`);
    if(soundName === 'invalid_move') {
      setIsVibrating(true);
      setTimeout(() => setIsVibrating(false), 300);
    }
  }, []);

  const handleSolved = (totalMoves) => {
    const isPerfect = totalMoves <= level.optimalMoves;
    const baseXP = 50;
    const earnedXP = isPerfect ? baseXP * 2 * combo : baseXP * combo;
    
    setXp(prev => prev + earnedXP);
    if(isPerfect) setCombo(prev => prev + 1);
    else setCombo(1);

    // Contrato de integración: Emitir evento personalizado para que MatePlay lo intercepte
    const payload = {
      levelId: level.id,
      stage: stage.id,
      movesUsed: totalMoves,
      optimalMoves: level.optimalMoves,
      timeSeconds: time,
      xpEarned: earnedXP,
      streakBonus: combo > 1,
      comboMultiplier: combo,
      perfect: isPerfect
    };
    
    const event = new CustomEvent('EQUATION_SOLVED', { detail: payload });
    window.dispatchEvent(event);

    setShowCelebration(true);

    // Avanzar de nivel o etapa tras una pequeña pausa para celebrar
    setTimeout(() => {
      setShowCelebration(false);
      if (currentLevelIdx + 1 < stage.levels.length) {
        setCurrentLevelIdx(prev => prev + 1);
      } else if (currentStageIdx + 1 < stages.length) {
        setCurrentStageIdx(prev => prev + 1);
        setCurrentLevelIdx(0);
      } else {
        if(onGameEnd) onGameEnd({ xp, time });
      }
    }, 1500); 
  };

  const { leftSide, rightSide, moves, init, handleActionBothSides, handleDivideBothSides, handleCombine } = useEquation(
    level?.equation,
    handleSolved,
    playSound
  );

  // Reiniciar ecuación cada vez que el nivel cambia
  useEffect(() => {
    if (level) {
      init(level.equation);
    }
  }, [level, init]);

  // Manejador del timer en tiempo real
  useEffect(() => {
    const timer = setInterval(() => setTime(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!stage || !level) return <div className="eb-container"><h2 style={{margin: 'auto'}}>¡Módulo Completado!</h2></div>;

  return (
    <div className="eb-container">
      <HUD 
        stageName={stage.name} 
        levelId={level.id} 
        moves={moves} 
        optimalMoves={level.optimalMoves} 
        time={time} 
        xp={xp} 
        combo={combo}
        isEvaluation={evaluationMode}
      />

      <BalanceBoard 
        leftSide={leftSide} 
        rightSide={rightSide} 
        onCombineTerms={handleCombine}
        isVibrating={isVibrating}
      />

      {/* Controles: En una etapa más avanzada esto podría ser contextual basado en la selección */}
      <div className="eb-action-panel">
        <button className="eb-btn-action" onClick={() => handleActionBothSides(createTerm('number', 1))}>+1 Ambos Lados</button>
        <button className="eb-btn-action" onClick={() => handleActionBothSides(createTerm('number', -1))}>-1 Ambos Lados</button>
        
        {/* Solo mostrar división si estamos en la etapa 3 (El Mundo de X) */}
        {stage.id >= 3 && (
          <button className="eb-btn-action divide" onClick={() => handleDivideBothSides(2)}>÷2 Ambos Lados</button>
        )}
      </div>

      {showCelebration && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.5)', zIndex: 100, fontSize: '3rem', color: 'var(--eb-success)',
          animation: 'eb-vibrate 0.3s'
        }}>
          ¡Correcto!
        </div>
      )}
    </div>
  );
};
