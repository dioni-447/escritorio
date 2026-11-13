/* =========================================================
   CARTA ROMÂNTICA — carta.js
   JavaScript puro. Responsável por:
   1. Abrir o envelope (interação que também libera a música)
   2. Revelar a carta com animações suaves
   3. Mostrar a galeria de fotos só se houver fotos
   4. Controlar a música (opcional)
   ========================================================= */
(function () {
  "use strict";

  var envelopeScreen = document.getElementById("envelopeScreen");
  var envelope = document.getElementById("envelope");
  var page = document.getElementById("page");
  var memories = document.getElementById("memories");
  var gallery = memories ? memories.querySelector(".gallery") : null;
  var audio = document.getElementById("musica");
  var musicBtn = document.getElementById("musicBtn");

  var reduzMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var aberta = false;

  /* =======================================================
     Preparação
     ======================================================= */

  // Música só existe se você preencher o src do <audio> no carta.html
  var temMusica = !!(audio && audio.getAttribute("src"));
  if (temMusica) musicBtn.hidden = false;

  // Galeria só aparece se houver pelo menos uma <figure> dentro dela
  var temFotos = !!(gallery && gallery.querySelector("figure"));
  if (memories && temFotos) memories.hidden = false;

  /* =======================================================
     1. ABRIR O ENVELOPE
     ======================================================= */
  function abrirCarta() {
    if (aberta) return;
    aberta = true;

    // A música começa aqui: é dentro de um toque do usuário,
    // então os navegadores (Safari/iPhone, Chrome/Android) permitem.
    if (temMusica) tocarMusica();

    envelope.classList.add("open");
    envelope.disabled = true;

    var espera = reduzMovimento ? 0 : 1700; // tempo da animação do envelope
    window.setTimeout(mostrarPagina, espera);
  }

  envelope.addEventListener("click", abrirCarta);

  /* =======================================================
     2. REVELAR A PÁGINA
     ======================================================= */
  function mostrarPagina() {
    page.hidden = false;
    envelopeScreen.classList.add("leaving");
    window.scrollTo(0, 0);

    // Remove a tela do envelope do DOM depois do fade
    window.setTimeout(function () {
      if (envelopeScreen.parentNode) envelopeScreen.parentNode.removeChild(envelopeScreen);
    }, reduzMovimento ? 0 : 1000);

    revelarElementos();
  }

  // Cada bloco com .reveal aparece suavemente ao entrar na tela
  function revelarElementos() {
    var itens = page.querySelectorAll(".reveal");

    // Navegadores sem IntersectionObserver: mostra tudo de uma vez
    if (!("IntersectionObserver" in window)) {
      for (var i = 0; i < itens.length; i++) itens[i].classList.add("visible");
      return;
    }

    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("visible");
          obs.unobserve(entrada.target);
        }
      });
    }, { threshold: 0, rootMargin: "0px 0px -8% 0px" }); // threshold 0: funciona mesmo com carta bem longa

    // Pequeno atraso para o título aparecer logo após o fade do envelope
    window.setTimeout(function () {
      for (var j = 0; j < itens.length; j++) obs.observe(itens[j]);
    }, reduzMovimento ? 0 : 250);
  }

  /* =======================================================
     3. MÚSICA (OPCIONAL)
     ======================================================= */
  function atualizarBotao(tocando) {
    musicBtn.setAttribute("aria-pressed", String(tocando));
    musicBtn.setAttribute("aria-label", tocando ? "Pausar música" : "Ligar música");
  }

  function tocarMusica() {
    audio.volume = 0.5;
    var p = audio.play();
    if (p && typeof p.then === "function") {
      p.then(function () { atualizarBotao(true); })
       .catch(function () { atualizarBotao(false); }); // bloqueada: o botão liga depois
    } else {
      atualizarBotao(true);
    }
  }

  musicBtn.addEventListener("click", function () {
    if (audio.paused) {
      tocarMusica();
    } else {
      audio.pause();
      atualizarBotao(false);
    }
  });

  // Pausa quando a aba/app vai para segundo plano
  document.addEventListener("visibilitychange", function () {
    if (document.hidden && !audio.paused) {
      audio.pause();
      atualizarBotao(false);
    }
  });
})();
