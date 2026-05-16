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
        { id: '1-12', equation: '3a = 2a + 3', optimalMoves: 1, varSymbol: 'a' },
        { id: '1-13', equation: 'm + 3 = 6', optimalMoves: 1, varSymbol: 'm' },
        { id: '1-14', equation: '2m = m + 5', optimalMoves: 1, varSymbol: 'm' },
        { id: '1-15', equation: '2m + 2 = m + 4', optimalMoves: 2, varSymbol: 'm' },
        { id: '1-16', equation: 's - 2 = 3', optimalMoves: 1, varSymbol: 's' },
        { id: '1-17', equation: '2(c + 1) = 4', optimalMoves: 2, varSymbol: 'c' },
        { id: '1-18', equation: '2(a + 2) = a + 6', optimalMoves: 3, varSymbol: 'a' },
        { id: '1-19', equation: '3(c + 1) = 2(c + 2)', optimalMoves: 3, varSymbol: 'c' },
        { id: '1-20', equation: '-2(a - 1) = 4', optimalMoves: 2, varSymbol: 'a' }
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
        { id: '2-7', equation: '2x + 1 = x - 3', optimalMoves: 2, varSymbol: 'x' },
        { id: '2-8', equation: '2m - 5 = m - 2', optimalMoves: 2, varSymbol: 'm' },
        { id: '2-9', equation: '3s + 2 = 2s - 1', optimalMoves: 3, varSymbol: 's' },
        { id: '2-10', equation: '2x - 2 = x - 6', optimalMoves: 2, varSymbol: 'x' },
        { id: '2-11', equation: '3m - 4 = 2m + 1', optimalMoves: 3, varSymbol: 'm' },
        { id: '2-12', equation: '2x + 5 = x + 1', optimalMoves: 2, varSymbol: 'x' },
        { id: '2-13', equation: 's + 3 = -2', optimalMoves: 1, varSymbol: 's' },
        { id: '2-14', equation: 'm - 4 = -1', optimalMoves: 1, varSymbol: 'm' },
        { id: '2-15', equation: '2x + 3 = x - 2', optimalMoves: 2, varSymbol: 'x' },
        { id: '2-16', equation: 's - 0.5 = 1.5', optimalMoves: 1, varSymbol: 's' },
        { id: '2-17', equation: 'm + 0.5 = 2.5', optimalMoves: 1, varSymbol: 'm' },
        { id: '2-18', equation: '2(s - 1) = 4', optimalMoves: 2, varSymbol: 's' },
        { id: '2-19', equation: '-2(m + 1) = -m - 2.5', optimalMoves: 3, varSymbol: 'm' },
        { id: '2-20', equation: '3(s + 0.5) = s + 4.5', optimalMoves: 3, varSymbol: 's' }
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
        { id: '3-12', equation: '3x + 5 = 2x + 8', optimalMoves: 2, varSymbol: 'x' },
        { id: '3-13', equation: '3x - 3 = 9', optimalMoves: 2, varSymbol: 'x' },
        { id: '3-14', equation: '5x + 2 = 3x + 10', optimalMoves: 3, varSymbol: 'x' },
        { id: '3-15', equation: '2x + 5 = x + 2', optimalMoves: 3, varSymbol: 'x' },
        { id: '3-16', equation: 'x/2 + 3 = 7', optimalMoves: 3, varSymbol: 'x' },
        { id: '3-17', equation: '3(2x - 1) = 4x + 5', optimalMoves: 4, varSymbol: 'x' },
        { id: '3-18', equation: '(2x + 4)/2 = x + 2', optimalMoves: 3, varSymbol: 'x' },
        { id: '3-19', equation: '2(x/2 + 1) = 4', optimalMoves: 3, varSymbol: 'x' },
        { id: '3-20', equation: '3(x/3 + 2) = 2(x + 1)', optimalMoves: 4, varSymbol: 'x' }
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
      const varSym = eqStr.match(/[a-zA-Z]/)?.[0] || 'x';
      return { left: this.parseExpression(leftStr, varSym), right: this.parseExpression(rightStr, varSym) };
    },
    parseExpression(str, varSym) {
      str = str.replace(/\s+/g, '');
      let terms = [];
      const bubbleRegex = /([+-]?\d*(?:\.\d+)?)\(([^)]+)\)(?:\/(\d+(?:\.\d+)?))?/g;
      let match;
      let processedStr = str;
      while ((match = bubbleRegex.exec(str)) !== null) {
         let coefStr = match[1];
         let innerStr = match[2];
         let divStr = match[3];
         let multiplier = 1;
         if (coefStr === '-') multiplier = -1;
         else if (coefStr !== '' && coefStr !== '+') multiplier = parseFloat(coefStr);
         if (divStr) multiplier = multiplier / parseFloat(divStr);
         let innerTerms = this.parseSimpleExpression(innerStr, varSym);
         terms.push({ type: 'bubble', multiplier, terms: innerTerms, id: 'b_' + Math.random().toString(36).substr(2, 9) });
         processedStr = processedStr.replace(match[0], '');
      }
      if (processedStr.length > 0) terms = terms.concat(this.parseSimpleExpression(processedStr, varSym));
      return terms;
    },
    parseSimpleExpression(str, varSym) {
      if (!str) return [];
      let terms = [];
      const parts = str.match(/[+-]?[^+-]+/g);
      if (!parts) return [];
      
      const parseVal = (s) => {
         if (s.includes('/')) {
            const [n, d] = s.split('/');
            return parseFloat(n) / parseFloat(d);
         }
         return parseFloat(s);
      };

      parts.forEach(p => {
        let isNeg = p.startsWith('-');
        p = p.replace(/^[+-]/, '');
        if (p.includes(varSym)) {
          let numStr = p.replace(varSym, '');
          if (numStr === '') numStr = '1';
          if (numStr.startsWith('/')) numStr = '1' + numStr;
          let val = parseVal(numStr);
          terms.push({ type: 'variable', val: isNeg ? -val : val, symbol: varSym, id: 't_'+Math.random().toString(36).substr(2,9) });
        } else {
          let val = parseVal(p);
          if (!isNaN(val)) terms.push({ type: 'number', val: isNeg ? -val : val, id: 't_'+Math.random().toString(36).substr(2,9) });
        }
      });
      return terms;
    },
    applyActionToBothSides(leftSide, rightSide, type, value, symbol = 'x') {
      const newTerm = { id: Math.random().toString(36).substring(2, 9), type: type === 'variable' ? 'variable' : 'number', val: value, symbol: symbol };
      return { newLeft: [...leftSide, newTerm], newRight: [...rightSide, newTerm] };
    },
    applyDivisionToBothSides(leftSide, rightSide, divisor) {
      const divideSide = side => side.map(t => {
          if (t.type === 'bubble') return { ...t, multiplier: Math.round((t.multiplier / divisor)*1000)/1000 };
          return { ...t, val: Math.round((t.val / divisor)*1000)/1000 };
      });
      return { success: true, newLeft: divideSide(leftSide), newRight: divideSide(rightSide) };
    },
    tryCombineTerms(side, id1, id2) {
      const t1 = side.find(t => t.id === id1), t2 = side.find(t => t.id === id2);
      if (!t1 || !t2 || t1.type === 'bubble' || t2.type === 'bubble' || t1.type !== t2.type || (t1.type === 'variable' && t1.symbol !== t2.symbol)) return { success: false, newSide: side };
      let newSide = side.filter(t => t.id !== id1 && t.id !== id2);
      let sum = t1.val + t2.val;
      sum = Math.round(sum * 1000) / 1000; // Fix floating point issues
      if (sum !== 0) newSide.push({ ...t1, val: sum, id: Math.random().toString(36).substring(2,9) });
      return { success: true, newSide };
    },
    checkSolved(leftSide, rightSide) {
      const flatten = side => side.reduce((acc, t) => t.type === 'bubble' ? acc.concat(t.terms.map(it => ({...it, val: it.val * t.multiplier}))) : acc.concat(t), []);
      const l = flatten(leftSide), r = flatten(rightSide);
      const isIsolatedVar = s => s.length === 1 && s[0].type === 'variable' && Math.abs(s[0].val - 1) < 0.001;
      const isSingleNum = s => s.length === 1 && s[0].type === 'number';
      return (isIsolatedVar(l) && isSingleNum(r)) || (isSingleNum(l) && isIsolatedVar(r));
    },
    simplifyState() {
       // Logic to trigger re-renders or internal state maintenance
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
        case 'pop':
          this.playTone(600, 'sine', 0.1, 0.1);
          setTimeout(() => this.playTone(800, 'sine', 0.1, 0.1), 50);
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
        'c': ["Sistema: Operación inválida. Carga desequilibrada.", "Ren: Eso no funciona con estas cajas."],
        'a': ["Cero: Los números y la criatura no se mezclan. ¡Despéjala!"],
        'm': ["Sistema: Combinación biológica rechazada."],
        's': ["Cero: La energía de la estrella rechazó tu movimiento. Ten cuidado."],
        'x': ["Sistema: Error de sintaxis. Variables y enteros son inmiscibles."]
      };

      const dynamicBubbleExpanded = {
        'c': ["Ren: Escudo colapsado. Procedo a despejar la zona."],
        'a': ["Ren: ¡Contención rota! Las criaturas están libres."],
        'm': ["Sistema: Campo biológico abierto."],
        's': ["Ren: Firewall roto. Firmas de energía expuestas."],
        'x': ["Ren: Protocolo ejecutado. Paréntesis purgados del código."]
      };

      const dynamicHints = {
        'vars_both_sides': ["Cero: Demasiadas variables dispersas. Intenta moverlas todas a un solo muelle.", "Ren: La señal de la variable está duplicada. Hay que consolidarla en un lado."],
        'nums_both_sides': ["Cero: Los valores constantes están estorbando. Agrúpalos para ver mejor.", "Ren: Demasiado ruido numérico. Voy a simplificar las constantes."],
        'has_bubbles': ["Cero: Esa zona de cuarentena protege el núcleo. Tienes que colapsar el escudo primero.", "Aria: Mis escudos son impenetrables... a menos que sepas donde presionar."],
        'general': ["Cero: Estás dando vueltas, Ren. Enfócate en aislar la incógnita.", "Ren: Esta ecuación es más resistente de lo que pensaba. Necesito un enfoque más directo."]
      };

      let pool = ["Sistema en línea."];
      if (event === 'load') pool = dynamicLoad[symbol] || dynamicLoad['x'];
      if (event === 'load_two_vars') pool = dynamicLoadTwoVars[symbol] || dynamicLoadTwoVars['x'];
      if (event === 'win') pool = dynamicWin[symbol] || dynamicWin['x'];
      if (event === 'fail') pool = dynamicFail[symbol] || dynamicFail['x'];
      if (event === 'bubble_expanded') pool = dynamicBubbleExpanded[symbol] || dynamicBubbleExpanded['x'];
      if (event === 'hint') pool = dynamicHints[symbol] || dynamicHints['general'];
      
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

      // Cálculo de bonificación: 3 minutos máximo para ganar bonificación
      const timeBonus = Math.max(0, 180 - state.time) * 2; 
      const totalXP = state.xp + timeBonus;

      container.innerHTML = `
        <div class="eb-container" style="justify-content:center; align-items:center; text-align:center; position: relative; overflow: hidden; height: 100%;">
          <!-- Acelerador de Partículas (Fondo) -->
          <div class="eb-particle-accelerator"></div>
          
          <h2 style="color:var(--eb-success); font-size:2.8rem; font-family:var(--font-display); z-index: 10; text-shadow: 0 0 15px rgba(158,206,106,0.5);">¡Sincronización Completa! ✨</h2>
          <p style="color:var(--eb-text); max-width:500px; font-size:1.1rem; line-height:1.5; margin: 20px 0; z-index: 10;">"Bien hecho, Ren. El acelerador cuántico está asimilando la energía residual. Procesando rendimiento..."</p>
          
          <div style="background: rgba(26, 27, 38, 0.8); padding: 25px; border-radius: 12px; z-index: 10; border: 1px solid var(--eb-primary); min-width: 320px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
             <p style="color:var(--eb-text-bright); font-size:1.2rem; margin: 5px 0; display:flex; justify-content:space-between;"><span>XP Base:</span> <span style="color:#f1c40f; font-weight:bold;">${state.xp}</span></p>
             <p style="color:var(--eb-text-bright); font-size:1.2rem; margin: 5px 0; display:flex; justify-content:space-between;"><span>Tiempo Residual:</span> <span id="eb-final-time" style="color:#7aa2f7; font-weight:bold;">${state.time}s</span></p>
             <div style="margin-top: 15px; border-top: 1px solid #414868; padding-top: 15px;">
                <p style="color:var(--eb-primary); font-size:1.5rem; margin: 0; font-weight:bold;">XP TOTAL</p>
                <p id="eb-final-xp" style="color:#9ece6a; font-weight:bold; font-size: 3rem; margin: 5px 0; text-shadow: 0 0 20px rgba(158,206,106,0.6);">${state.xp}</p>
             </div>
          </div>
          
          <button class="eb-btn-action" id="eb-btn-end" style="margin-top:30px; font-size:1.2rem; padding:15px 40px; cursor:pointer; z-index: 10; display: none; background:var(--eb-primary); color:white; font-weight:bold;">Desconectar</button>
        </div>
      `;

      let currentTime = state.time;
      let currentXp = state.xp;
      const timeSpan = document.getElementById('eb-final-time');
      const xpSpan = document.getElementById('eb-final-xp');
      const btnEnd = document.getElementById('eb-btn-end');

      if (timeBonus > 0 && !state.evaluationMode) {
        AudioEngine.play('combo_activate'); 
        const tickInterval = setInterval(() => {
          if (currentTime > 0 && currentXp < totalXP) {
             currentTime -= 2; 
             if (currentTime < 0) currentTime = 0;
             currentXp += 5; 
             if (currentXp > totalXP) currentXp = totalXP;
             
             timeSpan.textContent = currentTime + 's';
             xpSpan.textContent = currentXp;
             
             AudioEngine.playTone(600 + (currentXp - state.xp)*3, 'sine', 0.05, 0.03);
          } else {
             clearInterval(tickInterval);
             timeSpan.textContent = '0s (Bono Asimilado)';
             xpSpan.textContent = totalXP;
             AudioEngine.play('level_complete');
             btnEnd.style.display = 'block';
             
             if (totalXP > state.xp) {
                window.dispatchEvent(new CustomEvent('EQUABALANCE_SOLVED', { 
                  detail: { xpEarned: totalXP - state.xp, perfect: false }
                }));
             }
             
             state.xp = totalXP; 
          }
        }, 40);
      } else {
         timeSpan.textContent = state.time + 's (Sin bono)';
         btnEnd.style.display = 'block';
      }

      btnEnd.onclick = () => { if(state.onEndCallback) state.onEndCallback({ xp: state.xp, time: state.time }); };
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

      if (!stage || !level) return; 

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
          
          <div id="eb-commlink" style="display:flex; align-items:center; background: rgba(10, 12, 18, 0.9); border: 1px solid var(--eb-primary); margin-bottom: 15px; padding: 10px; border-radius: 8px; font-family: monospace; color: var(--eb-text-bright); min-height: 80px; box-shadow: 0 0 20px rgba(122,162,247,0.2); gap: 15px; position:relative; overflow:hidden;">
             <div id="eb-commlink-avatar" style="width: 60px; height: 60px; border: 2px solid var(--eb-primary); border-radius: 6px; background: url('C:/Users/Usuario/.gemini/antigravity/brain/a9ce7f3f-bda1-4b48-97a0-f7cd8f12e249/cero_mentor_avatar_1778902282069.png') center/cover; position:relative; flex-shrink:0;">
                <div style="position:absolute; bottom: -5px; right: -5px; width: 12px; height: 12px; background: #9ece6a; border-radius: 50%; border: 2px solid #1a1b26; box-shadow: 0 0 10px #9ece6a;"></div>
             </div>
             <div style="flex:1;">
                <div style="font-size:0.7rem; color:var(--eb-primary); margin-bottom:4px; text-transform:uppercase; letter-spacing:1px; font-weight:bold;">Commlink: Canal Seguro</div>
                <span style="color:var(--eb-primary); margin-right: 5px; font-weight:bold;">></span><span id="eb-commlink-text" style="word-wrap: break-word; line-height:1.4;">Conectando...</span>
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
            ${stage.id === 1 ? `
              <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap: 10px; width: 100%; max-width:500px; margin: 0 auto;">
                <button class="eb-btn-action" data-action="add" data-type="number" data-value="1">+1</button>
                <button class="eb-btn-action" data-action="add" data-type="number" data-value="-1">-1</button>
                <button class="eb-btn-action" data-action="add" data-type="variable" data-value="1" data-symbol="${currentSymbol}">+${displaySym}</button>
                <button class="eb-btn-action" data-action="add" data-type="variable" data-value="-1" data-symbol="${currentSymbol}">-${displaySym}</button>
              </div>
            ` : stage.id === 2 ? `
              <div style="display:grid; grid-template-columns: repeat(5, 1fr); gap: 8px; width: 100%;">
                <button class="eb-btn-action" data-action="add" data-type="number" data-value="1">+1</button>
                <button class="eb-btn-action" data-action="add" data-type="number" data-value="2">+2</button>
                <button class="eb-btn-action" data-action="add" data-type="number" data-value="0.5">+0.5</button>
                <button class="eb-btn-action" data-action="add" data-type="variable" data-value="1" data-symbol="${currentSymbol}">+${displaySym}</button>
                <button class="eb-btn-action" data-action="add" data-type="variable" data-value="2" data-symbol="${currentSymbol}">+2${displaySym}</button>
                <button class="eb-btn-action" data-action="add" data-type="number" data-value="-1">-1</button>
                <button class="eb-btn-action" data-action="add" data-type="number" data-value="-2">-2</button>
                <button class="eb-btn-action" data-action="add" data-type="number" data-value="-0.5">-0.5</button>
                <button class="eb-btn-action" data-action="add" data-type="variable" data-value="-1" data-symbol="${currentSymbol}">-${displaySym}</button>
                <button class="eb-btn-action" data-action="add" data-type="variable" data-value="-2" data-symbol="${currentSymbol}">-2${displaySym}</button>
              </div>
            ` : `
              <div style="display:flex; flex-direction:column; gap:8px; width: 100%;">
                <div style="display:grid; grid-template-columns: repeat(6, 1fr); gap: 5px;">
                  <button class="eb-btn-action" data-action="add" data-type="number" data-value="1">+1</button>
                  <button class="eb-btn-action" data-action="add" data-type="number" data-value="2">+2</button>
                  <button class="eb-btn-action" data-action="add" data-type="number" data-value="3">+3</button>
                  <button class="eb-btn-action" data-action="add" data-type="number" data-value="-1">-1</button>
                  <button class="eb-btn-action" data-action="add" data-type="number" data-value="-2">-2</button>
                  <button class="eb-btn-action" data-action="add" data-type="number" data-value="-3">-3</button>
                </div>
                <div style="display:grid; grid-template-columns: repeat(6, 1fr); gap: 5px;">
                  <button class="eb-btn-action" data-action="add" data-type="variable" data-value="1" data-symbol="${currentSymbol}">+${displaySym}</button>
                  <button class="eb-btn-action" data-action="add" data-type="variable" data-value="2" data-symbol="${currentSymbol}">+2${displaySym}</button>
                  <button class="eb-btn-action" data-action="add" data-type="variable" data-value="3" data-symbol="${currentSymbol}">+3${displaySym}</button>
                  <button class="eb-btn-action" data-action="add" data-type="variable" data-value="-1" data-symbol="${currentSymbol}">-${displaySym}</button>
                  <button class="eb-btn-action" data-action="add" data-type="variable" data-value="-2" data-symbol="${currentSymbol}">-2${displaySym}</button>
                  <button class="eb-btn-action" data-action="add" data-type="variable" data-value="-3" data-symbol="${currentSymbol}">-3${displaySym}</button>
                </div>
                <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap: 5px;">
                  <button class="eb-btn-action divide" data-action="div" data-value="2">÷2 Ambos Lados</button>
                  <button class="eb-btn-action divide" data-action="div" data-value="3">÷3 Ambos Lados</button>
                  <button class="eb-btn-action divide" data-action="div" data-value="4">÷4 Ambos Lados</button>
                </div>
              </div>
            `}
          </div>
        </div>
      `;

      this.attachEvents();
    },

    renderTerms(terms) {
      if (terms.length === 0) return `<div class="eb-term-zero">0</div>`;
      return terms.map(t => {
        if (t.type === 'bubble') {
           return `
             <div class="eb-bubble-container" data-id="${t.id}">
                <div class="eb-bubble-multiplier">${t.multiplier < 0 ? '-' : ''}${Math.abs(t.multiplier) !== 1 ? Math.abs(t.multiplier) : ''}</div>
                <div class="eb-bubble-content">${this.renderTerms(t.terms)}</div>
             </div>
           `;
        }
        const isVar = t.type === 'variable';
        let valDisp = t.val;
        if (!Number.isInteger(valDisp)) valDisp = Number(valDisp.toFixed(2));
        const display = isVar ? `${valDisp === 1 ? '' : (valDisp === -1 ? '-' : valDisp)}${SYMBOL_MAP[t.symbol] || t.symbol}` : valDisp;
        return `<div class="eb-term-block ${isVar ? 'eb-term-var' : 'eb-term-num'}" draggable="true" data-id="${t.id}"><div class="eb-term-content">${display}</div></div>`;
      }).join('');
    },

    attachEvents() {
      document.querySelectorAll('.eb-btn-action[data-action]').forEach(btn => {
        btn.onclick = (e) => {
          const action = e.currentTarget.dataset.action;
          if (action === 'add') Controller.actionBothSides(e.currentTarget.dataset.type, parseFloat(e.currentTarget.dataset.value), e.currentTarget.dataset.symbol || 'x');
          else if (action === 'div') Controller.divideBothSides(parseFloat(e.currentTarget.dataset.value));
        };
      });

      document.querySelectorAll('.eb-bubble-container').forEach(b => {
        b.onclick = (e) => {
           e.stopPropagation();
           Controller.expandBubble(b.dataset.id);
        };
      });

      document.querySelectorAll('.eb-term-block').forEach(b => {
        b.ondragstart = (e) => { state.draggedId = b.dataset.id; };
      });

      document.querySelectorAll('.eb-board-side').forEach(side => {
        side.ondragover = (e) => {
            e.preventDefault();
            side.classList.add('eb-drag-over');
        };
        side.ondragleave = (e) => {
            side.classList.remove('eb-drag-over');
        };
        side.ondrop = (e) => {
          side.classList.remove('eb-drag-over');
          const target = e.target.closest('.eb-term-block');
          if (target && state.draggedId) Controller.combineTerms(side.dataset.side, state.draggedId, target.dataset.id, e.clientX, e.clientY);
        };
      });

      if (!this.typeInterval) UI.showCommlinkMessage(Narrator.getMessage(state.stageIdx, 'load', state.currentStageLevels[state.levelIdx]?.varSymbol));
    },
    
    showCommlinkMessage(text, isError = false) {
      const comm = document.getElementById('eb-commlink-text');
      const avatar = document.getElementById('eb-commlink-avatar');
      if (!comm) return;
      
      comm.textContent = text;
      
      // Trigger glitch animation on the whole panel
      comm.parentElement.parentElement.classList.remove('eb-glitch-text');
      void comm.parentElement.parentElement.offsetWidth; // Trigger reflow
      comm.parentElement.parentElement.classList.add('eb-glitch-text');

      // Animación de hablar para el avatar
      if (avatar) {
        avatar.style.borderColor = isError ? 'var(--eb-error)' : 'var(--eb-primary)';
        avatar.animate([
          { opacity: 0.7, transform: 'scale(1)' },
          { opacity: 1, transform: 'scale(1.05)' },
          { opacity: 0.7, transform: 'scale(1)' }
        ], { duration: 200, iterations: 2 });
      }
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
             let valDisp = finalNum.val;
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
      AudioEngine.init();
      const curso = options?.curso || '3ro';
      const modoAvanzado = options?.modoAvanzado || false;
      state.modoAvanzado = modoAvanzado;
      state.stageIdx = curso === '1ro' ? 0 : (curso === '2do' ? 1 : 2);
      
      let allLevels = stages[state.stageIdx].levels;
      if (modoAvanzado) {
          allLevels = allLevels.slice(15);
      } else {
          allLevels = allLevels.slice(0, 15);
      }
      
      state.currentStageLevels = [...allLevels].sort(() => 0.5 - Math.random()).slice(0, 5);
      state.levelIdx = 0;
      state.time = 0;
      state.xp = 0;
      state.combo = 1;
      state.evaluationMode = options?.evaluationMode || false;
      state.evalHistory = [];
      state.onEndCallback = onEnd;
      UI.initStyles();
      this.loadLevel(true);
      if(state.timerId) clearInterval(state.timerId);
      state.timerId = setInterval(() => { 
          state.time++; 
          const tEl = document.getElementById('eb-timer-display');
          if(tEl) tEl.textContent = `${Math.floor(state.time/60)}:${(state.time%60).toString().padStart(2,'0')}`;
      }, 1000);
    },
    
    stop() {
      if (state.timerId) clearInterval(state.timerId);
    },

    expandBubble(bubbleId) {
       let foundSide = null;
       let bIndex = state.leftSide.findIndex(t => t.id === bubbleId);
       if (bIndex !== -1) foundSide = state.leftSide;
       else {
          bIndex = state.rightSide.findIndex(t => t.id === bubbleId);
          if (bIndex !== -1) foundSide = state.rightSide;
       }
       
       if (!foundSide) return;
       
       const bubble = foundSide[bIndex];
       foundSide.splice(bIndex, 1);
       
       bubble.terms.forEach(t => {
          let newVal = t.val * bubble.multiplier;
          foundSide.push({ ...t, val: newVal, id: 't_' + Math.random().toString(36).substr(2,9) });
       });
       
       state.moves++;
       AudioEngine.play('pop');
       
       const el = document.querySelector(`[data-id="${bubbleId}"]`);
       if(el) {
          const rect = el.getBoundingClientRect();
          UI.createParticles(rect.left + rect.width/2, rect.top + rect.height/2);
       }
       
       UI.render();
       UI.showCommlinkMessage(Narrator.getMessage(state.stageIdx, 'bubble_expanded', bubble.terms[0]?.symbol || 'x'));
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
      // Verificar si necesita una pista
      const level = state.currentStageLevels[state.levelIdx];
      if (state.moves > level.optimalMoves + 3 && state.moves % 3 === 0) {
        this.provideHint();
      }

      if (Engine.checkSolved(state.leftSide, state.rightSide)) {
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
          const baseXP = state.modoAvanzado ? 100 : 50;
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
      }
    },

    provideHint() {
      const hasBubbles = state.leftSide.some(t => t.type === 'bubble') || state.rightSide.some(t => t.type === 'bubble');
      const hasVarsBothSides = state.leftSide.some(t => t.type === 'variable') && state.rightSide.some(t => t.type === 'variable');
      const hasNumsBothSides = state.leftSide.some(t => t.type === 'number') && state.rightSide.some(t => t.type === 'number');

      let hintType = 'general';
      if (hasBubbles) hintType = 'has_bubbles';
      else if (hasVarsBothSides) hintType = 'vars_both_sides';
      else if (hasNumsBothSides) hintType = 'nums_both_sides';

      UI.showCommlinkMessage(Narrator.getMessage(state.stageIdx, 'hint', hintType));
    }
  };

  return {
    iniciar: (options, onEnd) => Controller.start(options, onEnd),
    detener: () => Controller.stop()
  };
})();

// Exponerlo globalmente
window.EquaBalanceApp = EquaBalance;
