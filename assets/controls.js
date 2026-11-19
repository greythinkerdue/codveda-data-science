// Theme toggle + language toggle, shared across all pages.
(function () {
  function getTheme() { try { return localStorage.getItem('codveda-theme') || 'dark'; } catch (e) { return 'dark'; } }
  function setTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    try { localStorage.setItem('codveda-theme', t); } catch (e) {}
  }
  function getLang() { try { return localStorage.getItem('codveda-lang') || 'en'; } catch (e) { return 'en'; } }
  function setLang(l) { try { localStorage.setItem('codveda-lang', l); } catch (e) {} }

  function applyLangButtons(lang) {
    document.querySelectorAll('.lang-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.lang === lang);
    });
  }

  function applyTranslations(lang) {
    if (typeof I18N === 'undefined') return;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const entry = key.split('.').reduce((o, k) => (o ? o[k] : undefined), I18N);
      if (entry && entry[lang] !== undefined) {
        el.innerHTML = entry[lang];
      }
    });
    document.documentElement.lang = lang === 'id' ? 'id' : 'en';
  }

  // ---- Motion: count-up KPI numbers + reveal-on-scroll ----
  function runCountUp(el) {
    const raw = el.textContent.trim();
    const match = raw.match(/^([^\d-]*)(-?[\d,]*\.?\d+)(.*)$/);
    if (!match) return;
    const prefix = match[1];
    const numStr = match[2].replace(/,/g, '');
    const suffix = match[3];
    const target = parseFloat(numStr);
    if (isNaN(target)) return;
    const decimals = (numStr.split('.')[1] || '').length;
    const duration = 850;
    const startTime = performance.now();
    function tick(now) {
      const p = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = target * eased;
      el.textContent = prefix + val.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = raw;
    }
    requestAnimationFrame(tick);
  }

  function initMotion() {
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const countEls = Array.from(document.querySelectorAll('.kpi-value, .proj-metric')).filter((el) => !el.dataset.counted);
    if (countEls.length && !reduceMotion) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || entry.target.dataset.counted) return;
          entry.target.dataset.counted = '1';
          io.unobserve(entry.target);
          runCountUp(entry.target);
        });
      }, { threshold: 0.4 });
      countEls.forEach((el) => io.observe(el));
    } else if (reduceMotion) {
      countEls.forEach((el) => { el.dataset.counted = '1'; });
    }

    const revealEls = Array.from(document.querySelectorAll('.card, .kpi-tile, .insight, .proj-card, .ds-tab')).filter((el) => !el.dataset.revealed);
    if (revealEls.length) {
      revealEls.forEach((el) => { el.dataset.revealed = '1'; el.classList.add('reveal'); });
      if (reduceMotion) {
        revealEls.forEach((el) => el.classList.add('in'));
      } else {
        const io2 = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in');
              io2.unobserve(entry.target);
            }
          });
        }, { threshold: 0.12 });
        revealEls.forEach((el) => io2.observe(el));
      }
    }
  }

  // Dynamic KPI values set later by a page's own fetch() may render after
  // DOMContentLoaded; re-scan once more shortly after load to catch them.
  function initMotionWithRetry() {
    initMotion();
    setTimeout(initMotion, 600);
  }

  document.addEventListener('DOMContentLoaded', function () {
    setTheme(getTheme());
    const lang = getLang();
    applyLangButtons(lang);
    applyTranslations(lang);

    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', function () {
        const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        setTheme(next);
        document.dispatchEvent(new CustomEvent('codveda:themechange', { detail: { theme: next } }));
      });
    }

    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        const l = btn.dataset.lang;
        setLang(l);
        applyLangButtons(l);
        applyTranslations(l);
        document.dispatchEvent(new CustomEvent('codveda:langchange', { detail: { lang: l } }));
      });
    });

    initMotionWithRetry();
  });
})();
