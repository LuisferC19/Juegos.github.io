const SEGMENTS = {
  suave: [
    { label: 'Beso suave', color: '#C0392B', reto: 'Besa suavemente a tu pareja en los labios por 5 segundos' },
    { label: 'Abrazo', color: '#96281B', reto: 'Abrázate fuerte con tu pareja por 30 segundos' },
    { label: 'Masaje', color: '#D4A853', reto: 'Masajea los hombros de tu pareja por 1 minuto' },
    { label: 'Caricia', color: '#C0392B', reto: 'Acaricia el rostro de tu pareja suavemente' },
    { label: 'Susurro', color: '#3D1515', reto: 'Susurra algo bonito al oído de tu pareja' },
    { label: 'Mirada', color: '#96281B', reto: 'Mírense a los ojos durante 30 segundos sin reír' },
    { label: 'Beso cuello', color: '#D4A853', reto: 'Da tres besos suaves en el cuello' },
    { label: 'Mano', color: '#C0392B', reto: 'Toma la mano de tu pareja y dile algo bonito' },
  ],
  travieso: [
    { label: 'Beso largo', color: '#C0392B', reto: 'Beso apasionado de 20 segundos sin parar' },
    { label: 'Muslos', color: '#96281B', reto: 'Masajea los muslos de tu pareja durante 1 minuto' },
    { label: 'Oído', color: '#D4A853', reto: 'Susurra algo atrevido al oído y reacciona' },
    { label: 'Espalda', color: '#C0392B', reto: 'Recorre la espalda de tu pareja con los dedos' },
    { label: 'Mordida', color: '#3D1515', reto: 'Muerde suavemente el cuello de tu pareja' },
    { label: 'Cintura', color: '#96281B', reto: 'Toca y acaricia la cintura por 30 segundos' },
    { label: 'Reto abierto', color: '#D4A853', reto: 'Tu pareja elige dónde y cómo tocarte por 1 minuto' },
    { label: 'Fantasía', color: '#C0392B', reto: 'Cuenta una fantasía que nunca has dicho' },
  ],
  hot: [
    { label: '🔥 Sin límites', color: '#C0392B', reto: 'Haz lo que más le gusta a tu pareja durante 1 minuto' },
    { label: 'Zona prohibida', color: '#96281B', reto: 'Explora la zona más sensible de tu pareja' },
    { label: 'Con la lengua', color: '#D4A853', reto: 'Usa la lengua en donde tu pareja elija' },
    { label: 'Desnudo/a', color: '#C0392B', reto: 'Quita una prenda a tu pareja muy lentamente' },
    { label: 'Dominio', color: '#3D1515', reto: 'Tu pareja te dice exactamente qué hacer por 2 minutos' },
    { label: 'Beso profundo', color: '#96281B', reto: 'El beso más intenso posible, 30 segundos' },
    { label: 'Sorpresa', color: '#D4A853', reto: 'Haz algo que sabes que le encanta, sin avisar' },
    { label: 'Todo', color: '#C0392B', reto: 'Cada quien elige un lugar del cuerpo del otro para explorar' },
  ],
  custom: [],
};

let currentLevel = 'suave';
let timerSec = 30;
let timerInterval = null;
let isSpinning = false;
let currentAngle = 0;

const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const W = canvas.width;
const H = canvas.height;
const R = W / 2;

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

const spinBtn = document.getElementById('spinBtn');
const spinActionBtn = document.getElementById('spinActionBtn');
const customBtn = document.getElementById('customBtn');
const customModal = document.getElementById('customModal');
const addSegBtn = document.getElementById('addSegBtn');
const customSegList = document.getElementById('customSegList');
const resultCategory = document.getElementById('resultCategory');
const resultMain = document.getElementById('resultMain');
const wheelResult = document.getElementById('wheelResult');
const resultTimer = document.getElementById('resultTimer');
const timerPresets = document.querySelectorAll('.timer-preset');
const intensityButtons = document.querySelectorAll('.intensity-btn');

function getSegments() {
  const current = SEGMENTS[currentLevel];
  return current.length > 0
    ? current
    : [{ label: 'Agrega segmentos', color: '#3D1515', reto: 'Agrega segmentos personalizados primero' }];
}

function drawWheel(angle) {
  const segments = getSegments();
  const arc = (Math.PI * 2) / segments.length;
  ctx.clearRect(0, 0, W, H);

  segments.forEach((segment, index) => {
    const start = angle + index * arc;
    const end = start + arc;

    ctx.beginPath();
    ctx.moveTo(R, R);
    ctx.arc(R, R, R - 4, start, end);
    ctx.closePath();
    ctx.fillStyle = segment.color;
    ctx.fill();

    ctx.strokeStyle = 'rgba(26,10,10,0.6)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.save();
    ctx.translate(R, R);
    ctx.rotate(start + arc / 2);
    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(250,240,230,0.92)';
    ctx.font = `bold ${Math.min(13, 130 / segments.length)}px DM Sans`;
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 4;
    const text = segment.label.length > 12 ? `${segment.label.slice(0, 11)}…` : segment.label;
    ctx.fillText(text, R - 16, 5);
    ctx.restore();
  });

  ctx.beginPath();
  ctx.arc(R, R, 30, 0, Math.PI * 2);
  ctx.fillStyle = '#1A0A0A';
  ctx.fill();
  ctx.strokeStyle = 'rgba(212,168,83,0.3)';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(R, R, R - 2, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(212,168,83,0.2)';
  ctx.lineWidth = 4;
  ctx.stroke();
}

function spin() {
  if (isSpinning) return;
  const segments = getSegments();
  if (!segments.length) return;

  isSpinning = true;
  wheelResult.classList.remove('show');
  stopTimer();

  const totalRotation = Math.PI * 2 * (5 + Math.floor(Math.random() * 5)) + Math.random() * Math.PI * 2;
  const duration = 3500 + Math.random() * 1500;
  const startTime = performance.now();
  const startAngle = currentAngle;

  function easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function updateFrame(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOut(progress);
    currentAngle = startAngle + totalRotation * eased;
    drawWheel(currentAngle);

    if (progress < 1) {
      requestAnimationFrame(updateFrame);
    } else {
      isSpinning = false;
      showResult();
    }
  }

  requestAnimationFrame(updateFrame);
}

function showResult() {
  const segments = getSegments();
  const arc = (Math.PI * 2) / segments.length;
  const normalized = (((-currentAngle - Math.PI / 2) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
  const index = Math.floor(normalized / arc) % segments.length;
  const segment = segments[index];

  resultCategory.textContent = `✦ ${segment.label} ✦`;
  resultMain.textContent = segment.reto;
  wheelResult.classList.add('show');

  if (timerSec > 0) {
    resultTimer.style.display = 'block';
    startTimer(timerSec);
  }
}

function initializeControls() {
  intensityButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (isSpinning) return;
      intensityButtons.forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      currentLevel = button.dataset.level;
      resultTimer.style.display = 'none';
      wheelResult.classList.remove('show');
      drawWheel(currentAngle);
      stopTimer();
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

  spinBtn.addEventListener('click', spin);
  spinActionBtn.addEventListener('click', spin);
  customBtn.addEventListener('click', openCustomModal);
  customModal.addEventListener('click', (event) => {
    if (event.target === customModal) closeCustomModal();
  });
  document.querySelectorAll('.close-modal').forEach((button) => {
    button.addEventListener('click', closeCustomModal);
  });
  addSegBtn.addEventListener('click', addCustomSegment);
}

function addCustomSegment() {
  const input = document.getElementById('newSegInput');
  const value = input.value.trim();
  if (!value) return;
  const colors = ['#C0392B', '#96281B', '#D4A853', '#3D1515'];
  SEGMENTS.custom.push({ label: value, color: colors[SEGMENTS.custom.length % colors.length], reto: value });
  input.value = '';
  renderCustomSegs();
  if (currentLevel === 'custom') drawWheel(currentAngle);
}

function renderCustomSegs() {
  customSegList.innerHTML = SEGMENTS.custom
    .map((segment, index) => `
      <div class="custom-seg-item">
        <span><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${segment.color};margin-right:8px;vertical-align:middle;"></span>${segment.label}</span>
        <button class="remove-seg" data-index="${index}">✕</button>
      </div>
    `)
    .join('');

  const buttons = customSegList.querySelectorAll('.remove-seg');
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const index = Number(button.dataset.index);
      SEGMENTS.custom.splice(index, 1);
      renderCustomSegs();
      if (currentLevel === 'custom') drawWheel(currentAngle);
    });
  });

  if (!SEGMENTS.custom.length) {
    customSegList.innerHTML = '<p style="font-size:0.8rem;color:rgba(250,240,230,0.3);padding:8px;">Vacío — agrega segmentos arriba</p>';
  }
}

function openCustomModal() {
  customModal.classList.add('open');
  renderCustomSegs();
}

function closeCustomModal() {
  customModal.classList.remove('open');
}

function startTimer(seconds) {
  stopTimer();
  let remaining = seconds;
  const display = document.getElementById('timerDisplay');
  const fill = document.getElementById('timerFill');
  if (!display || !fill) return;

  function update() {
    display.textContent = `${Math.floor(remaining / 60).toString().padStart(2, '0')}:${(remaining % 60).toString().padStart(2, '0')}`;
    fill.style.width = `${(remaining / seconds) * 100}%`;
  }

  update();
  timerInterval = setInterval(() => {
    remaining -= 1;
    update();
    if (remaining <= 0) {
      stopTimer();
      display.textContent = '¡Tiempo!';
    }
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

initializeControls();
drawWheel(0);
