// EquaBalanceVanilla.js
// Implementación en Vanilla JS del Módulo EquaBalance para MatePlay

const EquaBalance = (function() {
  // --- DATOS DE NIVELES ---
  const stages = [
    {
      id: 1, name: "El Cofre Misterioso", mechanics: "Suma y resta simple, incógnita visual",
      levels: [
        { id: '1-1', equation: 'x + 1 = 3', optimalMoves: 2 },
        { id: '1-2', equation: 'x + 2 = 5', optimalMoves: 2 },
        { id: '1-3', equation: 'x - 1 = 4', optimalMoves: 2 },
        { id: '1-4', equation: 'x - 3 = 1', optimalMoves: 2 }
      ]
    },
    {
      id: 2, name: "Positivos y Negativos", mechanics: "Cancelación visual, números enteros, negativos",
      levels: [
        { id: '2-1', equation: 'x - 5 = -2', optimalMoves: 2 },
        { id: '2-2', equation: 'x + 4 = -1', optimalMoves: 2 },
        { id: '2-3', equation: 'x - 3 = -5', optimalMoves: 2 },
        { id: '2-4', equation: 'x + 6 = -3', optimalMoves: 2 }
      ]
    },
    {
      id: 3, name: "El Mundo de X", mechanics: "Notación algebraica formal, coeficientes",
      levels: [
        { id: '3-1', equation: '2x = x + 3', optimalMoves: 2 },
        { id: '3-2', equation: '3x - 1 = 2x + 4', optimalMoves: 4 },
        { id: '3-3', equation: '2x + 2 = 8', optimalMoves: 3 },
        { id: '3-4', equation: '4x - 2 = 3x + 3', optimalMoves: 4 }
      ]
    }
  ];

  // --- MOTOR ALGEBRAICO ---
  const Engine = {
    createTerm(type, value, symbol = 'x') {
      return { id: Math.random().toString(36).substring(2, 9), type, value, symbol: type === 'variable' ? symbol : null };
    },
    parseEquation(eqStr) {
      const [leftStr, rightStr] = eqStr.split('=').map(s => s.trim());
      const parseSide = (str) => {
        const termsStr = str.replace(/\s+/g, '').match(/[+-]?[^+-]+/g) || [];
        return termsStr.map(t => {
          if (/[a-zA-Z]/.test(t)) {
            const symbol = t.match(/[a-zA-Z]/)[0];
            let coeff = t.replace(symbol, '');
            if (coeff === '' || coeff === '+') coeff = '1';
            if (coeff === '-') coeff = '-1';
            return this.createTerm('variable', parseInt(coeff, 10), symbol);
          }
          return this.createTerm('number', parseInt(t, 10));
        });
      };
      return { left: parseSide(leftStr), right: parseSide(rightStr) };
    },
    applyActionToBothSides(leftSide, rightSide, type, value) {
      return {
        newLeft: [...leftSide, this.createTerm(type, value)],
        newRight: [...rightSide, this.createTerm(type, value)]
      };
    },
    applyDivisionToBothSides(leftSide, rightSide, divisor) {
      if (divisor === 0) return { success: false, newLeft: leftSide, newRight: rightSide };
      const divideSide = side => side.map(t => ({ ...t, value: t.value / divisor, id: Math.random().toString(36).substring(2, 9) }));
      return { success: true, newLeft: divideSide(leftSide), newRight: divideSide(rightSide) };
    },
    tryCombineTerms(side, id1, id2) {
      const t1Index = side.findIndex(t => t.id === id1);
      const t2Index = side.findIndex(t => t.id === id2);
      if (t1Index === -1 || t2Index === -1) return { success: false, newSide: side };
      const t1 = side[t1Index], t2 = side[t2Index];
      
      if (t1.type !== t2.type || t1.symbol !== t2.symbol) return { success: false, newSide: side };
      
      const newValue = t1.value + t2.value;
      let newSide = [...side];
      if (newValue === 0) {
        newSide = newSide.filter(t => t.id !== id1 && t.id !== id2);
      } else {
        newSide[t1Index] = { ...t1, value: newValue };
        newSide = newSide.filter(t => t.id !== id2);
      }
      return { success: true, newSide };
    },
    checkSolved(leftSide, rightSide) {
      const isIsolatedVar = side => side.length === 1 && side[0].type === 'variable' && side[0].value === 1;
      const isSingleNum = side => side.length === 1 && side[0].type === 'number';
      return (isIsolatedVar(leftSide) && isSingleNum(rightSide)) || (isSingleNum(leftSide) && isIsolatedVar(rightSide));
    }
  };

  // --- ESTADO ---
  let state = {
    stageIdx: 0, levelIdx: 0, leftSide: [], rightSide: [],
    moves: 0, time: 0, xp: 0, combo: 1, timerId: null,
    draggedId: null, onEndCallback: null
  };

  // --- INTERFAZ (UI) ---
  const UI = {
    initStyles() {
      if (!document.getElementById('eb-styles')) {
        const link = document.createElement('link');
        link.id = 'eb-styles';
        link.rel = 'stylesheet';
        link.href = './EquaBalance/EquaBalanceStyles.css';
        document.head.appendChild(link);
      }
    },
    render() {
      const container = document.getElementById('contenido-juego');
      if (!container) return;
      const stage = stages[state.stageIdx];
      const level = stage ? stage.levels[state.levelIdx] : null;

      if (!stage || !level) {
        // Fin del módulo
        container.innerHTML = `
          <div class="eb-container" style="justify-content:center; align-items:center;">
            <h2 style="color:var(--eb-success); font-size:2rem; font-family:var(--font-display);">¡Módulo Completado! 🎉</h2>
            <p style="color:var(--eb-text-bright); font-size:1.2rem;">Ganaste en total: <span style="color:#f1c40f; font-weight:bold;">${state.xp} XP</span></p>
            <button class="eb-btn-action" id="eb-btn-end" style="margin-top:20px; font-size:1.2rem; padding:15px 30px;">Volver al Menú</button>
          </div>
        `;
        document.getElementById('eb-btn-end').onclick = () => { if(state.onEndCallback) state.onEndCallback({ xp: state.xp, time: state.time }); };
        return;
      }

      const formatTime = (s) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`;
      
      container.innerHTML = `
        <div class="eb-container">
          <div class="eb-hud">
            <div class="eb-hud-left">
              <h2 class="eb-stage-title">${stage.name} <span class="eb-level-id">(${level.id})</span></h2>
              <div class="eb-moves">Movimientos: ${state.moves} <span class="eb-optimal">/ Óptimos: ${level.optimalMoves}</span></div>
            </div>
            <div class="eb-hud-right">
              <div class="eb-timer" id="eb-timer-display">${formatTime(state.time)}</div>
              <div class="eb-combo ${state.combo > 1 ? 'active' : ''}">Combo x${state.combo}</div>
              <div class="eb-xp">XP: ${state.xp}</div>
            </div>
          </div>
          
          <div id="eb-board" class="eb-balance-board">
            <div id="eb-left-side" class="eb-board-side eb-left-side" data-side="left">
              <div class="eb-terms-container">${this.renderTerms(state.leftSide)}</div>
            </div>
            <div class="eb-balance-center">
              <div class="eb-equals-sign">=</div>
              <div class="eb-fulcrum"></div>
            </div>
            <div id="eb-right-side" class="eb-board-side eb-right-side" data-side="right">
              <div class="eb-terms-container">${this.renderTerms(state.rightSide)}</div>
            </div>
            <div id="eb-celebration" class="oculto" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.7); z-index: 100; font-size: 3.5rem; color: var(--eb-success); border-radius: 16px; flex-direction:column;">
              <div>¡Correcto! ✨</div>
              <div id="eb-earned-xp" style="font-size:1.5rem; color:#f1c40f; margin-top:10px;"></div>
            </div>
          </div>
          
          <div class="eb-action-panel">
            <button class="eb-btn-action" data-action="add" data-type="number" data-value="1">+1 Ambos Lados</button>
            <button class="eb-btn-action" data-action="add" data-type="number" data-value="-1">-1 Ambos Lados</button>
            ${stage.id >= 3 ? `
              <button class="eb-btn-action" data-action="add" data-type="variable" data-value="1">+x Ambos</button>
              <button class="eb-btn-action" data-action="add" data-type="variable" data-value="-1">-x Ambos</button>
              <button class="eb-btn-action divide" data-action="div" data-value="2">÷2 Ambos</button>
              <button class="eb-btn-action divide" data-action="div" data-value="3">÷3 Ambos</button>
            ` : ''}
          </div>
        </div>
      `;

      this.attachEvents();
    },

    renderTerms(side) {
      return side.map(term => {
        const isVar = term.type === 'variable';
        let valDisp = term.value;
        if (!Number.isInteger(valDisp)) valDisp = Number(valDisp.toFixed(2));
        
        const disp = isVar 
          ? (Math.abs(valDisp) === 1 ? (valDisp < 0 ? `-${term.symbol}` : term.symbol) : `${valDisp}${term.symbol}`)
          : valDisp;
        const cls = `eb-term-block ${isVar ? 'eb-term-var' : 'eb-term-num'} ${term.value < 0 ? 'eb-term-negative' : 'eb-term-positive'}`;
        return `<div class="${cls}" draggable="true" data-id="${term.id}"><div class="eb-term-content">${disp}</div></div>`;
      }).join('');
    },

    attachEvents() {
      // Botones del panel
      document.querySelectorAll('.eb-btn-action').forEach(btn => {
        btn.onclick = (e) => {
          const action = e.currentTarget.dataset.action;
          if (action === 'add') Controller.actionBothSides(e.currentTarget.dataset.type, parseInt(e.currentTarget.dataset.value));
          else if (action === 'div') Controller.divideBothSides(parseInt(e.currentTarget.dataset.value));
        };
      });

      // Eventos Drag & Drop
      document.querySelectorAll('.eb-term-block').forEach(b => {
        b.ondragstart = (e) => {
          state.draggedId = e.target.closest('.eb-term-block').dataset.id;
          e.dataTransfer.effectAllowed = 'move';
        };
      });

      const handleDragOver = (e) => e.preventDefault();
      const handleDrop = (sideId) => (e) => {
        e.preventDefault();
        const targetBlock = e.target.closest('.eb-term-block');
        if (targetBlock && state.draggedId && state.draggedId !== targetBlock.dataset.id) {
          Controller.combineTerms(sideId, state.draggedId, targetBlock.dataset.id);
        }
        state.draggedId = null;
      };

      const leftSide = document.getElementById('eb-left-side');
      const rightSide = document.getElementById('eb-right-side');
      if (leftSide) { leftSide.ondragover = handleDragOver; leftSide.ondrop = handleDrop('left'); }
      if (rightSide) { rightSide.ondragover = handleDragOver; rightSide.ondrop = handleDrop('right'); }
    },
    
    showCelebration(earnedXP) {
      const cel = document.getElementById('eb-celebration');
      const xpEl = document.getElementById('eb-earned-xp');
      if (cel && xpEl) {
        xpEl.textContent = `+${earnedXP} XP`;
        cel.classList.remove('oculto');
      }
    },
    
    vibrateBoard() {
      const board = document.getElementById('eb-board');
      if (board) {
        board.classList.add('vibrating');
        setTimeout(() => board.classList.remove('vibrating'), 300);
      }
    }
  };

  // --- CONTROLADOR ---
  const Controller = {
    start(onEnd) {
      state.stageIdx = 0;
      state.levelIdx = 0;
      state.time = 0;
      state.xp = 0;
      state.combo = 1;
      state.onEndCallback = onEnd;
      
      UI.initStyles();
      this.loadLevel();
      
      if (state.timerId) clearInterval(state.timerId);
      state.timerId = setInterval(() => {
        state.time++;
        const tEl = document.getElementById('eb-timer-display');
        if (tEl) tEl.textContent = `${Math.floor(state.time/60)}:${(state.time%60).toString().padStart(2,'0')}`;
      }, 1000);
    },
    
    stop() {
      if (state.timerId) clearInterval(state.timerId);
    },
    
    loadLevel() {
      const stage = stages[state.stageIdx];
      if (!stage) { UI.render(); return; }
      const level = stage.levels[state.levelIdx];
      const parsed = Engine.parseEquation(level.equation);
      state.leftSide = parsed.left;
      state.rightSide = parsed.right;
      state.moves = 0;
      UI.render();
    },
    
    actionBothSides(type, value) {
      if(window.reproducirSonido) window.reproducirSonido('ding');
      const { newLeft, newRight } = Engine.applyActionToBothSides(state.leftSide, state.rightSide, type, value);
      state.leftSide = newLeft;
      state.rightSide = newRight;
      state.moves++;
      UI.render();
    },
    
    divideBothSides(divisor) {
      if(window.reproducirSonido) window.reproducirSonido('ding');
      const { success, newLeft, newRight } = Engine.applyDivisionToBothSides(state.leftSide, state.rightSide, divisor);
      if (success) {
        state.leftSide = newLeft;
        state.rightSide = newRight;
        state.moves++;
        this.checkWin();
      }
    },
    
    combineTerms(sideId, id1, id2) {
      if (id1 === id2) return;
      const sideArr = sideId === 'left' ? state.leftSide : state.rightSide;
      const { success, newSide } = Engine.tryCombineTerms(sideArr, id1, id2);
      
      if (success) {
        if(window.reproducirSonido) window.reproducirSonido('drop'); 
        if (sideId === 'left') state.leftSide = newSide;
        else state.rightSide = newSide;
        state.moves++;
        this.checkWin();
      } else {
        if(window.reproducirSonido) window.reproducirSonido('error');
        UI.vibrateBoard();
      }
    },
    
    checkWin() {
      if (Engine.checkSolved(state.leftSide, state.rightSide)) {
        if(window.reproducirSonido) window.reproducirSonido('exito');
        UI.render(); // Ensure the board is up to date
        
        const level = stages[state.stageIdx].levels[state.levelIdx];
        const isPerfect = state.moves <= level.optimalMoves;
        const baseXP = 50;
        const earnedXP = isPerfect ? baseXP * 2 * state.combo : baseXP * state.combo;
        
        state.xp += earnedXP;
        if(isPerfect) state.combo++;
        else state.combo = 1;

        UI.showCelebration(earnedXP);

        // Integración con MatePlay: Disparar evento para que game.js lo guarde
        window.dispatchEvent(new CustomEvent('EQUABALANCE_SOLVED', { 
          detail: { xpEarned: earnedXP, perfect: isPerfect }
        }));

        setTimeout(() => {
          state.levelIdx++;
          if (state.levelIdx >= stages[state.stageIdx].levels.length) {
            state.levelIdx = 0;
            state.stageIdx++;
          }
          this.loadLevel();
        }, 1500);
      } else {
        UI.render();
      }
    }
  };

  return {
    iniciar: (onEnd) => Controller.start(onEnd),
    detener: () => Controller.stop()
  };
})();

// Exponerlo globalmente
window.EquaBalanceApp = EquaBalance;
