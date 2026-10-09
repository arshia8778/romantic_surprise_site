const reduceMotion = window.matchMedia(
'(prefers-reduced-motion: reduce)'
).matches;

// نمایش بخش‌ها هنگام اسکرول
const revealItems = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
const observer = new IntersectionObserver(
(entries, obs) => {
entries.forEach((entry) => {
if (entry.isIntersecting) {
entry.target.classList.add('visible');
obs.unobserve(entry.target);
}
});
},
{
threshold: 0.08,
rootMargin: '0px 0px -20px 0px',
}
);

revealItems.forEach((el) => observer.observe(el));
} else {
revealItems.forEach((el) => el.classList.add('visible'));
}

// ستاره‌های پس‌زمینه
const canvas = document.getElementById('stars');
const ctx = canvas ? canvas.getContext('2d', { alpha: true }) : null;

let stars = [];
let rafId = 0;
let lastFrame = 0;
let resizeTimer;

function resizeCanvas() {
if (!canvas || !ctx) return;

const width = window.innerWidth;
const height = window.innerHeight;
const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
const mobile = window.matchMedia('(max-width: 600px)').matches;

canvas.width = Math.floor(width * dpr);
canvas.height = Math.floor(height * dpr);
canvas.style.width = `${width}px`;
canvas.style.height = `${height}px`;

ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

const count = Math.min(
mobile ? 34 : 75,
Math.floor(width / (mobile ? 11 : 13))
);

stars = Array.from({ length: count }, () => ({
x: Math.random() * width,
y: Math.random() * height,
r: Math.random() * 1.1 + 0.25,
a: Math.random() * 0.5 + 0.15,
phase: Math.random() * Math.PI * 2,
}));

drawStarsOnce();
}

function drawStarsOnce() {
if (!ctx || !canvas) return;

ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

stars.forEach((star) => {
const alpha = reduceMotion
? star.a
: Math.max(
0.12,
Math.min(0.7, star.a + Math.sin(star.phase) * 0.1)
);

ctx.beginPath();
ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
ctx.fillStyle = `rgba(255, 210, 233, ${alpha})`;
ctx.fill();


});
}

function drawStars(timestamp = 0) {
if (!ctx || document.hidden) return;

const mobile = window.matchMedia('(max-width: 600px)').matches;
const interval = mobile ? 100 : 60;

if (timestamp - lastFrame < interval && lastFrame !== 0) {
rafId = requestAnimationFrame(drawStars);
return;
}

lastFrame = timestamp;

stars.forEach((star) => {
star.phase += 0.018;
});

drawStarsOnce();
rafId = requestAnimationFrame(drawStars);
}

function startStars() {
cancelAnimationFrame(rafId);
rafId = 0;
lastFrame = 0;

drawStarsOnce();

if (!reduceMotion && !document.hidden) {
rafId = requestAnimationFrame(drawStars);
}
}

resizeCanvas();
startStars();

window.addEventListener('resize', () => {
clearTimeout(resizeTimer);

resizeTimer = setTimeout(() => {
resizeCanvas();
startStars();
}, 150);
});

document.addEventListener('visibilitychange', () => {
if (document.hidden) {
cancelAnimationFrame(rafId);
rafId = 0;
} else {
startStars();
}
});

// مدیریت تعداد قلب‌ها و گلبرگ‌ها
let activePetals = 0;
const MAX_PETALS = 45;

const toast = document.getElementById('toast');
let toastTimer;

function showToast(message) {
if (!toast) return;

toast.textContent = message;
toast.classList.add('show');

clearTimeout(toastTimer);

toastTimer = setTimeout(() => {
toast.classList.remove('show');
}, 2600);
}

function removePetal(el) {
if (!el || !el.isConnected) return;

el.remove();
activePetals = Math.max(0, activePetals - 1);
}

function makePetals(count = 24) {
if (reduceMotion) {
showToast('این سورپرایز با عشق برای توئه ♡');
return;
}

const symbols = ['♥', '♡', '✿', '✧'];
const amount = Math.min(
Math.max(0, count),
MAX_PETALS - activePetals
);

for (let i = 0; i < amount; i++) {
const el = document.createElement('span');


el.className = 'petal';
el.setAttribute('aria-hidden', 'true');
el.textContent = symbols[
  Math.floor(Math.random() * symbols.length)
];

// پخش شدن در عرض صفحه، نه از یک گوشه
el.style.left = `${Math.random() * 94 + 3}vw`;
el.style.top = `${-20 - Math.random() * 100}px`;
el.style.fontSize = `${10 + Math.random() * 14}px`;
el.style.opacity = `${0.45 + Math.random() * 0.4}`;
el.style.setProperty(
  '--drift',
  `${Math.random() * 120 - 60}px`
);
el.style.animationDuration = `${4 + Math.random() * 4}s`;
el.style.animationDelay = `${Math.random() * 0.6}s`;

document.body.appendChild(el);
activePetals++;

el.addEventListener(
  'animationend',
  () => removePetal(el),
  { once: true }
);

// پاک‌سازی احتیاطی در صورت اجرا نشدن animationend
setTimeout(() => removePetal(el), 10000);


}
}

// دکمه‌ی سورپرایز
document.getElementById('surpriseBtn')?.addEventListener('click', () => {
makePetals(28);
showToast('یه عالمه گلبرگ و قلب، فقط برای تو! ♡');
});

// دکمه‌ی قلب
document.getElementById('heartBtn')?.addEventListener('click', () => {
makePetals(34);

const reaction = document.getElementById('reaction');

if (reaction) {
reaction.textContent =
'پس این لبخند کوچولو، قشنگ‌ترین جایزه‌ی این صفحه‌ست. ♥';
}

showToast('لبخندت رو به حساب یه سورپرایز موفق می‌ذارم ✨');
});

// قلب در محل لمس یا کلیک کاربر
document.addEventListener('click', (event) => {
if (reduceMotion || activePetals >= MAX_PETALS) return;

if (event.target.closest('button, a, input, textarea')) return;

const heart = document.createElement('span');

heart.className = 'petal';
heart.setAttribute('aria-hidden', 'true');
heart.textContent = '♥';

// مختصات واقعی لمس نسبت به صفحه‌ی قابل‌مشاهده
const x = Math.max(
8,
Math.min(window.innerWidth - 24, event.clientX)
);

const y = Math.max(
8,
Math.min(window.innerHeight - 24, event.clientY)
);

heart.style.left = `${x}px`;
heart.style.top = `${y}px`;
heart.style.fontSize = '16px';
heart.style.animationDuration = '2.4s';
heart.style.setProperty(
'--drift',
`${Math.random() * 50 - 25}px`
);

document.body.appendChild(heart);
activePetals++;

heart.addEventListener(
'animationend',
() => removePetal(heart),
{ once: true }
);

setTimeout(() => removePetal(heart), 5000);
});
