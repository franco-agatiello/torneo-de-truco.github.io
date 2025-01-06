const jugadoresRegistrados = ['Fede', 'Nico', 'Tobi', 'Ernes', 'Santi', 'Caño', 'Colo', 'Mati', 'Jero', 'Vega'];

const participantes = {};
const partidas = [];
const passwordCorrecta = "trucoargento";
let partidaEditando = null; // Variable para rastrear la partida que se está editando
let partidaAEliminar = null; // Variable para rastrear la partida que se está eliminando

function mostrarVista(vista) {
    const vistas = document.querySelectorAll('.vista');
    vistas.forEach(v => v.classList.remove('active'));

    if (vista === 'torneo') {
        document.getElementById('vistaTorneo').classList.add('active');
        actualizarTabla();
    } else if (vista === 'registroPartidas') {
        document.getElementById('vistaRegistroPartidas').classList.add('active');
        actualizarTablaPartidas();
    } else if (vista === 'gestion') {
        document.getElementById('passwordDialog').style.display = 'block';
    } else if (vista === 'reglamento') {
        document.getElementById('vistaReglamento').classList.add('active');
    } else if (vista === 'nuevaPartida') {
        document.getElementById('vistaNuevaPartida').classList.add('active');
    }
}
function verificarPassword() {
    const inputPassword = document.getElementById('passwordInput').value;
    if (inputPassword === passwordCorrecta) {
        document.getElementById('passwordDialog').style.display = 'none';
        document.getElementById('vistaGestion').classList.add('active');
        actualizarListaJugadores();
    } else {
        document.getElementById('passwordError').style.display = 'block';
    }
}

function ocultarDialogo() {
    document.getElementById('passwordDialog').style.display = 'none';
    mostrarVista('torneo'); // Vuelve a la vista principal
}

function verificarPasswordEliminar() {
    const inputPassword = document.getElementById('passwordInputEliminar').value;
    if (inputPassword === passwordCorrecta) {
        document.getElementById('passwordDialogEliminar').style.display = 'none';
        eliminarPartidaConfirmada(partidaAEliminar);
    } else {
        document.getElementById('passwordErrorEliminar').style.display = 'block';
    }
}

function ocultarDialogoEliminar() {
    document.getElementById('passwordDialogEliminar').style.display = 'none';
}

function eliminarPartida(index) {
    partidaAEliminar = index;
    document.getElementById('passwordDialogEliminar').style.display = 'block';
}
function eliminarPartidaConfirmada(index) {
    const partida = partidas[index];
    actualizarEstadisticas(partida.equipo1, partida.puntosEquipo1, partida.puntosEquipo1 > partida.puntosEquipo2, false);
    actualizarEstadisticas(partida.equipo2, partida.puntosEquipo2, partida.puntosEquipo2 > partida.puntosEquipo1, false);
    partidas.splice(index, 1);
    actualizarTabla();
    actualizarTablaPartidas();
}

function actualizarListaJugadores() {
    const listaJugadores = document.getElementById('listaJugadores');
    listaJugadores.innerHTML = '';
    jugadoresRegistrados.forEach(jugador => {
        listaJugadores.innerHTML += `<li>${jugador} <button onclick="eliminarJugador('${jugador}')">Eliminar</button></li>`;
    });
}

function cambiarFormulario() {
    const tipoPartida = document.getElementById('tipoPartida').value;
    const formularioPartida = document.getElementById('formularioPartida');
    formularioPartida.innerHTML = '';

    const crearSelectJugadores = (id) => {
        let options = jugadoresRegistrados.map(jugador => `<option value="${jugador}">${jugador}</option>`).join('');
        return `<select id="${id}">${options}</select>`;
    };

    if (tipoPartida === '2v2') {
        formularioPartida.innerHTML = `
            <div class="jugador-row">
                <h3>Equipo 1</h3>
                ${crearSelectJugadores('jugador1')}
                ${crearSelectJugadores('jugador2')}
            </div>
            <div class="jugador-row">
                <h3>Equipo 2</h3>
                ${crearSelectJugadores('jugador3')}
                ${crearSelectJugadores('jugador4')}
            </div>
            <div class="jugador-row">
                <h3>Puntuación</h3>
                <input type="number" id="puntosEquipo1" placeholder="Puntos Equipo 1">
                <input type="number" id="puntosEquipo2" placeholder="Puntos Equipo 2">
            </div>
        `;
    } else if (tipoPartida === '3v3') {
        formularioPartida.innerHTML = `
            <div class="jugador-row">
                <h3>Equipo 1</h3>
                ${crearSelectJugadores('jugador1')}
                ${crearSelectJugadores('jugador2')}
                ${crearSelectJugadores('jugador3')}
            </div>
            <div class="jugador-row">
                <h3>Equipo 2</h3>
                ${crearSelectJugadores('jugador4')}
                ${crearSelectJugadores('jugador5')}
                ${crearSelectJugadores('jugador6')}
            </div>
            <div class="jugador-row">
                <h3>Puntuación</h3>
                <input type="number" id="puntosEquipo1" placeholder="Puntos Equipo 1">
                <input type="number" id="puntosEquipo2" placeholder="Puntos Equipo 2">
            </div>
        `;
    }
}

function agregarJugador() {
    const nuevoJugador = document.getElementById('nuevoJugador').value.trim();
    if (nuevoJugador && !jugadoresRegistrados.includes(nuevoJugador)) {
        jugadoresRegistrados.push(nuevoJugador);
        actualizarListaJugadores();
        cambiarFormulario();
        document.getElementById('nuevoJugador').value = '';
    } else {
        alert('Por favor, introduce un nombre válido y no duplicado.');
    }
}

function eliminarJugador(jugador) {
    const index = jugadoresRegistrados.indexOf(jugador);
    if (index > -1) {
        jugadoresRegistrados.splice(index, 1);
        actualizarListaJugadores();
        cambiarFormulario();
    }
}

function registrarPartida() {
    const tipoPartida = document.getElementById('tipoPartida').value;
    const lugar = document.getElementById('lugar').value.trim();
    const fecha = document.getElementById('fecha').value;
    const puntosEquipo1 = parseInt(document.getElementById('puntosEquipo1').value);
    const puntosEquipo2 = parseInt(document.getElementById('puntosEquipo2').value);

    if (!lugar || !fecha || isNaN(puntosEquipo1) || isNaN(puntosEquipo2)) {
        alert('Por favor, completa todos los campos correctamente.');
        return;
    }

    const jugadoresEquipo1 = [];
    const jugadoresEquipo2 = [];

    if (tipoPartida === '2v2') {
        for (let i = 1; i <= 2; i++) {
            const jugador = document.getElementById(`jugador${i}`).value;
            if (!jugador) {
                alert('Por favor, completa todos los campos correctamente.');
                return;
            }
            jugadoresEquipo1.push(jugador);
        }
        for (let i = 3; i <= 4; i++) {
            const jugador = document.getElementById(`jugador${i}`).value;
            if (!jugador) {
                alert('Por favor, completa todos los campos correctamente.');
                return;
            }
            jugadoresEquipo2.push(jugador);
        }
    } else if (tipoPartida === '3v3') {
        for (let i = 1; i <= 3; i++) {
            const jugador = document.getElementById(`jugador${i}`).value;
            if (!jugador) {
                alert('Por favor, completa todos los campos correctamente.');
                return;
            }
            jugadoresEquipo1.push(jugador);
        }
        for (let i = 4; i <= 6; i++) {
            const jugador = document.getElementById(`jugador${i}`).value;
            if (!jugador) {
                alert('Por favor, completa todos los campos correctamente.');
                return;
            }
            jugadoresEquipo2.push(jugador);
        }
    }

    // Si estamos editando una partida, eliminamos las estadísticas anteriores
    if (partidaEditando !== null) {
        const partidaAnterior = partidas[partidaEditando];
        actualizarEstadisticas(partidaAnterior.e
