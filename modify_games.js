const fs = require('fs');

let content = fs.readFileSync('./js/game.js', 'utf8');

// Inject window.onPowerUpSaltear into game initializers
// 1. Pizza Rush
content = content.replace(/if \(dataCompleta.juego === 'pizza_rush'\) \{/, 
  "if (dataCompleta.juego === 'pizza_rush') {\n    window.onPowerUpSaltear = () => { clearInterval(window.timerID); terminarPedido(true); };");

// 2. Tetris
content = content.replace(/else if \(dataCompleta.juego === 'tetris'\) \{/, 
  "else if (dataCompleta.juego === 'tetris') {\n    window.onPowerUpSaltear = () => { clearInterval(window.timerID); terminarNivel(true); };");

// 3. Arquitecto
content = content.replace(/else if \(dataCompleta.juego === 'arquitecto'\) \{/, 
  "else if (dataCompleta.juego === 'arquitecto') {\n    window.onPowerUpSaltear = () => { clearInterval(window.timerID); verificarArquitecto(true); };"); // Guessing function name, will check

// Let's first just find the 'terminar' or 'siguiente' functions for all games.
console.log("File read successfully.");
