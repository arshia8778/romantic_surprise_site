// انیمیشن‌های سبک و تعاملی صفحه
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ظاهر شدن بخش‌ها هنگام اسکرول
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// پس‌زمینه‌ی ستاره‌ای
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
let stars = [];
function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  stars = Array.from({ length: Math.min(100, Math.floor(window.innerWidth / 12)) }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.4 + 0.25,
    a: Math.random() * 0.65 + 0.15,
    speed: Math.random() * 0.008 + 0.002
  }));
}
function drawStars() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  stars.forEach((s) => {
    s.a += (Math.random() - 0.5) * s.speed;
    s.a = Math.max(0.1, Math.min(0.8, s.a));
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 210, 233, ${s.a})`;
    ctx.fill();
  });
  if (!reduceMotion) requestAnimationFrame(drawStars);
}
resizeCanvas();
drawStars();
window.addEventListener('resize', resizeCanvas);

// بارش گلبرگ/قلب
function makePetals(count = 24) {
  if (reduceMotion) return;
  const symbols = ['♥', '♡', '✿', '✧'];
  for (let i = 0; i < count; i++) {
    const petal = document.createElement('span');
    petal.className = 'petal';
    petal.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    petal.style.left = Math.random() * 100 + 'vw';
    petal.style.fontSize = (10 + Math.random() * 18) + 'px';
    petal.style.opacity = (0.45 + Math.random() * 0.5).toString();
    petal.style.setProperty('--drift', (Math.random() * 180 - 90) + 'px');
    petal.style.animationDuration = (4 + Math.random() * 5) + 's';
    petal.style.animationDelay = (Math.random() * 1.2) + 's';
    document.body.appendChild(petal);
    petal.addEventListener('animationend', () => petal.remove());
  }
}

const toast = document.getElementById('toast');
let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}
document.getElementById('surpriseBtn').addEventListener('click', () => {
  makePetals(36);
  showToast('یه عالمه گلبرگ و قلب، فقط برای تو! ♡');
});
document.getElementById('heartBtn').addEventListener('click', () => {
  makePetals(48);
  document.getElementById('reaction').textContent = 'پس این لبخند کوچولو، قشنگ‌ترین جایزه‌ی این صفحه‌ست. ♥';
  showToast('لبخندت رو به حساب یه سورپرایز موفق می‌ذارم ✨');
});

// کلیک روی پس‌زمینه قلب کوچولو می‌سازد
document.addEventListener('click', (event) => {
  if (event.target.closest('button, a')) return;
  const heart = document.createElement('span');
  heart.className = 'petal';
  heart.textContent = '♥';
  heart.style.left = event.clientX + 'px';
  heart.style.top = event.clientY + 'px';
  heart.style.fontSize = '18px';
  heart.style.animationDuration = '2.4s';
  heart.style.setProperty('--drift', (Math.random() * 80 - 40) + 'px');
  document.body.appendChild(heart);
  heart.addEventListener('animationend', () => heart.remove());
});
