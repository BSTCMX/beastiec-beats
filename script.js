// script.js — controlador de pads + reproductor con prev/next

const beats = [
    { name: "caos", file: "beats/caos.mp3" },
    { name: "castlevania", file: "beats/castlevania.mp3" },
    { name: "cibersht", file: "beats/cibersht.mp3" },
    { name: "elbonito", file: "beats/elbonito.mp3" },
    { name: "guitarramalgrabada", file: "beats/guitarramalgrabada.mp3" },
    { name: "malvadote", file: "beats/malvadote.mp3" },
    { name: "nubes", file: "beats/nubes.mp3" },
    { name: "rare", file: "beats/rare.mp3" },
    { name: "reppin", file: "beats/reppin.mp3" },
    { name: "terror", file: "beats/terror.mp3" },
    { name: "tranquilón", file: "beats/tranquilón.mp3" },
    { name: "transmisión", file: "beats/transmisión.mp3" },
    { name: "trp guitarrón", file: "beats/trp guitarrón.mp3" },
    { name: "trp sht guitar", file: "beats/trp sht guitar.mp3" },
    { name: "yerbón", file: "beats/yerbón.mp3" }
];

const beatsContainer = document.getElementById('beats-container');
const player = document.getElementById('player');
const currentBeat = document.getElementById('current-beat');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

let currentIndex = 0;

// Crear pads de beats
beats.forEach((beat, index) => {
    const col = document.createElement('div');
    col.classList.add('col-6', 'col-md-3'); // responsive: 2 por fila en móvil, 4 en desktop

    const pad = document.createElement('div');
    pad.classList.add('beat-pad');
    pad.setAttribute('role', 'button');
    pad.setAttribute('tabindex', '0');
    pad.dataset.index = index;

    const title = document.createElement('div');
    title.classList.add('beat-title');
    title.textContent = beat.name;

    pad.appendChild(title);
    col.appendChild(pad);
    beatsContainer.appendChild(col);

    // Click y tecla Enter para activar
    pad.addEventListener('click', () => {
        if (currentIndex === index && !player.paused) {
            player.pause();
        } else {
            playTrackAt(index);
        }
    });
    pad.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            pad.click();
        }
    });
});

// Reproducir un track por índice
function playTrackAt(index) {
    if (index < 0) index = beats.length - 1;
    if (index >= beats.length) index = 0;
    currentIndex = index;
    player.src = beats[currentIndex].file;

    // Intenta reproducir (si el navegador no lo permite, queda en pausa hasta interacción)
    const playPromise = player.play();
    if (playPromise !== undefined) {
        playPromise.catch(() => {
            // autoplay bloqueado: no pasa nada, usuario debe dar play manualmente
        });
    }

    updateCurrentBeatUI();
}

// Actualiza texto y resaltado del pad activo
function updateCurrentBeatUI() {
    currentBeat.textContent = `Reproduciendo: ${beats[currentIndex].name}`;

    // marcar active pad
    document.querySelectorAll('.beat-pad').forEach((p) => {
        p.classList.remove('active-pad');
    });
    const activePad = document.querySelector(`.beat-pad[data-index="${currentIndex}"]`);
    if (activePad) activePad.classList.add('active-pad');
}

// Siguiente pista
function nextTrack() {
    currentIndex++;
    if (currentIndex >= beats.length) currentIndex = 0;
    playTrackAt(currentIndex);
}

// Anterior pista: clásico behavior
function prevTrack() {
    if (player.currentTime > 2) {
        player.currentTime = 0;
        player.play();
    } else {
        currentIndex--;
        if (currentIndex < 0) currentIndex = beats.length - 1;
        playTrackAt(currentIndex);
    }
}

// Botones prev/next
if (prevBtn) prevBtn.addEventListener('click', prevTrack);
if (nextBtn) nextBtn.addEventListener('click', nextTrack);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextTrack();
    if (e.key === 'ArrowLeft') prevTrack();
    if (e.key === ' ' && document.activeElement.tagName !== 'INPUT') {
        // espacio pausa/reproduce
        e.preventDefault();
        if (player.paused) player.play();
        else player.pause();
    }
});

// Al terminar pista, ir a la siguiente
player.addEventListener('ended', () => {
    nextTrack();
});

// Si el usuario usa los controles del audio directamente (play/pause), actualizar la UI
player.addEventListener('play', () => {
    updateCurrentBeatUI();
});
player.addEventListener('pause', () => {
    // no quitar el highlight, sólo actualizar texto si quieres
});

// Inicial: preparar src (no forzar autoplay)
player.src = beats[0].file;
updateCurrentBeatUI();
