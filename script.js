// script.js — controlador de pads + reproductor con prev/next

const beats = [
    { name: "Caos", file: "beats/caos.mp3" },
    { name: "Castlevania", file: "beats/castlevania.mp3" },
    { name: "Cibersht", file: "beats/cibersht.mp3" },
    { name: "El Bonito", file: "beats/elbonito.mp3" },
    { name: "Guitarra Mal Grabada", file: "beats/guitarramalgrabada.mp3" },
    { name: "Malvadote", file: "beats/malvadote.mp3" },
    { name: "Nubes", file: "beats/nubes.mp3" },
    { name: "Rare", file: "beats/rare.mp3" },
    { name: "Reppin", file: "beats/reppin.mp3" },
    { name: "Terror", file: "beats/terror.mp3" },
    { name: "Tranquilon", file: "beats/tranquilon.mp3" },
    { name: "Transmision", file: "beats/transmision.mp3" },
    { name: "TRP Guitarron", file: "beats/trpguitarron.mp3" },
    { name: "TRP SHT Guitar", file: "beats/trpshtguitar.mp3" },
    { name: "Yerbon", file: "beats/yerbon.mp3" }
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
    col.classList.add('col-6', 'col-md-3');

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

    const playPromise = player.play();
    if (playPromise !== undefined) {
        playPromise.catch(() => { /* autoplay bloqueado */ });
    }

    updateCurrentBeatUI();
}

// Actualiza UI
function updateCurrentBeatUI() {
    currentBeat.textContent = `Reproduciendo: ${beats[currentIndex].name}`;

    document.querySelectorAll('.beat-pad').forEach(p => p.classList.remove('active-pad'));
    const activePad = document.querySelector(`.beat-pad[data-index="${currentIndex}"]`);
    if (activePad) activePad.classList.add('active-pad');
}

// Prev / Next
function nextTrack() {
    currentIndex++;
    if (currentIndex >= beats.length) currentIndex = 0;
    playTrackAt(currentIndex);
}

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

// Atajos de teclado
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextTrack();
    if (e.key === 'ArrowLeft') prevTrack();
    if (e.key === ' ' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        player.paused ? player.play() : player.pause();
    }
});

// Al terminar pista
player.addEventListener('ended', nextTrack);

// Actualizar UI si usan controles directos
player.addEventListener('play', updateCurrentBeatUI);

// Inicial
player.src = beats[0].file;
updateCurrentBeatUI();
