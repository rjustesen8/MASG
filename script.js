const header = document.querySelector('[data-header]');
const navToggle = document.querySelector('[data-nav-toggle]');
const nav = document.querySelector('[data-nav]');
const reveals = [...document.querySelectorAll('.reveal')];
const heroVideo = document.getElementById('heroVideo');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

window.addEventListener('scroll', () => {
  header?.classList.toggle('scrolled', window.scrollY > 24);
});

navToggle?.addEventListener('click', () => {
  nav?.classList.toggle('open');
});

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => nav.classList.remove('open'));
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

reveals.forEach((item) => observer.observe(item));

// All uploaded videos stay in the site package, but playback is concentrated in the hero.
const heroPlaylist = [
  { src: 'assets/videos/football-night.mp4', poster: 'assets/img/0001.jpg' },
  { src: 'assets/videos/basketball-gym.mp4', poster: 'assets/img/0428(1).jpg' },
  { src: 'assets/videos/soccer-field.mp4', poster: 'assets/img/0002.jpg' },
  { src: 'assets/videos/baseball-diamond.mp4', poster: 'assets/img/0003.jpg' },
  { src: 'assets/videos/lacrosse-action.mp4', poster: 'assets/img/0428.jpg' },
];

let heroIndex = 0;
function setHeroVideo(nextIndex) {
  if (!heroVideo || !heroPlaylist.length) return;
  heroIndex = nextIndex % heroPlaylist.length;
  const next = heroPlaylist[heroIndex];
  heroVideo.classList.add('is-switching');
  setTimeout(() => {
    heroVideo.setAttribute('poster', next.poster);
    heroVideo.src = next.src;
    heroVideo.load();
    heroVideo.play().catch(() => {});
    heroVideo.classList.remove('is-switching');
  }, 350);
}

if (heroVideo && heroPlaylist.length > 1 && !prefersReducedMotion) {
  setInterval(() => setHeroVideo(heroIndex + 1), 9000);
} else if (heroVideo && prefersReducedMotion) {
  heroVideo.removeAttribute('autoplay');
  heroVideo.pause();
}

const estimateFields = ['serviceLevel', 'schoolSize', 'dataReadiness', 'fundingSupport', 'timelineNeed']
  .map((id) => document.getElementById(id))
  .filter(Boolean);
const estimateResult = document.getElementById('estimateResult');

function money(value) {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

function updateEstimate() {
  if (!estimateResult || !estimateFields.length) return;
  const total = estimateFields.reduce((sum, field) => sum + Number(field.value || 0), 0);
  const low = Math.round(total * 0.85 / 50) * 50;
  const high = Math.round(total * 1.15 / 50) * 50;
  estimateResult.textContent = `${money(low)} – ${money(high)}`;
}

estimateFields.forEach((field) => field.addEventListener('change', updateEstimate));
updateEstimate();
