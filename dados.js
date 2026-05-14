const DATA = {
  suave: {
    acciones: [
      { e: '💋', t: 'Besa' },
      { e: '🤗', t: 'Abraza' },
      { e: '🤲', t: 'Masajea' },
      { e: '✋', t: 'Acaricia' },
      { e: '😘', t: 'Da un beso en' },
      { e: '🫦', t: 'Muerde suave' },
    ],
    zonas: [
      { e: '👋', t: 'la mano' },
      { e: '🦷', t: 'el cuello' },
      { e: '👂', t: 'la oreja' },
      { e: '💆', t: 'la cabeza' },
      { e: '🦵', t: 'la rodilla' },
      { e: '😊', t: 'la mejilla' },
    ],
  },
  travieso: {
    acciones: [
      { e: '💋', t: 'Besa apasionado' },
      { e: '👅', t: 'Lame' },
      { e: '🔥', t: 'Toca lento' },
      { e: '🤲', t: 'Masajea profundo' },
      { e: '😏', t: 'Susurra al oído' },
      { e: '🫦', t: 'Muerde' },
    ],
    zonas: [
      { e: '🦋', t: 'el pecho' },
      { e: '🍑', t: 'la cintura' },
      { e: '🦵', t: 'el muslo' },
      { e: '👂', t: 'el oído' },
      { e: '💫', t: 'el cuello' },
      { e: '✨', t: 'la espalda baja' },
    ],
  },
  hot: {
    acciones: [
      { e: '🔥', t: 'Lame apasionado' },
      { e: '💋', t: 'Besa sin parar' },
      { e: '👅', t: 'Usa la lengua' },
      { e: '🫦', t: 'Muerde suave' },
      { e: '🤲', t: 'Explora con las manos' },
      { e: '😈', t: 'Haz lo que quieras' },
    ],
    zonas: [
      { e: '💋', t: 'los labios' },
      { e: '🔥', t: 'el pecho' },
      { e: '✨', t: 'el abdomen' },
      { e: '💫', t: 'el muslo interior' },
      { e: '🌶️', t: 'donde más le guste' },
      { e: '🎯', t: 'su zona prohibida' },
    ],
  },
  custom: { acciones: [], zonas: [] },
};

let currentLevel = 'suave';
let timerSec = 30;
let timerInterval = null;
let timerRemaining = 0;

const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0;
let my = 0;
let rx = 0;
let ry = 0;

document.addEventListener('mousemove', (event) => {
  mx = event.clientX;
  my = event.clientY;
  cursor.style.left = `${mx - 5}px`;
  cursor.style.top = `${my - 5}px`;
});

(function animateCursorRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = `${rx - 18}px`;
  ring.style.top = `${ry - 18}px`;
  requestAnimationFrame(animateCursorRing);
})();

const rollBtn = document.getElementById('rollBtn');
const customBtn = document.getElementById('customBtn');
const modal = document.getElementById('customModal');
const modalClose = document.getElementById('modalClose');
const modalCancel = document.getElementById('modalCancel');
const modalSave = document.getElementById('modalSave');
const tabButtons = document.querySelectorAll('.tab-btn');
const addAccion = document.getElementById('addAccion');
const addZona = document.getElementById('addZona');
const inputAccion = document.getElementById('inputAccion');
const inputZona = document.getElementById('inputZona');
const listAcciones = document.getElementById('listAcciones');
const listZonas = document.getElementById('listZonas');
const timerPresets = document.querySelectorAll('.timer-preset');
const intensityButtons = document.querySelectorAll('.intensity-btn');
const resultCard = document.getElementById('resultCard');
const resAccion = document.getElementById('resAccion');
const resZona = document.getElementById('resZona');
const resTimer = document.getElementById('resTimer');
const timerDisplay = document.getElementById('timerDisplay');
const timerFill = document.getElementById('timerFill');

function initializePage() {
  intensityButtons.forEach((button) => {
    button.addEventListener('click', () => {
      intensityButtons.forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      currentLevel = button.dataset.level;
      resetDice();
    });
  });

  timerPresets.forEach((button) => {
    button.addEventListener('click', () => {
      timerPresets.forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      timerSec = Number(button.dataset.sec);
      stopTimer();
    });
  });

  rollBtn.addEventListener('click', roll);
  customBtn.addEventListener('click', () => {
    modal.classList.add('open');
    renderCustomLists();
  });
  modalClose.addEventListener('click', () => modal.classList.remove('open'));
  modalCancel.addEventListener('click', () => modal.classList.remove('open'));
  modalSave.addEventListener('click', () => modal.classList.remove('open'));

  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      tabButtons.forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      document.getElementById('tabAcciones').style.display = button.dataset.tab === 'acciones' ? 'block' : 'none';
      document.getElementById('tabZonas').style.display = button.dataset.tab === 'zonas' ? 'block' : 'none';
    });
  });

  addAccion.addEventListener('click', () => {
    const value = inputAccion.value.trim();
    if (!value) return;
    DATA.custom.acciones.push({ e: '✨', t: value });
    inputAccion.value = '';
    renderCustomLists();
  });

  addZona.addEventListener('click', () => {
    const value = inputZona.value.trim();
    if (!value) return;
    DATA.custom.zonas.push({ e: '✨', t: value });
    inputZona.value = '';
    renderCustomLists();
  });

  modal.addEventListener('click', (event) => {
    if (event.target === modal) modal.classList.remove('open');
  });
}

function roll() {
  const data = DATA[currentLevel];
  if (!data || !data.acciones.length || !data.zonas.length) {
    alert(currentLevel === 'custom' ? 'Agrega al menos una acción y una zona personalizada primero.' : 'Sin datos disponibles.');
    return;
  }

  const action = data.acciones[Math.floor(Math.random() * data.acciones.length)];
  const zone = data.zonas[Math.floor(Math.random() * data.zonas.length)];

  const dieAccion = document.getElementById('dieAccion');
  const dieZona = document.getElementById('dieZona');
  dieAccion.classList.add('rolling');
  dieZona.classList.add('rolling');
  setTimeout(() => {
    dieAccion.classList.remove('rolling');
    dieZona.classList.remove('rolling');
  }, 520);

  let count = 0;
  const source = data;
  const roller = setInterval(() => {
    const randomAction = source.acciones[Math.floor(Math.random() * source.acciones.length)];
    const randomZone = source.zonas[Math.floor(Math.random() * source.zonas.length)];
    document.getElementById('dieAccionEmoji').textContent = randomAction.e;
    document.getElementById('dieAccionText').textContent = randomAction.t;
    document.getElementById('dieZonaEmoji').textContent = randomZone.e;
    document.getElementById('dieZonaText').textContent = randomZone.t;
    count += 1;
    if (count >= 8) {
      clearInterval(roller);
      document.getElementById('dieAccionEmoji').textContent = action.e;
      document.getElementById('dieAccionText').textContent = action.t;
      document.getElementById('dieZonaEmoji').textContent = zone.e;
      document.getElementById('dieZonaText').textContent = zone.t;
      showResult(action, zone);
    }
  }, 60);
}

function showResult(action, zone) {
  resAccion.textContent = `${action.e} ${action.t}`;
  resZona.textContent = `${zone.e} ${zone.t}`;
  resultCard.classList.add('show');
  if (timerSec > 0) {
    resTimer.style.display = 'block';
    startTimer(timerSec);
  } else {
    resTimer.style.display = 'none';
  }
}

function resetDice() {
  document.getElementById('dieAccionEmoji').textContent = '🎲';
  document.getElementById('dieAccionText').textContent = 'Tira';
  document.getElementById('dieZonaEmoji').textContent = '🎲';
  document.getElementById('dieZonaText').textContent = 'los dados';
  resultCard.classList.remove('show');
  stopTimer();
}

function startTimer(seconds) {
  stopTimer();
  timerRemaining = seconds;
  updateTimerDisplay(timerRemaining, seconds);
  timerInterval = setInterval(() => {
    timerRemaining -= 1;
    updateTimerDisplay(timerRemaining, seconds);
    if (timerRemaining <= 0) {
      stopTimer();
      timerDisplay.textContent = '¡Tiempo!';
    }
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function updateTimerDisplay(remaining, total) {
  const minutes = Math.floor(remaining / 60).toString().padStart(2, '0');
  const seconds = (remaining % 60).toString().padStart(2, '0');
  timerDisplay.textContent = `${minutes}:${seconds}`;
  timerFill.style.width = `${(remaining / total) * 100}%`;
}

function renderCustomLists() {
  listAcciones.innerHTML = DATA.custom.acciones.length
    ? DATA.custom.acciones
        .map((item, index) => `
          <li class="custom-item">
            <span>${item.e} ${item.t}</span>
            <button class="custom-remove" data-index="${index}" data-group="acciones">✕</button>
          </li>
        `)
        .join('')
    : '<li style="padding:10px;color:rgba(250,240,230,0.3);font-size:0.8rem;">Vacío — agrega algo arriba</li>';

  listZonas.innerHTML = DATA.custom.zonas.length
    ? DATA.custom.zonas
        .map((item, index) => `
          <li class="custom-item">
            <span>${item.e} ${item.t}</span>
            <button class="custom-remove" data-index="${index}" data-group="zonas">✕</button>
          </li>
        `)
        .join('')
    : '<li style="padding:10px;color:rgba(250,240,230,0.3);font-size:0.8rem;">Vacío — agrega algo arriba</li>';

  document.querySelectorAll('.custom-remove').forEach((button) => {
    button.addEventListener('click', () => {
      const group = button.dataset.group;
      const index = Number(button.dataset.index);
      DATA.custom[group].splice(index, 1);
      renderCustomLists();
    });
  });
}

initializePage();
renderCustomLists();
