const elementos = [
    "Hidrógeno", "Helio", "Litio", "Berilio", "Boro", "Carbono", "Nitrógeno", "Oxígeno", "Flúor", "Neón",
    "Sodio", "Magnesio", "Aluminio", "Silicio", "Fósforo", "Azufre", "Cloro", "Argón", "Potasio", "Calcio",
    "Escandio", "Titanio", "Vanadio", "Cromo", "Manganeso", "Hierro", "Cobalto", "Níquel", "Cobre", "Zinc",
    "Galio", "Germanio", "Arsénico", "Selenio", "Bromo", "Kriptón", "Rubidio", "Estroncio", "Itrio", "Zirconio",
    "Niobio", "Molibdeno", "Tecnecio", "Rutenio", "Rodio", "Paladio", "Plata", "Cadmio", "Indio", "Estaño",
    "Antimonio", "Telurio", "Yodo", "Xenón", "Cesio", "Bario", "Lantano", "Cerio", "Praseodimio", "Neodimio",
    "Prometio", "Samario", "Europio", "Gadolinio", "Terbio", "Disprosio", "Holmio", "Erbio", "Tulio", "Iterbio",
    "Lutecio", "Hafnio", "Tantalio", "Wolframio", "Renio", "Osmio", "Iridio", "Platino", "Oro", "Mercurio",
    "Talio", "Plomo", "Bismuto", "Polonio", "Astato", "Radón", "Francio", "Radio", "Actinio", "Torio",
    "Protactinio", "Uranio", "Neptunio", "Plutonio", "Americio", "Curio", "Berkelio", "Californio", "Einsteinio",
    "Fermio", "Mendelevio", "Nobelio", "Laurencio", "Rutherfordio", "Dubnio", "Seaborgio", "Bohrio", "Hassio",
    "Meitnerio", "Darmstatio", "Roentgenio", "Copernicio", "Nihonio", "Flerovio", "Moscovio", "Livermorio"
];

function obtenerElementoAleatorio() {
    const indiceAleatorio = Math.floor(Math.random() * elementos.length);
    return elementos[indiceAleatorio].toUpperCase();
}

let palabraSecreta = obtenerElementoAleatorio();
let intentoActual = "";
let filaActual = 0;
let juegoTerminado = false;
const intentosMaximos = 6;

const grid = document.getElementById("guess-grid");

function crearCasillas() {
    grid.innerHTML = "";
    for (let fila = 0; fila < intentosMaximos; fila++) {
        const filaDiv = document.createElement("div");
        filaDiv.style.display = 'flex';
        filaDiv.style.gap = '0.5rem';

        for (let col = 0; col < palabraSecreta.length; col++) {
            const celda = document.createElement("div");
            celda.classList.add("tile");
            filaDiv.appendChild(celda);
        }

        grid.appendChild(filaDiv);
    }
}

crearCasillas();

const teclado = document.querySelector(".keyboard");
const filasTeclado = ["QWERTYUIOP", "ASDFGHJKLÑ", "ZXCVBNM"];

filasTeclado.forEach(fila => {
    const filaDiv = document.createElement("div");
    filaDiv.classList.add("keyboard-row");

    fila.split("").forEach(tecla => {
        const boton = document.createElement("button");
        boton.textContent = tecla;
        boton.classList.add("tecla");
        boton.addEventListener("click", () => manejarTecla(tecla));
        filaDiv.appendChild(boton);
    });

    teclado.appendChild(filaDiv);
});

const botonEnter = document.createElement("button");
botonEnter.textContent = "✅";
botonEnter.classList.add("tecla", "enter");
botonEnter.addEventListener("click", () => manejarTecla("ENTER"));

const botonBackspace = document.createElement("button");
botonBackspace.textContent = "❌";
botonBackspace.classList.add("tecla", "backspace");
botonBackspace.addEventListener("click", () => manejarTecla("BACKSPACE"));

const filaFinal = document.createElement("div");
filaFinal.classList.add("keyboard-row", "fila-final");
filaFinal.appendChild(botonEnter);
filaFinal.appendChild(botonBackspace);
teclado.appendChild(filaFinal);

document.addEventListener("keydown", (event) => {
    const tecla = event.key.toUpperCase();

    if (/^[A-ZÁÉÍÓÚÑ]$/.test(tecla)) {
        manejarTecla(tecla);
    } else if (event.key === "Backspace") {
        manejarTecla("BACKSPACE");
    } else if (event.key === "Enter") {
        manejarTecla("ENTER");
    }
});

function manejarTecla(tecla) {
    if (juegoTerminado) return;

    if (tecla === "BACKSPACE") {
        borrarLetra();
    } else if (tecla === "ENTER") {
        enviarIntento();
    } else if (intentoActual.length < palabraSecreta.length) {
        agregarLetra(tecla);
    }
}

function agregarLetra(letra) {
    intentoActual += letra;
    const index = intentoActual.length - 1;
    grid.children[filaActual].children[index].textContent = letra;
}

function borrarLetra() {
    if (intentoActual.length > 0) {
        const index = intentoActual.length - 1;
        grid.children[filaActual].children[index].textContent = "";
        intentoActual = intentoActual.slice(0, -1);
    }
}

function eliminarAcentos(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function mostrarModalMensaje(mensaje) {
    let modal = document.getElementById("mensajeModal");
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "mensajeModal";
        modal.className = "modal";
        modal.innerHTML = `
            <div class="modal-content">
                <p id="mensajeTexto"></p>
                <button id="cerrarMensaje">OK</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    document.getElementById("mensajeTexto").textContent = mensaje;
    modal.style.display = "flex";

    document.getElementById("cerrarMensaje").onclick = () => {
        modal.style.display = "none";
    };
}

function enviarIntento() {
    if (intentoActual.length !== palabraSecreta.length) {
        mostrarModalMensaje("La palabra debe tener " + palabraSecreta.length + " letras.");
        return;
    }

    const palabra = palabraSecreta.toUpperCase();
    const filaCeldas = grid.children[filaActual].children;
    const botones = document.querySelectorAll(".keyboard .tecla");

    const frecuenciaLetras = {};
    const palabraSinAcentos = eliminarAcentos(palabra);
    for (const letra of palabraSinAcentos) {
        frecuenciaLetras[letra] = (frecuenciaLetras[letra] || 0) + 1;
    }

    for (let i = 0; i < palabra.length; i++) {
        const letraOriginal = intentoActual[i];
        const letraSinAcento = eliminarAcentos(letraOriginal);
        const letraPalabra = palabra[i];
        const letraPalabraSinAcento = eliminarAcentos(letraPalabra);
        const celda = filaCeldas[i];

        const boton = [...botones].find(b => eliminarAcentos(b.textContent) === letraSinAcento);

        if (letraSinAcento === letraPalabraSinAcento) {
            celda.style.backgroundColor = "#538d4e";
            celda.classList.add("correct");
            if (boton?.classList.contains("present")) {
                boton.classList.remove("present");
            }
            boton?.classList.add("correct");
            frecuenciaLetras[letraSinAcento]--;
        }
    }

    for (let i = 0; i < palabra.length; i++) {
        const letraOriginal = intentoActual[i];
        const letraSinAcento = eliminarAcentos(letraOriginal);
        const celda = filaCeldas[i];
        if (celda.classList.contains("correct")) continue;

        const boton = [...botones].find(b => eliminarAcentos(b.textContent) === letraSinAcento);

        if (palabraSinAcentos.includes(letraSinAcento) && frecuenciaLetras[letraSinAcento] > 0) {
            celda.style.backgroundColor = "#b59f3b";
            celda.classList.add("present");
            if (!boton?.classList.contains("correct")) {
                boton?.classList.add("present");
            }
            frecuenciaLetras[letraSinAcento]--;
        } else {
            celda.style.backgroundColor = "#3a3a3c";
            celda.classList.add("absent");
            if (!boton?.classList.contains("correct") && !boton?.classList.contains("present")) {
                boton?.classList.add("absent");
            }
        }
    }

    const intentoSinAcentos = eliminarAcentos(intentoActual);
    if (intentoSinAcentos === palabraSinAcentos) {
        juegoTerminado = true;
        setTimeout(() => {
            mostrarModalMensaje("¡Ganaste! La palabra era " + palabraSecreta);
            reiniciarJuego();
        }, 500);
    } else {
        if (filaActual === intentosMaximos - 1) {
            juegoTerminado = true;
            setTimeout(() => {
                mostrarModalMensaje("¡Perdiste! La palabra era " + palabraSecreta);
                reiniciarJuego();
            }, 500);
        } else {
            intentoActual = "";
            filaActual++;
        }
    }
}

function reiniciarJuego() {
    intentoActual = "";
    filaActual = 0;
    palabraSecreta = obtenerElementoAleatorio();
    crearCasillas();
    juegoTerminado = false;
    document.querySelectorAll(".keyboard button").forEach(boton => {
        boton.classList.remove("correct", "present", "absent");
    });
}

// Mostrar modal de instrucciones al cargar
window.addEventListener("load", () => {
    const modal = document.getElementById("instruccionesModal");
    const cerrarBtn = document.getElementById("cerrarModal");
    modal.style.display = "flex";

    cerrarBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });
});
