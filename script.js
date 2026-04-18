/* ─────────────────────────────────────────
   script.js  –  Abhyuday Taneja Portfolio
───────────────────────────────────────── */

/* ── 1. LOADER ────────────────────────── */
(function () {
  const loader = document.getElementById('loader');
  const bar = document.getElementById('loaderBar');
  const btn = document.getElementById('loaderBtn');

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 8 + 2;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      bar.style.width = '100%';
      setTimeout(() => btn.classList.add('visible'), 300);
    }
    bar.style.width = progress + '%';
  }, 60);

  btn.addEventListener('click', () => {
    loader.classList.add('hidden');
    document.body.style.overflow = '';
    triggerReveal();
  });

  // Prevent background scroll while loader is visible
  document.body.style.overflow = 'hidden';
})();


/* ── 2. DARK / LIGHT THEME ───────────── */
const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

// Check stored preference
const storedTheme = localStorage.getItem('theme') || 'light';
setTheme(storedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
});

function setTheme(theme) {
  html.setAttribute('data-theme', theme);
  themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('theme', theme);
}


/* ── 3. SCROLL REVEAL ────────────────── */
function triggerReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Staggered delay for siblings
          const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
          const idx = siblings.indexOf(entry.target);
          setTimeout(() => {
            entry.target.classList.add('visible');
            // Trigger skill bar fill when skill bars become visible
            const fills = entry.target.querySelectorAll('.skill-fill');
            fills.forEach(f => animateSkillBar(f));
          }, idx * 80);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}


/* ── 4. COUNTER ANIMATION ────────────── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;

  const tick = () => {
    current += step;
    if (current >= target) {
      el.textContent = target;
      return;
    }
    el.textContent = Math.floor(current);
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

// Observe stat numbers
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);
document.querySelectorAll('.stat-num').forEach(el => counterObserver.observe(el));


/* ── 5. SKILL BARS ───────────────────── */
function animateSkillBar(fill) {
  const pct = fill.dataset.pct;
  // Use rAF to trigger transition
  requestAnimationFrame(() => {
    fill.style.width = pct + '%';
  });
}

// Also observe skill panels as a whole (for tab switches)
const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-fill').forEach(animateSkillBar);
      }
    });
  },
  { threshold: 0.2 }
);
document.querySelectorAll('.skill-panel').forEach(p => skillObserver.observe(p));


/* ── 6. SKILL TABS ───────────────────── */
document.querySelectorAll('.skill-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    // Deactivate all
    document.querySelectorAll('.skill-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.skill-panel').forEach(p => p.classList.remove('active'));

    // Activate clicked
    tab.classList.add('active');
    const panel = document.getElementById(tab.dataset.tab);
    panel.classList.add('active');

    // Animate bars in newly visible panel
    panel.querySelectorAll('.skill-fill').forEach(f => {
      f.style.width = '0%';
      setTimeout(() => animateSkillBar(f), 50);
    });

    // Trigger reveal for items in panel
    panel.querySelectorAll('.reveal:not(.visible)').forEach(el => {
      el.classList.add('visible');
    });
  });
});


/* ── 7. ACTIVE NAV LINK ON SCROLL ────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  },
  { threshold: 0.4 }
);
sections.forEach(s => navObserver.observe(s));


/* ── 8. SMOOTH SCROLL FOR NAV ────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* ── 9. CONTACT FORM ─────────────────── */
function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const original = btn.textContent;
  btn.textContent = '✓ Message Sent!';
  btn.style.background = '#28c840';
  btn.style.color = '#fff';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = original;
    btn.style.background = '';
    btn.style.color = '';
    btn.disabled = false;
    e.target.reset();
  }, 3000);
}


/* ── 10. NAVBAR GLASS SHADOW ON SCROLL ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.style.top = '12px';
  } else {
    navbar.style.top = '20px';
  }
}, { passive: true });


/* ── 11. MOUSE-FOLLOW GLOW (subtle) ──── */
document.addEventListener('mousemove', e => {
  document.querySelectorAll('.project-card, .achievement-card').forEach(card => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const inside = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;
    if (inside) {
      const cx = (x / rect.width - 0.5) * 12;
      const cy = (y / rect.height - 0.5) * 12;
      card.style.transform = `translateY(-6px) rotateX(${-cy}deg) rotateY(${cx}deg)`;
      card.style.transition = 'transform 0.1s linear';
    } else {
      card.style.transform = '';
      card.style.transition = 'transform 0.3s ease';
    }
  });
}, { passive: true });
