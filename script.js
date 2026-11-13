/*   Starfield background (Three.js) - kept from the original*/
(function initStars() {
  if (typeof THREE === 'undefined') return;

  const canvas = document.getElementById('bg');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 0;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight, false);

  const starsCount = window.innerWidth < 768 ? 4000 : 10000;
  const positions = new Float32Array(starsCount * 3);
  for (let i = 0; i < positions.length; i++) {
    positions[i] = Math.random() * 2000 - 1000;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({ color: 0x888888, size: 0.5 });
  const stars = new THREE.Points(geometry, material);
  scene.add(stars);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animate() {
    if (!reduceMotion) {
      stars.rotation.x += 0.001;
      stars.rotation.y += 0.001;
    }
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();

  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });
})();

/*   Typewriter intro*/
(function initTypewriter() {
  const el = document.getElementById('typed');
  if (!el) return;

  const roles = ['a Software Developer', 'a Student', 'a Tech Enthusiast', 'an Innovator'];
  const prefix = 'HOLA! I am ';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion) {
    el.textContent = prefix + roles[0];
    return;
  }

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  async function typeText(text, speed = 45) {
    for (const ch of text) {
      el.textContent += ch;
      await sleep(speed);
    }
  }

  async function eraseText(speed = 25) {
    while (el.textContent.length > 0) {
      el.textContent = el.textContent.slice(0, -1);
      await sleep(speed);
    }
  }

  async function run() {
    el.textContent = '';
    await sleep(600);
    await typeText(prefix);
    let i = 0;
    while (true) {
      await typeText(roles[i]);
      await sleep(1600);
      await eraseText();
      el.textContent = prefix;
      i = (i + 1) % roles.length;
    }
  }

  run();
})();

/*   Header: shadow on scroll + mobile menu*/
(function initHeader() {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');

  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  function setOpen(open) {
    nav.classList.toggle('open', open);
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  }

  toggle.addEventListener('click', () => setOpen(!nav.classList.contains('open')));
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });
})();

/*   Reveal sections on scroll*/
(function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  items.forEach((el) => observer.observe(el));
})();

/*   Count-up numbers in the stats section*/
(function initCounters() {
  const counters = document.querySelectorAll('.count');
  if (!counters.length || !('IntersectionObserver' in window)) return;

  const animate = (el) => {
    const target = Number(el.dataset.target);
    const duration = 1400;
    const start = performance.now();

    function frame(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased);
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  };

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((el) => observer.observe(el));
})();

/*   Footer year*/
(function initYear() {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();

/*   Project domains: hover, click or keyboard to switch*/
(function initDomains() {
  const buttons = Array.from(document.querySelectorAll('.domain-btn'));
  if (!buttons.length) return;

  function activate(domain, focus = false) {
    buttons.forEach((btn) => {
      const on = btn.dataset.domain === domain;
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-selected', String(on));
      btn.tabIndex = on ? 0 : -1;
      if (on && focus) btn.focus();
    });
    document.querySelectorAll('.domain-panel').forEach((panel) => {
      panel.classList.toggle('is-active', panel.dataset.domain === domain);
    });
  }

  buttons.forEach((btn, i) => {
    btn.addEventListener('mouseenter', () => activate(btn.dataset.domain));
    btn.addEventListener('click', () => activate(btn.dataset.domain));

    btn.addEventListener('keydown', (e) => {
      let next = null;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = buttons[(i + 1) % buttons.length];
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = buttons[(i - 1 + buttons.length) % buttons.length];
      if (next) {
        e.preventDefault();
        activate(next.dataset.domain, true);
      }
    });
  });
})();
