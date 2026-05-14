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

function animateCursorRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = `${rx - 18}px`;
  ring.style.top = `${ry - 18}px`;
  requestAnimationFrame(animateCursorRing);
}

function createParticles(count = 24) {
  if (!document.getElementById('particles')) return;
  const particles = document.getElementById('particles');
  particles.innerHTML = '';

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    const size = Math.random() * 2 + 1;
    const left = Math.random() * 100;
    const duration = 8 + Math.random() * 10;
    const delay = -Math.random() * duration;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${left}%`;
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${delay}s`;
    particles.appendChild(particle);
  }
}

function revealOnScroll() {
  document.querySelectorAll('.reveal').forEach((element) => {
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      element.classList.add('visible');
    }
  });
}

window.addEventListener('load', () => {
  animateCursorRing();
  createParticles(28);
  revealOnScroll();
});

window.addEventListener('scroll', revealOnScroll);
