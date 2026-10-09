const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// نمایش بخش‌ها هنگام اسکرول
const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });
  revealItems.forEach(el => observer.observe(el));
} else revealItems.forEach(el => el.classList.add('visible'));

// ستاره‌های کم‌تعدادتر و بهینه‌تر برای گوشی
const canvas = document.getElementById('stars');
const ctx = canvas ? canvas.getContext('2d', { alpha: true }) : null;
let stars = [], rafId = 0, lastFrame = 0, resizeTimer;
function resizeCanvas() {
  if (!canvas || !ctx) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  canvas.width = Math.floor(innerWidth * dpr);
  canvas.height = Math.floor(innerHeight * dpr);
  canvas.style.width = innerWidth + 'px';
  canvas.style.height = innerHeight + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const mobile = matchMedia('(max-width:600px)').matches;
  const count = Math.min(mobile ? 34 : 75, Math.floor(innerWidth / (mobile ? 11 : 13)));
  stars = Array.from({length: count}, () => ({
    x: Math.random()*innerWidth, y: Math.random()*innerHeight,
    r: Math.random()*1.1+.25, a: Math.random()*.5+.15, phase: Math.random()*6.28
  }));
  ctx.clearRect(0, 0, innerWidth, innerHeight);
}
function drawStars(timestamp = 0) {
  if (!ctx || document.hidden) return;
  const interval = matchMedia('(max-width:600px)').matches ? 100 : 60;
  if (timestamp - lastFrame < interval) {
    if (!reduceMotion) rafId = requestAnimationFrame(drawStars);
    return;
  }
  lastFrame = timestamp;
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  stars.forEach(s => {
    if (!reduceMotion) s.phase += .018;
    const alpha = Math.max(.12, Math.min(.7, s.a + Math.sin(s.phase)*.1));
    ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
    ctx.fillStyle = `rgba(255,210,233,${alpha})`; ctx.fill();
  });
  if (!reduceMotion) rafId = requestAnimationFrame(drawStars);
}
function restartStars() {
  cancelAnimationFrame(rafId);
  drawStars(0);
  if (!reduceMotion && !document.hidden) rafId = requestAnimationFrame(drawStars);
}
resizeCanvas();
if (!reduceMotion) rafId = requestAnimationFrame(drawStars);
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => { resizeCanvas(); restartStars(); }, 150);
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden) cancelAnimationFrame(rafId);
  else restartStars();
});

// جلوگیری از زیاد شدن بیش از حد قلب‌ها و گلبرگ‌ها
let activePetals = 0;
const MAX_PETALS = 45;
function makePetals(count = 24) {
  if (reduceMotion) { showToast('این سورپرایز با عشق برای توئه ♡'); return; }
  const symbols = ['♥','♡','✿','✧'];
  const amount = Math.max(0, Math.min(count, MAX_PETALS-activePetals));
  for (let i=0; i<amount; i++) {
    const el = document.createElement('span');
    el.className = 'petal'; el.setAttribute('aria-hidden','true');
    el.textContent = symbols[Math.floor(Math.random()*symbols.length)];
    el.style.left = Math.random()*100+'vw';
    el.style.fontSize = (10+Math.random()*14)+'px';
    el.style.opacity = (.45+Math.random()*.4).toString();
    el.style.setProperty('--drift',(Math.random()*120-60)+'px');
    el.style.animationDuration = (4+Math.random()*4)+'s';
    el.style.animationDelay = (Math.random()*.6)+'s';
    document.body.appendChild(el); activePetals++;
    el.addEventListener('animationend', () => {
      el.remove(); activePetals = Math.max(0,activePetals-1);
    }, {once:true});
  }
}
const toast = document.getElementById('toast');
let toastTimer;
function showToast(message) {
  if (!toast) return;
  toast.textContent = message; toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}
document.getElementById('surpriseBtn')?.addEventListener('click', () => {
  makePetals(28); showToast('یه عالمه گلبرگ و قلب، فقط برای تو! ♡');
});
document.getElementById('heartBtn')?.addEventListener('click', () => {
  makePetals(34);
  const reaction = document.getElementById('reaction');
  if (reaction) reaction.textContent = 'پس این لبخند کوچولو، قشنگ‌ترین جایزه‌ی این صفحه‌ست. ♥';
  showToast('لبخندت رو به حساب یه سورپرایز موفق می‌ذارم ✨');
});
document.addEventListener('click', event => {
  if (reduceMotion || activePetals >= MAX_PETALS) return;
  if (event.target.closest('button,a,input,textarea')) return;
  const heart = document.createElement('span');
  heart.className = 'petal'; heart.setAttribute('aria-hidden','true'); heart.textContent = '♥';
  heart.style.left = Math.max(4, Math.min(innerWidth-20, event.clientX))+'px';
  heart.style.top = event.clientY+'px'; heart.style.fontSize = '16px';
  heart.style.animationDuration = '2.4s';
  heart.style.setProperty('--drift',(Math.random()*50-25)+'px');
  document.body.appendChild(heart); activePetals++;
  heart.addEventListener('animationend', () => {
    heart.remove(); activePetals = Math.max(0,activePetals-1);
  }, {once:true});
});
