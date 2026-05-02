/* ═══════════════════════════════════════════════
   KHALED HAMDY — PORTFOLIO SCRIPT
   ═══════════════════════════════════════════════ */

(() => {
  'use strict';

  /* ── DOM Refs ── */
  const html = document.documentElement;
  const cursor = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursorDot');
  const nav = document.getElementById('nav');
  const themeToggle = document.getElementById('themeToggle');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const typedEl = document.getElementById('typedTitle');

  /* ══════════════════════════════════
     CUSTOM CURSOR
  ══════════════════════════════════ */
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  const isTouchDevice = window.matchMedia('(hover: none)').matches;

  if (!isTouchDevice) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    });

    const animateCursor = () => {
      cursorX += (mouseX - cursorX) * 0.12;
      cursorY += (mouseY - cursorY) * 0.12;
      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';
      requestAnimationFrame(animateCursor);
    };
    animateCursor();

    // Hover effect on interactive elements
    const hoverTargets = document.querySelectorAll(
      'a, button, .skill-card, .project-card, .cert-card, .contact-card, .tool-badge, .tag'
    );

    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });
  }

  /* ══════════════════════════════════
     THEME TOGGLE
  ══════════════════════════════════ */
  const savedTheme = localStorage.getItem('kh-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('kh-theme', next);
  });

  /* ══════════════════════════════════
     NAV SCROLL EFFECT
  ══════════════════════════════════ */
  const handleNavScroll = () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleNavScroll, { passive: true });

  /* ══════════════════════════════════
     MOBILE MENU
  ══════════════════════════════════ */
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  document.querySelectorAll('.mob-link, .mobile-cv').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ══════════════════════════════════
     TYPING EFFECT
  ══════════════════════════════════ */
  const titles = [
    'Offensive Security Engineer',
    'Penetration Tester',
    'Red Team Operator',
    'Network Security Specialist',
    'Bug Bounty Researcher',
  ];

  let titleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeDelay = 80;

  const type = () => {
    const currentTitle = titles[titleIndex];

    if (!isDeleting) {
      typedEl.textContent = currentTitle.slice(0, charIndex + 1);
      charIndex++;
      typeDelay = 80;

      if (charIndex === currentTitle.length) {
        isDeleting = true;
        typeDelay = 2000; // pause at end
      }
    } else {
      typedEl.textContent = currentTitle.slice(0, charIndex - 1);
      charIndex--;
      typeDelay = 40;

      if (charIndex === 0) {
        isDeleting = false;
        titleIndex = (titleIndex + 1) % titles.length;
        typeDelay = 400;
      }
    }

    setTimeout(type, typeDelay);
  };

  setTimeout(type, 1200);

  /* ══════════════════════════════════
     SCROLL REVEAL
  ══════════════════════════════════ */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ══════════════════════════════════
     COUNTER ANIMATION
  ══════════════════════════════════ */
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.target, 10);
          const duration = 1600;
          const start = performance.now();

          const update = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Easing: ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target);
            if (progress < 1) requestAnimationFrame(update);
            else el.textContent = target;
          };

          requestAnimationFrame(update);
          counterObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('.stat-num').forEach(el => counterObserver.observe(el));

  /* ══════════════════════════════════
     SMOOTH SCROLL FOR NAV LINKS
  ══════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ══════════════════════════════════
     ACTIVE NAV LINK HIGHLIGHT
  ══════════════════════════════════ */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.style.color = link.getAttribute('href') === `#${id}`
              ? 'var(--accent)'
              : '';
          });
        }
      });
    },
    { rootMargin: '-40% 0px -40% 0px' }
  );

  sections.forEach(section => sectionObserver.observe(section));

  /* ══════════════════════════════════
     TERMINAL TYPEWRITER LINES
  ══════════════════════════════════ */
  // Small stagger on terminal lines when they appear
  const termLines = document.querySelectorAll('.terminal .t-line, .terminal .t-block .t-line');
  termLines.forEach((line, i) => {
    line.style.opacity = '0';
    line.style.transform = 'translateX(-8px)';
    line.style.transition = `opacity 0.4s ease ${0.3 + i * 0.12}s, transform 0.4s ease ${0.3 + i * 0.12}s`;
  });

  const termObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          termLines.forEach(line => {
            line.style.opacity = '1';
            line.style.transform = 'translateX(0)';
          });
          termObserver.disconnect();
        }
      });
    },
    { threshold: 0.3 }
  );

  const terminal = document.querySelector('.terminal');
  if (terminal) termObserver.observe(terminal);

  /* ══════════════════════════════════
     STAGGERED SKILL CARDS
  ══════════════════════════════════ */
  document.querySelectorAll('.skill-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.08}s`;
  });

  document.querySelectorAll('.project-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.1}s`;
  });

  document.querySelectorAll('.cert-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.07}s`;
  });

  /* ══════════════════════════════════
     PARALLAX HERO ORBS (subtle)
  ══════════════════════════════════ */
  const orb1 = document.querySelector('.hero-orb-1');
  const orb2 = document.querySelector('.hero-orb-2');

  if (!isTouchDevice && orb1 && orb2) {
    window.addEventListener('mousemove', (e) => {
      const xRatio = (e.clientX / window.innerWidth - 0.5) * 2;
      const yRatio = (e.clientY / window.innerHeight - 0.5) * 2;
      orb1.style.transform = `translate(${xRatio * -20}px, ${yRatio * -20}px)`;
      orb2.style.transform = `translate(${xRatio * 15}px, ${yRatio * 15}px)`;
    }, { passive: true });
  }

  /* ══════════════════════════════════
     TOOL BADGE RIPPLE
  ══════════════════════════════════ */
  document.querySelectorAll('.tool-badge').forEach(badge => {
    badge.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        transform: scale(0);
        animation: ripple-anim 0.6s linear;
        background: rgba(184,255,87,0.3);
        width: 100px;
        height: 100px;
        left: ${e.clientX - rect.left - 50}px;
        top: ${e.clientY - rect.top - 50}px;
        pointer-events: none;
      `;
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  // Add ripple keyframes dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple-anim {
      to { transform: scale(3); opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  console.log('%c KH@R3DTEAM ', 'background:#b8ff57;color:#080808;font-weight:bold;font-size:14px;padding:4px 8px;');
  console.log('%c Khaled Hamdy — Offensive Security Engineer ', 'color:#b8ff57;font-size:12px;');
  console.log('%c github.com/khaledhamdy404 ', 'color:#6b6b67;font-size:11px;');

})();
