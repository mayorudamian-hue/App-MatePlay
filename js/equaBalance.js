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
      id: 1, 
      name: "Acto 1: El Desajuste Físico", 
      mechanics: `"Escucha, Ren. Las masas en el Muelle 4 están fluctuando. Hay contenedores corruptos desestabilizando los pilares. Usa tu Sincronización: extrae el mismo peso de ambos lados para neutralizar la carga o la plataforma colapsará." — Cero`,
      levels: [
        { id: '1-1', equation: 'c + 1 = 3', optimalMoves: 1, varSymbol: 'c' },
        { id: '1-2', equation: 'c + 2 = 5', optimalMoves: 1, varSymbol: 'c' },
        { id: '1-3', equation: 'a - 1 = 4', optimalMoves: 1, varSymbol: 'a' },
        { id: '1-4', equation: 'a - 3 = 1', optimalMoves: 1, varSymbol: 'a' },
        { id: '1-5', equation: '2c = c + 4', optimalMoves: 1, varSymbol: 'c' },
        { id: '1-6', equation: '2c + 1 = c + 5', optimalMoves: 2, varSymbol: 'c' },
        { id: '1-7', equation: '2a = a + 3', optimalMoves: 1, varSymbol: 'a' },
        { id: '1-8', equation: 'a - 4 = 2', optimalMoves: 1, varSymbol: 'a' },
        { id: '1-9', equation: '3c = 2c + 2', optimalMoves: 1, varSymbol: 'c' },
        { id: '1-10', equation: 'c - 5 = 1', optimalMoves: 1, varSymbol: 'c' },
        { id: '1-11', equation: '2a + 2 = a + 8', optimalMoves: 2, varSymbol: 'a' },
        { id: '1-12', equation: '3a = 2a + 3', optimalMoves: 1, varSymbol: 'a' }
      ]
    },
    {
      id: 2, 
      name: "Acto 2: Firmas de Energía", 
      mechanics: `"Estás aprendiendo a ver el esqueleto del mundo, chico. La arquitectura de la red se está desangrando. Ya no son objetos físicos, es energía pura. Localiza los nodos fantasma (X) y cancela las polaridades opuestas." — Cero`,
      levels: [
        { id: '2-1', equation: 'm - 5 = -2', optimalMoves: 1, varSymbol: 'm' },
        { id: '2-2', equation: 'x + 4 = -1', optimalMoves: 1, varSymbol: 'x' },
        { id: '2-3', equation: 's - 3 = -5', optimalMoves: 1, varSymbol: 's' },
        { id: '2-4', equation: 'x + 6 = -3', optimalMoves: 1, varSymbol: 'x' },
        { id: '2-5', equation: 'm + 2 = -4', optimalMoves: 1, varSymbol: 'm' },
        { id: '2-6', equation: 'x - 1 = -6', optimalMoves: 1, varSymbol: 'x' },
        { id: '2-7', equation: 's + 5 = -2', optimalMoves: 1, varSymbol: 's' },
        { id: '2-8', equation: 'x - 4 = -7', optimalMoves: 1, varSymbol: 'x' },
        { id: '2-9', equation: 'm + 3 = 1', optimalMoves: 1, varSymbol: 'm' },
        { id: '2-10', equation: 'x - 6 = -2', optimalMoves: 1, varSymbol: 'x' },
        { id: '2-11', equation: 's + 7 = 3', optimalMoves: 1, varSymbol: 's' },
        { id: '2-12', equation: 'x - 2 = -4', optimalMoves: 1, varSymbol: 'x' }
      ]
    },
    {
      id: 3, 
      name: "Acto 3: El Código Fuente", 
      mechanics: `"El Arquitecto intenta reescribir la constante. Las variables se han fragmentado en ambos espectros. Tu mente es el procesador ahora: consolida las firmas de energía (X) de un solo lado para purgar el sistema." — Cero`,
      levels: [
        { id: '3-1', equation: '2x = x + 3', optimalMoves: 1, varSymbol: 'x' },
        { id: '3-2', equation: '3x - 1 = 2x + 4', optimalMoves: 2, varSymbol: 'x' },
        { id: '3-3', equation: '2x + 2 = 8', optimalMoves: 2, varSymbol: 'x' },
        { id: '3-4', equation: '4x - 2 = 3x + 3', optimalMoves: 2, varSymbol: 'x' },
        { id: '3-5', equation: '5x = 4x + 6', optimalMoves: 1, varSymbol: 'x' },
        { id: '3-6', equation: '3x + 1 = 2x + 5', optimalMoves: 2, varSymbol: 'x' },
        { id: '3-7', equation: '4x - 3 = 2x + 5', optimalMoves: 3, varSymbol: 'x' },
        { id: '3-8', equation: '2x - 4 = x - 1', optimalMoves: 2, varSymbol: 'x' },
        { id: '3-9', equation: '3x + 2 = 14', optimalMoves: 2, varSymbol: 'x' },
        { id: '3-10', equation: '5x - 2 = 4x + 1', optimalMoves: 2, varSymbol: 'x' },
        { id: '3-11', equation: '4x = 2x + 6', optimalMoves: 2, varSymbol: 'x' },
        { id: '3-12', equation: '3x + 5 = 2x + 8', optimalMoves: 2, varSymbol: 'x' }
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
    evaluationMode: false, evalHistory: [],
    currentStageLevels: []
  };

  // --- NARRADOR Y COMUNICACIONES ---
  const Narrator = {
    getMessage(stageIdx, event, symbol = 'x') {
      const dynamicLoad = {
        'c': ["Ren: Hay demasiadas cajas bloqueando el área. Voy a despejar la zona.", "Cero: La masa de las cajas es inestable. Aísla una para medirla."],
        'a': ["Cero: ¡Atención! Esa criatura se ha escapado. Aíslala de inmediato.", "Ren: Voy a encerrar a ese bicho antes de que cause daños físicos."],
        'm': ["Sistema: Núcleo biológico inestable. Neutraliza el exceso de masa alrededor de la manzana."],
        's': ["Cero: ¡Cuidado! Un núcleo de poder (⭐) se salió de control. Aísla la estrella."],
        'x': ["Cero: Filtrando firmas fantasma [X]... Aísla la anomalía de la red.", "Cero: El código fuente está fragmentado. Consolida las variables [X]."]
      };

      const dynamicLoadTwoVars = {
        'c': ["Cero: Hay contenedores en ambos muelles. Inyecta Antimateria (-📦) en los dos lados para anular el exceso."],
        'a': ["Cero: ¡Múltiples criaturas en los dos lados! Envía una anti-criatura (-👾) a ambos lados para cancelar."],
        'm': ["Sistema: Masa biológica detectada en ambos polos. Aplique antimateria biológica a ambos polos."],
        's': ["Cero: Núcleos estelares en conflicto a ambos lados. Anula uno inyectando una anti-estrella en ambos lados."],
        'x': ["Cero: Variables duplicadas en ambos espectros. Resta la variable de ambos lados para unificarlas."]
      };
      
      const dynamicWin = {
        'c': ["Ren: Zona despejada. Hemos recuperado el contenedor.", "Cero: Bien hecho. La caja está aislada."],
        'a': ["Ren: Listo. La criatura está contenida de forma segura.", "Cero: Monstruo encerrado. El sector está a salvo."],
        'm': ["Cero: Núcleo biológico estabilizado. Buen control de la anomalía."],
        's': ["Ren: Estrella contenida. El poder vuelve a fluir con normalidad."],
        'x': ["Ren: Algoritmo purgado. La variable [X] ha sido resuelta.", "Sistema: Velo cuántico estabilizado al 100%."]
      };
      
      const dynamicFail = {
        'c': ["Sistema: Choque físico. Las cajas numéricas no se anulan así.", "Cero: No puedes fusionar cajas con otros elementos. Usa opuestos."],
        'a': ["Cero: Los números y la criatura no se mezclan. ¡Despéjala!"],
        'm': ["Sistema: Polaridad biológica incompatible. Busca el opuesto numérico."],
        's': ["Cero: La energía de la estrella rechazó tu movimiento. Ten cuidado."],
        'x': ["Sistema: Error de sintaxis en el tejido. Variables no compatibles."]
      };

      let pool = ["Sistema en línea."];
      if (event === 'load') pool = dynamicLoad[symbol] || dynamicLoad['x'];
      if (event === 'load_two_vars') pool = dynamicLoadTwoVars[symbol] || dynamicLoadTwoVars['x'];
      if (event === 'win') pool = dynamicWin[symbol] || dynamicWin['x'];
      if (event === 'fail') pool = dynamicFail[symbol] || dynamicFail['x'];
      
      return pool[Math.floor(Math.random() * pool.length)];
    }
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
        <div class="eb-container" style="justify-content:center; align-items:center; text-align:center; background-color: var(--eb-bg); position:relative;">
          <div style="position:absolute; top:20px; left:20px; color: var(--eb-primary); font-family: monospace; opacity: 0.7;">[ENLACE SEGURO ESTABLECIDO]</div>
          <h1 style="color:var(--eb-primary); font-size:2.5rem; margin-bottom:10px; font-family:var(--font-display); text-transform: uppercase; letter-spacing: 2px;">${stage.name}</h1>
          
          <div style="background: var(--eb-surface); border-left: 4px solid var(--eb-primary); padding: 20px; margin: 30px auto; max-width: 600px; text-align: left; border-radius: 4px; box-shadow: 0 10px 30px var(--eb-shadow);">
            <p style="color:var(--eb-text-bright); font-size:1.2rem; line-height:1.6; font-style: italic; margin: 0;">${stage.mechanics}</p>
          </div>
          
          <button class="eb-btn-action" id="eb-btn-continue" style="margin-top:20px; padding:15px 40px; font-size:1.2rem; background:linear-gradient(135deg, var(--eb-primary), #3d59a1); border:none; cursor:pointer; color: white;">Iniciar Sincronización</button>
        </div>
      `;
      document.getElementById('eb-btn-continue').onclick = onContinue;
    },

    renderEndScreen() {
      const container = document.getElementById('contenido-juego');
      if (!container) return;
      container.innerHTML = `
        <div class="eb-container" style="justify-content:center; align-items:center; text-align:center;">
          <h2 style="color:var(--eb-success); font-size:2.5rem; font-family:var(--font-display);">¡Sincronización Completa! ✨</h2>
          <p style="color:var(--eb-text); max-width:500px; font-size:1.1rem; line-height:1.5; margin: 20px 0;">"Bien hecho, Ren. Has estabilizado el sector... por ahora. Pero las anomalías siguen mutando. Mantente alerta."</p>
          <p style="color:var(--eb-text-bright); font-size:1.2rem;">Rendimiento del Sincronizador: <span style="color:#f1c40f; font-weight:bold;">+${state.xp} XP</span></p>
          <button class="eb-btn-action" id="eb-btn-end" style="margin-top:30px; font-size:1.2rem; padding:15px 30px; cursor:pointer;">Desconectar</button>
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
      const level = state.currentStageLevels[state.levelIdx];

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
                ? `<div class="eb-moves">Pasos Algebraicos: ${state.moves} <span class="eb-optimal">/ Óptimos: ${level.optimalMoves}</span></div>` 
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
          
          <div id="eb-commlink" style="background: rgba(0,0,0,0.4); border-left: 3px solid var(--eb-primary); margin-bottom: 15px; padding: 12px 15px; border-radius: 4px; font-family: monospace; color: var(--eb-text-bright); min-height: 60px; box-shadow: inset 0 0 10px rgba(0,0,0,0.5); line-height: 1.5; font-size: 0.95rem;">
             <span style="color:var(--eb-primary); margin-right: 5px; font-weight:bold;">></span><span id="eb-commlink-text" style="word-wrap: break-word;">Conectando...</span>
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
            ${stage.id === 1 ? `
              <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap: 10px; width: 100%; max-width:500px; margin: 0 auto;">
                <button class="eb-btn-action" data-action="add" data-type="number" data-value="1" style="padding:15px 0;">+1 Unidad</button>
                <button class="eb-btn-action" data-action="add" data-type="number" data-value="-1" style="padding:15px 0;">-1 Unidad</button>
                <button class="eb-btn-action" style="background:#3d59a1; padding:15px 0;" data-action="add" data-type="variable" data-value="1" data-symbol="${currentSymbol}">+1 ${displaySym}</button>
                <button class="eb-btn-action" style="background:#3d59a1; padding:15px 0;" data-action="add" data-type="variable" data-value="-1" data-symbol="${currentSymbol}">-1 ${displaySym}</button>
              </div>
            ` : stage.id === 2 ? `
              <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap: 8px; width: 100%;">
                <button class="eb-btn-action" data-action="add" data-type="number" data-value="1">+1</button>
                <button class="eb-btn-action" data-action="add" data-type="number" data-value="2">+2</button>
                <button class="eb-btn-action" data-action="add" data-type="number" data-value="3">+3</button>
                <button class="eb-btn-action" data-action="add" data-type="number" data-value="5">+5</button>
                <button class="eb-btn-action" data-action="add" data-type="number" data-value="-1">-1</button>
                <button class="eb-btn-action" data-action="add" data-type="number" data-value="-2">-2</button>
                <button class="eb-btn-action" data-action="add" data-type="number" data-value="-3">-3</button>
                <button class="eb-btn-action" data-action="add" data-type="number" data-value="-5">-5</button>
              </div>
            ` : `
              <div style="display:flex; flex-direction:column; gap:8px; width: 100%;">
                <div style="display:grid; grid-template-columns: repeat(6, 1fr); gap: 5px;">
                  <button class="eb-btn-action" data-action="add" data-type="number" data-value="1" style="padding:10px 0; font-size:1rem;">+1</button>
                  <button class="eb-btn-action" data-action="add" data-type="number" data-value="2" style="padding:10px 0; font-size:1rem;">+2</button>
                  <button class="eb-btn-action" data-action="add" data-type="number" data-value="3" style="padding:10px 0; font-size:1rem;">+3</button>
                  <button class="eb-btn-action" data-action="add" data-type="number" data-value="-1" style="padding:10px 0; font-size:1rem;">-1</button>
                  <button class="eb-btn-action" data-action="add" data-type="number" data-value="-2" style="padding:10px 0; font-size:1rem;">-2</button>
                  <button class="eb-btn-action" data-action="add" data-type="number" data-value="-3" style="padding:10px 0; font-size:1rem;">-3</button>
                </div>
                <div style="display:grid; grid-template-columns: repeat(6, 1fr); gap: 5px;">
                  <button class="eb-btn-action" style="background:#3d59a1; padding:10px 0; font-size:1rem;" data-action="add" data-type="variable" data-value="1" data-symbol="${currentSymbol}">+${displaySym}</button>
                  <button class="eb-btn-action" style="background:#3d59a1; padding:10px 0; font-size:1rem;" data-action="add" data-type="variable" data-value="2" data-symbol="${currentSymbol}">+2${displaySym}</button>
                  <button class="eb-btn-action" style="background:#3d59a1; padding:10px 0; font-size:1rem;" data-action="add" data-type="variable" data-value="3" data-symbol="${currentSymbol}">+3${displaySym}</button>
                  <button class="eb-btn-action" style="background:#3d59a1; padding:10px 0; font-size:1rem;" data-action="add" data-type="variable" data-value="-1" data-symbol="${currentSymbol}">-${displaySym}</button>
                  <button class="eb-btn-action" style="background:#3d59a1; padding:10px 0; font-size:1rem;" data-action="add" data-type="variable" data-value="-2" data-symbol="${currentSymbol}">-2${displaySym}</button>
                  <button class="eb-btn-action" style="background:#3d59a1; padding:10px 0; font-size:1rem;" data-action="add" data-type="variable" data-value="-3" data-symbol="${currentSymbol}">-3${displaySym}</button>
                </div>
                <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap: 5px;">
                  <button class="eb-btn-action divide" data-action="div" data-value="2" style="padding:10px 0; font-size:1rem;">÷2 Ambos Lados</button>
                  <button class="eb-btn-action divide" data-action="div" data-value="3" style="padding:10px 0; font-size:1rem;">÷3 Ambos Lados</button>
                  <button class="eb-btn-action divide" data-action="div" data-value="4" style="padding:10px 0; font-size:1rem;">÷4 Ambos Lados</button>
                </div>
              </div>
            `}
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
      // Botones de acción estándar
      document.querySelectorAll('.eb-btn-action[data-action]').forEach(btn => {
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
      };

      // Mostrar mensaje inicial si acabamos de renderizar el contenedor base
      if (!this.typeInterval) {
         const currentLevel = state.currentStageLevels[state.levelIdx];
         this.showCommlinkMessage(Narrator.getMessage(state.stageIdx, 'load', currentLevel?.varSymbol));
      }
    },
    
    showCommlinkMessage(text, isError = false) {
      const comm = document.getElementById('eb-commlink-text');
      const box = document.getElementById('eb-commlink');
      if (!comm || !box) return;
      
      comm.textContent = '';
      box.style.borderLeftColor = isError ? 'var(--eb-error)' : 'var(--eb-primary)';
      comm.style.color = isError ? 'var(--eb-error)' : 'var(--eb-text-bright)';
      
      // Destello de caja
      box.style.backgroundColor = isError ? 'rgba(247, 118, 142, 0.2)' : 'rgba(122, 162, 247, 0.1)';
      setTimeout(() => box.style.backgroundColor = 'rgba(0,0,0,0.4)', 200);
      
      let i = 0;
      clearInterval(this.typeInterval);
      this.typeInterval = setInterval(() => {
        comm.textContent += text.charAt(i);
        i++;
        if (i >= text.length) clearInterval(this.typeInterval);
      }, 30); // 30ms por carácter (efecto máquina de escribir)
    },
    
    createParticles(x, y) {
      // Onda de choque (Shockwave)
      const wave = document.createElement('div');
      wave.className = 'eb-shockwave';
      wave.style.left = x + 'px';
      wave.style.top = y + 'px';
      document.body.appendChild(wave);
      setTimeout(() => wave.remove(), 500);

      // Partículas esparcidas y símbolos
      const symbols = ['+', '-', 'x', '✨', '⚡'];
      for (let i = 0; i < 20; i++) {
        const p = document.createElement('div');
        
        if (i % 4 === 0) {
           p.className = 'eb-particle-text';
           p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        } else {
           p.className = 'eb-particle';
           const colors = ['#7aa2f7', '#9ece6a', '#e0af68', '#ffffff'];
           p.style.background = colors[Math.floor(Math.random() * colors.length)];
           p.style.boxShadow = `0 0 10px ${p.style.background}`;
        }
        
        p.style.left = x + 'px';
        p.style.top = y + 'px';
        
        const angle = Math.random() * Math.PI * 2;
        const velocity = 30 + Math.random() * 80;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        
        p.style.setProperty('--tx', `${tx}px`);
        p.style.setProperty('--ty', `${ty}px`);
        
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 800);
      }
    },
    
    showCelebration(earnedXP) {
      const cel = document.getElementById('eb-celebration');
      const titleEl = document.getElementById('eb-cel-title');
      const xpEl = document.getElementById('eb-earned-xp');
      
      if (cel && xpEl && titleEl) {
        let resultString = "";
        if (state.leftSide.length > 0 && state.rightSide.length > 0) {
           const finalVar = state.leftSide[0].type === 'variable' ? state.leftSide[0] : state.rightSide[0];
           const finalNum = state.leftSide[0].type === 'number' ? state.leftSide[0] : state.rightSide[0];
           if (finalVar && finalNum) {
             const mappedSymbol = SYMBOL_MAP[finalVar.symbol] || finalVar.symbol;
             // Formateo del decimal
             let valDisp = finalNum.value;
             if (!Number.isInteger(valDisp)) valDisp = Number(valDisp.toFixed(2));
             resultString = `${mappedSymbol} = ${valDisp}`;
           }
        }
      
        if (!state.evaluationMode) {
          titleEl.innerHTML = `¡Correcto! ✨${resultString ? `<br><span style="font-size:2.5rem; display:block; margin-top:10px; color:#c0caf5; font-weight:900;">${resultString}</span>` : ''}`;
          xpEl.textContent = `+${earnedXP} XP`;
        } else {
          titleEl.innerHTML = `¡Registrado! 📝${resultString ? `<br><span style="font-size:2.5rem; display:block; margin-top:10px; color:#c0caf5; font-weight:900;">${resultString}</span>` : ''}`;
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
      
      const curso = options?.curso || '3ro';
      if (curso === '1ro') state.stageIdx = 0;
      else if (curso === '2do') state.stageIdx = 1;
      else state.stageIdx = 2; // 3ro por defecto
      
      // Preparar niveles aleatorios de la etapa correspondiente
      const allLevels = stages[state.stageIdx].levels;
      state.currentStageLevels = [...allLevels].sort(() => 0.5 - Math.random()).slice(0, 5); // 5 niveles por sesión
      
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
      if (!stage || state.currentStageLevels.length === 0) { 
        if (state.evaluationMode) UI.renderEvalSummary();
        else UI.renderEndScreen();
        return; 
      }
      
      const level = state.currentStageLevels[state.levelIdx];
      const parsed = Engine.parseEquation(level.equation);
      state.leftSide = parsed.left;
      state.rightSide = parsed.right;
      state.moves = 0;
      
      // Reiniciar intervalo de tipeo al cambiar nivel
      clearInterval(UI.typeInterval);
      UI.typeInterval = null; 

      const hasVarBothSides = state.leftSide.some(t => t.type === 'variable') && state.rightSide.some(t => t.type === 'variable');
      const eventType = hasVarBothSides ? 'load_two_vars' : 'load';

      if (isNewStage && !state.evaluationMode) {
        UI.renderStageIntro(() => { 
            UI.render(); 
            UI.showCommlinkMessage(Narrator.getMessage(state.stageIdx, eventType, level.varSymbol)); 
        });
      } else {
        UI.render();
        UI.showCommlinkMessage(Narrator.getMessage(state.stageIdx, eventType, level.varSymbol));
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
        // NOTA: No sumamos moves aquí para que simplificar sea gratis
        this.checkWin();
      } else {
        AudioEngine.play('invalid_move');
        UI.vibrateBoard();
        const currentLevel = state.currentStageLevels[state.levelIdx];
        UI.showCommlinkMessage(Narrator.getMessage(state.stageIdx, 'fail', currentLevel?.varSymbol), true);
      }
    },
    
    checkWin() {
      if (Engine.checkSolved(state.leftSide, state.rightSide)) {
        const level = state.currentStageLevels[state.levelIdx];
        AudioEngine.play('level_complete');
        UI.render(); // Asegurar que el último movimiento se dibuje
        UI.showCommlinkMessage(Narrator.getMessage(state.stageIdx, 'win', level?.varSymbol));
        
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
          if (state.levelIdx >= state.currentStageLevels.length) {
            // El alumno solo juega la etapa correspondiente a su curso
            if (state.evaluationMode) UI.renderEvalSummary();
            else UI.renderEndScreen();
            return;
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
