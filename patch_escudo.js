const fs = require('fs');

let content = fs.readFileSync('./js/game.js', 'utf8');

const replacements = [
  // 1. Pizza Rush
  {
    search: `      else {
        comboActual = 0;
        erroresPorTema[tema] = (erroresPorTema[tema] || 0) + 1;
        if (excedido) { mostrarMensaje('Te pasaste. Era ' + sumaCorrecta, 'error'); }
        else { mostrarMensaje('Tiempo agotado. Era ' + sumaCorrecta, 'error'); }
      }`,
    replace: `      else {
        if (!window.intentarUsarEscudo()) {
          comboActual = 0;
          erroresPorTema[tema] = (erroresPorTema[tema] || 0) + 1;
          if (excedido) { mostrarMensaje('Te pasaste. Era ' + sumaCorrecta, 'error'); }
          else { mostrarMensaje('Tiempo agotado. Era ' + sumaCorrecta, 'error'); }
        }
      }`
  },
  // 2. Tetris Click Error
  {
    search: `          } else {
            comboActual = 0;
            const tema = ej.familia ? ej.familia.charAt(0).toUpperCase() + ej.familia.slice(1) : "Equivalencias";
            erroresPorTema[tema] = (erroresPorTema[tema] || 0) + 1;
            ficha.classList.add('incorrecta'); puntaje = Math.max(0, puntaje - 5);
          }`,
    replace: `          } else {
            if (!window.intentarUsarEscudo()) {
              comboActual = 0;
              const tema = ej.familia ? ej.familia.charAt(0).toUpperCase() + ej.familia.slice(1) : "Equivalencias";
              erroresPorTema[tema] = (erroresPorTema[tema] || 0) + 1;
              ficha.classList.add('incorrecta'); puntaje = Math.max(0, puntaje - 5);
            }
          }`
  },
  // 3. Tetris Timeout
  {
    search: `      iniciarCronometro(TIEMPO_POR_EJERCICIO, function() {
        comboActual = 0;
        actProgreso(false);
        const tema = ej.familia ? ej.familia.charAt(0).toUpperCase() + ej.familia.slice(1) : "Equivalencias";
        erroresPorTema[tema] = (erroresPorTema[tema] || 0) + 1;`,
    replace: `      iniciarCronometro(TIEMPO_POR_EJERCICIO, function() {
        if (!window.intentarUsarEscudo()) {
          comboActual = 0;
          const tema = ej.familia ? ej.familia.charAt(0).toUpperCase() + ej.familia.slice(1) : "Equivalencias";
          erroresPorTema[tema] = (erroresPorTema[tema] || 0) + 1;
        }
        actProgreso(false);`
  },
  // 4. Chef Timeout
  {
    search: `      iniciarCronometro(TIEMPO_POR_EJERCICIO, function() {
        const ejFin = ejercicios[recetaActual];
        comboActual = 0;
        actProgreso(false);
        const tema = categorizar(ejFin.cantidad_objetivo);
        erroresPorTema[tema] = (erroresPorTema[tema] || 0) + 1;`,
    replace: `      iniciarCronometro(TIEMPO_POR_EJERCICIO, function() {
        const ejFin = ejercicios[recetaActual];
        if (!window.intentarUsarEscudo()) {
          comboActual = 0;
          const tema = categorizar(ejFin.cantidad_objetivo);
          erroresPorTema[tema] = (erroresPorTema[tema] || 0) + 1;
        }
        actProgreso(false);`
  },
  // 5. Chef Incorrect
  {
    search: `      } else if (comparar(totalEnBowl, objetivo) > 0) {
        comboActual = 0;
        const tema = categorizar(objetivo);
        erroresPorTema[tema] = (erroresPorTema[tema] || 0) + 1;
        actProgreso(false);`,
    replace: `      } else if (comparar(totalEnBowl, objetivo) > 0) {
        if (!window.intentarUsarEscudo()) {
          comboActual = 0;
          const tema = categorizar(objetivo);
          erroresPorTema[tema] = (erroresPorTema[tema] || 0) + 1;
        }
        actProgreso(false);`
  },
  // 6. Arquitecto Incorrect
  {
    search: `          } else {
            comboActual = 0;
            this.classList.add('incorrecta');
            const ref = contenedor.querySelector('.cuerda-ref');
            if (ref) ref.classList.add('incorrecta');
          }`,
    replace: `          } else {
            if (!window.intentarUsarEscudo()) {
              comboActual = 0;
              this.classList.add('incorrecta');
              const ref = contenedor.querySelector('.cuerda-ref');
              if (ref) ref.classList.add('incorrecta');
            }
          }`
  },
  // 7. Porcentajes Incorrect
  {
    search: `          } else {
            this.classList.add('incorrecta'); comboActual = 0; reproducirSonido('error');
            erroresPorTema["Conversión Porcentaje"] = (erroresPorTema["Conversión Porcentaje"] || 0) + 1;
          }`,
    replace: `          } else {
            if (!window.intentarUsarEscudo()) {
              this.classList.add('incorrecta'); comboActual = 0; reproducirSonido('error');
              erroresPorTema["Conversión Porcentaje"] = (erroresPorTema["Conversión Porcentaje"] || 0) + 1;
            }
          }`
  },
  // 8. Ascensor Timeout
  {
    search: `      iniciarCronometro(TIEMPO_POR_EJERCICIO, () => {
         comboActual = 0; mostrarMensaje('¡Tiempo agotado!', 'error');
         ejActual++; 
         if(ejActual < ejercicios.length) renderizarEjercicio();
         else mostrarPantallaFinal(contenedor, 'ascensor_extremo', curso, puntaje, aciertos, ejActual, erroresPorTema);
      });`,
    replace: `      iniciarCronometro(TIEMPO_POR_EJERCICIO, () => {
         if (!window.intentarUsarEscudo()) {
           comboActual = 0; mostrarMensaje('¡Tiempo agotado!', 'error');
         }
         ejActual++; 
         if(ejActual < ejercicios.length) renderizarEjercicio();
         else mostrarPantallaFinal(contenedor, 'ascensor_extremo', curso, puntaje, aciertos, ejActual, erroresPorTema);
      });`
  },
  // 9. Ascensor Incorrect
  {
    search: `        } else {
          reproducirSonido('error');
          comboActual = 0;
          mostrarMensaje('¡Piso equivocado!', 'error');
          erroresPorTema["Suma de Enteros"] = (erroresPorTema["Suma de Enteros"] || 0) + 1;
        }`,
    replace: `        } else {
          if (!window.intentarUsarEscudo()) {
            reproducirSonido('error');
            comboActual = 0;
            mostrarMensaje('¡Piso equivocado!', 'error');
            erroresPorTema["Suma de Enteros"] = (erroresPorTema["Suma de Enteros"] || 0) + 1;
          }
        }`
  },
  // 10. Combinados Process Error
  {
    search: `      function procesarError(msg) {
        reproducirSonido('error');
        comboActual = 0;
        mostrarMensaje(msg, 'error');
        erroresPorTema[ej.tipo === 'raiz' ? 'Radicación' : (ej.tipo === 'potencia' ? 'Potenciación' : 'Regla de Signos')] = (erroresPorTema[ej.tipo] || 0) + 1;
        actProgreso(false);
      }`,
    replace: `      function procesarError(msg) {
        if (!window.intentarUsarEscudo()) {
          reproducirSonido('error');
          comboActual = 0;
          mostrarMensaje(msg, 'error');
          erroresPorTema[ej.tipo === 'raiz' ? 'Radicación' : (ej.tipo === 'potencia' ? 'Potenciación' : 'Regla de Signos')] = (erroresPorTema[ej.tipo] || 0) + 1;
        }
        actProgreso(false);
      }`
  },
  // 11. Combinados Incorrect Result
  {
    search: `        } else {
          comboActual = 0;
          puntaje = Math.max(0, puntaje - 5);
          reproducirSonido('error');
          mostrarMensaje('Incorrecto. La respuesta era: ' + ej.respuesta, 'error');
          erroresPorTema[esModuloFracciones ? 'Fracciones Combinadas' : 'Enteros Combinados'] = (erroresPorTema[esModuloFracciones ? 'Fracciones Combinadas' : 'Enteros Combinados'] || 0) + 1;
        }`,
    replace: `        } else {
          if (!window.intentarUsarEscudo()) {
            comboActual = 0;
            puntaje = Math.max(0, puntaje - 5);
            reproducirSonido('error');
            mostrarMensaje('Incorrecto. La respuesta era: ' + ej.respuesta, 'error');
            erroresPorTema[esModuloFracciones ? 'Fracciones Combinadas' : 'Enteros Combinados'] = (erroresPorTema[esModuloFracciones ? 'Fracciones Combinadas' : 'Enteros Combinados'] || 0) + 1;
          }
        }`
  }
];

let changed = 0;
replacements.forEach(r => {
  if (content.includes(r.search)) {
    content = content.replace(r.search, r.replace);
    changed++;
  } else {
    // try to normalize line endings
    const searchNormalized = r.search.replace(/\r\n/g, '\n');
    const contentNormalized = content.replace(/\r\n/g, '\n');
    if (contentNormalized.includes(searchNormalized)) {
      content = contentNormalized.replace(searchNormalized, r.replace.replace(/\r\n/g, '\n'));
      changed++;
    } else {
      console.log('Could not find:', r.search.substring(0, 50));
    }
  }
});

fs.writeFileSync('./js/game.js', content, 'utf8');
console.log('Replaced ' + changed + ' occurrences.');
