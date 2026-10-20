/* Google Analytics 4: basic consent mode, no Google requests before acceptance. */
(function () {
  'use strict';
  var ID = 'G-Q8KRKK58GF';
  var KEY = 'alexos.analytics-consent.v1';
  var MAX_AGE = 180 * 24 * 60 * 60 * 1000;
  var accepted = false;
  var started = false;
  var previousFocus;
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('consent', 'default', {
    analytics_storage: 'denied', ad_storage: 'denied',
    ad_user_data: 'denied', ad_personalization: 'denied'
  });
  function readChoice() {
    try {
      var item = JSON.parse(localStorage.getItem(KEY));
      if (item && typeof item.accepted === 'boolean' &&
          Date.now() - item.time >= 0 && Date.now() - item.time < MAX_AGE) return item;
    } catch (_) {}
    return null;
  }
  function removeCookies() {
    document.cookie.split(';').forEach(function (entry) {
      var name = entry.split('=')[0].trim();
      if (!/^_ga(?:_|$)|^_gid$|^_gat(?:_|$)/.test(name)) return;
      ['', location.hostname, '.' + location.hostname, 'alexos.es', '.alexos.es'].forEach(function (domain) {
        document.cookie = name + '=; Max-Age=0; path=/; SameSite=Lax' + (domain ? '; domain=' + domain : '');
      });
    });
  }
  function start() {
    if (started) return;
    started = true;
    gtag('js', new Date());
    gtag('config', ID, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_expires: 15552000
    });
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID;
    document.head.appendChild(script);
  }
  function applyChoice(value) {
    accepted = value;
    window['ga-disable-' + ID] = !value;
    gtag('consent', 'update', { analytics_storage: value ? 'granted' : 'denied' });
    if (value) start();
    else removeCookies();
  }
  var style = document.createElement('style');
  style.textContent = '#alexos-cookies{position:fixed;bottom:20px;left:20px;right:20px;max-width:710px;margin:auto;padding:22px;background:#fff;color:#172e45;border:1px solid #dce2e8;border-radius:6px;box-shadow:0 6px 35px #172e4526;z-index:1000;font:14px/1.55 "Segoe UI",sans-serif}#alexos-cookies[hidden]{display:none}#alexos-cookies p{margin:8px 0 14px}#alexos-cookies .cookie-actions{display:flex;gap:12px;flex-wrap:wrap}#alexos-cookies button{flex:1;min-width:150px;padding:11px 18px;border:1px solid #172e45;border-radius:3px;background:#172e45;color:white;font:600 14px "Segoe UI",sans-serif;cursor:pointer}#alexos-cookie-settings{display:block;margin:12px auto;padding:8px 12px;border:1px solid #566878;border-radius:3px;background:#fff;color:#172e45;font:12px "Segoe UI",sans-serif;cursor:pointer}#alexos-cookies button:focus-visible,#alexos-cookie-settings:focus-visible{outline:3px solid #225dc0;outline-offset:3px}#alexos-cookies details{margin-bottom:14px}#alexos-cookies a{color:#225dc0}@media print{#alexos-cookies,#alexos-cookie-settings{display:none!important}}';
  document.head.appendChild(style);
  var panel = document.createElement('section');
  panel.id = 'alexos-cookies';
  panel.hidden = true;
  panel.setAttribute('aria-label', 'Preferencias de cookies analíticas');
  panel.innerHTML = '<strong>Cookies analíticas</strong><p>Con tu permiso, Alejandro Olmos utiliza Google Analytics para conocer las visitas y el uso de esta web. Puedes aceptar o rechazar las cookies analíticas; la web funciona en ambos casos.</p><details><summary>Más información</summary><p>Google recibe datos de navegación, del dispositivo e interacciones como clics en contacto. Las cookies _ga y _ga_* distinguen visitas durante un máximo de 180 días. No activamos funciones publicitarias. Guardamos tu elección en este navegador durante 180 días y puedes cambiarla en «Configurar cookies».</p><a href="https://policies.google.com/privacy?hl=es" target="_blank" rel="noopener noreferrer">Privacidad de Google</a></details><div class="cookie-actions"><button type="button" data-choice="no">Rechazar analíticas</button><button type="button" data-choice="yes">Aceptar analíticas</button></div>';
  document.body.appendChild(panel);
  var settings = document.createElement('button');
  settings.id = 'alexos-cookie-settings';
  settings.type = 'button';
  settings.textContent = 'Configurar cookies';
  settings.setAttribute('aria-controls', panel.id);
  settings.setAttribute('aria-expanded', 'false');
  (document.querySelector('footer') || document.body).appendChild(settings);
  settings.addEventListener('click', function () {
    previousFocus = settings;
    panel.hidden = false;
    settings.setAttribute('aria-expanded', 'true');
    panel.querySelector('button').focus();
  });
  panel.addEventListener('click', function (event) {
    var button = event.target.closest('button[data-choice]');
    if (!button) return;
    var value = button.dataset.choice === 'yes';
    try { localStorage.setItem(KEY, JSON.stringify({ accepted: value, time: Date.now() })); } catch (_) {}
    var mustReload = started && !value;
    applyChoice(value);
    panel.hidden = true;
    settings.setAttribute('aria-expanded', 'false');
    if (previousFocus) previousFocus.focus();
    if (mustReload) location.reload();
  });
  document.addEventListener('click', function (event) {
    if (!accepted || !(event.target instanceof Element)) return;
    var link = event.target.closest('a[href]');
    var name;
    if (link && link.protocol === 'mailto:') name = 'contact_click';
    else if (link && /(^|\.)linkedin\.com$/.test(link.hostname)) name = 'linkedin_click';
    else if (event.target.closest('button.print')) name = 'profile_pdf_click';
    if (name) gtag('event', name, { send_to: ID, transport_type: 'beacon' });
  });
  window.addEventListener('storage', function (event) {
    if (event.key === KEY) location.reload();
  });
  var choice = readChoice();
  applyChoice(choice ? choice.accepted : false);
  if (!choice) {
    panel.hidden = false;
    settings.setAttribute('aria-expanded', 'true');
  }
}());
