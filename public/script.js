// ============================================================
//  ByteBuilder — script.js
//  Lógica de la página principal (pagina web.html / index.html)
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. ANIMACIÓN DE ENTRADA ────────────────────────────────
  animateEntrance();

  // ── 2. BOTÓN ASISTENTE — efecto de clic con partículas ────
  initAssistentButton();

  // ── 3. CARDS — reveal al hacer scroll ─────────────────────
  initCardReveal();

  // ── 4. CURSOR PERSONALIZADO ───────────────────────────────
  initCustomCursor();

  // ── 5. DECORACIONES — parallax suave con el mouse ─────────
  initParallax();

  // ── 6. HEADER — efecto al hacer scroll ────────────────────
  initHeaderScroll();

});


// ─────────────────────────────────────────────────────────────
// 1. ANIMACIÓN DE ENTRADA
// ─────────────────────────────────────────────────────────────
function animateEntrance() {
  const header     = document.querySelector('.header');
  const descripcion = document.querySelector('.descripcion');
  const botones    = document.querySelector('.botones');
  const cards      = document.querySelectorAll('.card');

  // Ocultar inicialmente
  [header, descripcion, botones].forEach(el => {
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
  });

  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(40px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });

  // Revelar en cascada
  setTimeout(() => reveal(header),      100);
  setTimeout(() => reveal(descripcion), 350);
  setTimeout(() => reveal(botones),     550);
  cards.forEach((card, i) => {
    setTimeout(() => reveal(card), 750 + i * 150);
  });

  function reveal(el) {
    if (!el) return;
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  }
}


// ─────────────────────────────────────────────────────────────
// 2. BOTÓN ASISTENTE — partículas + ripple al hacer clic
// ─────────────────────────────────────────────────────────────
function initAssistentButton() {
  const btnAsistente = document.querySelector('.btn.izquierda');
  const btnBuscador  = document.querySelector('.btn.derecha');

  [btnAsistente, btnBuscador].forEach(btn => {
    if (!btn) return;

    btn.addEventListener('click', function(e) {
      // Ripple
      const ripple = document.createElement('span');
      const rect   = btn.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height) * 2;
      ripple.style.cssText = `
        position:absolute;
        width:${size}px; height:${size}px;
        top:${e.clientY - rect.top - size/2}px;
        left:${e.clientX - rect.left - size/2}px;
        background:rgba(255,255,255,0.35);
        border-radius:50%;
        transform:scale(0);
        animation:rippleAnim 0.6s ease-out forwards;
        pointer-events:none;
      `;
      btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);

      // Partículas
      spawnParticles(e.clientX, e.clientY, btn === btnAsistente ? '#bfae9d' : '#536ef6');
    });

    // Hover glow
    btn.addEventListener('mouseenter', () => {
      btn.style.boxShadow = '0 12px 30px rgba(191,174,157,0.35)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.boxShadow = '';
    });
  });

  // Inyectar keyframe de ripple
  if (!document.getElementById('ripple-style')) {
    const style = document.createElement('style');
    style.id = 'ripple-style';
    style.textContent = `
      @keyframes rippleAnim {
        to { transform: scale(1); opacity: 0; }
      }
      @keyframes particleFly {
        0%   { transform: translate(0,0) scale(1); opacity:1; }
        100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity:0; }
      }
    `;
    document.head.appendChild(style);
  }
}

function spawnParticles(x, y, color) {
  for (let i = 0; i < 12; i++) {
    const p = document.createElement('div');
    const angle = (Math.random() * 360) * (Math.PI / 180);
    const dist  = 40 + Math.random() * 60;
    p.style.cssText = `
      position:fixed;
      width:${4 + Math.random()*5}px;
      height:${4 + Math.random()*5}px;
      background:${color};
      border-radius:50%;
      left:${x}px; top:${y}px;
      pointer-events:none;
      z-index:9999;
      --tx:${Math.cos(angle)*dist}px;
      --ty:${Math.sin(angle)*dist}px;
      animation:particleFly 0.7s ease-out forwards;
    `;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 800);
  }
}


// ─────────────────────────────────────────────────────────────
// 3. CARDS — reveal suave al entrar en viewport
// ─────────────────────────────────────────────────────────────
function initCardReveal() {
  const cards = document.querySelectorAll('.card');
  if (!cards.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity  = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  cards.forEach(card => observer.observe(card));
}


// ─────────────────────────────────────────────────────────────
// 4. CURSOR PERSONALIZADO (solo desktop)
// ─────────────────────────────────────────────────────────────
function initCustomCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return; // no en móvil

  const cursor = document.createElement('div');
  cursor.id = 'custom-cursor';
  cursor.style.cssText = `
    position:fixed;
    width:18px; height:18px;
    border:2px solid #bfae9d;
    border-radius:50%;
    pointer-events:none;
    z-index:99999;
    transition:transform 0.15s ease, opacity 0.2s;
    transform:translate(-50%,-50%);
    mix-blend-mode:multiply;
  `;
  document.body.appendChild(cursor);

  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
  });

  // Agrandar sobre elementos interactivos
  document.querySelectorAll('a, button, .card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(2.2)';
      cursor.style.background = 'rgba(191,174,157,0.15)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(1)';
      cursor.style.background = 'transparent';
    });
  });
}


// ─────────────────────────────────────────────────────────────
// 5. PARALLAX SUAVE DE DECORACIONES CON EL MOUSE
// ─────────────────────────────────────────────────────────────
function initParallax() {
  const layers = [
    { selector: '.cruz1,.cruz2,.cruz3,.cruz4', speed: 0.012 },
    { selector: '.pc1,.pc2,.pc3,.pc4',         speed: 0.020 },
    { selector: '.dove1,.dove2,.dove3',         speed: 0.016 },
    { selector: '.keyboard1,.keyboard2,.keyboard3', speed: 0.010 },
    { selector: '.mouse1,.mouse2,.mouse3',      speed: 0.014 },
  ];

  const cx = window.innerWidth  / 2;
  const cy = window.innerHeight / 2;

  document.addEventListener('mousemove', e => {
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;

    layers.forEach(({ selector, speed }) => {
      document.querySelectorAll(selector).forEach(el => {
        el.style.transform = `translate(${dx * speed}px, ${dy * speed}px)`;
      });
    });
  });
}


// ─────────────────────────────────────────────────────────────
// 6. HEADER — sombra dinámica al hacer scroll
// ─────────────────────────────────────────────────────────────
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      header.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)';
      header.style.background = 'rgba(255,255,255,0.92)';
    } else {
      header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.05)';
      header.style.background = 'rgba(255,255,255,0.78)';
    }
  });
}
