const WHATSAPP_URL = 'https://wa.me/971XXXXXXXXX?text=Hi%20Flask%20Media%2C%20I%27m%20interested%20in%20a%20free%20growth%20audit.';

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-whatsapp]').forEach((el) => {
    el.setAttribute('href', WHATSAPP_URL);
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener');
  });

  const menuToggle = document.querySelector('.mobile-toggle');
  const nav = document.querySelector('.nav-links');
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', nav.classList.contains('open'));
    });
  }

  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });
  reveals.forEach(el => io.observe(el));

  const heroVisual = document.querySelector('.hero-emblem');
  const hero = document.querySelector('.hero-visual');
  if (heroVisual && hero && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
      heroVisual.style.transform = `translateY(-8px) rotateX(${y}deg) rotateY(${x}deg)`;
    });
    hero.addEventListener('mouseleave', () => {
      heroVisual.style.transform = '';
    });
  }
});
