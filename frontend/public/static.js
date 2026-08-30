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

  // ---- Pulsante "Installa app" (PWA) ----
  var installBtn = document.querySelector('.install-app-btn');
  if (installBtn) {
    var deferredPrompt = null;
    window.addEventListener('beforeinstallprompt', function (e) {
      e.preventDefault();
      deferredPrompt = e;
    });
    click(installBtn, function () {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(function () { deferredPrompt = null; });
      } else {
        showInstallHelp();
      }
    });
  }

  function showInstallHelp() {
    if (document.querySelector('.install-dialog')) return;
    var isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    var lang = localStorage.getItem('adt_lang') === 'en' ? 'en' : 'it';
    var tx = {
      it: {
        title: "Installa l'app",
        ios: 'Su iPhone/iPad: apri il menu Condividi (quadrato con freccia) e scegli "Aggiungi a schermata Home".',
        android: 'Su Android o computer: scegli "Installa app" (o "Aggiungi a schermata Home") dal menu del browser.',
        close: 'Chiudi',
      },
      en: {
        title: 'Install the app',
        ios: 'On iPhone/iPad: open the Share menu (square with arrow) and choose "Add to Home Screen".',
        android: 'On Android or computer: choose "Install app" (or "Add to Home Screen") from the browser menu.',
        close: 'Close',
      },
    }[lang];

    var overlay = document.createElement('div');
    overlay.className = 'install-overlay';
    overlay.innerHTML =
      '<div class="install-dialog" role="dialog" aria-modal="true" aria-labelledby="install-title">' +
      '<h3 id="install-title">' + tx.title + '</h3>' +
      '<p>' + (isIOS ? tx.ios : tx.android) + '</p>' +
      '<button class="btn btn-primary btn-sm">' + tx.close + '</button>' +
      '</div>';

    function close() {
      overlay.remove();
      document.removeEventListener('keydown', esc);
    }
    function esc(e) { if (e.key === 'Escape') close(); }
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    overlay.querySelector('button').addEventListener('click', close);
    document.addEventListener('keydown', esc);
    document.body.appendChild(overlay);
    overlay.querySelector('button').focus();
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

  // ---- Striscia recensioni: visibile SUBITO, numeri riempiti appena arrivano ----
  var faqSection = document.querySelector('.faq-list');
  if (faqSection) {
    var strip = document.querySelector('.reviews-strip-static');
    if (!strip) {
      strip = document.createElement('section');
      strip.className = 'container section reviews-strip-static';
      strip.style.textAlign = 'center';
      strip.innerHTML =
        '<div class="card" style="padding:28px 20px;border:1px solid #f59e0b55;background:linear-gradient(135deg,#fff8ef,#fff)">' +
        '<div style="font-size:42px;color:#f59e0b" aria-hidden="true">★★★★★</div>' +
        '<h2 style="margin:10px 0 4px">Recensioni verificate</h2>' +
        '<p class="muted" style="max-width:520px;margin:0 auto">Ogni valutazione arriva da una seduta completata sulla piattaforma. I nostri pazienti raccontano la loro esperienza.</p>' +
        '<a href="/recensioni" class="btn btn-outline" style="margin-top:14px">Leggi le recensioni</a>' +
        '</div>';
      var target = faqSection.closest('section');
      if (target) target.parentNode.insertBefore(strip, target);
    }
    // Numeri appena arrivano (se il backend è addormentato, il riquadro è già visibile)
    fetch('/api/ratings')
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (!d || !d.total || d.total <= 0) return;
        var h2 = strip.querySelector('h2');
        if (h2) h2.textContent = d.avg + ' su 5 · ' + d.total + ' recensioni verificate';
      })
      .catch(function () { /* i numeri restano generici */ });
  }

  // ---- Modulo contatti (pagine statiche senza React) ----
  var contactForms = document.querySelectorAll('.contact-form');
  contactForms.forEach(function (form) {
    on(form, 'submit', function (e) {
      e.preventDefault();
      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = v; });
      if (data.__hp__) return; // honeypot anti-bot
      var btn = form.querySelector('[type="submit"]');
      var status = form.querySelector('.contact-status');
      if (btn) { btn.disabled = true; btn.textContent = 'Invio in corso…'; }
      if (status) { status.textContent = ''; status.style.color = ''; }
      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
        .then(function (r) {
          return r.json().catch(function () { return {}; }).then(function (b) { return { ok: r.ok, body: b }; });
        })
        .then(function (res) {
          if (res.ok) {
            form.reset();
            if (status) { status.textContent = 'Messaggio inviato! Ti risponderemo al più presto.'; status.style.color = '#15803d'; }
          } else if (status) {
            status.textContent = (res.body && res.body.error) || 'Errore di invio, riprova.';
            status.style.color = '#b91c1c';
          }
        })
        .catch(function () {
          if (status) { status.textContent = 'Errore di rete, riprova.'; status.style.color = '#b91c1c'; }
        })
        .finally(function () {
          if (btn) { btn.disabled = false; btn.textContent = 'Invia messaggio'; }
        });
    });
  });

  // ---- Effetto portale: anelli + logo "Adatto x Te" al tocco (come in React) ----
  // Sui percorsi React questo listener viene rimosso da __disableStatic qui sotto.
  var portalTouch = document.querySelector('.portal-touch');
  if (portalTouch) {
    var portalReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    on(window, 'pointerdown', function (e) {
      if (portalReduced) return;
      if (e.button !== undefined && e.button !== 0) return; // solo tasto sinistro
      if (portalTouch.childElementCount > 6) portalTouch.firstChild.remove();
      var cluster = document.createElement('div');
      cluster.className = 'ti-cluster';
      cluster.style.left = e.clientX + 'px';
      cluster.style.top = e.clientY + 'px';
      for (var i = 0; i < 5; i++) {
        var ring = document.createElement('div');
        ring.className = 'ti-ring';
        ring.style.width = (110 + i * 42) + 'px';
        ring.style.height = (110 + i * 42) + 'px';
        ring.style.animationDelay = (i * 90) + 'ms';
        cluster.appendChild(ring);
      }
      var logo = document.createElement('span');
      logo.className = 'logo ti-logo';
      logo.setAttribute('aria-hidden', 'true');
      logo.innerHTML =
        '<span class="logo-line"></span><span class="logo-text">Adatto <em>x</em> Te</span><span class="logo-line"></span>';
      cluster.appendChild(logo);
      portalTouch.appendChild(cluster);
      setTimeout(function () { cluster.remove(); }, 2300);
    });
  }

  // Espone la funzione per disattivare tutto quando React monta
  window.__disableStatic = function () {
    handlers.forEach(function (h) { h[0].removeEventListener(h[1], h[2]); });
    handlers = [];
  };
})();
