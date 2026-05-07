const fs = require('fs');
const lines = fs.readFileSync('./js/game.js', 'utf8').split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('comboActual = 0;')) {
    console.log(`--- Line ${i + 1} ---`);
    for (let j = Math.max(0, i - 2); j <= Math.min(lines.length - 1, i + 3); j++) {
      console.log(`${j + 1}: ${lines[j]}`);
    }
  }
}
