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
    let botonIniciar = document.getElementById('iniciarJuego');
    let faseColocacion = true;
    let barcosRojos = [];
    let contadorAmarillo = 0;
    

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
                const posicion = this.getAttribute('posicion');
                if (!barcosRojos.includes(posicion)) { 
                    //Añadir al array y marcar la celda
                    barcosRojos.push(posicion);
                    colocarBarcos(2, tablero);
                    this.style.backgroundColor = 'red';
                    this.disabled = true;
                    console.log('Barcos Rojos:', barcosRojos);
                }
            }else{//Estamos en el turno amarillo
                comprobarCelda(barcosRojos,boton);
                contadorAmarillo++;
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
        //Modificamos la informacion amarillo
        const infoAmarillo = document.getElementById("mensajes");

    });
});

function colocarBarcos(longitud, tablero) {
    let seleccionados = []; // Guardará las posiciones del barco en construcción
    let numSeleccion = 3;
    const botones = document.querySelectorAll('.boton');
    
    botones.forEach(boton => {
        boton.addEventListener('click', function colocar(event) {
            if (seleccionados.length === 0) {
                // Si no hay selección previa, cualquier celda es válida
                agregarCelda(this, seleccionados);
            } else {
                // Validamos si la celda es adyacente a la última seleccionada
                const ultima = seleccionados[seleccionados.length - 1];
                const actual = this.getAttribute('posicion');

                if (esAdyacente(ultima, actual)) {
                    agregarCelda(this, seleccionados);
                } else {
                    alert('Debes colocar el barco en una celda adyacente.');
                }
            }

            // Si el barco está completamente colocado, quitamos el evento
            if (seleccionados.length === longitud) {
                barcosRojos.push([...seleccionados]); // Guardamos el barco en el array principal
                seleccionados = []; // Reiniciamos para el siguiente barco

                botones.forEach(boton => boton.removeEventListener('click', colocar));
            }
        });
    });
}

function agregarCelda(boton, seleccionados) {
    const posicion = boton.getAttribute('posicion');
    seleccionados.push(posicion);
    boton.style.backgroundColor = 'red';
    boton.disabled = true;
}

function esAdyacente(pos1, pos2) {
    const [fila1, col1] = pos1.split(',').map(Number);
    const [fila2, col2] = pos2.split(',').map(Number);

    return (Math.abs(fila1 - fila2) === 1 && col1 === col2) || 
           (Math.abs(col1 - col2) === 1 && fila1 === fila2);
}



//Comprobar si en esa posicion hay barco
function comprobarCelda(barcosRojos,boton){
    const posicion = boton.getAttribute('posicion');
    if (barcosRojos.includes(posicion)) { 
        //marcar la celda
        boton.style.backgroundColor = 'orange';
        boton.disabled = true;
    }else{
        boton.style.backgroundColor = 'blue';
        boton.disabled = true;
    }
}
