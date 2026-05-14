const CARDS = {
  suave: [
    { type: 'reto', icon: '💋', text: 'Dale un beso de 10 segundos en el cuello' },
    { type: 'pregunta', icon: '💬', text: '¿Cuál es tu fantasía más suave?' },
    { type: 'verdad', icon: '🤫', text: 'Di algo que te encanta de mí que nunca has dicho' },
    { type: 'reto', icon: '🤗', text: 'Abrázame fuerte por 30 segundos sin decir nada' },
    { type: 'pregunta', icon: '💬', text: '¿En qué momento te enamoraste más de mí?' },
    { type: 'reto', icon: '✋', text: 'Masajea los hombros de tu pareja por 1 minuto' },
    { type: 'verdad', icon: '🤫', text: '¿Cuál es el lugar más loco donde has pensado besarme?' },
    { type: 'reto', icon: '😘', text: 'Susúrrale algo bonito al oído' },
  ],
  travieso: [
    { type: 'reto', icon: '🔥', text: 'Besa a tu pareja apasionadamente por 20 segundos' },
    { type: 'pregunta', icon: '💬', text: '¿Cuál parte de mi cuerpo te gusta más tocar?' },
    { type: 'verdad', icon: '🤫', text: 'Describe la noche que más disfrutaste conmigo' },
    { type: 'reto', icon: '💋', text: 'Dale un beso en el lugar que a él/ella más le gusta' },
    { type: 'reto', icon: '🤲', text: 'Masajea los muslos de tu pareja durante 1 minuto' },
    { type: 'pregunta', icon: '💬', text: '¿Qué cosa nueva te gustaría intentar conmigo?' },
    { type: 'verdad', icon: '🤫', text: '¿En qué situación me deseas más?' },
    { type: 'reto', icon: '😈', text: 'Susurra algo atrevido al oído y observa su reacción' },
  ],
  hot: [
    { type: 'reto', icon: '💥', text: 'Besa cada rincón de su cuello sin parar por 30 segundos' },
    { type: 'pregunta', icon: '💬', text: '¿Cuál es tu posición favorita y por qué?' },
    { type: 'verdad', icon: '🤫', text: 'Cuenta la fantasía más atrevida que tengas' },
    { type: 'reto', icon: '🌶️', text: 'Explora con las manos toda la espalda de tu pareja' },
    { type: 'reto', icon: '🔥', text: 'Quite una prenda de ropa a tu pareja con los dientes' },
    { type: 'pregunta', icon: '💬', text: '¿Qué hago que te vuelve loco/a?' },
    { type: 'verdad', icon: '🤫', text: '¿Cuándo fue la última vez que me deseaste intensamente?' },
    { type: 'reto', icon: '💫', text: 'Haz lo que más le gusta a tu pareja durante 1 minuto' },
  ],
  custom: [],
};

let currentLevel = 'suave';
let currentType = 'all';
let deck = [];
let deckIndex = 0;
let timerSec = 30;
let timerInterval = null;

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

const cardMain = document.getElementById('cardMain');
const drawBtn = document.getElementById('drawBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const customBtn = document.getElementById('customBtn');
const customModal = document.getElementById('customModal');
const customCardsList = document.getElementById('customCardsList');
const addCardBtn = document.getElementById('addCard');
const newCardType = document.getElementById('newCardType');
const newCardText = document.getElementById('newCardText');
const timerPresets = document.querySelectorAll('.timer-preset');
const intensityButtons = document.querySelectorAll('.intensity-btn');
const typeFilters = document.querySelectorAll('.type-filter');

function initializeDeck() {
  intensityButtons.forEach((button) => {
    button.addEventListener('click', () => {
      intensityButtons.forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      currentLevel = button.dataset.level;
      buildDeck();
    });
  });

  typeFilters.forEach((button) => {
    button.addEventListener('click', () => {
      typeFilters.forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      currentType = button.dataset.type;
      buildDeck();
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

  drawBtn.addEventListener('click', drawCard);
  shuffleBtn.addEventListener('click', shuffleDeck);
  cardMain.addEventListener('click', drawCard);
  customBtn.addEventListener('click', openCustomModal);
  addCardBtn.addEventListener('click', handleAddCard);
  customModal.addEventListener('click', (event) => {
    if (event.target === customModal) closeCustomModal();
  });
  document.querySelectorAll('.close-modal').forEach((button) => {
    button.addEventListener('click', closeCustomModal);
  });
}

function buildDeck() {
  deck = [...CARDS[currentLevel]];
  if (currentType !== 'all') {
    deck = deck.filter((card) => card.type === currentType);
  }

  for (let i = deck.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  deckIndex = 0;
  updateCounter();
  resetCard();
}

function updateCounter() {
  const counter = document.getElementById('counter');
  const remaining = Math.max(0, deck.length - deckIndex);
  counter.textContent = remaining > 0 ? `${remaining} cartas restantes` : 'Mazo terminado — mezcla de nuevo';
}

function resetCard() {
  cardMain.classList.remove('flip-in', 'flip-out');
  cardMain.innerHTML = `
    <div class="card-back">🃏</div>
    <p style="font-family:'Playfair Display',serif;font-size:1.1rem;margin-top:12px;opacity:0.5;">Toca para robar</p>
  `;
  stopTimer();
}

function drawCard() {
  if (!deck.length) {
    buildDeck();
    return;
  }

  if (deckIndex >= deck.length) {
    deckIndex = 0;
    shuffleDeck();
    return;
  }

  const card = deck[deckIndex];
  deckIndex += 1;
  cardMain.classList.add('flip-out');

  setTimeout(() => {
    cardMain.classList.remove('flip-out');
    cardMain.innerHTML = `
      <div class="card-category-icon">${card.icon}</div>
      <div class="card-category-label">${card.type === 'reto' ? '💪 Reto' : card.type === 'pregunta' ? '💬 Pregunta' : '🤫 Verdad'}</div>
      <div class="card-ornament"></div>
      <div class="card-text">${card.text}</div>
      <div class="card-timer ${timerSec > 0 ? 'show' : ''}" id="cardTimer">
        <div class="timer-display" id="timerDisplay">--:--</div>
        <div class="timer-bar"><div class="timer-fill" id="timerFill" style="width:100%"></div></div>
      </div>
    `;
    cardMain.classList.add('flip-in');
    setTimeout(() => cardMain.classList.remove('flip-in'), 360);

    if (timerSec > 0) {
      startTimer(timerSec);
    }

    updateCounter();
  }, 360);
}

function shuffleDeck() {
  for (let i = deck.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  deckIndex = 0;
  updateCounter();
  resetCard();
}

function startTimer(seconds) {
  stopTimer();
  let remaining = seconds;
  updateTimer(remaining, seconds);
  timerInterval = setInterval(() => {
    remaining -= 1;
    updateTimer(remaining, seconds);
    if (remaining <= 0) {
      stopTimer();
      const display = document.getElementById('timerDisplay');
      if (display) display.textContent = '¡Tiempo!';
    }
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function updateTimer(remaining, total) {
  const display = document.getElementById('timerDisplay');
  const fill = document.getElementById('timerFill');
  if (!display) return;
  const minutes = Math.floor(remaining / 60).toString().padStart(2, '0');
  const seconds = (remaining % 60).toString().padStart(2, '0');
  display.textContent = `${minutes}:${seconds}`;
  if (fill) {
    fill.style.width = `${(remaining / total) * 100}%`;
  }
}

function openCustomModal() {
  customModal.classList.add('open');
  renderCustomCards();
}

function closeCustomModal() {
  customModal.classList.remove('open');
}

function handleAddCard() {
  const text = newCardText.value.trim();
  const type = newCardType.value;
  if (!text) return;
  const icons = { reto: '💪', pregunta: '💬', verdad: '🤫' };
  CARDS.custom.push({ type, icon: icons[type], text });
  newCardText.value = '';
  renderCustomCards();
  if (currentLevel === 'custom') {
    buildDeck();
  }
}

function renderCustomCards() {
  if (!customCardsList) return;
  customCardsList.innerHTML = CARDS.custom
    .map((card, index) => `
      <div class="custom-card-item">
        <p>${card.icon} ${card.text}</p>
        <button class="custom-card-remove" data-index="${index}">✕</button>
      </div>
    `)
    .join('');

  customCardsList.querySelectorAll('.custom-card-remove').forEach((button) => {
    button.addEventListener('click', () => {
      const index = Number(button.dataset.index);
      CARDS.custom.splice(index, 1);
      renderCustomCards();
      if (currentLevel === 'custom') buildDeck();
    });
  });

  if (!CARDS.custom.length) {
    customCardsList.innerHTML = '<p style="font-size:0.8rem;color:rgba(250,240,230,0.3);padding:8px;">Vacío — agrega cartas arriba</p>';
  }
}

initializeDeck();
buildDeck();
