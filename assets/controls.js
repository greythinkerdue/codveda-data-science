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
  });
})();
