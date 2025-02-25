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
                    this.style.backgroundColor = 'red';
                    this.disabled = true;
                    console.log('Barcos Rojos:', barcosRojos);
                }
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
});

//Gestionar los clicks (por celda) para colocar barcos en su posicion
function colocarBarcos(){

}


//Comprobar si en esa posicion hay barco
function comprobarCelda(){

}
