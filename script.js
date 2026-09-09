document.getElementById('year').textContent = new Date().getFullYear();

// Idioma automático según el navegador (sin permisos, sin APIs externas).
if (window.UnwindyI18n) {
  const lang = UnwindyI18n.detectLanguage();
  UnwindyI18n.applyTranslations(lang);
}

// Scroll suave para enlaces internos.
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Scroll-reveal ligero: usa Intersection Observer nativo (sin librerías),
// respeta prefers-reduced-motion, y deja de observar cada elemento tras
// revelarlo una vez (no vuelve a animar al hacer scroll hacia atrás).
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
} else if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
}

// Botón "Compartir": usa la Web Share API nativa si está disponible
// (móviles, navegadores modernos), con fallback a copiar el link.
const shareBtn = document.getElementById('share-btn');
if (shareBtn) {
  shareBtn.addEventListener('click', async () => {
    const shareData = {
      title: 'Unwindy',
      text: 'Unwindy — duerme mejor cada noche.',
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareData.url);
        const original = shareBtn.innerHTML;
        shareBtn.innerHTML = '<span class="support-btn-icon">✅</span><span>Copiado</span>';
        setTimeout(() => {
          shareBtn.innerHTML = original;
        }, 2000);
      }
    } catch (error) {
      // El usuario canceló el share sheet o el navegador no soporta nada de esto — no hace falta hacer nada.
    }
  });
}
