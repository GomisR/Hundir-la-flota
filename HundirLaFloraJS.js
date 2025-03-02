/*
IDEA DE JUEGO: 
Turno rojo:
Al inicio el jugador rojo selecciona cada celda (en cada celda un boton) y guardamos la posicion de ese boton/celda en un array barcosRojos
Cuando termine de colocar todos los barcos iniciamos el juego (cambio de funcion) clickando el boton de inicio
Extras: 
El orden de los barcos lo damos establecidos ya-> PRIMERO: 3 barcos de dos posiciones, SEGUNDO: 2 barcos de 3 posiciones y TERCERO: 1 barco de 4 posiciones.
Si el boton ya ha sido seleccionado deshabilitar ese boton y pintar el fondo de rojo
¿Como hacemos para que al seleccionar una celda solo pueda pinchar en las adiacentes ? 

Turno amarillo:
Selecciona una celda y activamos funcion comprobarCelda() comprobamos el array barcosRojos y si coincide la posicion pintamos de amarillo sino pintamos de azul y si destrulle el barco pintamos en rojo todas las celdas
Por cada click añadimos al contador 
*/

/*
Mensajes de cantidad de barcos que quedan por poner/hundir(dependiendo de si faseColocacion = true o = false)
(Turno rojo) Metodo para detectar cuando termia de colocar el barco colocarBarco() (El orden lo establecemos nosotros) utilizando el mensaje anterior indicamos que tipo de barco va a colocar
(Turno amarillo) Metodo para detectar si el barco está hundido o tocado comprobarCelda() (hundido todos de color rojo, tocado de color naranja)
*/

document.addEventListener('DOMContentLoaded', function() {
    const tablero = document.getElementById('tablero');
    let botonIniciar = document.getElementById('cambioTurno');
    let botonReset = document.getElementById('reset');
    let faseColocacion = true;
    let barcosRojos = [];
    let contadorAmarillo = 0;
    let barcosPendientes = [2, 2, 2, 3, 3, 4];
    let contadorBarcos = 0;
    let barcoActual = [];
    let colocandoBarco = false;


    //Deshabilitamos desde el principio el boton
    botonIniciar.disabled = true;

    //Creamos el tablero

    
    for (let fila = 0; fila < 10; fila++) {
        for (let col = 0; col < 10; col++) {
            //Contenedores 
            const celda = document.createElement('div');
            celda.setAttribute("class","celda");
            //celda.textContent = `${fila},${col}`;
            tablero.appendChild(celda);

            //Cada contenedor añdimos un boton
            const boton = document.createElement('button');
            boton.setAttribute("class","boton");
            boton.style.width = "100%";
            boton.style.height = "100%";
            celda.appendChild(boton);

            //Añadimos la posición como atributo posicion
            boton.setAttribute("posicion", `${fila},${col}`);
        }
    }

    //Añadimos el EventListener a todos los botones
    const botones = document.querySelectorAll('.boton');
    botones.forEach(boton => {
        boton.addEventListener('click', function() {
            if (faseColocacion) {
                if(barcosPendientes.length != 0){
                    colocarBarcos(boton);
                }else{
                    botones.disabled;
                }
                
                console.log('Barcos Rojos:', barcosRojos);
            } else {
                comprobarCelda(barcosRojos,boton);
                contadorAmarillo++;
                actualizarContador();  // Actualizamos clicks
            }
        });
    });

    //Iniciar el turno amarillo
    botonIniciar.addEventListener('click', function() {
        faseColocacion = false;
        alert('Amarillo, es tu momento. Hora de acabar con los rojos!');

        // Restauramos el estado de los botones
        const botones = document.querySelectorAll('.boton');
        botones.forEach(boton => {
            boton.disabled = false; // Reactivamos el botón
            boton.style.backgroundColor = ''; // Restablecemos el color de fondo
        });
    });

    function colocarBarcos(boton) {
        const posicion = boton.getAttribute('posicion');
        if (!colocandoBarco) {
            //Inicio del barco
            barcoActual = [posicion];
            colocandoBarco = true;
            boton.style.backgroundColor = 'red';
            boton.disabled = true;
            actualizarMensaje(`Coloca el resto del barco en celdas adyacentes (${barcosPendientes[0]} espacios en total).`);
        } else {
            //Comprobamos si es adyacente
            const ultimaPos = barcoActual[barcoActual.length - 1];
            if (esAdyacente(ultimaPos, posicion)) {
                barcoActual.push(posicion);
                boton.style.backgroundColor = 'red';
                boton.disabled = true;
            } else {
                alert('Solo puedes colocar el barco en una celda adyacente.');
                return;
            }
        }

        if (barcoActual.length === barcosPendientes[0]) {
            barcosRojos.push([...barcoActual]);
            barcosPendientes.shift();
            barcoActual = [];
            colocandoBarco = false;

            if (barcosPendientes.length === 0) {
                actualizarMensaje("Ha colocado todos los barcos hora de esconderse.");
                botonIniciar.disabled = false; //Habilitar cambio de turno
            } else {
                actualizarMensaje(`Coloca un barco de ${barcosPendientes[0]} casillas.`);
            }
        }
    }
 
    //Reiniciar el juego
    botonReset.addEventListener('click', function(){
        faseColocacion = true;
        contadorBarcos = 0;
        barcosRojos = [];
        contadorAmarillo = 0;
        barcosPendientes = [2, 2, 2, 3, 3, 4];
        barcoActual = [];
        colocandoBarco = false;
        botones.forEach(boton => {
            boton.disabled = false; // Reactivamos el botón
            boton.style.backgroundColor = ''; // Restablecemos el color de fondo
        })
        contadorAmarillo = 0;
        actualizarContador();
        actualizarMensaje(`Coloca un barco de ${barcosPendientes[0]} casillas.`);
    });

    function esAdyacente(pos1, pos2) {
        const [fila1, col1] = pos1.split(',').map(Number);
        const [fila2, col2] = pos2.split(',').map(Number);

        return (Math.abs(fila1 - fila2) === 1 && col1 === col2) || 
            (Math.abs(col1 - col2) === 1 && fila1 === fila2);
    }


    //Comprobar si en esa posicion hay barco
    function comprobarCelda(barcosRojos, boton) {
        const posicion = boton.getAttribute('posicion');
        let tocado = false;
        let barcoImpactado = null;

        // Verificar si la posición impactada pertenece a algún barco
        for (let barco of barcosRojos) {
            if (barco.includes(posicion)) {
                tocado = true;
                barcoImpactado = barco;
                break;
            }
        }

        if (tocado) {
            // Marcamos la celda impactada
            boton.style.backgroundColor = 'orange';
            boton.disabled = true;

            // Comprobamos si todas las celdas del barco han sido tocadas
            let hundido = true;
            for (let pos of barcoImpactado) {
                const botonCorrespondiente = document.querySelector(`button[posicion='${pos}']`);
                if (botonCorrespondiente.style.backgroundColor !== 'orange' && botonCorrespondiente.style.backgroundColor !== 'red') {
                    hundido = false;
                    break;
                }
            }

            if (hundido) {
                // Barco hundido, lo marcamos en rojo
                barcoImpactado.forEach(pos => {
                    const botonClicado = document.querySelector(`button[posicion='${pos}']`);
                    botonClicado.style.backgroundColor = 'red';
                    botonClicado.disabled = true;
                });
                actualizarMensaje("¡Has hundido un barco!");
                contadorBarcos++;
                comprobarGanador();
            } else {
                actualizarMensaje("¡Barco tocado!");
            }
        } else {
            boton.style.backgroundColor = 'blue';
            actualizarMensaje("Le diste al agua... Intenta de nuevo.");
        }

        // Deshabilitar el botón después del disparo
        boton.disabled = true;
    }


    //Sacar mensajes por pantalla para informar al usuario
    function actualizarMensaje(mensaje) {
        document.getElementById('mensajes').innerText = mensaje;
    }

    function actualizarContador() {
        const contador = document.getElementById('contador');
        contador.innerHTML = `<p>Número de clicks: ${contadorAmarillo}</p>`;
    }
    function comprobarGanador() {
        console.log(contadorBarcos);
        console.log("Longitud barcos: "+barcosRojos.length);
        // Comprobar si hay un ganador (todos los barcos hundidos)
        if (contadorBarcos == barcosRojos.length) {
            alert("¡Felicidades! Has hundido todos los barcos. ¡Eres el ganador!");
    
        } else {
            const barcosRestantes = barcosRojos.length - contadorBarcos;
            actualizarMensaje(`Quedan ${barcosRestantes} barcos por hundir.`);
        }
    }
});


    //Comprobar si en esa posicion hay barco
    function comprobarCelda(barcosRojos, boton) {
        const posicion = boton.getAttribute('posicion');
        let tocado = false;
        let barcoImpactado = null;

        // Verificar si la posición impactada pertenece a algún barco
        for (let barco of barcosRojos) {
            if (barco.includes(posicion)) {
                tocado = true;
                barcoImpactado = barco;
                break;
            }
        }

        if (tocado) {
            // Marcamos la celda impactada
            boton.style.backgroundColor = 'orange';
            boton.disabled = true;

            // Comprobamos si todas las celdas del barco han sido tocadas
            let hundido = true;
            for (let pos of barcoImpactado) {
                const botonCorrespondiente = document.querySelector(`button[posicion='${pos}']`);
                if (botonCorrespondiente.style.backgroundColor !== 'orange' && botonCorrespondiente.style.backgroundColor !== 'red') {
                    hundido = false;
                    break;
                }
            }

            if (hundido) {
                // Barco hundido, lo marcamos en rojo
                barcoImpactado.forEach(pos => {
                    const botonClicado = document.querySelector(`button[posicion='${pos}']`);
                    botonClicado.style.backgroundColor = 'red';
                    botonClicado.disabled = true;
                });
                actualizarMensaje("¡Has hundido un barco!");
                contadorBarcos++;
                comprobarGanador();
            } else {
                actualizarMensaje("¡Barco tocado!");
            }
        } else {
            boton.style.backgroundColor = 'blue';
            actualizarMensaje("Le diste al agua... Intenta de nuevo.");
        }

        // Deshabilitar el botón después del disparo
        boton.disabled = true;
    }


    //Sacar mensajes por pantalla para informar al usuario
    function actualizarMensaje(mensaje) {
        document.getElementById('mensajes').innerText = mensaje;
    }

    function actualizarContador() {
        const contador = document.getElementById('contador');
        contador.innerHTML = `<p>Número de clicks: ${contadorAmarillo}</p>`;
    }
    function comprobarGanador() {
        console.log(contadorBarcos);
        console.log("Longitud barcos: "+barcosRojos.length);
        // Comprobar si hay un ganador (todos los barcos hundidos)
        if (contadorBarcos == barcosRojos.length) {
            alert("¡Felicidades! Has hundido todos los barcos. ¡Eres el ganador!");
    
        } else {
            const barcosRestantes = barcosRojos.length - contadorBarcos;
            actualizarMensaje(`Quedan ${barcosRestantes} barcos por hundir.`);
        }
    }
});

