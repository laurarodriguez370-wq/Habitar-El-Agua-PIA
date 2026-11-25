/* Mejoras del front: aparición de secciones y botón "volver arriba". */
(() => {
  const arriba = document.createElement('button');
  arriba.type = 'button';
  arriba.className = 'arriba';
  arriba.setAttribute('aria-label', 'Volver arriba');
  arriba.textContent = '↑';
  arriba.addEventListener('click', () => window.scrollTo({ top: 0 }));
  document.body.appendChild(arriba);

  const alScroll = () => {
    const y = window.scrollY;
    arriba.classList.toggle('ver', y > 700);
  };
  window.addEventListener('scroll', alScroll, { passive: true });
  alScroll();

  // Menú desplegable accesible por clic y teclado
  document.querySelectorAll('.menu > li').forEach((item) => {
    const trigger = item.querySelector(':scope > a[aria-haspopup="true"]');
    if (!trigger) return;
    trigger.setAttribute('aria-expanded', 'false');
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      const abrir = !item.classList.contains('abierto');
      document.querySelectorAll('.menu > li.abierto').forEach((other) => {
        other.classList.remove('abierto');
        other.querySelector(':scope > a[aria-haspopup="true"]')?.setAttribute('aria-expanded', 'false');
      });
      item.classList.toggle('abierto', abrir);
      trigger.setAttribute('aria-expanded', String(abrir));
    });
  });
  document.addEventListener('click', (event) => {
    if (event.target.closest('.menu')) return;
    document.querySelectorAll('.menu > li.abierto').forEach((item) => {
      item.classList.remove('abierto');
      item.querySelector(':scope > a[aria-haspopup="true"]')?.setAttribute('aria-expanded', 'false');
    });
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    document.querySelectorAll('.menu > li.abierto').forEach((item) => {
      item.classList.remove('abierto');
      item.querySelector(':scope > a[aria-haspopup="true"]')?.setAttribute('aria-expanded', 'false');
      item.querySelector(':scope > a[aria-haspopup="true"]')?.focus();
    });
  });

  // Aparición suave: solo si el navegador lo soporta y el usuario no pidió menos movimiento
  if (!('IntersectionObserver' in window) ||
      matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const bloques = document.querySelectorAll('main > section:not(.hero), .h-bloque > *, footer .voz, footer .cols');
  const obs = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  bloques.forEach((b) => {
    // Lo que ya está en pantalla al cargar no se anima (evita parpadeo)
    if (b.getBoundingClientRect().top < window.innerHeight) return;
    b.classList.add('revela');
    obs.observe(b);
  });
})();
