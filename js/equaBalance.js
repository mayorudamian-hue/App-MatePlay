// EquaBalanceVanilla.js
// Implementación en Vanilla JS del Módulo EquaBalance para MatePlay - Fase 2

const EquaBalance = (function() {
  // --- MAPA DE SÍMBOLOS ---
  const SYMBOL_MAP = {
    'c': '📦', // Cofre
    'a': '👾', // Alien
    'm': '🍎', // Manzana
    's': '⭐', // Estrella
    'x': 'x'   // Letra formal
  };

  // --- DATOS DE NIVELES ---
  const stages = [
    {
      id: 1, name: "1° Año: El Objeto Misterioso", mechanics: "Descubre qué valor esconde el objeto. Usa la balanza para dejarlo completamente solo.",
      levels: [
        { id: '1-1', equation: 'c + 1 = 3', optimalMoves: 2, varSymbol: 'c' },
        { id: '1-2', equation: 'c + 2 = 5', optimalMoves: 2, varSymbol: 'c' },
        { id: '1-3', equation: 'a - 1 = 4', optimalMoves: 2, varSymbol: 'a' },
        { id: '1-4', equation: 'a - 3 = 1', optimalMoves: 2, varSymbol: 'a' }
      ]
    },
    {
      id: 2, name: "2° Año: Transición Simbólica", mechanics: "Los matemáticos a veces usan objetos, pero a menudo usan letras, como la famosa X.",
      levels: [
        { id: '2-1', equation: 'm - 5 = -2', optimalMoves: 2, varSymbol: 'm' },
        { id: '2-2', equation: 'x + 4 = -1', optimalMoves: 2, varSymbol: 'x' },
        { id: '2-3', equation: 's - 3 = -5', optimalMoves: 2, varSymbol: 's' },
        { id: '2-4', equation: 'x + 6 = -3', optimalMoves: 2, varSymbol: 'x' }
      ]
    },
    {
      id: 3, name: "3° Año: El Mundo de X", mechanics: "Notación algebraica formal. Aprende a agrupar variables y usar la división para resolver.",
      levels: [
        { id: '3-1', equation: '2x = x + 3', optimalMoves: 2, varSymbol: 'x' },
        { id: '3-2', equation: '3x - 1 = 2x + 4', optimalMoves: 4, varSymbol: 'x' },
        { id: '3-3', equation: '2x + 2 = 8', optimalMoves: 3, varSymbol: 'x' },
        { id: '3-4', equation: '4x - 2 = 3x + 3', optimalMoves: 4, varSymbol: 'x' }
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
    applyActionToBothSides(leftSide, rightSide, type, value, symbol = 'x') {
      return {
        newLeft: [...leftSide, this.createTerm(type, value, symbol)],
        newRight: [...rightSide, this.createTerm(type, value, symbol)]
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

  // --- AUDIO ENGINE (Web Audio API) ---
  const AudioEngine = {
    ctx: null,
    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if(AudioContext) this.ctx = new AudioContext();
      }
      if(this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    },
    playTone(freq, type, duration, vol=0.1) {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(vol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    },
    play(sound) {
      this.init();
      if(!this.ctx) return;
      switch(sound) {
        case 'tap_block': 
          this.playTone(440, 'sine', 0.1, 0.1); 
          break;
        case 'cancel_terms': 
          this.playTone(800, 'square', 0.1, 0.05); 
          setTimeout(() => this.playTone(1200, 'sine', 0.15, 0.05), 50);
          break;
        case 'invalid_move':
          this.playTone(150, 'sawtooth', 0.2, 0.15);
          break;
        case 'level_complete':
          this.playTone(523.25, 'sine', 0.15, 0.1);
          setTimeout(() => this.playTone(659.25, 'sine', 0.15, 0.1), 150);
          setTimeout(() => this.playTone(783.99, 'sine', 0.3, 0.1), 300);
          break;
        case 'combo_activate':
          this.playTone(880, 'sine', 0.1, 0.1);
          setTimeout(() => this.playTone(1760, 'sine', 0.3, 0.1), 100);
          break;
      }
    }
  };

  // --- ESTADO ---
  let state = {
    stageIdx: 0, levelIdx: 0, leftSide: [], rightSide: [],
    moves: 0, time: 0, xp: 0, combo: 1, timerId: null,
    draggedId: null, onEndCallback: null,
    evaluationMode: false, evalHistory: []
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
    
    renderStageIntro(onContinue) {
      const container = document.getElementById('contenido-juego');
      if (!container) return;
      const stage = stages[state.stageIdx];
      
      container.innerHTML = `
        <div class="eb-container" style="justify-content:center; align-items:center; text-align:center;">
          <h1 style="color:var(--eb-primary); font-size:3rem; margin-bottom:10px; font-family:var(--font-display);">Etapa ${stage.id}</h1>
          <h2 style="color:var(--eb-text-bright); font-size:2rem; margin-bottom:20px;">${stage.name}</h2>
          <p style="color:var(--eb-text); max-width:500px; font-size:1.1rem; line-height:1.5;">${stage.mechanics}</p>
          <button class="eb-btn-action" id="eb-btn-continue" style="margin-top:40px; padding:15px 40px; font-size:1.2rem; background:linear-gradient(135deg, var(--eb-primary), #3d59a1); border:none; cursor:pointer;">Comenzar Nivel</button>
        </div>
      `;
      document.getElementById('eb-btn-continue').onclick = onContinue;
    },

    renderEndScreen() {
      const container = document.getElementById('contenido-juego');
      if (!container) return;
      container.innerHTML = `
        <div class="eb-container" style="justify-content:center; align-items:center;">
          <h2 style="color:var(--eb-success); font-size:2rem; font-family:var(--font-display);">¡Módulo Completado! 🎉</h2>
          <p style="color:var(--eb-text-bright); font-size:1.2rem;">Ganaste en total: <span style="color:#f1c40f; font-weight:bold;">${state.xp} XP</span></p>
          <button class="eb-btn-action" id="eb-btn-end" style="margin-top:20px; font-size:1.2rem; padding:15px 30px; cursor:pointer;">Volver al Menú</button>
        </div>
      `;
      document.getElementById('eb-btn-end').onclick = () => { if(state.onEndCallback) state.onEndCallback({ xp: state.xp, time: state.time }); };
    },

    renderEvalSummary() {
      const container = document.getElementById('contenido-juego');
      if (!container) return;
      
      let correctCount = state.evalHistory.filter(h => h.correct).length;
      
      let rows = state.evalHistory.map(h => `
        <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
          <td style="padding:10px;">${h.levelId}</td>
          <td style="padding:10px;">${h.moves}</td>
          <td style="padding:10px;">${h.optimal}</td>
          <td style="padding:10px; color:${h.correct ? 'var(--eb-success)' : 'var(--eb-warning)'};">${h.correct ? 'Óptimo' : 'Regular'}</td>
        </tr>
      `).join('');

      container.innerHTML = `
        <div class="eb-container" style="align-items:center;">
          <h2 style="color:var(--eb-warning); font-size:2rem; font-family:var(--font-display); margin-top:20px;">Reporte de Evaluación 📋</h2>
          <table style="width:100%; max-width:600px; margin-top:20px; border-collapse:collapse; color:var(--eb-text-bright);">
            <tr style="border-bottom:2px solid var(--eb-board-line); text-align:left;">
              <th style="padding:10px;">Nivel</th>
              <th style="padding:10px;">Tus Movimientos</th>
              <th style="padding:10px;">Mín. Posible</th>
              <th style="padding:10px;">Desempeño</th>
            </tr>
            ${rows}
          </table>
          <p style="margin-top:20px; font-size:1.2rem; color:var(--eb-text);">Resolución Óptima: <strong style="color:var(--eb-primary);">${correctCount}/${state.evalHistory.length}</strong></p>
          <button class="eb-btn-action" id="eb-btn-end" style="margin-top:30px; font-size:1.2rem; padding:15px 30px; cursor:pointer;">Finalizar Evaluación</button>
        </div>
      `;
      document.getElementById('eb-btn-end').onclick = () => { if(state.onEndCallback) state.onEndCallback({ history: state.evalHistory, time: state.time }); };
    },

    render() {
      const container = document.getElementById('contenido-juego');
      if (!container) return;
      const stage = stages[state.stageIdx];
      const level = stage ? stage.levels[state.levelIdx] : null;

      if (!stage || !level) return; // Should be handled by loadLevel

      const formatTime = (s) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`;
      
      const currentSymbol = level.varSymbol || 'x';
      const displaySym = SYMBOL_MAP[currentSymbol] || currentSymbol;

      container.innerHTML = `
        <div class="eb-container">
          <div class="eb-hud">
            <div class="eb-hud-left">
              <h2 class="eb-stage-title">${stage.name} <span class="eb-level-id">(${level.id})</span></h2>
              ${!state.evaluationMode 
                ? `<div class="eb-moves">Movimientos: ${state.moves} <span class="eb-optimal">/ Óptimos: ${level.optimalMoves}</span></div>` 
                : `<div class="eb-moves" style="color:var(--eb-warning);">MODO EVALUACIÓN</div>`}
            </div>
            <div class="eb-hud-right">
              <div class="eb-timer" id="eb-timer-display">${formatTime(state.time)}</div>
              ${!state.evaluationMode ? `
                <div class="eb-combo ${state.combo > 1 ? 'active' : ''}">Combo x${state.combo}</div>
                <div class="eb-xp">XP: ${state.xp}</div>
              ` : ''}
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
              <div id="eb-cel-title">¡Correcto! ✨</div>
              <div id="eb-earned-xp" style="font-size:1.5rem; color:#f1c40f; margin-top:10px;"></div>
            </div>
          </div>
          
          <div class="eb-action-panel">
            <button class="eb-btn-action" data-action="add" data-type="number" data-value="1">+1 Ambos Lados</button>
            <button class="eb-btn-action" data-action="add" data-type="number" data-value="-1">-1 Ambos Lados</button>
            ${stage.id >= 3 ? `
              <button class="eb-btn-action" data-action="add" data-type="variable" data-value="1" data-symbol="${currentSymbol}">+${displaySym} Ambos</button>
              <button class="eb-btn-action" data-action="add" data-type="variable" data-value="-1" data-symbol="${currentSymbol}">-${displaySym} Ambos</button>
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
        
        const mappedSymbol = isVar ? (SYMBOL_MAP[term.symbol] || term.symbol) : '';
        
        // Si el valor absoluto es 1, solo mostramos el símbolo (o su negativo)
        const disp = isVar 
          ? (Math.abs(valDisp) === 1 ? (valDisp < 0 ? `-${mappedSymbol}` : mappedSymbol) : `${valDisp}${mappedSymbol}`)
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
          if (action === 'add') {
             const symbol = e.currentTarget.dataset.symbol || 'x';
             Controller.actionBothSides(e.currentTarget.dataset.type, parseInt(e.currentTarget.dataset.value), symbol);
          }
          else if (action === 'div') {
             Controller.divideBothSides(parseInt(e.currentTarget.dataset.value));
          }
        };
      });

      // Eventos Drag & Drop
      document.querySelectorAll('.eb-term-block').forEach(b => {
        b.ondragstart = (e) => {
          state.draggedId = e.target.closest('.eb-term-block').dataset.id;
          e.dataTransfer.effectAllowed = 'move';
          setTimeout(() => b.classList.add('dragging'), 0); // Estilo mientras se arrastra
        };
        b.ondragend = (e) => {
          b.classList.remove('dragging');
          document.querySelectorAll('.eb-board-side').forEach(side => side.classList.remove('drag-over'));
        };
      });

      const handleDragOver = (e) => {
        e.preventDefault();
        const side = e.target.closest('.eb-board-side');
        if (side) side.classList.add('drag-over');
      };
      
      const handleDragLeave = (e) => {
        const side = e.target.closest('.eb-board-side');
        if (side) side.classList.remove('drag-over');
      };

      const handleDrop = (sideId) => (e) => {
        e.preventDefault();
        const side = e.target.closest('.eb-board-side');
        if (side) side.classList.remove('drag-over');
        
        const targetBlock = e.target.closest('.eb-term-block');
        if (targetBlock && state.draggedId && state.draggedId !== targetBlock.dataset.id) {
          Controller.combineTerms(sideId, state.draggedId, targetBlock.dataset.id, e.clientX, e.clientY);
        }
        state.draggedId = null;
      };

      const leftSide = document.getElementById('eb-left-side');
      const rightSide = document.getElementById('eb-right-side');
      if (leftSide) { 
        leftSide.ondragover = handleDragOver; 
        leftSide.ondragleave = handleDragLeave;
        leftSide.ondrop = handleDrop('left'); 
      }
      if (rightSide) { 
        rightSide.ondragover = handleDragOver; 
        rightSide.ondragleave = handleDragLeave;
        rightSide.ondrop = handleDrop('right'); 
      }
    },
    
    createParticles(x, y) {
      const container = document.getElementById('eb-board');
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const relX = x - rect.left;
      const relY = y - rect.top;
      
      for(let i=0; i<10; i++) {
        const p = document.createElement('div');
        p.className = 'eb-particle';
        p.style.left = relX + 'px';
        p.style.top = relY + 'px';
        
        const angle = Math.random() * Math.PI * 2;
        const speed = 40 + Math.random() * 60;
        p.style.setProperty('--tx', (Math.cos(angle) * speed) + 'px');
        p.style.setProperty('--ty', (Math.sin(angle) * speed) + 'px');
        
        container.appendChild(p);
        setTimeout(() => p.remove(), 600);
      }
    },
    
    showCelebration(earnedXP) {
      const cel = document.getElementById('eb-celebration');
      const titleEl = document.getElementById('eb-cel-title');
      const xpEl = document.getElementById('eb-earned-xp');
      if (cel && xpEl && titleEl) {
        if (!state.evaluationMode) {
          titleEl.textContent = '¡Correcto! ✨';
          xpEl.textContent = `+${earnedXP} XP`;
        } else {
          titleEl.textContent = '¡Registrado! 📝';
          xpEl.textContent = '';
        }
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
    start(options, onEnd) {
      AudioEngine.init(); // Permiso de audio del usuario
      state.stageIdx = 0;
      state.levelIdx = 0;
      state.time = 0;
      state.xp = 0;
      state.combo = 1;
      state.evaluationMode = options?.evaluationMode || false;
      state.evalHistory = [];
      state.onEndCallback = onEnd;
      
      UI.initStyles();
      this.loadLevel(true); // true = es una nueva etapa, mostrar intro
      
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
    
    loadLevel(isNewStage = false) {
      const stage = stages[state.stageIdx];
      if (!stage) { 
        if (state.evaluationMode) UI.renderEvalSummary();
        else UI.renderEndScreen();
        return; 
      }
      
      const level = stage.levels[state.levelIdx];
      const parsed = Engine.parseEquation(level.equation);
      state.leftSide = parsed.left;
      state.rightSide = parsed.right;
      state.moves = 0;
      
      if (isNewStage && !state.evaluationMode) {
        UI.renderStageIntro(() => { UI.render(); });
      } else {
        UI.render();
      }
    },
    
    actionBothSides(type, value, symbol) {
      AudioEngine.play('tap_block');
      const { newLeft, newRight } = Engine.applyActionToBothSides(state.leftSide, state.rightSide, type, value, symbol);
      state.leftSide = newLeft;
      state.rightSide = newRight;
      state.moves++;
      UI.render();
    },
    
    divideBothSides(divisor) {
      AudioEngine.play('tap_block');
      const { success, newLeft, newRight } = Engine.applyDivisionToBothSides(state.leftSide, state.rightSide, divisor);
      if (success) {
        state.leftSide = newLeft;
        state.rightSide = newRight;
        state.moves++;
        this.checkWin();
      }
    },
    
    combineTerms(sideId, id1, id2, clientX, clientY) {
      if (id1 === id2) return;
      const sideArr = sideId === 'left' ? state.leftSide : state.rightSide;
      const { success, newSide } = Engine.tryCombineTerms(sideArr, id1, id2);
      
      if (success) {
        AudioEngine.play('cancel_terms');
        if (clientX && clientY) UI.createParticles(clientX, clientY);
        
        if (sideId === 'left') state.leftSide = newSide;
        else state.rightSide = newSide;
        state.moves++;
        this.checkWin();
      } else {
        AudioEngine.play('invalid_move');
        UI.vibrateBoard();
      }
    },
    
    checkWin() {
      if (Engine.checkSolved(state.leftSide, state.rightSide)) {
        AudioEngine.play('level_complete');
        UI.render(); // Asegurar que el último movimiento se dibuje
        
        const level = stages[state.stageIdx].levels[state.levelIdx];
        const isPerfect = state.moves <= level.optimalMoves;
        
        // Guardar historial para evaluación
        state.evalHistory.push({
          levelId: level.id,
          moves: state.moves,
          optimal: level.optimalMoves,
          correct: isPerfect
        });

        let earnedXP = 0;
        if (!state.evaluationMode) {
          const baseXP = 50;
          earnedXP = isPerfect ? baseXP * 2 * state.combo : baseXP * state.combo;
          state.xp += earnedXP;
          if(isPerfect) state.combo++;
          else state.combo = 1;

          window.dispatchEvent(new CustomEvent('EQUABALANCE_SOLVED', { 
            detail: { xpEarned: earnedXP, perfect: isPerfect }
          }));
        }

        UI.showCelebration(earnedXP);

        setTimeout(() => {
          state.levelIdx++;
          let isNewStage = false;
          if (state.levelIdx >= stages[state.stageIdx].levels.length) {
            state.levelIdx = 0;
            state.stageIdx++;
            isNewStage = true;
          }
          this.loadLevel(isNewStage);
        }, 1500);
      } else {
        UI.render();
      }
    }
  };

  return {
    iniciar: (options, onEnd) => Controller.start(options, onEnd),
    detener: () => Controller.stop()
  };
})();

// Exponerlo globalmente
window.EquaBalanceApp = EquaBalance;
