// Interazioni vanilla per le pagine pubbliche STATICHE (senza React).
// Su queste pagine non c'è idratazione React: questo file garantisce menu,
// lingua, FAQ, carosello, cookie banner e recensioni. Sui percorsi React
// (login, dashboard, ecc.) main.jsx chiama window.__disableStatic().
(function () {
  'use strict';
  var handlers = [];
  function on(el, ev, fn) {
    if (!el) return;
    el.addEventListener(ev, fn);
    handlers.push([el, ev, fn]);
  }
  function click(el, fn) { on(el, 'click', fn); }

  // ---- Menu mobile ----
  var navToggle = document.querySelector('.nav-toggle');
  var mainMenu = document.getElementById('main-menu');
  if (navToggle && mainMenu) {
    click(navToggle, function () {
      var open = mainMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    click(mainMenu, function () {
      mainMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  }

  // ---- Toggle lingua (come in React: localStorage + reload) ----
  var langBtn = document.querySelector('.lang-toggle');
  if (langBtn) {
    click(langBtn, function () {
      var cur = localStorage.getItem('adt_lang') || 'it';
      localStorage.setItem('adt_lang', cur === 'it' ? 'en' : 'it');
      window.location.reload();
    });
  }

  // ---- FAQ accordion ----
  document.querySelectorAll('.faq-q').forEach(function (q) {
    click(q, function () {
      var item = q.closest('.faq-item');
      var wasOpen = item && item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (i) { i.classList.remove('open'); });
      if (item && !wasOpen) item.classList.add('open');
    });
  });

  // ---- Carosello testimonianze (dati statici come in Home.jsx) ----
  var TESTIMONIALS = [
    { text: 'Ho prenotato in due minuti e la videochiamata è stata impeccabile. Finalmente la terapia si adatta ai miei orari.', author: 'Marco, 34 — Milano' },
    { text: 'La preparazione mentale ai concorsi mi ha aiutato a gestire l’ansia dell’esame. Consigliatissimo.', author: 'Luca, 27 — Roma' },
    { text: 'Io e mia moglie seguiamo la terapia di coppia online: comodissima, anche quando siamo in viaggio.', author: 'Giulia, 41 — Torino' },
    { text: 'Da sportivo pensavo fosse impossibile, invece la psicologia dello sport da remoto funziona davvero.', author: 'Alessandro, 29 — Napoli' },
  ];
  var slider = document.querySelector('.testimonial-slider');
  if (slider) {
    var dots = Array.prototype.slice.call(slider.querySelectorAll('.testimonial-dot'));
    var blockquote = slider.querySelector('.testimonial blockquote');
    var figcaption = slider.querySelector('.testimonial figcaption');
    var idx = 0;
    function render() {
      if (!blockquote || !figcaption) return;
      blockquote.textContent = '\u201C' + TESTIMONIALS[idx].text + '\u201D';
      figcaption.textContent = TESTIMONIALS[idx].author;
      dots.forEach(function (d, i) { d.classList.toggle('active', i === idx); });
    }
    dots.forEach(function (d, i) {
      click(d, function () { idx = i; render(); });
    });
    var prev = slider.querySelector('.t-arrow[aria-label="Precedente"]');
    var next = slider.querySelector('.t-arrow[aria-label="Successiva"]');
    click(prev, function () { idx = (idx - 1 + TESTIMONIALS.length) % TESTIMONIALS.length; render(); });
    click(next, function () { idx = (idx + 1) % TESTIMONIALS.length; render(); });
    setInterval(function () { idx = (idx + 1) % TESTIMONIALS.length; render(); }, 6000);
  }

  // ---- Replay animazione fumetto hero ----
  var heroComic = document.querySelector('.hero-comic');
  if (heroComic) {
    click(heroComic, function () {
      var path = heroComic.querySelector('.comic-bubble-path');
      var bubble = heroComic.querySelector('.comic-bubble');
      [path, bubble].forEach(function (el) {
        if (!el) return;
        el.style.animation = 'none';
        void el.offsetWidth;
        el.style.animation = '';
      });
    });
  }

  // ---- Cookie banner (localStorage adt_cookie_consent) ----
  var cookieBanner = document.querySelector('.cookie-banner');
  if (cookieBanner) {
    var consent = localStorage.getItem('adt_cookie_consent');
    if (consent) {
      cookieBanner.style.display = 'none';
    } else {
      var btns = cookieBanner.querySelectorAll('.cookie-actions button');
      if (btns[0]) click(btns[0], function () { localStorage.setItem('adt_cookie_consent', 'refused'); cookieBanner.style.display = 'none'; });
      if (btns[1]) click(btns[1], function () { localStorage.setItem('adt_cookie_consent', 'accepted'); cookieBanner.style.display = 'none'; });
    }
  }

  // ---- Striscia recensioni (fetch /api/ratings come ReviewsStrip) ----
  var faqSection = document.querySelector('.faq-list');
  if (faqSection) {
    fetch('/api/ratings')
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (!d || !d.total || d.total <= 0) return;
        var section = document.createElement('section');
        section.className = 'container section';
        section.style.textAlign = 'center';
        section.innerHTML =
          '<div class="card" style="padding:28px 20px;border:1px solid #f59e0b55;background:linear-gradient(135deg,#fff8ef,#fff)">' +
          '<div style="font-size:42px;color:#f59e0b">★★★★★</div>' +
          '<h2 style="margin:10px 0 4px">' + d.avg + ' su 5 · ' + d.total + ' recensioni verificate</h2>' +
          '<p class="muted" style="max-width:520px;margin:0 auto">Ogni valutazione arriva da una seduta completata sulla piattaforma. I nostri pazienti raccontano la loro esperienza.</p>' +
          '<a href="/recensioni" class="btn btn-outline" style="margin-top:14px">Leggi le recensioni</a>' +
          '</div>';
        var target = faqSection.closest('section');
        if (target) target.parentNode.insertBefore(section, target);
      })
      .catch(function () { /* niente recensioni: nessun blocco */ });
  }

  // Espone la funzione per disattivare tutto quando React monta
  window.__disableStatic = function () {
    handlers.forEach(function (h) { h[0].removeEventListener(h[1], h[2]); });
    handlers = [];
  };
})();
