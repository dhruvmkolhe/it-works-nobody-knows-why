/* ============================================
   LUMINA AI — Interactions & Scroll Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Navbar scroll effect ---
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  const handleNavbarScroll = () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  };

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });

  // --- Mobile menu toggle ---
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const spans = mobileToggle.querySelectorAll('span');
      mobileToggle.classList.toggle('open');
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileToggle.classList.remove('open');
      });
    });
  }

  // --- Intersection Observer for reveal animations ---
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  revealElements.forEach(el => revealObserver.observe(el));

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const navHeight = navbar.offsetHeight;
        const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - navHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- Animated counter for hero stats ---
  const statNumbers = document.querySelectorAll('.stat-number');

  const animateCounter = (el) => {
    const text = el.textContent;
    const hasPlus = text.includes('+');
    const hasPercent = text.includes('%');
    const hasM = text.includes('M');

    let numericStr = text.replace(/[^0-9.]/g, '');
    const target = parseFloat(numericStr);
    const isDecimal = numericStr.includes('.');

    const duration = 1800;
    const startTime = performance.now();

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic

      let current = target * eased;
      let display;

      if (isDecimal) {
        display = current.toFixed(1);
      } else {
        display = Math.floor(current).toLocaleString();
      }

      if (hasM) display += 'M';
      if (hasPlus) display += '+';
      if (hasPercent) display += '%';

      el.textContent = display;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  };

  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach(el => statsObserver.observe(el));

  // --- Parallax-lite for hero orbs on mousemove ---
  const heroSection = document.querySelector('.hero');
  const orbs = document.querySelectorAll('.hero-orb');

  if (heroSection && orbs.length) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      orbs.forEach((orb, i) => {
        const speed = (i + 1) * 15;
        orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
      });
    });
  }

  // --- Mockup bar width animation ---
  const mockupBars = document.querySelectorAll('.mockup-bar');
  mockupBars.forEach(bar => {
    const originalWidth = bar.style.width || window.getComputedStyle(bar).width;
    bar.style.width = '0%';

    const barObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              bar.style.transition = 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
              bar.style.width = originalWidth;
            }, 600);
            barObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    barObserver.observe(bar);
  });

});
